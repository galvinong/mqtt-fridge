'use strict'
const deviceRoot = 'RF24SN/in/1/'
let express = require('express')
let router = express.Router()
let mqtt = require('mqtt')

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

router.get('/get-data/:sensor_id/:time_created', function(req, res, next) {
	SensorInput.find({sensor: req.params.sensor_id}).where('events.created').gt(req.params.time_created).exec(function(err, sensorItem) {
		if (err) {
			res.send(err)
		} else {
			res.send(sensorItem)
		}
	})
})

/**
 * Handles message arrvied from broker and add to mongodb
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
	}
}


module.exports = router