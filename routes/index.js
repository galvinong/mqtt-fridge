'use strict'
const deviceRoot = 'RF24SN/in/1/'
let express = require('express')
let router = express.Router()
let mqtt = require('mqtt')
let https = require('https')

// For OneSignal integration, function sending push notifications to client
//
let message = {
	app_id: '***REMOVED***',
	contents: {'en': 'Warning: value above range!'},
	included_segments: ['All'],
}

let sendNotification = function(data) {
	let headers = {
		'Content-Type': 'application/json; charset=utf-8',
		'Authorization': 'Basic ***REMOVED***',
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
const mongodbURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://***REMOVED***'
mongoose.connect(mongodbURI, function(err, res) {
	if (err) {
		console.log('ERROR connecting to ' + mongodbURI + '. ' + err )
	} else {
		console.log('Success connected to: ' + mongodbURI)
		// Create a mqtt client and subscribe to all under deviceroot
		let mqttClient = mqtt.connect('mqtt://***REMOVED***:***REMOVED***@m20.cloudmqtt.com:16673')
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
// router.get('/', function(req, res, next) {
// 	res.render('index')
// })
router.get('/', function(request, response) {
	response.sendfile('index.html')
})

// API for database retrieval, sensor ID then moment js time format
router.get('/get-data/:sensor_id/:time_created', function(req, res, next) {
	SensorInput.find({sensor: req.params.sensor_id}).where('events.created').gt(req.params.time_created).exec(function(err, sensorItem) {
		if (err) {
			res.send(err)
		} else {
			res.send(sensorItem)
		}
	})
})

let channelNames = {
	channel: [
		{
			id: 'RF24SN/in/1/1',
			title: 'temperature',
			compare: '>',
			warning: '20',
		}, {
			id: 'RF24SN/in/1/2',
			title: 'humidity',
			compare: '<',
			warning: '50',
		},
	],
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
		console.log(topic + ' ' + payload)
		checkNotification(topic, payload)

		// let message = {
		// 	app_id: '***REMOVED***',
		// 	contents: {'en': 'English Message'},
		// 	included_segments: ['All'],
		// }
		// sendNotification(message)
	}
}

/**
 * [checkNotification Handles checking for onesignal notifications]
 * @param  {[type]} topic   [splits based on the channel defined]
 * @param  {[type]} payload [apply checking based on the payload]
 */
function checkNotification(topic, payload) {
	for (let i = 0; i < channelNames.channel.length; i++) {
		if (topic == channelNames.channel[i].title) {
			if (channelNames.channel[i].compare = '>') {
				if (payload > channelNames.channel[i].warning) {
					message.contents = {'en': 'Warning: ' + channelNames.channel[i].title + ' value above range!' + payload}
					sendNotification(message)
				}
			} else if (channelNames.channel[i].compare = '<') {
				if (payload < channelNames.channel[i].warning) {
					message.contents = {'en': 'Warning: ' + channelNames.channel[i].title + ' value below range!' + payload}
					sendNotification(message)
				}
			}
		}
	}
}

module.exports = router
