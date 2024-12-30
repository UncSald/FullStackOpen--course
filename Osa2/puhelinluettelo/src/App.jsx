import axios from 'axios'
import { useState, useEffect } from 'react'




const Person = (props) => {
  return (
    <p>
      {props.name} {props.number}
    </p>
  )
}

const ListPerson = ({numbersToShow}) => {
  return (
    <>
      {numbersToShow.map(person =>
        <Person
          key={person.name} 
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

const PersonForm = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber}) => {
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
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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


const App = () => {

  const [persons, setPersons] = useState([])
  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [numbersShown, setShowNumbers] = useState('')

  const numbersToShow = numbersShown === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().match(numbersShown.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter numbersShown={numbersShown}
          setShowNumbers={setShowNumbers}
        />
        <h2>add new</h2>
        <PersonForm
          persons={persons}
          setPersons={setPersons}
          newName={newName}
          setNewName={setNewName}
          newNumber={newNumber}
          setNewNumber={setNewNumber}
        />

        <h2>Numbers</h2>
        <div>
          <ListPerson numbersToShow={numbersToShow}/>
        </div>
      </div>

    </div>
  )

}

export default App