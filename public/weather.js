const city = document.getElementById("cityInput");
const parrafos = document.querySelector(".parrafos");
const infoMapa = document.getElementById("mapa");

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

  // Verificar la conexión cada  segundo 
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

    
    

  } catch (error) {
    document.getElementById("result").textContent =
      "No se pudo obtener la temperatura. Verifica el nombre de la ciudad o la API key.";
  }
}
infoMapa.addEventListener("click", () => {
  window.open(`https://www.google.com/maps/@41.6334618,2.0633321,3a,75y,229.86h,90t/data=!3m7!1e1!3m5!1suHq3K381unqjUf_pRP9VCA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DuHq3K381unqjUf_pRP9VCA%26yaw%3D229.8561550312585!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D`,"_blank","",true);
})
  