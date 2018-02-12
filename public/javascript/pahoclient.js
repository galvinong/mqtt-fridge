// Socket handling script, gets live updates from mosquitto through websockets
// Create a client instance
let pahoClient = new Paho.MQTT.Client(
  'm20.cloudmqtt.com',
  36673,
  'web_' + parseInt(Math.random() * 100, 10))

pahoClient.onConnectionlost = onConnectionLost
pahoClient.onMessageArrived = onMessageArrived
let options = {
	timeout: 3,
	useSSL: true,
	cleanSession: true,
	userName: config.username,
	password: config.password,
	onSuccess: onConnect,
	onFailure: doFail,
}

// connect the client
pahoClient.connect(options)

/**
 * [onConnect called when the client connects]
 */
function onConnect() {
	console.log('onConnect')
	pahoClient.subscribe('RF24SN/in/1/1', {qos: 0})
	pahoClient.subscribe('RF24SN/in/1/2', {qos: 0})
};

/**
 * [doFail description]
 * @param  {[error]} e [prints out error message when client fails]
 **/
function doFail(e) {
	console.log(e)
};

/**
 * [onConnectionLost: called when the client loses its connection]
 * @param  {[responseObject]} responseObject [returns error object]
 */
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log('onConnectionLost: ' + responseObject.errorMessage)
	}
};

let channelSubscribe = {
	channel: [
		{
			id: 'RF24SN/in/1/1',
			return: 'returntemp',
		}, {
			id: 'RF24SN/in/1/2',
			return: 'returnhumd',
		},
	],
}


/**
 * [onMessageArrived called when message arrives]
 * @param  {[message]} message [message contains topic and payload]
 */
function onMessageArrived(message) {
	if (message.payloadString !== 'NaN') {
		let payload = Math.floor(message.payloadString * 100) / 100
		// Hide loading message
		// $('.loading').hide()
		// Load values according to their html id
		for (var i = 0; i < channelSubscribe.channel.length; i++) {
			// console.log(channelNames.channel[i].title)
			// console.log(channelNames.channel[i].return)
			if (message.destinationName == channelSubscribe.channel[i].id) {
				$('#' + channelSubscribe.channel[i].return).html(payload)
			}
		}
	}
};
