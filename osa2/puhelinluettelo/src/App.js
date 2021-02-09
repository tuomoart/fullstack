import React, { useState } from 'react'

const PersonsDisplay = ({ persons }) => {
  return(
    <div>
      <ul>
        {persons.map(person => 
          <Person key= {person.name} person={person} />
        )}
      </ul>
    </div>
  )
}

const Person = ({ person }) => {
  return(
    <div>
      <li>
        {person.name}
      </li>
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const addName = (event) => {
    event.preventDefault()

    if (newName === "") {
      return("")
    }

    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const nameObject = {
        name: newName
      }
      setPersons(persons.concat(nameObject))
      setNewName("")
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <PersonsDisplay persons={persons} />
    </div>
  )

}

export default App