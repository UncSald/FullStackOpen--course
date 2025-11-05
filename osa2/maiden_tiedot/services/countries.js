import axios from 'axios'
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAllCountries = () => {
    const request = axios.get(`${baseURL}/all`)
    const data = request.then(response => response.data)
    return data
}

export default { getAllCountries }