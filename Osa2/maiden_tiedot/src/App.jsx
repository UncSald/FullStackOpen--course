import { useState, useEffect } from 'react'
import countries from '../services/countries'
import weather from '../services/weather'

const SearchBar = (props) => {
    return (
        <>
            find countries 
            <input
                value={props.value}
                onChange={props.onChange}
            />
        </>
    )
}

const countryData = (country) => {
    return (
        <ul>
            {Object.keys(country.languages).map(language =>
            <li key={country.languages[language]}>
                {country.languages[language]}
            </li>
                
            )}
        </ul>
    )

}

const getFlag = (country) => {
    const url = country.flags.png
    return (
        <>
            <img src={url}></img>
        </>
    )
}

const WeatherIcon = ( {code} ) => {
    const source = `https://openweathermap.org/img/wn/${code}@2x.png`
    return (
        <>
            <img src={source}/>
        </>  
    )
}

const showSingleCountry = (country, weather) => {
    return (
        <>
            <h1>
                {country.name.common}
            </h1>
            <li>
                Capital {country.capital}
            </li>
            <li>
                Area {country.area}
            </li>
            <h2>
                Languages
            </h2>
                {countryData(country)}
                {getFlag(country)}
                <p>
                    Temperature {(weather.temperature)} Celsius
                </p>
                <p>
                    <WeatherIcon code = {weather.weather_code}/>
                </p>
                <p>
                    Wind {(weather.wind_speed)} m/s
                </p>
                
        </>

    )
}

const ShowSelected = (props) => {
    if(props.showFiltered==false) {
        useEffect(() => {
            props.getLocalWeather(props.showCountry)
        }, [])
        return(
            showSingleCountry(props.showCountry, props.weatherValue)
        )
    }
}

const ListCountries = ( props ) => {
    const dummy = "Too many matches, specify another filter"

    if(props.showFiltered)
        
        if (props.countriesToShow.length > 10)
        {
            return (
                <p>
                    {dummy}
                </p>
            )
        } else if (props.countriesToShow.length > 1){
            return (
                props.countriesToShow.map(country => 
                    <li key={country.name.common}>
                        {country.name.common}
                        <button onClick={()=>{
                            props.toggleMode(country, false);
                            props.setCountryToShow(country)
                            }}>Show</button>
                    </li>
                )
            )
        } else if (props.countriesToShow.length == 1) {
            const country = props.countriesToShow[0]
            useEffect(() => {
                props.getLocalWeather(country)
            }, [])
            return (
                <div>
                    {showSingleCountry(country, props.weatherValue)}
                </div>

            )
    }
}

const App = () => {
    const [allCountries, setAllCountries] = useState([])
    const [weatherValue, setWeather] = useState([])
    const [newCountry, setNewCountry] = useState('')
    const countriesToShow = allCountries.filter(country => country.name.common.toLowerCase().includes(`${newCountry}`.toLowerCase()))
    const [showCountry, setCountryToShow] = useState(countriesToShow[0])
    const [showFiltered, setShowFiltered] = useState(true)
    
    useEffect(()=> {
        countries
            .getAllCountries()
                .then(data => {
                    setAllCountries(data)
                })
    }, [])

    useEffect(() => {
    }, [showCountry, showFiltered])

    const getLocalWeather = (country) => { {
        const lat = country.capitalInfo.latlng[0]
        const long = country.capitalInfo.latlng[1]
        weather
            .getWeather(lat, long)
                .then(data => {
                    setWeather(data)
                })}
    }

    const handleValueChanged = (event) => {
        setNewCountry(event.target.value)
        toggleMode(showCountry,true)
    }

    const toggleMode = (country, way=true) => {
        setShowFiltered(way)
        setCountryToShow(country)
        } 

  return (
    <>
        
        <div>
            <SearchBar onChange={() => handleValueChanged(event)} value={newCountry}/>
        </div>
        <ListCountries showFiltered={showFiltered}
        countriesToShow={countriesToShow}
        weatherValue={weatherValue}
        toggleMode={toggleMode}
        setCountryToShow={setCountryToShow}
        getLocalWeather={getLocalWeather}/>
        <ShowSelected showFiltered={showFiltered}
        getLocalWeather={getLocalWeather}
        showCountry={showCountry}
        weatherValue={weatherValue}/>
    </>
  )
}

export default App
