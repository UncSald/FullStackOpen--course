import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  } , [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [numbersShown, setShowNumbers] = useState('')

  const numbersToShow = numbersShown === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().match(numbersShown.toLowerCase()))


  const Person = (props) => {
      const DeletePerson = (event) => {
      event.preventDefault()
      if (window.confirm("Delete", `${props.name}`)) {
      personService
        .delete_person(props.id)
        .then(response => {
          const newData=persons.filter(person => person.id !=(props.id))
          return setPersons(newData)
        })}
    }
    return (
      <div>
        <form onSubmit={DeletePerson}><p>{props.name} {props.number} <button type="submit">delete</button></p></form>
      </div>
    )
  }

  const ListPerson = () => {
    return (
      <>
        {numbersToShow.map(person =>
          <Person
          key={person.name} 
          id={person.id}
          name={person.name}
          number={person.number}/>
          )
        }
      </>
    )
  }

  const Filter = ({numbersShown,setShowNumbers}) => {
    const handleFilter = (event) => {
      setShowNumbers(event.target.value)
    }
    return (
      <div>
          filter: 
          <input
            value={numbersShown}
            onChange={handleFilter}
          />
        </div>
    )
  }

  const PersonForm = () => {
    const handleNameChange = (event) => {
      setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
    }

    const nameInBook = (newName) => {
      const found = persons.find((props) => props.name === newName)
      return found
    }

    const addPerson = (event) => {
      event.preventDefault()
      
      if (nameInBook(newName) != undefined) {
        alert(`${newName} is already added to phonebook`)
      }
      else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      }
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
      }
    }
    return (
      <form onSubmit={addPerson}>
        <div>
          name: 
          <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input
          value={newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter numbersShown={numbersShown}
          setShowNumbers={setShowNumbers}
        />
        <h2>add new</h2>
        <PersonForm/>

        <h2>Numbers</h2>
        <div>
          <ListPerson/>
        </div>
      </div>

    </div>
  )

}

export default App