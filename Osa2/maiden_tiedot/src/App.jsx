import { useState, useEffect } from 'react'
import countries from '../services/countries'


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

const showSingleCountry = (country) => {
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
        </>

    )
}

const App = () => {
    const [allCountries, setAllCountries] = useState([])
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



    const searchBar = () => {
        return (
            <>
                find countries 
                <input
                    value={newCountry}
                    onChange={handleValueChanged}
                />
            </>
        )
    }

    const handleValueChanged = (event) => {
        setNewCountry(event.target.value)
        toggleMode(null,true)
    }

    const showSelected = () => {
        if(!showFiltered) {
            return(
                showSingleCountry(showCountry)
            )
        }
    }

    const toggleMode = (country, way=true) => {
        setShowFiltered(way)
        setCountryToShow(country)
    }

    const listCountries = () => {
        const dummy = "Too many matches, specify another filter"
            
        if(showFiltered)
            
            if (countriesToShow.length > 10)
            {
                return (
                    <p>
                        {dummy}
                    </p>
                    
                )
            } else if (countriesToShow.length > 1){
                return (
                    countriesToShow.map(country => 
                        <li key={country.name.common}>
                            {country.name.common}
                            <button onClick={()=>{setShowFiltered(false);setCountryToShow(country)}}>button</button>
                        </li>
                    )
                )
            } else if (countriesToShow.length == 1) {
            return (
                <div>
                    {showSingleCountry(countriesToShow[0])}
                </div>

            )
        }
    }

  return (
    <>
    
      <div>
        {searchBar()}
      </div>
      {listCountries()}
      {showSelected()}

    </>
  )
}

export default App
