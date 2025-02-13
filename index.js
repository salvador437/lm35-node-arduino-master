const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const path = require('path');
const { SerialPort, ReadlineParser } = require('serialport');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/estilos', express.static(path.join(__dirname, 'public/estilos')));
app.use('/imagenes', express.static(path.join(__dirname, 'public/imagenes')));

let cont = 0;
let port;
let parser;

const setupSerialPort = () => {
  try {
    // Cerrar el puerto serial si ya está abierto
    if (port && port.isOpen) {
      port.close((err) => {
        if (err) {
          console.error('Error al cerrar el puerto:', err.message);
        } else {
          console.log('Puerto cerrado antes de reconectar');
        }
      });
    }

    // Crear una nueva instancia del puerto serial
    port = new SerialPort({
      path: 'COM5',
      baudRate: 9600,
    });

    parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser.on('open', () => {
      console.log('Conectando con Arduino');
       // Notificar a los clientes
    });

    // Manejar errores en el parser
    parser.on('error', (err) => {
      console.error('Error en el parser:', err.message);
      handleSerialError(err);
    });

    // Manejar errores en el puerto serial
    port.on('error', (err) => {
      console.error('Error en el puerto serial:', err.message);
      handleSerialError(err);
    });

    // Capturar el evento de cierre del puerto (desconexión USB)
    port.on('close', () => {
      console.log('Puerto serial cerrado (USB desconectado)');
      handleSerialError(new Error('Arduino desconectado'));
      
    });

    parser.on('data', (data) => {
      const temp = `${parseInt(data, 10)} °C`;
        console.log(temp);
        io.emit('temp', data.toString());
      if (cont <= 60) {
        const ahora = new Date();
        const fecha = `${String(ahora.getDate()).padStart(2, '0')}/${String(ahora.getMonth() + 1).padStart(2, '0')}/${ahora.getFullYear()}`;
        const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;
        fs.appendFileSync("temperatura.txt", `🥵${temp}  📅${fecha}   ⌚${hora}  \n`);
        
        cont++;
      } else {
        
      }
    });

  } catch (err) {
    handleSerialError(err);
  }
};

const handleSerialError = (err) => {
  console.error('Error en el puerto serial:', err.message);
  io.emit('error', 'Arduino desconectado');
  // Notificar a los clientes
};

const closePort = () => {
  if (port && port.isOpen) {
    port.close((err) => {
      if (err) {
        console.error('Error al cerrar el puerto:', err.message);
      } else {
        console.log('Puerto cerrado');
      }
      io.emit('reload');
      
    });
  }
};

// Ruta para restablecer la conexión manualmente
app.post('/reconnect', (req, res) => {
  console.log('Reconexión solicitada manualmente');
  setupSerialPort(); // Intentar reconectar
  res.sendStatus(200); // Responder al cliente
});

// Iniciar la conexión con el puerto serial
setupSerialPort();

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    io.emit('reload');
    
  });

  socket.on('error', () => {
    console.log('Error en Arduino');
    io.emit('reload');
    
  });
});

// Rutas
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

// Iniciar el servidor
server.listen(3000, () => console.log('Servidor en el puerto 3000'));