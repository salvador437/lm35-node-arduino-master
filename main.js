const socket = io();

const tem = document.getElementById('temperature');

socket.on('temp', function (data) {
  console.log(data);
  tem.innerHTML = `${data}°C`;
});
