let labels =[]
let tempData=[]
let humdData=[]

// Momentjs definition of days
const today = moment().startOf('day')
const yesterday = moment(today).add(-1, 'days')
const tomorrow = moment(today).add(1, 'days')
const pastHour = moment().add(-1, 'hours')

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

// Start of ChartJS code
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
// TODO: use the same dataset but draw differently on another chart, probably look at chart options
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
		},
	})
	setInterval(function() {
		let latestLabel = moment().format('MM-DD hh:mm')
		lineChart.data.datasets[0].data[labels.length] = tempChartUpdate
		lineChart.data.datasets[1].data[labels.length] = humdChartUpdate
		lineChart.data.labels[labels.length] = latestLabel
		console.log(latestLabel + ' ' + tempChartUpdate + ' ' + humdChartUpdate)
		window.lineChart.update()
	}, 10000)
}

// End of ChartJS code

// Start of HandleBars Template


$(document).ready(function() {
	$('#cancelCard').click(function() {
		$('.collapse').collapse('toggle')
	})

	$('#addCard').click(function() {
		$('.card-columns').append()
	})
})
