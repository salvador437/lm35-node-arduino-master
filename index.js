const http = require("http");
const express = require("express");
const SocketIO = require("socket.io");
const path = require("path");
const { SerialPort, ReadlineParser } = require("serialport");
const fs = require("fs");

// ================================
// CONFIGURACIONES INICIALES
// ================================

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use("/estilos", express.static(path.join(__dirname, "public/estilos")));
app.use("/imagenes", express.static(path.join(__dirname, "public/imagenes")));

let cont = 0;
let port;
let arduinoUno;
let puertoActual = null;

// ================================
// DETECTOR DE DISPOSITIVOS SERIAL (ESTABLE)
// ================================
const detectarDispositivosSerial = async () => {
  try {
    const ports = await SerialPort.list();

    console.log("📌 Puertos detectados:");
    ports.forEach((p) => {
      console.log(`➡ ${p.path} | ${p.manufacturer || "Desconocido"}`);
    });

    if (ports.length === 0) return null;

    // Toma el primer puerto disponible
    return ports[0].path;
  } catch (err) {
    console.error("Error al listar puertos:", err.message);
    return null;
  }
};

// ================================
// CONEXIÓN AL PUERTO SERIAL
// ================================
const setupSerialPort = async () => {
  try {
    if (port && port.isOpen) {
      port.close();
    }

    const puertoDetectado = await detectarDispositivosSerial();

    if (!puertoDetectado) {
      console.log("⏳ Esperando conexión del dispositivo...");
      return;
    }

    // Evita reconectar al mismo puerto si ya está activo
    if (puertoDetectado === puertoActual && port?.isOpen) return;

    puertoActual = puertoDetectado;

    port = new SerialPort({
      path: puertoDetectado,
      baudRate: 9600,
    });

    arduinoUno = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    console.log("✅ Conectado a:", puertoDetectado);

    io.emit("usb-info", {
      nombre: "Dispositivo Serial",
      puerto: puertoDetectado,
    });

    arduinoUno.on("data", (data) => {
      const temp = data.toString().trim();
      console.log("🌡", temp);
      io.emit("temp", temp);

      if (fs.existsSync("./temperatura.txt")) {
        const ahora = new Date();
        if (cont >= 60) return;

        const fecha = `${String(ahora.getDate()).padStart(2, "0")}/${String(
          ahora.getMonth() + 1
        ).padStart(2, "0")}/${ahora.getFullYear()}`;

        const hora = `${String(ahora.getHours()).padStart(2, "0")}:${String(
          ahora.getMinutes()
        ).padStart(2, "0")}:${String(ahora.getSeconds()).padStart(2, "0")}`;

        fs.appendFileSync(
          "temperatura.txt",
          `🥵${temp}  📅${fecha}   ⌚${hora}\n`
        );
        cont++;
      } else {
        fs.writeFileSync("./temperatura.txt", "");
      }
    });

    port.on("error", handleSerialError);

    port.on("close", () => {
      console.log("❌ Dispositivo desconectado");
      io.emit("usb-off");
      puertoActual = null;
    });

  } catch (err) {
    handleSerialError(err);
  }
};

// ================================
// MANEJO DE ERRORES SERIAL
// ================================
const handleSerialError = (err) => {
  console.error("⚠ Error en el puerto serial:", err.message);
  app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error404.html"));
});
  io.emit("error", "Dispositivo desconectado");
};

// ================================
// ESCANEO AUTOMÁTICO CADA 3 SEGUNDOS
// ================================
setInterval(() => {
  if (!port || !port.isOpen) {
    setupSerialPort();
  }
}, 1000);

// ================================
// SOCKET.IO
// ================================
io.on("connection", (socket) => {
  console.log("✅ Cliente conectado");
  app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
});

// ================================
// RUTAS
// ================================
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/weather.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "weather.html"));
});

app.get("/error404.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "error404.html"));
});

// ================================
// MANEJO DE ERRORES
// ================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).sendFile(path.join(__dirname, "public", "error404.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error404.html"));
});

// ================================
// INICIAR SERVIDOR
// ================================
setupSerialPort();

server.listen(3000, () => {
  console.log("🚀 Servidor corriendo en puerto 3000");
});