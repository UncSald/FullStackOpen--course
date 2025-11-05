import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

const baseURL = 'https://api.openweathermap.org/data/2.5/weather'
const icon_url = 'https://openweathermap.org/img/wn'

const getWeather = async (latitude, longitude) => {

    const responses = await axios.get(`${baseURL}?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`)
    const response = responses.data
    const weatherData = {
	current: {
		temperature: response.main.temp,
        wind_speed: response.wind.speed,
        weather_code: response.weather[0].icon
	},
    }
    return weatherData.current
}


export default { getWeather}