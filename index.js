const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const path = require('path');
const { SerialPort, ReadlineParser } = require('serialport');
const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/estilos', express.static(path.join(__dirname, 'public/estilos')));
app.use('/imagenes', express.static(path.join(__dirname, 'public/imagenes')));


let port;
let parser;

try {
  port = new SerialPort({
    path: 'COM5',
    baudRate: 9600,
  });

  parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('open', function () {
    console.log('conectado con arduino');
  });

  parser.on('data', function (data) {
    let temp = parseInt(data, 10) + " °C";
    console.log(temp);
    io.emit('temp', data.toString());
  });

  parser.on('error', (err) => {
    console.log(err);
    io.emit('error', 'Arduino desconectado');
  });

  port.on('error', function (err) {
    console.log(err);
    io.emit('error', 'Arduino desconectado');
  });
} catch (err) {
  console.error('Error al conectar con el Arduino:', err.message);
}

io.on('connection', (socket) => {
  console.log('un cliente se ha conectado');
  
  socket.on('disconnect', () => {
    console.log('cliente desconectado');
  });

  socket.on('error', () => {
    console.log('error en arduino');
  });
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/error404.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'error404.html'));
});

// Middleware para manejar errores y redirigir a error404.html
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', 'error404.html'));
});

// Middleware para manejar rutas no encontradas y redirigir a error404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'error404.html'));
});

server.listen(3000, () => console.log('servidor en el puerto 3000'));

