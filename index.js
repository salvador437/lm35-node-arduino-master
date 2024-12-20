const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const SerialPort = require('serialport');

const app = express();
const server = http.createServer(app);


app.use(express.static(__dirname + '/public'));
server.listen(3000, () => console.log('server on port 3000'));


const ReadLine = SerialPort.parser.ReadLine();

const port = new SerialPort("COM5", {
  baudRate: 9600
});
const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }));

parser.on('open', function () {
  console.log('connection is opened');
});

parser.on('data', function (data) {
  let temp = parseInt(data, 10) + " °C";
  console.log(temp);
  io.emit('temp', data.toString());
});
const io = SocketIO.listen(server);
parser.on('error', (err) => console.log(err));
port.on('error', (err) => console.log(err));
