
const ffDe = document.getElementById("ff-de");
const ffA = document.getElementById("ff-a");
const fcDe = document.getElementById("fc-de");
const fcA = document.getElementById("fc-a");
const fsMayorDe = document.getElementById("fs-mayor-de");

// labels 
const lblffdevalue = document.getElementById("lbl-ff-de-value");
const lblffA = document.getElementById("lbl-ff-a");
const lblfcde = document.getElementById("lbl-fc-de");
const lblfca = document.getElementById("lbl-fc-a");
const lblMayorDe = document.getElementById("lbl-mayor-de");
const botonSalir = document.getElementById("boton-salir")

const contenido = `${ffDe.value},${ffA.value},${fcDe.value},${fcA.value},${fsMayorDe.value}`;
// condiciones iniciales
lblffdevalue.innerHTML = "0" + ffDe.value + "°C"
lblffA.innerHTML= "0" + ffA.value + "°C"
lblfcde.innerHTML = fcDe.value + "°C"; 
lblfca.innerHTML= fcA.value + "°C"; 
lblMayorDe.innerHTML = fsMayorDe.value + "°C"; 



  // Dividir el contenido en valores
  /* const valores = data.split(',');
  // Asignar las variables
  ffDe.value = parseInt(valores[0], 10);
  ffA.value = parseInt(valores[1], 10);
  fcDe.value = parseInt(valores[2], 10);
  fcA.value = parseInt(valores[3], 10);
  fsMayorDe.value = parseInt(valores[4], 10); */

botonSalir.addEventListener("click",()=>{
  window.open("./index.html", "_self", "", true);
})

ffDe.addEventListener("mousemove", ()=>{
  if(ffDe.value < 10){
    lblffdevalue.innerHTML = "0" + ffDe.value + "°C" ;
  }else{
    lblffdevalue.innerHTML = ffDe.value + "°C"
  }
}) 

ffDe.addEventListener("change", ()=>{
  if(ffDe.value < 10){
    lblffdevalue.innerHTML = "0" + ffDe.value + "°C" ;
  }else{
    lblffdevalue.innerHTML = ffDe.value + "°C"
  }
}) 

ffA.addEventListener("mousemove", ()=>{
  if(ffA.value < 10){
    lblffA.innerHTML = "0" + ffA.value + "°C" ;
  }else{ 
    lblffA.innerHTML= ffA.value + "°C"
  }  
}) 

ffA.addEventListener("change", ()=>{
  if(ffA.value < 10){
    lblffA.innerHTML = "0" + ffA.value + "°C" ;
  }else{ 
    lblffA.innerHTML= ffA.value + "°C"
  }  
})


fcDe.addEventListener("mousemove", ()=>{
  if(fcDe.value < 10){
    lblfcde.innerHTML = "0" + fcDe.value + "°C" ;
  }else{
    lblfcde.innerHTML = fcDe.value + "°C";
  }
})  

fcDe.addEventListener("change", ()=>{
  if(fcDe.value < 10){
    lblfcde.innerHTML = "0" + fcDe.value + "°C";
  }else{
    lblfcde.innerHTML = fcDe.value + "°C";
  }
})


fcA.addEventListener("mousemove", ()=>{
  if(fcA.value < 10){
    lblfca.innerHTML = "0" + fcA.value + "°C";
  }else{
    lblfca.innerHTML = fcA.value + "°C";
  }
}) 

fcA.addEventListener("change", ()=>{
  if(fcA.value < 10){
    lblfca.innerHTML = "0" + fcA.value + "°C";
  }else{
    lblfca.innerHTML = fcA.value + "°C";
  }
})

fsMayorDe.addEventListener("mousemove", ()=>{
  lblMayorDe.innerHTML = fsMayorDe.value + "°C";
}) 
j
fsMayorDe.addEventListener("change", ()=>{
  lblMayorDe.innerHTML = fsMayorDe.value + "°C";
}) 


  // Guardar en el archivo
  /* fs.writeFile('variables.txt', contenido, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
    } else {
      console.log('Variables guardadas correctamente en variables.txt');
    }
  }) */
