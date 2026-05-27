// Weather API Configuration
const API_KEY = 'a6d96b6be62e4ab857513300241512'; // Using WeatherAPI.com (free tier)
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geolocationBtn = document.getElementById('geolocationBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const weatherContainer = document.getElementById('weatherContainer');
const welcomeMessage = document.getElementById('welcomeMessage');
const favoritesContainer = document.getElementById('favoritesContainer');

// State
let currentCity = null;
let favoritesCities = JSON.parse(localStorage.getItem('favoritesCities')) || [];

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
geolocationBtn.addEventListener('click', handleGeolocation);
searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());
searchInput.addEventListener('input', handleSearchInput);

// Initialize
displayFavorites();

/**
 * Handle city search
 */
async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    await fetchWeatherData(city);
    searchInput.value = '';
    document.getElementById('searchSuggestions').classList.remove('active');
}

/**
 * Handle search input with suggestions
 */
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    const suggestionsDiv = document.getElementById('searchSuggestions');
    
    if (query.length < 2) {
        suggestionsDiv.classList.remove('active');
        return;
    }
    
    try {
        const response = await fetch(
            `${WEATHER_API_URL}/current.json?key=${API_KEY}&q=${query}&aqi=no`
        );
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        const location = data.location;
        
        suggestionsDiv.innerHTML = `
            <div class="suggestion-item" onclick="selectCity('${location.name}, ${location.country}')">
                <i class="fas fa-map-marker-alt"></i> ${location.name}, ${location.country}
            </div>
        `;
        suggestionsDiv.classList.add('active');
    } catch (error) {
        suggestionsDiv.classList.remove('active');
    }
}

/**
 * Select a city from suggestions
 */
function selectCity(city) {
    searchInput.value = city;
    document.getElementById('searchSuggestions').classList.remove('active');
    handleSearch();
}

/**
 * Handle geolocation
 */
async function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
            hideLoading();
            showError(`Geolocation error: ${error.message}`);
        }
    );
}

/**
 * Fetch weather data from API
 */
async function fetchWeatherData(location) {
    showLoading();
    hideError();
    
    try {
        // Current weather
        const currentResponse = await fetch(
            `${WEATHER_API_URL}/current.json?key=${API_KEY}&q=${location}&aqi=yes`
        );
        
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentData = await currentResponse.json();
        
        // Forecast (7 days)
        const forecastResponse = await fetch(
            `${WEATHER_API_URL}/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=no`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available');
        }
        
        const forecastData = await forecastResponse.json();
        
        currentCity = currentData.location.name;
        displayWeather(currentData, forecastData);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(`Error: ${error.message}`);
    }
}

/**
 * Display weather data
 */
function displayWeather(currentData, forecastData) {
    const current = currentData.current;
    const location = currentData.location;
    const forecast = forecastData.forecast;
    
    // Hide welcome, show weather
    welcomeMessage.classList.add('hidden');
    weatherContainer.classList.remove('hidden');
    
    // Current weather
    const now = new Date();
    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('weatherIcon').src = `https:${current.condition.icon}`;
    document.getElementById('temp').textContent = Math.round(current.temp_c);
    document.getElementById('description').textContent = current.condition.text;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.feelslike_c)}°C`;
    
    // Weather details
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_kph} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_mb} mb`;
    document.getElementById('visibility').textContent = `${current.vis_km} km`;
    document.getElementById('uvIndex').textContent = current.uv.toFixed(1);
    document.getElementById('rainChance').textContent = `${current.cloud}%`;
    
    // Sunrise/Sunset
    const astro = forecast.forecastday[0].astro;
    document.getElementById('sunrise').textContent = astro.sunrise.split(' ')[0];
    document.getElementById('sunset').textContent = astro.sunset.split(' ')[0];
    
    // Hourly forecast
    displayHourlyForecast(forecast.forecastday[0].hour);
    
    // Daily forecast
    displayDailyForecast(forecast.forecastday);
}

