// weather.js - Weather data fetching and display for Willamette River - Portland Morrison Street Bridge
document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather-container');
    // Set refresh interval to 5 minutes (in milliseconds)
    const refreshInterval = 5 * 60 * 1000;
    let refreshTimer;
    
    // Function to fetch weather data from weather.gov API for Portland Morrison Street Bridge
    async function fetchMorrisonBridgeWeather() {
        try {
            weatherContainer.innerHTML = '<p>Getting weather data for Willamette River - Portland Morrison Street Bridge...</p>';
            
            // Coordinates for Portland Morrison Street Bridge (approximate)
            const lat = 45.517;  // Morrison Bridge latitude
            const lon = -122.673; // Morrison Bridge longitude
            
            // First get the grid endpoint for the location
            const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
            const pointsData = await pointsResponse.json();
            
            if (!pointsResponse.ok) {
                throw new Error(pointsData.detail || 'Error fetching location data');
            }
            
            // Get the forecast using the grid endpoint
            const forecastUrl = pointsData.properties.forecast;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            
            if (!forecastResponse.ok) {
                throw new Error(forecastData.detail || 'Error fetching forecast data');
            }
            
            // Get hourly forecast for more precise data
            const hourlyForecastUrl = pointsData.properties.forecastHourly;
            const hourlyResponse = await fetch(hourlyForecastUrl);
            const hourlyData = await hourlyResponse.json();
            
            if (!hourlyResponse.ok) {
                throw new Error(hourlyData.detail || 'Error fetching hourly data');
            }
            
            // Display the weather data
            displayWeatherData(forecastData, hourlyData);
            
        } catch (error) {
            console.error('Weather API error:', error);
            weatherContainer.innerHTML = `<p>Unable to fetch weather data: ${error.message}</p>`;
        }
    }
    
    // Function to get appropriate weather icon based on forecast condition
    function getWeatherIcon(forecast, isDaytime) {
        const condition = forecast.toLowerCase();
        
        // Map weather conditions to icon filenames that actually exist in the animated folder
        if (condition.includes('partly sunny') || condition.includes('mostly sunny')) {
            return 'cloudy-day-3'; // Using cloudy-day-3 for partly sunny
        } else if (condition.includes('partly cloudy')) {
            return 'cloudy-day-2'; // Using cloudy-day-2 for partly cloudy
        } else if (condition.includes('cloudy') && !condition.includes('partly')) {
            return 'cloudy'; // Using cloudy for fully cloudy conditions
        } else if (condition.includes('rain') && condition.includes('thunder')) {
            return 'thunder'; // Using thunder for thunderstorms
        } else if (condition.includes('thunder') || condition.includes('lightning')) {
            return 'thunder'; // Using thunder for lightning
        } else if (condition.includes('rain') || condition.includes('showers')) {
            return 'rainy-1'; // Using rainy-1 for rain conditions
        } else if (condition.includes('snow')) {
            return 'snowy-1'; // Using snowy-1 for snow conditions
        } else if (condition.includes('fog') || condition.includes('haze')) {
            // No specific fog icon, using cloudy as fallback
            return 'cloudy';
        } else if (condition.includes('wind')) {
            // No specific wind icon, using cloudy-day-1 as fallback
            return 'cloudy-day-1';
        } else if (condition.includes('sunny') || condition.includes('clear')) {
            if (isDaytime === false) {
                return 'night'; // Use night icon for clear night conditions
            }
            return 'day'; // Use day icon for sunny/clear day conditions
        } else {
            return 'weather'; // Using weather.svg as default
        }
    }
    
    // Function to display weather data
    function displayWeatherData(forecastData, hourlyData) {
        const currentPeriod = forecastData.properties.periods[0];
        const currentHourly = hourlyData.properties.periods[0];
        
        const temperature = currentPeriod.temperature;
        const windSpeed = currentPeriod.windSpeed;
        const windDirection = currentPeriod.windDirection;
        const shortForecast = currentPeriod.shortForecast;
        const isDaytime = currentPeriod.isDaytime;
        
        // Get the appropriate weather icon
        const weatherIconType = getWeatherIcon(shortForecast, isDaytime);
        
        // Calculate precipitation chance (may not be directly available)
        let precipChance = "N/A";
        if (currentHourly.probabilityOfPrecipitation && 
            currentHourly.probabilityOfPrecipitation.value !== null) {
            precipChance = `${currentHourly.probabilityOfPrecipitation.value}%`;
        }
        
        // Extract wind gust information if available
        // The NWS API may include wind gust data in different formats depending on the forecast
        let windGusts = "N/A";
        
        // Try different possible locations for wind gust data
        if (currentPeriod.windGust) {
            // If windGust is directly available as a string
            windGusts = currentPeriod.windGust;
        } else if (currentHourly.windGust && typeof currentHourly.windGust === 'string') {
            // If windGust is directly available as a string in hourly data
            windGusts = currentHourly.windGust;
        } else if (currentHourly.windGust && currentHourly.windGust.value) {
            // If windGust is an object with a value property
            windGusts = `${currentHourly.windGust.value} mph`;
        } else if (currentHourly.windSpeed && currentHourly.windSpeed.includes('mph')) {
            // As a fallback, estimate gusts as 1.5x the wind speed
            const baseSpeed = parseInt(currentHourly.windSpeed);
            if (!isNaN(baseSpeed)) {
                const estimatedGusts = Math.round(baseSpeed * 1.5);
                windGusts = `≈ ${estimatedGusts} mph (estimated)`;
            }
        } else if (currentPeriod.windSpeed && currentPeriod.windSpeed.includes('mph')) {
            // As a fallback, estimate gusts as 1.5x the wind speed from period data
            const baseSpeed = parseInt(currentPeriod.windSpeed);
            if (!isNaN(baseSpeed)) {
                const estimatedGusts = Math.round(baseSpeed * 1.5);
                windGusts = `≈ ${estimatedGusts} mph (estimated)`;
            }
        }
        
        // Update last refresh time in the UI without seconds
        const now = new Date();
        const refreshTime = now.toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        weatherContainer.innerHTML = `
            <div class="weather-card">
                <h3>Willamette River Weather</h3>
                <h4>Portland Morrison Bridge</h4>
                <div class="weather-details">
                    <div class="temp-row">
                        <div class="weather-icon">
                            <img src="assets/weather/animated/${weatherIconType}.svg" alt="${shortForecast}" class="weather-icon-img">
                        </div>
                        <p class="temperature">${temperature}°${currentPeriod.temperatureUnit}</p>
                    </div>
                    <p class="conditions">${shortForecast}</p>
                    <p class="wind">Current Wind: ${windSpeed} ${windDirection}</p>
                    <p class="wind-gusts">Wind Gusts: ${windGusts}</p>
                    <p class="precipitation">Chance of Precipitation: ${precipChance}</p>
                </div>
                <div class="weather-location">
                    <p>Portland, Oregon</p>
                    <p class="forecast-time">Last updated: ${refreshTime}</p>
                    <p class="auto-refresh">Auto-refreshes every 5 minutes</p>
                </div>
            </div>
        `;
    }
    
    // Function to initialize weather and set up auto-refresh
    function initWeather() {
        // Fetch weather data immediately on page load
        fetchMorrisonBridgeWeather();
        
        // Clear any existing timer
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
        
        // Set up periodic refresh
        refreshTimer = setInterval(() => {
            console.log("Auto-refreshing weather data...");
            fetchMorrisonBridgeWeather();
        }, refreshInterval);
        
        // Clear interval when page is hidden (user switches tabs/apps)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause the auto-refresh when page is not visible
                if (refreshTimer) {
                    clearInterval(refreshTimer);
                    refreshTimer = null;
                }
            } else {
                // Resume auto-refresh and immediately fetch new data when page becomes visible again
                if (!refreshTimer) {
                    fetchMorrisonBridgeWeather();
                    refreshTimer = setInterval(() => {
                        fetchMorrisonBridgeWeather();
                    }, refreshInterval);
                }
            }
        });
    }
    
    // Initialize if weather container exists
    if (weatherContainer) {
        initWeather();
    }
});