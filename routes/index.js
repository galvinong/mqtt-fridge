'use strict'
const deviceRoot = 'RF24SN/in/1/'
let express = require('express')
let app = express()
let router = express.Router()
let mqtt = require('mqtt')
let https = require('https')
let bodyParser = require('body-parser')

// create application/json parser
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
app.set('view engine', 'ejs')

//  OneSignal warning array
let channelNames = {
	channel: [
		{
			id: 'RF24SN/in/1/1',
			title: 'Temperature',
			compare: '>',
			warning: '25',
		}, {
			id: 'RF24SN/in/1/2',
			title: 'Humidity',
			compare: '<',
			warning: '50',
		},
	],
}

// For OneSignal integration, function sending push notifications to client
let sendNotification = function(data) {
	let headers = {
		'Content-Type': 'application/json; charset=utf-8',
		'Authorization': config.NotifyAuth,
	}

	let options = {
		host: 'onesignal.com',
		port: 443,
		path: '/api/v1/notifications',
		method: 'POST',
		headers: headers,
	}

	let req = https.request(options, function(res) {
		res.on('data', function(data) {
			console.log('Response:')
			console.log(JSON.parse(data))
		})
	})

	req.on('error', function(e) {
		console.log('ERROR:')
		console.log(e)
	})

	req.write(JSON.stringify(data))
	req.end()
}


// For MongoDB connection
let mongoose = require('mongoose')
const mongodbURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.MONGODB_URL
mongoose.connect(mongodbURI, function(err, res) {
	if (err) {
		console.log('ERROR connecting to ' + mongodbURI + '. ' + err )
	} else {
		console.log('Success connected to: ' + mongodbURI)
		// Create a mqtt client and subscribe to all under deviceroot
		let mqttClient = mqtt.connect('mqtt://\config.username:\config.password/@m20.cloudmqtt.com:16673')
		mqttClient.subscribe(deviceRoot + '+')
		// Calls function insertEvent when message arrives
		mqttClient.on('message', insertEvent)
	}
})

// Schema for the sensor input using mongoose
const sensorSchema = new mongoose.Schema({
	sensor: String,
	events: {
		value: Number,
		created: Date,
	},
})

// Creates a model based off the schema
let SensorInput = mongoose.model('RF24SN', sensorSchema)

// Routes index page and database data
router.get('/', function(req, res) {
	res.render('index.html')
})

// API for database retrieval, sensor ID then moment js time format
router.get('/get-data/:sensor_id/:time_created', function(req, res) {
	SensorInput.find({sensor: req.params.sensor_id}).where('events.created').gt(req.params.time_created).exec(function(err, sensorItem) {
		if (err) {
			res.send(err)
		} else {
			res.send(sensorItem)
		}
	})
})

router.post('/add-warn', function(req, res) {
	res.send('Warning received')
	insertWarning(req.body)
})

router.delete('/add-warn', function(req, res) {
	res.send('Delete recevied')
	removeWarning(req.body)
})

app.use('/', router)

/**
 * [removeWarning remove warning notification after deleting card]
 * @param  {[type]} responseBody [ID of channel to delete]
 */
function removeWarning(responseBody) {
	for (let i = channelNames.channel.length - 1; i >= 0; i--) {
		if (channelNames.channel[i].title === responseBody.title && channelNames.channel[i].compare === responseBody.compare && channelNames.channel[i].warning === responseBody.warning) {
			channelNames.channel.splice(i, 1)
			break
		}
	}
	console.log(channelNames)
}

/**
 * [insertWarning Handles OneSignal Warning insertion into the array]
 * @param  {[type]} responseData [response data from post request]
 */
function insertWarning(responseData) {
	let newWarning = {
		id: responseData.id,
		title: responseData.title,
		compare: responseData.compare,
		warning: responseData.warning,
	}
	channelNames.channel.push(newWarning)
	console.log(channelNames)
}

/**
 * Handles message arrived from broker and add to mongodb
 * @param {string} topic topic that the client is subscribed to
 * @param {string} payload payload that the topic has, sent periodically
 */
function insertEvent(topic, payload) {
	// Check payload whether 0 or nan, don't insert
	if (payload !== NaN ) {
		let key = topic.replace(deviceRoot, '')
		let sensor = new SensorInput({
			sensor: key,
			events: {
				value: payload,
				created: new Date(),
			},
		})
		sensor.save(function(err) {
			if (err) {
				console.log('Error saving to mongodb')
			}
		})
		// console.log(topic + ' ' + payload)
		checkNotification(topic, payload)
	}
}

/**
 * [checkNotification Handles checking for onesignal notifications]
 * @param  {[type]} topic   [splits based on the channel defined]
 * @param  {[type]} payload [apply checking based on the payload]
 */
function checkNotification(topic, payload) {
	console.log(topic + ' ' + payload)
	for (let i = 0; i < channelNames.channel.length; i++) {
		// Match the channel name with topic
		if (topic === channelNames.channel[i].id) {
			console.log(channelNames.channel[i].compare + ' ' + channelNames.channel[i].warning + ' ' + channelNames.channel[i].title)
			// If payload is bigger than warning,
			if (channelNames.channel[i].compare === '>') {
				if (payload > channelNames.channel[i].warning) {
					console.log('bigger')
					let message = {
						app_id: config.appID,
						contents: {'en': 'Warning: ' + channelNames.channel[i].title + ' value above range! ' + payload},
						included_segments: ['All'],
					}
					sendNotification(message)
				}
			}
			if (channelNames.channel[i].compare === '<') {
				if (payload < channelNames.channel[i].warning ) {
					console.log('smaller')
					let message = {
						app_id: config.appID,
						contents: {'en': 'Warning: ' + channelNames.channel[i].title + ' value below range! ' + payload},
						included_segments: ['All'],
					}
					sendNotification(message)
				}
			}
		}
	}
}

module.exports = router
