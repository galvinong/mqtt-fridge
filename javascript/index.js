// Nodejs web server init file, serves html and images
let http = require('http')
let url = require('url')
let path = require('path')
let fs = require('fs')
let mqtt = require('mqtt')
// let mongodb = require('mongodb')
let mongoose = require('mongoose')
const port = process.env.PORT || 8080
const mongoport = process.env.PORT || 5000

// For mongodb connection
const mongodbURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://***REMOVED***'
const deviceRoot = 'RF24SN/in/1/'
// mqtt client create to subscribe
let client

mongoose.connect(mongodbURI, function(err, res) {
	if (err) {
		console.log('ERROR connecting to ' + mongodbURI + '. ' + err )
	} else {
		console.log('Success connected to: ' + uriString)

		// Create a mqtt client and connect it
		// TODO: probably need to add the username and password
		client = mqtt.createClient(mongoport, localhost)

		// Subscribes to all sub channel under deviceroot
		client.subscribe(deviceRoot + '+')

		// Calls function insertEvent when message arrives
		client.on('message', insertEvent)
	}
})

// Schema for the sensor input using mongoose
const sensorSchema = new mongoose.Schema({
	sensor: String,
	events: {
		value: payload,
		created: Date,
	},
})

// Creates a model based off the schema
let SensorInput = mongoose.model('RF24SN', sensorSchema)

/**
 * Handles message arrvied from broker and add to mongodb
 * @param {string} topic topic that the client is subscribed to
 * @param {string} payload payload that the topic has, sent periodically
 */
function insertEvent(topic, payload) {
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

// HTTP Page serving code
http.createServer(function(request, response) {
	let uri = url.parse(request.url).pathname
	let filename = path.join(process.cwd(), uri)

	let contentTypesByExtension = {
		'.html': 'text/html',
		'.css': 'text/css',
		'.js': 'text/javascript',
		'.png': 'image/png',
		'.jpg': 'image/jpg',
	}

	fs.exists(filename, function(exists) {
		if (!exists) {
			response.writeHead(404, {'Content-Type': 'text/plain'})
			response.write('404 Not Found\n')
			response.end()
			return
		}

		if (fs.statSync(filename).isDirectory())
			filename += '/index.html'

		fs.readFile(filename, 'binary', function(err, file) {
			if (err) {
				response.writeHead(500, {'Content-Type': 'text/plain'})
				response.write(err + '\n')
				response.end()
				return
			}

			let headers = {}
			let contentType = contentTypesByExtension[path.extname(filename)]
			if (contentType)
				headers['Content-Type'] = contentType
			response.writeHead(200, headers)
			response.write(file, 'binary')
			response.end()
		})
	})
}).listen(parseInt(port, 10))

console.log('Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown')
