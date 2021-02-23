import React, { useState, useEffect } from 'react'
import personsService from "./services/persons"

const PersonsDisplay = ({ persons, deleteAPerson }) => {
  return(
    <div>
      <ul>
        {persons.map(person => 
          <Person
            key={person.name}
            person={person}
            deleteThisPerson={() => deleteAPerson(person)}
          />
        )}
      </ul>
    </div>
  )
}

const Person = ({ person , deleteThisPerson}) => {
  return(
    <div>
      <li>
        {person.name} {person.number}
        <button onClick={deleteThisPerson}>delete</button>
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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 0) {
    
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  return (
    <div className="error">
      {message}
    </div>
  )
  
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState()

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message) => {
    setErrorType(0)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const showError = (message) => {
    setErrorType(1)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
  
  const addPerson = (event) => {
    event.preventDefault()

    if (newName === "") {
      return("")
    }

    if (persons.map(person => person.name).includes(newName)) {
      const confirmation = window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)

      if (confirmation) {
        const person = persons.find(p => p.name === newName)
        const updatedPerson = {...person, number: newNumber}
        personsService
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPersons => {
            personsService
            .getAll()
            .then(newPersons =>
              {
                setPersons(newPersons)
                showNotification(`${updatedPerson.name} updated!`)
              })
          })
          .catch(error => {
            showError(`'${person.name}' was already removed from server`)
            personsService
            .getAll()
            .then(newPersons =>
              {
                setPersons(newPersons)
              })
          })
      }      
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }

      personsService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        showNotification(`${returnedPerson.name} added!`)
      })
      .catch(error => showError(error.response.data.error))
      
    }
  }

  const deletePerson = (person) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${person.name}?`)

    if (confirmation) {
      personsService
        .deleteThis(person.id)
        .then(returnedPersons => {
          personsService
          .getAll()
          .then(newPersons =>
            {
              setPersons(newPersons)
              showNotification(`${person.name} deleted!`)
            })
            .catch(error => {
              showError(`'${person.name}' was already removed from server`)
            })
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.includes(search))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={errorType} />
      <Field text={"Search for"} value={search} onChange={handleSearchChange} />
      <h3>Add new</h3>
      <form onSubmit={addPerson}>
        <Field text={"Name:"} value={newName} onChange={handleNameChange} />
        <Field text={"Number:"} value={newNumber} onChange={handleNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <PersonsDisplay persons={personsToShow} deleteAPerson={deletePerson} />
    </div>
  )

}

export default App