'use strict';
require('dotenv').config()

const {
  EventHubProducerClient
} = require("@azure/event-hubs");
const connectionString = process.env.cs;
const eventHubName = process.env.hubname;

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');
        const producer = new EventHubProducerClient(connectionString, eventHubName);
        console.log('Connected to Event Hub')


        // Act on input messages to the module.
        client.on('inputMessage', function (inputName, msg) {
          console.log('Message Received')
          console.log(msg)
          pipeMessage(client, inputName, msg);
        });
      }
    });
  }
});

// This function just pipes the messages without any change.
async function pipeMessage(client, inputName, msg) {
  try {
    console.log(inputName);ß

    client.complete(msg, () => {});

    if (inputName === 'opcua_data') {
      var message = msg.getBytes().toString('utf8');
      if (message) {
        console.log('opcua data received');
        console.log(JSON.parse(message));

        const batch = await producer.createBatch(); batch.tryAdd({body: "First event"});
        await producer.sendBatch(batch);
      }
    }
  } catch (e) {
    console.error(e)
  }
}
