'use strict'
// Nodejs web server init file, serves html and images
let express = require('express')
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
