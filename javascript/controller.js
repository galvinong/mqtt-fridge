//controller.js, bridging mqtt and websockets together


// First init mqtt and connect to mosquitto at 127.0.0.1
const mqtt = require('mqtt');
const client = mqtt.client('mqtt://127.0.0.1');

// Check whether connected or not
var connected = false;

// Add subscription of topics here
client.on('connect', () => {
  client.subscribe('RF24SN/in/1/1')
});

// Handle topic subscription here
client.on('message', (topic, message) => {
  switch (topic) {
    case 'RF24SN/in/1/1'
      return handleTemp(message);
  }
});

function handleTemp(message) {
  console.log('Temperature is now at %f', message)
  connected = (message.toString() === true)
}
