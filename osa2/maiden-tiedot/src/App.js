import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountriesDisplay = ({ countries }) => {
  return(
    <div>
      <ul>
        {countries.map(country => 
          <Country key={country.name} country={country} />
        )}
      </ul>
    </div>
  )
}

const Country = ({ country }) => {
  return(
    <div>
      <li>
        {country.name}
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
      <CountriesDisplay countries={countriesToShow} />
    </div>
  )

}

export default App