const apikey = "10361bb5ed91b2158f934b4bd1435152";

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;
      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(new Date().getTime());
          const dat = new Date(data.dt);
          console.log(dat.toLocaleString(undefined, "Asia/Kolkata"));
          console.log(new Date().getMinutes());
          weatherReport(data);
        });
    });
  }
});

function searchByCity() {
  const place = document.getElementById("input").value;
  const urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

  fetch(urlsearch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      weatherReport(data);
    });
  document.getElementById("input").value = "";
}

function weatherReport(data) {
  const urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

  fetch(urlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      console.log(forecast.city);
      dayForecast(forecast);

      console.log(data);
      document.getElementById("city").innerText = data.name + ", " + data.sys.country;
      console.log(data.name, data.sys.country);

      console.log(Math.floor(data.main.temp - 273));
      document.getElementById("temperature").innerText = Math.floor(data.main.temp - 273) + " °C";

      document.getElementById("clouds").innerText = data.weather[0].description;
      console.log(data.weather[0].description);

      document.getElementById("humidity").innerText = "Humidity: " + data.main.humidity + "%";
      document.getElementById("windspeed").innerText = "Wind Speed: " + data.wind.speed + " m/s";

      let icon1 = data.weather[0].icon;
      let iconurl = `http://api.openweathermap.org/img/w/${icon1}.png`;
      document.getElementById("img").src = iconurl;
    });
}

function dayForecast(forecast) {
  document.querySelector(".weekF").innerHTML = "";
  const tomorrowIndex = 8; // Index of tomorrow's forecast in the response data

  for (let i = 0; i < 7; i++) {
    const forecastIndex = tomorrowIndex + i;
    console.log(forecast.list[forecastIndex]);
    let div = document.createElement("div");
    div.setAttribute("class", "dayF");

    let day = document.createElement("p");
    day.setAttribute("class", "date");
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Setting the date for each day starting from tomorrow
    const options = { weekday: "long", month: "long", day: "numeric" };
    day.innerText = date.toLocaleDateString("en-US", options);
    div.appendChild(day);

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[forecastIndex].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[forecastIndex].main.temp_min - 273) +
      " °C";
    div.appendChild(temp);

    let description = document.createElement("p");
    description.setAttribute("class", "desc");
    description.innerText = forecast.list[forecastIndex].weather[0].description;
    div.appendChild(description);

    document.querySelector(".weekF").appendChild(div);
  }
}
