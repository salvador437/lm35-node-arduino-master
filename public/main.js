//48e29ad0a3bb4b4794991617251802  weather key de openweather
// key=CZVCNYPB7647GR77JR53L8QH6  weather key de visualcrossing

const socket = io();
const boton = document.getElementById("btn-preset");
const botonExterior = document.getElementById("btn-exterior");

const reconnectButton = document.getElementById("btn-reconnect");
const temperatureDisplay = document.getElementById("temperature");
const fondo = document.getElementsByTagName("body")[0];
const titulo = document.querySelector(".container p");
const reloj = document.getElementById("reloj");
const statusElement = document.getElementById("status");

let ffDe = parseInt(localStorage.getItem("ffDe"));
let ffA = parseInt(localStorage.getItem("ffA"));
let fcDe = parseInt(localStorage.getItem("fcDe"));
let fcA = parseInt(localStorage.getItem("fcA"));
let fsMayorDe = parseInt(localStorage.getItem("fsMayorDe"));
let tempExterior = localStorage.getItem("temp-ext");
let ciudad = localStorage.getItem("cityName");

if (reconnectButton) {
  reconnectButton.style.display = "flex";
  statusElement.textContent = "Estado: Desconectado";
  reconnectButton.addEventListener("click", () => {
    fetch("/reconnect", { method: "POST" })
      .then((response) => {
        if (response.ok) {
          console.log("Reconexión solicitada");
        } else {
          console.error("Error al solicitar reconexión");
        }
      })
      .catch((error) => console.error("Error:", error));
  });
} else {
  console.error('Elemento con ID "btn-reconnect" no encontrado');
}

// Redirección al hacer clic en el botón de preset
boton.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "./preset.html";
});

// Redirección al hacer clic en el botón de exterior
botonExterior.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "./weather.html";
});

// Manejar el evento de recarga desde el servidor
socket.on("reload", () => {
  location.reload();
});

// Manejo de errores de Arduino desconectado
socket.on("err", () => mostrarError());
socket.on("error", () => mostrarError());

// Función para mostrar un error en la interfaz
function mostrarError() {
  temperatureDisplay.innerHTML = "Arduino desconectado";
  reconnectButton.style.display = "flex";
  temperatureDisplay.style.fontSize = "20px";
  window.location.href = "error404.html";
}

// Actualización de la temperatura en la interfaz
socket.on("temp", (data) => {
  const temperatura = parseFloat(data).toFixed(1);
  temperatureDisplay.innerHTML = ` ${temperatura} °C`;
  reconnectButton.style.display = "none";
  statusElement.textContent = "Estado: Conectado";
  statusElement.style.color = "white";
  if (temperatura > 30 && temperatura < 40) {
    actualizarEstilos("red", "url('./imagenes/calor-extremo.jpg')", "🔥");
  } else if (temperatura > fcA && temperatura < fsMayorDe) {
    actualizarEstilos("orangered", "url('./imagenes/fondo-calor.jpg')", "🥵");
  } else if (temperatura < fcA && temperatura > fcDe) {
    actualizarEstilos("white", "url('./imagenes/fondo.jpg')", "😎");
  } else if (temperatura < ffA) {
    actualizarEstilos("blue", "url('./imagenes/fondo-frio.jpg')", "🥶");
  }
});

// Función para actualizar estilos de la interfaz
function actualizarEstilos(color, imagen, emoji) {
  temperatureDisplay.style.color = color;
  fondo.style.background = `${imagen} no-repeat center center fixed`;
  titulo.style.color = color;
  reloj.style.color = color;
  temperatureDisplay.style.border = `2px solid ${color}`;
  temperatureDisplay.innerHTML = ` ${parseFloat(temperatureDisplay.innerHTML)} 
  °C ${emoji}  ${tempExterior} °C ext `;
}

// Función para actualizar el reloj en la interfaz
function actualizarReloj() {
  const ahora = new Date();
  const fecha = `${String(ahora.getDate()).padStart(2, "0")}/${String(
    ahora.getMonth() + 1
  ).padStart(2, "0")}/${ahora.getFullYear()}`;
  const hora = `${String(ahora.getHours()).padStart(2, "0")}:${String(
    ahora.getMinutes()
  ).padStart(2, "0")}:${String(ahora.getSeconds()).padStart(2, "0")}`;

  reloj.innerHTML = `📅 ${fecha}   ⌚${hora}  🌐 ${ciudad}`;
  setTimeout(actualizarReloj, 1000);
}

// Iniciar el reloj en la interfaz
actualizarReloj();
