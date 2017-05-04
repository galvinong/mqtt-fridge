// Momentjs definition of days
const today = moment().startOf('day')
const yesterday = moment(today).subtract(1, 'days')
const tomorrow = moment(today).add(1, 'days')
const pastHour = moment().subtract(1, 'hours')
let pastMinute = moment().subtract(1, 'minutes')

let labels =[]
let tempData=[]
let humdData=[]

// <--START of ChartJS code-->
// API to retrieve data for chart drawing, according to /get-data/sensorid/date
$('.loading').hide()
$.ajax({
	url: './get-data/1' + '/' + pastMinute,
	dataType: 'json',
}).done(function(results) {
	const value = round(results[0].events.value, 2)
	console.log(value)
	$('#returntemp').html(value)
})

$.ajax({
	url: './get-data/2' + '/' + pastMinute,
	dataType: 'json',
}).done(function(results) {
	const value = round(results[0].events.value, 2)
	$('#returnhumd').html(value)
})

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
