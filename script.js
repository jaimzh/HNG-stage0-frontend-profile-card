function updateTime() {
  const timeElement = document.getElementById("user-time-ms");
  timeElement.textContent = Date.now();
}

updateTime();
setInterval(updateTime, 1000);
