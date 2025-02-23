const city = document.getElementById("cityInput");
const parrafos = document.querySelector(".parrafos");

city.addEventListener("click", (event) => {
  event.preventDefault();
  city.value = "";
});

async function checkInternetConnection() {
    try {
      await fetch("https://www.google.com", { mode: "no-cors" });
      internet.style.visibility = "visible";
      parrafos.style.visibility = "visible";
      return;
    } catch (error) {
      internet.style.visibility = "hidden";
      parrafos.style.visibility = "hidden";
    }
  }

  // Verificar la conexión cada  segundo  53290579Q jav
  setInterval(checkInternetConnection, 1000);
  checkInternetConnection();

async function getTemperature() {
  const city = document.getElementById("cityInput").value;

  if (!city) {
    alert("Por favor, ingresa el nombre de una ciudad.");
    return;
  }

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=CZVCNYPB7647GR77JR53L8QH6`

      /* `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},41.6154,2.08601?key=CZVCNYPB7647GR77JR53L8QH6` */
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

    const temperaturaCelsius = (((temperature - 32) * 5) / 9).toFixed(1);
    
    
    
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

    localStorage.setItem("temp-ext", temperaturaCelsius);
    localStorage.setItem("humedad", humedad);
    localStorage.setItem("cityName", cityName);
    localStorage.setItem("latitud", latitud);
    localStorage.setItem("longitud", longitud);
    localStorage.setItem("Zona-horaria", zonaHoraria);

    window.open(`https://www.google.com/maps?q=${latitud},${longitud}`,"_self","",true);

  } catch (error) {
    document.getElementById("result").textContent =
      "No se pudo obtener la temperatura. Verifica el nombre de la ciudad o la API key.";
  }
}
  