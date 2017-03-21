let labels =[]
let tempData=[]
let humdData=[]

const today = moment().startOf('day')
const yesterday = moment(today).add(-1, 'days')
const tomorrow = moment(today.add(1, 'days'))
const pastHour = moment().add(-1, 'hours')

// Format display date on chart
Date.prototype.formatMMDDYYYY = function() {
	// Month starts counting at 0, therefore + 1
	return (this.getMonth() + 1) + '/' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes()
}
/**
 * [drawLineChart Draws the line chart from mongodb mqtt
 */
function drawLineChart() {
	// get the data from past 4 hrs
	$.ajax({
		url: './get-data/1' + '/' + pastHour,
		dataType: 'json',
	}).done(function(results) {
		// console.log(results)
		results.forEach(function(packet) {
			labels.push(new Date(packet.events.created).formatMMDDYYYY())
			tempData.push(packet.events.value)
		})
	})

	$.ajax({
		url: './get-data/2' + '/' + pastHour,
		dataType: 'json',
	}).done(function(results) {
		console.log(results)
		results.forEach(function(packet) {
			humdData.push(packet.events.value)
		})
	})
	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Temperature',
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(217, 83, 79, 1)",
				borderColor: "rgba(217, 83, 79, 1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(217, 83, 79, 1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(217, 83, 79, 1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				scaleSteps: 7,
				data: tempData,
				spanGaps: false,
			},
			{
				label: 'Humidity',
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(84, 137, 225, 1)",
				borderColor: "rgba(84, 137, 225, 1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(84, 137, 225, 1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(84, 137, 225, 1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				scaleSteps: 7,
				data: humdData,
				spanGaps: false,
			},
		],
	}
	// latestLabel = data.labels[labels.length]
	console.log(labels)
	let chartCtx = document.getElementById('chartID').getContext('2d')
	let lineChart = new Chart(chartCtx, {
		type: 'line',
		data: data,
		options: {
			responsive: false,
			animation: {
				duration: 250 * 1.5,
				easing: 'linear',
			},
		},
	})
	setInterval(function() {
		let latestLabel = new Date().formatMMDDYYYY()
		lineChart.data.datasets[0].data[labels.length] = tempChartUpdate
		lineChart.data.datasets[1].data[labels.length] = humdChartUpdate
		lineChart.data.labels[labels.length] = latestLabel
		console.log(latestLabel + ' ' + tempChartUpdate + ' ' + humdChartUpdate)
		lineChart.update()
	}, 60000)
}

drawLineChart()
