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
var client = new mqtt.MQTTClient(1883, '127.0.0.1', 'pusher');

io.sockets.on('connection', function (socket) {
    // socket conneciton indicates what mqtt topic to subscribe to in
    socket.on('subscribe', function (data) {
        console.log('Subscribing to: ' + data.topic);
        socket.join(data.topic);
        client.subscribe(data.topic);
    });

    socket.on('publish', function (data) {
        console.log('Publishing to: ' + data.topic);
        client.publish(data.topic.data.payload);
    });
});

// listen to messages coming from the mqtt broker
client.addListener('mqttData', function (topic, payload) {
    console.log(topic + "=" + payload);
    io.sockets.emit('mqtt', {
        'topic': String(topic),
        'payload': String(payload)
    });
});
