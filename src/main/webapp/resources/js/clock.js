function updateClock() {
    let currentDateTime = new Date();
    document.getElementById("clockDate").innerHTML = "Дата: " + currentDateTime.toLocaleDateString();
    document.getElementById("clockTime").innerHTML = "Время: " + currentDateTime.toLocaleTimeString();
}

window.onload = () => {
    updateClock();
    setInterval(updateClock, 7000);
};