// weather.js - Weather data fetching and display for Willamette River - Portland Morrison Street Bridge
document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather-container');
    // Set refresh interval to 5 minutes (in milliseconds)
    const refreshInterval = 5 * 60 * 1000;
    let refreshTimer;
    let windChart = null; // Store chart instance for updates
    
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
        console.log("Condition: ", condition);
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
    
    // Function to parse wind speed value from string (e.g., "10 mph" -> 10)
    function parseWindSpeed(windSpeedStr) {
        if (!windSpeedStr) return null;
        const match = windSpeedStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }
    
    // Function to create and update the wind speed chart
    function createWindSpeedChart(hourlyData) {
        // Process hourly data for specific time range (midnight to midnight)
        const hours = [];
        const windSpeeds = [];
        const windGusts = [];
        
        // Get current date info
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0); // Set to midnight last night
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Set to midnight tonight
        
        // Filter periods to include only those between midnight last night and midnight tonight
        const periods = hourlyData.properties.periods.filter(period => {
            const periodDate = new Date(period.startTime);
            return periodDate >= today && periodDate < tomorrow;
        });
        
        // Sort periods by time to ensure proper order
        periods.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        // Process the data for the chart
        periods.forEach(period => {
            // Format time (e.g., "3 PM")
            const date = new Date(period.startTime);
            const hour = date.getHours();
            const formattedHour = hour === 0 ? '12 AM' : 
                                 hour < 12 ? `${hour} AM` : 
                                 hour === 12 ? '12 PM' : 
                                 `${hour - 12} PM`;
            hours.push(formattedHour);
            
            // Parse wind speeds
            const windSpeed = parseWindSpeed(period.windSpeed);
            windSpeeds.push(windSpeed);
            
            // Parse wind gusts if available, otherwise use estimated values
            let gustSpeed = null;
            if (period.windGust) {
                gustSpeed = parseWindSpeed(period.windGust);
            } else if (windSpeed) {
                // Estimate gusts at 1.5x wind speed as a fallback
                gustSpeed = Math.round(windSpeed * 1.5);
            }
            windGusts.push(gustSpeed);
        });
        
        // Destroy previous chart if it exists
        if (windChart) {
            windChart.destroy();
        }
        
        // Get the canvas element
        const ctx = document.getElementById('wind-chart');
        
        // Create new chart with updated title to reflect the time range
        windChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [
                    {
                        label: 'Wind Speed (mph)',
                        data: windSpeeds,
                        borderColor: 'rgba(65, 105, 225, 1)',
                        backgroundColor: 'rgba(65, 105, 225, 0.2)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: 'Wind Gusts (mph)',
                        data: windGusts,
                        borderColor: 'rgba(220, 20, 60, 0.8)',
                        backgroundColor: 'rgba(220, 20, 60, 0.1)',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Today\'s Wind Forecast (Now to Midnight)',
                        font: {
                            size: 16,
                            family: '"Courier New", Courier, monospace'
                        }
                    },
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Wind Speed (mph)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });
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
                
                <!-- Wind Chart Section -->
                <div class="wind-chart-container">
                    <canvas id="wind-chart"></canvas>
                </div>
            </div>
        `;
        
        // Create the wind speed chart after the DOM has been updated
        setTimeout(() => {
            createWindSpeedChart(hourlyData);
        }, 100);
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