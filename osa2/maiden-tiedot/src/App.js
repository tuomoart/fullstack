import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountriesDisplay = ({ countries, filter }) => {
  if (countries.length > 10) {
    return(
      <div>Too many results, provide more search parameters, please!</div>
    )
  } else if (countries.length === 1) {
    const country = countries[0]
    return(
      <div>
        <h2>{country.name}</h2>
        <p>capital: {country.capital}</p>
        <p>population: {country.population}</p>

        <h3>languages:</h3>
        <ul>
          {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
        </ul>

        <img src={country.flag} width="100"/>

        <WeatherDisplay country={country} />
      </div>
    )
  }

  return(
    <div>
      <ul>
        {countries.map(country => 
          <Country key={country.name} country={country} filter={filter} />
        )}
      </ul>
    </div>
  )
}

const WeatherDisplay = ({ country }) => {
  const [ weather, setWeather ] = useState({
    current: {
      temperature: "",
      weather_icons: [
        ""
      ],
      wind_speed: "",
      wind_dir: "",
    }
  })
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current?access_key=' + api_key + '&query=' + country.capital)
      .then(response => {
        setWeather(response.data)
      })
  }, [country.name])

  return(
    <div>
      <h3>Weather in {country.name}</h3>

      temperature: {weather.current.temperature} C

      <p>
        <img src={weather.current.weather_icons} width="50"/>
      </p>

      wind: {weather.current.wind_speed} km/h, direction: {weather.current.wind_dir}
    </div>
  )
}

const Country = ({ country, filter }) => {

  return(
    <div>
      <li>
        <div>
          {country.name + " "} 
          <button key={country.name} type="button" onClick={(event) => {
          console.log(country.name)
          filter(country.name)}
          }>show</button>
        </div>
      </li>
    </div>
  )
}

const Field = ({ text, value, onChange }) => {
  return(
    <div>
      {text} <input 
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ search, setSearch ] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log(response)
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const countriesToShow = countries.filter(country => country.name.includes(search))

  return (
    <div>
      <h2>Countries</h2>
      <Field text={"Search for"} value={search} onChange={handleSearchChange} />
      <CountriesDisplay countries={countriesToShow} filter={setSearch} />
    </div>
  )

}

export default App