const socket = io();
const boton = document.getElementById("boton-preset");
const botonReset = document.getElementById("boton-reset");
const temperatureDisplay = document.getElementById('temperature');
const fondo = document.getElementsByTagName('body')[0];
const titulo = document.querySelector(".container p");
const reloj = document.getElementById('reloj');

// Redirección al hacer clic en el botón
boton.addEventListener("click", () => {
  window.location.href = "./preset.html";
});

// Manejo de errores de Arduino
socket.on('err', () => mostrarError());
socket.on('error', () => mostrarError());

function mostrarError() {
  temperatureDisplay.innerHTML = 'Arduino desconectado';
  temperatureDisplay.style.fontSize = '20px';
  window.open("./error404.html","_self","",true);
}

// Actualización de la temperatura
socket.on('temp', (data) => {
  const temperatura = parseFloat(data).toFixed(1);
  temperatureDisplay.innerHTML = ` ${temperatura} °C`;

  if (temperatura > 30 && temperatura < 40) {
    actualizarEstilos('red', "url('./imagenes/calor-extremo.jpg')", '🔥');
  } else if (temperatura > 25 && temperatura < 30) {
    actualizarEstilos('orangered', "url('./imagenes/fondo-calor.jpg')", '🥵');
  } else if (temperatura < 25 && temperatura > 15) {
    actualizarEstilos('cyan', "url('./imagenes/fondo.jpg')", '😎');
  } else if (temperatura < 15) {
    actualizarEstilos('blue', "url('./imagenes/fondo-frio.jpg')", '🥶');
  }
});

// Función para actualizar estilos
function actualizarEstilos(color, imagen, emoji) {
  temperatureDisplay.style.color = color;
  fondo.style.background = `${imagen} no-repeat center center fixed`;
  titulo.style.color = color;
  reloj.style.color = color;
  temperatureDisplay.style.border = `2px solid ${color}`;
  temperatureDisplay.innerHTML = ` ${parseFloat(temperatureDisplay.innerHTML)} °C ${emoji}`;
}

// Función para actualizar el reloj
function actualizarReloj() {
  const ahora = new Date();
  const fecha = `${String(ahora.getDate()).padStart(2, '0')}/${String(ahora.getMonth() + 1).padStart(2, '0')}/${ahora.getFullYear()}`;
  const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;

  reloj.innerHTML = `📅 ${fecha}   ⌚${hora}`;
  setTimeout(actualizarReloj, 1000);
}

// Iniciar el reloj
actualizarReloj();