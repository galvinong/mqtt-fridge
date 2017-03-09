#!/bin/sh
sudo rf24sn -v -b mqtt://localhost:1883 -spi /dev/spidev0.0 &
mosquitto -v &
node javascript/pusher.js &
