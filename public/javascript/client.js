// <--START of HandleBars Template-->
// Create cardsData obj and cards array to be displayed
let cardsData = {
	cards: [
		{
			title: 'Temperature',
			location: 'Top Shelf',
			returndata: 'returntemp',
			canvasID: 'tempcanvas',
			unitvalue: '°C',
			cardtext: '+-0.5°C accuracy',
			buttonValue: 'btnTemperature',
		}, {
			title: 'Humidity',
			location: 'Top Shelf',
			returndata: 'returnhumd',
			canvasID: 'humdcanvas',
			unitvalue: '%',
			cardtext: '+-2-5% accuracy',
			buttonValue: 'btnHumidity',
		},
	],
}

let template = Handlebars.templates['card-template'](cardsData)
// <--END of HandleBars Template-->


// <--Start of dropdown menu code-->
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip()
	// getInitialValue()
	$('.loading').hide()
	// Logic for add card dropdown button
	$('#cancelCard').click(function() {
		$('.collapse').collapse('toggle')
	})

	// Logic for add card button clicked
	$('#addCard').click(function() {
		$("form[name='cardform']").validate({
			rules: {
				titleName: 'required',
				channelName: 'required',
			},
			messages: {
				titleName: 'Please enter a card title',
				channelName: 'Please enter a MQTT channel name',
			},
			submitHandler: function() {
				let newCards = {cards: []}
				let returnString = 'return' + $('#title-input').val()
				let buttonID = 'btn' + $('title-input').val()
				let channelString = $('#channel-input').val()
				addNewCard(newCards, returnString, buttonID)
				addNewSubscribe(channelString, returnString)
				addNewWarning(channelString)
				let newCardsTemplate = Handlebars.templates['card-template'](newCards)
				$('#card-content').append(newCardsTemplate)
				$('.collapse').collapse('toggle')
			},
		})
	})
})
// <--End of dropdown menu code-->

/**
 * [addNewCard add new card into the dashboard]
 * @param {[array]} newCards     [push new card created into cards array]
 * @param {[type]} returnString [return html id to insert into]
 * @param {[type]} buttonID     [button id link]
 */
function addNewCard(newCards, returnString, buttonID) {
	// Push new object into cardsData and update
	let newCard = {
		title: $('#title-input').val(),
		location: $('#location-input').val(),
		returndata: returnString,
		unitvalue: $('#unit-input').val(),
		cardtext: $('#description-input').val(),
		buttonValue: buttonID,
	}

	newCards.cards.push(newCard)
}

/**
 * [addNewSubscribe add new subscription to MQTT server for new card]
 * @param {[type]} channelString [description]
 * @param {[type]} returnString  [description]
 */
function addNewSubscribe(channelString, returnString) {
	// Add channel to array channelNames and subscribe to new channel
	pahoClient.subscribe(channelString)
	let newChannel = {
		id: channelString,
		return: returnString,
	}
	channelSubscribe.channel.push(newChannel)
}

/**
 * [addNewWarning add new notification warning for new card]
 * @param {[type]} channelString [description]
 */
function addNewWarning(channelString) {
	if (!($('#operator-select').val() === '')) {
		let newWarning = {
			id: channelString,
			title: $('#title-input').val(),
			compare: $('#operator-select').val(),
			warning: $('#warning-input').val(),
		}
		console.log(newWarning)
		$.ajax({
			type: 'POST',
			data: JSON.stringify(newWarning),
			url: './add-warn',
			contentType: 'application/json',
		})
	}
}

/**
 * [round description]
 * @param  {[type]} value    [description]
 * @param  {[type]} decimals [description]
 * @return {[type]}          [description]
 */
function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}
