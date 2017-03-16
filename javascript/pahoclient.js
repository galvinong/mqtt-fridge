// Socket handling script, gets live updates from mosquitto through socket.io
// Create a client instance
client = new Paho.MQTT.Client(
  'm20.cloudmqtt.com',
  36673,
  'web_' + parseInt(Math.random() * 100, 10));

client.onConnectionlost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
var options = {
    timeout: 3,
    useSSL: true,
    cleanSession: true,
    userName: '***REMOVED***',
    password: '***REMOVED***',
    onSuccess: onConnect,
    onFailure: doFail,
};

// connect the client
client.connect(options);

// called when the client connects
function onConnect() {
    console.log("onConnect");
    client.subscribe("RF24SN/in/1/1", {qos: 0});
    client.subscribe("RF24SN/in/1/2", {qos: 0});
};

function doFail(e) {
    console.log(e);
};

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
};

// called when message arrives
function onMessageArrived(message) {
    if (message.payloadString !== "NaN") {
        var payload = message.payloadString;
        console.log(payload);
        $('.loading').hide();
        if (message.destinationName == "RF24SN/in/1/1") {
            $('#returntemp').html(payload);
        } else if (message.destinationName == "RF24SN/in/1/2") {
            $('#returnhumd').html(payload);
        }
    }
};
