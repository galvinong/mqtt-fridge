let labels =[]
let tempData=[]
let humdData=[]

// Momentjs definition of days
const today = moment().startOf('day')
const yesterday = moment(today).add(-1, 'days')
const tomorrow = moment(today).add(1, 'days')
const pastHour = moment().add(-1, 'hours')

// <--START of HandleBars Template-->
// Create cardsData obj and cards array to be displayed
let cardsData = {
	cards: [
		{
			title: 'Temperature',
			location: 'Top Shelf',
			returndata: 'returntemp',
			unitvalue: '°C',
			cardtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac laoreet nibh.',
			buttonValue: 'btnTemperature',
		}, {
			title: 'Humidity',
			location: 'Top Shelf',
			returndata: 'returnhumd',
			unitvalue: '%',
			cardtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac laoreet nibh.',
			buttonValue: 'btnHumidity',
		},
	],
}
let template = Handlebars.templates['card-template'](cardsData)
// <--END of HandleBars Template-->

// <--START of ChartJS code-->
// API to retrieve data for chart drawing, according to /get-data/sensorid/date
$.ajax({
	url: './get-data/1' + '/' + pastHour,
	dataType: 'json',
}).done(function(results) {
	// console.log(results)
	results.forEach(function(packet) {
		labels.push(moment(packet.events.created).format('MM-DD hh:mm'))
		tempData.push(packet.events.value)
	})
})

$.ajax({
	url: './get-data/2' + '/' + pastHour,
	dataType: 'json',
}).done(function(results) {
	// console.log(results)
	results.forEach(function(packet) {
		humdData.push(packet.events.value)
	})
})
// End of API code

const data = {
	labels: labels,
	datasets: [
		{
			label: 'Temperature',
			fill: false,
			lineTension: 0.1,
			backgroundColor: 'rgba(217, 83, 79, 1)',
			borderColor: 'rgba(217, 83, 79, 1)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgba(217, 83, 79, 1)',
			pointBackgroundColor: '#fff',
			pointBorderWidth: 1,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgba(217, 83, 79, 1)',
			pointHoverBorderColor: 'rgba(220,220,220,1)',
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			data: tempData,
			spanGaps: true,
		},
		{
			label: 'Humidity',
			fill: false,
			lineTension: 0.1,
			backgroundColor: 'rgba(84, 137, 225, 1)',
			borderColor: 'rgba(84, 137, 225, 1)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgba(84, 137, 225, 1)',
			pointBackgroundColor: '#fff',
			pointBorderWidth: 1,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgba(84, 137, 225, 1)',
			pointHoverBorderColor: 'rgba(220,220,220,1)',
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			data: humdData,
			spanGaps: true,
		},
	],
}
/**
 * [drawLineChart Draws the line chart from mongodb mqtt
 */
window.onload = function() {
	let chartCtx = document.getElementById('chartID').getContext('2d')
	window.lineChart = new Chart(chartCtx, {
		type: 'line',
		data: data,
		options: {
			title: {
				display: true,
				text: 'Live Updates',
			},
			responsive: true,
			maintainAspectRatio: false,
		},
	})
	// Every 10 seconds update the graph
	setInterval(function() {
		let latestLabel = moment().format('MM-DD hh:mm')
		let returntempValue = document.getElementById('returntemp').innerHTML
		let returnhumdValue = document.getElementById('returnhumd').innerHTML
		// If values are NaN or empty, don't udpate the chart
		if (isNaN(returntempValue) || isNaN(returnhumdValue) || returntempValue !== '' || returnhumdValue !== '') {
			console.log(returntempValue + ' ' + returnhumdValue)
			lineChart.data.datasets[0].data[labels.length] = returntempValue
			lineChart.data.datasets[1].data[labels.length] = returnhumdValue
			lineChart.data.labels[labels.length] = latestLabel
			window.lineChart.update()
		}
	}, 10000)
}
// <--End of ChartJS code-->

// <--Start of dropdown menu code-->
$(document).ready(function() {
	// $('.ready-value').hide()
	$('#cancelCard').click(function() {
		$('.collapse').collapse('toggle')
	})

	// Push new object into cardsData and update
	$('#addCard').click(function() {
		let returnString = 'return' + $('#title-input').val()
		let buttonID = 'btn' + $('title-input').val()
		let newCard = {
			title: $('#title-input').val(),
			location: $('#location-input').val(),
			returndata: returnString,
			unitvalue: $('#unit-input').val(),
			cardtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac laoreet nibh.',
			buttonValue: buttonID,
		}
		let newCards = {
			cards: [
			],
		}
		newCards.cards.push(newCard)
		// Add channel to array channelNames and subscribe to new channel
		let channelString = $('#channel-input').val()
		client.subscribe(channelString)
		let newChannel = {
			title: channelString,
			return: returnString,
		}
		channelNames.channel.push(newChannel)
		let newCardsTemplate = Handlebars.templates['card-template'](newCards)
		// $('#card-content').empty()
		$('#card-content').append(newCardsTemplate)
		$('.collapse').collapse('toggle')
		console.log($('#returntemp').val())
	})
})
// <--End of dropdown menu code-->
