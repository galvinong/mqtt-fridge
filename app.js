'use strict'
// Nodejs web server init file, serves html and images
let express = require('express')
let router = express.Router()
// let hbs = require('express-handlebars')
let path = require('path')
// let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let routes = require('./routes/index')
let newrelic = require('newrelic')
let app = express()
const port = process.env.PORT || 8080

// view engine setup either hbs or html
// app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}))
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)


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

// forward 404 to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

// for development, print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500)
		res.render('error', {
			message: err.message,
			error: err,
		})
	})
}

// for production use, no stacktrace
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	res.render('error', {
		message: err.message,
		error: {},
	})
})

app.listen(port)


console.log('Express server running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown')

module.exports = app