/**
 * Display hourly forecast
 */
function displayHourlyForecast(hours) {
    const container = document.getElementById('hourlyContainer');
    container.innerHTML = '';
    
    const now = new Date();
    const currentHour = now.getHours();
    
    hours.filter((_, index) => index >= currentHour).slice(0, 24).forEach(hour => {
        const hourObj = new Date(hour.time);
        const hourHtml = `
            <div class="hourly-item">
                <span class="time">${hourObj.getHours().toString().padStart(2, '0')}:00</span>
                <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
                <span class="temp">${Math.round(hour.temp_c)}°</span>
            </div>
        `;
        container.innerHTML += hourHtml;
    });
}

/**
 * Display daily forecast
 */
function displayDailyForecast(days) {
    const container = document.getElementById('dailyContainer');
    container.innerHTML = '';
    
    days.slice(0, 7).forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayHtml = `
            <div class="daily-item">
                <span class="day">${dayName}</span>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <div class="temps">
                    <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
                    <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
                </div>
                <span class="description">${day.day.condition.text}</span>
            </div>
        `;
        container.innerHTML += dayHtml;
    });
}

/**
 * Add city to favorites
 */
function addToFavorites() {
    if (currentCity && !favoritesCities.includes(currentCity)) {
        favoritesCities.push(currentCity);
        localStorage.setItem('favoritesCities', JSON.stringify(favoritesCities));
        displayFavorites();
    }
}

/**
 * Remove city from favorites
 */
function removeFavorite(city) {
    favoritesCities = favoritesCities.filter(c => c !== city);
    localStorage.setItem('favoritesCities', JSON.stringify(favoritesCities));
    displayFavorites();
}

/**
 * Display favorite cities
 */
async function displayFavorites() {
    const container = favoritesContainer;
    container.innerHTML = '';
    
    if (favoritesCities.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">No favorite cities yet. Search and save your favorite cities!</p>';
        return;
    }
    
    for (const city of favoritesCities) {
        try {
            const response = await fetch(
                `${WEATHER_API_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`
            );
            
            if (!response.ok) continue;
            
            const data = await response.json();
            const current = data.current;
            
            const favoriteHtml = `
                <div class="favorite-card" onclick="searchInput.value = '${city}'; handleSearch();">
                    <span class="city-name">${city}</span>
                    <img src="https:${current.condition.icon}" alt="${current.condition.text}" style="width: 40px; height: 40px; margin: 0.5rem auto;">
                    <span class="temp">${Math.round(current.temp_c)}°C</span>
                    <span class="condition">${current.condition.text}</span>
                    <button class="remove-favorite" onclick="event.stopPropagation(); removeFavorite('${city}');" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; color: var(--danger); cursor: pointer; font-size: 1.2rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.innerHTML += favoriteHtml;
        } catch (error) {
            console.error(`Error loading favorite city ${city}:`, error);
        }
    }
}

/**
 * UI Helper Functions
 */
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    weatherContainer.classList.add('hidden');
    welcomeMessage.classList.add('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
    welcomeMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Add favorite button to weather display
window.addEventListener('load', () => {
    const weatherMain = document.querySelector('.weather-main');
    if (weatherMain && !document.querySelector('.add-favorite-btn')) {
        const btnHtml = `
            <button class="add-favorite-btn" onclick="addToFavorites()" style="
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                border: none;
                color: white;
                border-radius: 15px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s;
                margin-top: 1rem;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 20px rgba(99, 102, 241, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <i class="fas fa-heart"></i> Add to Favorites
            </button>
        `;
        const currentWeather = document.querySelector('.current-weather');
        if (currentWeather) {
            currentWeather.innerHTML += btnHtml;
        }
    }
});

console.log('%c🌡️ Weather Dashboard Loaded!', 'font-size: 16px; color: #6366f1; font-weight: bold;');
console.log('%cWeather data powered by WeatherAPI.com', 'font-size: 12px; color: #a855f7;');