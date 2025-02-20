const city = document.getElementById("cityInput");
const parrafos = document.querySelector(".parrafos");

cityInput.addEventListener("focus", () => {
  cityInput.value = "";
});

async function getTemperature() {
  const city = document.getElementById("cityInput").value;
  const internet = document.getElementById("internet");

  async function checkInternetConnection() {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        internet.style.visibility = "visible";
        parrafos.style.visibility = "visible";
    } catch (error) {
        internet.style.visibility = "hidden";
        parrafos.style.visibility = "hidden";
        alert("Sin internet, revise su conexión")
    }
}

// Verificar la conexión cada  segundo
setInterval(checkInternetConnection, 1000);
checkInternetConnection(); 

  if (!city) {
    alert("Por favor, ingresa el nombre de una ciudad.");
    return;
  }

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=CZVCNYPB7647GR77JR53L8QH6`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data); // Verifica los datos en la consola

    const temperature = data.currentConditions.temp;
    const humedad = data.currentConditions.humidity;
    const latitud = data.latitude;
    const longitud = data.longitude;
    const zonaHoraria = data.timezone;
    const cityName = data.address;

    const temperaturaCelsius = (((temperature - 32) * 5) / 9).toFixed(2);

    document.getElementById(
      "result"
    ).textContent = `La temperatura en ${cityName} es de ${temperaturaCelsius}°C.`;
    document.getElementById(
      "humedad"
    ).textContent = `La humedad es de ${humedad} % `;
    document.getElementById(
      "latitud"
    ).textContent = `La latitud es de ${latitud} `;
    document.getElementById(
      "longitud"
    ).textContent = `La longitud es de ${longitud} `;
    document.getElementById(
      "zona-horaria"
    ).textContent = `La zona horaria es de ${zonaHoraria} `;
  } catch (error) {
    document.getElementById("result").textContent =
      "No se pudo obtener la temperatura. Verifica el nombre de la ciudad o la API key.";
  }
}
