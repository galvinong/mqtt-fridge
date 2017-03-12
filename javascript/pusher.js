/* Pusher.js
Server side node.js script that services real time web-socket requests
Allow web-socket connections to subscribe and publish to MQTT topics
*/

var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');

const PORT = process.env.PORT || 5000;

// create a socket object that listens on port 5000
var io = require('socket.io').listen((PORT), () => {
    console.log('Listening on ${ PORT }');
});

// create a mqtt client object and connect to the mqtt broker
var client = mqtt.connect('mqtt://m20.cloudmqtt.com/', {
    username: 'blazerflamer',
    password: 'rEFhbzjpJJEY'
});

io.on('connection', function (socket) {
    // Recieves subscribe message, sub to a data topic on behalf of browser
    // TODO: Add switch statement to check whether topic exists
    socket.on('subscribe', function (data) {
        console.log('Subscribing to: ' + data.topic);
        socket.join(data.topic);
        client.subscribe(data.topic);
    });

    // Recieve publish message
    socket.on('publish', function (data) {
        console.log('Publishing to: ' + data.topic);
        client.publish(data.topic, data.payload);
    });

    // Receive disconnect message, report user disconnection
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});

// MQTT Client, forward mqtt messages from broker
client.on('message', function (topic, payload) {
    console.log(topic + "=" + payload);
    // Send over mqtt messages to browser
    io.sockets.emit('mqtt', {
        'topic': String(topic),
        'payload': String(payload)
    });
});
