/* Pusher.js
Server side node.js script that services real time web-socket requests
Allow web-socket connections to subscribe and publish to MQTT topics
*/

var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');

// create a socket object that listens on port 5000
var io = require('socket.io').listen(5000);

// create a mqtt client object and connect to the mqtt broker
var client = mqtt.connect('mqtt://127.0.0.1/');

// TODO: Add switch statement to check whether topic exists
io.on('connection', function (socket) {
    console.log('user connected');
    // socket connection indicates what mqtt topic to subscribe to in a data topic
    socket.on('subscribe', function (data) {
        console.log('Subscribing to: ' + data.topic);
        socket.join(data.topic);
        client.subscribe(data.topic);
    });

    // when socket connection publishes a msg, forward to mosquitto
    socket.on('publish', function (data) {
        console.log('Publishing to: ' + data.topic);
        client.publish(data.topic, data.payload);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});

// listen to messages coming from the mqtt broker
client.on('message', function (topic, payload) {
    console.log(topic + "=" + payload);
    io.sockets.emit('mqtt', {
        'topic': String(topic),
        'payload': String(payload)
    });
});
