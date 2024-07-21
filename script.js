document.getElementById('weather-form-search').addEventListener('submit', function (event) {
    event.preventDefault();
    var city = document.getElementById('city-input').value;
    getWeather(city);
});

async function getWeather(city) {
    try {
        console.log('City name:', city);

        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                q: city,
                appid: 'b870683b2b0319cbdf52e57ebb9bafc1',
                units: 'metric'
            },
        });

        const currentTemperature = response.data.list[0].main.temp;
        document.querySelector('.weather-temp').textContent = Math.round(currentTemperature) + 'ºC';

        const forecastData = response.data.list;
        const dailyForecast = {};

        forecastData.forEach((data) => {
            const day = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            if (!dailyForecast[day]) {
                dailyForecast[day] = {
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    description: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: data.weather[0].icon,
                };
            } else {
                dailyForecast[day].minTemp = Math.min(dailyForecast[day].minTemp, data.main.temp_min);
                dailyForecast[day].maxTemp = Math.max(dailyForecast[day].maxTemp, data.main.temp_max);
            }
        });

        document.querySelector('.date-dayname').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const date = new Date().toUTCString().slice(5, 16);
        document.querySelector('.date-day').textContent = date;

        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const currentWeatherIconCode = dailyForecast[currentDay].icon;
        const weatherIconElement = document.querySelector('.weather-icon');
        weatherIconElement.innerHTML = getWeatherIcon(currentWeatherIconCode);

        document.querySelector('.location').textContent = response.data.city.name;
        document.querySelector('.weather-desc').textContent = dailyForecast[currentDay].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        document.querySelector('.humidity .value').textContent = dailyForecast[currentDay].humidity + ' %';
        document.querySelector('.wind .value').textContent = dailyForecast[currentDay].windSpeed + ' m/s';

        const dayElements = document.querySelectorAll('.day-name');
        const tempElements = document.querySelectorAll('.day-temp');
        const iconElements = document.querySelectorAll('.day-icon');

        Object.keys(dailyForecast).forEach((day, index) => {
            if (dayElements[index]) {
                const data = dailyForecast[day];
                dayElements[index].textContent = day;
                tempElements[index].textContent = `${Math.round(data.minTemp)}º / ${Math.round(data.maxTemp)}º`;
                iconElements[index].innerHTML = getWeatherIcon(data.icon);
            }
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            alert('lokasi tidak temukan, input ulang nama kota');
        } else {
            console.error('An error occurred while fetching data:', error.message);
        }
    }
}

function getWeatherIcon(iconCode) {
    const iconBaseUrl = 'https://openweathermap.org/img/wn/';
    const iconSize = '@2x.png';
    return `<img src="${iconBaseUrl}${iconCode}${iconSize}" alt="Weather Icon">`;
}

document.addEventListener("DOMContentLoaded", function () {
    const defaultCity = ''; // Replace with your default city if needed
    if (defaultCity) {
        getWeather(defaultCity);
    }
    setInterval(() => {
        if (defaultCity) {
            getWeather(defaultCity);
        }
    }, 900000); // Refresh every 15 minutes
});

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form");
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // Mencegah pengiriman form default
      
      // Mengirim data form menggunakan fetch
      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          alert("Pesan telah terkirim!");
          form.reset(); // Mengosongkan form setelah pengiriman sukses
          window.location.href = 'index.html';
        } else {
          alert("Terjadi kesalahan, silakan coba lagi.");
        }
      }).catch(error => {
        alert("Terjadi kesalahan, silakan coba lagi.");
      });
    });
  });