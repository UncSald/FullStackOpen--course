import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ err, message }) => {
  if (message === null) {
    return null
  }
  if(err){
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Person = ({ id, name, number, persons, setPersons, setNotificationMessage, setNotificationType }) => {
    const DeletePerson = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete ${name} ?`)) {
    personService
      .delete_person(id)
      .then(response => {
        setNotificationType(false)
        setNotificationMessage(
          `${name} was removed from server`
        )
        window.setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        const newData=persons.filter(person => person.id !=id)
        setPersons(newData)
      })}
  }
  return (
    <li className='person'>
      {name} {number} <button onClick={DeletePerson} type="submit">delete</button>
    </li>
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


const PersonForm = ({ persons , setPersons, setNewName, newName, newNumber, setNewNumber, setNotificationMessage, notificationType, setNotificationType}) => {
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
      const thisPerson = persons.find((props) => newName===props.name)
      if(window.confirm(`${thisPerson.name} is already added to the phonebook, replace the old number with a new one?`)){
      personService
        .updateNumber(thisPerson.id, thisPerson.name, newNumber)
        .then(response => {
          setPersons(persons.map(person => person.id !== thisPerson.id ? person : response.data))
          setNotificationType(false)
          setNotificationMessage(
            `Updated ${newName}'s number`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNotificationType(true)
          setNotificationMessage(`Information for ${newName} has already been removed from the server`)})
          }}
        
    
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
        setNotificationMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
    setNotificationMessage(null)
  }, 5000)
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
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(false)
  const numbersToShow = numbersShown === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().match(numbersShown.toLowerCase()))


  setTimeout(() => {
    setNotificationMessage(null)
  }, 5000)


  const ListPerson = () => {
    return (
      <>
        {numbersToShow.map(person =>
          <Person
          key={person.name} 
          id={person.id}
          name={person.name}
          number={person.number}
          persons={persons}
          setPersons={setPersons}
          setNotificationMessage={setNotificationMessage}
          setNotificationType={setNotificationType}/>
          )
        }
      </>
    )
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification err={notificationType} message={notificationMessage}/>
      <div>
        <Filter numbersShown={numbersShown}
          setShowNumbers={setShowNumbers}
        />
        <h2>Add new</h2>
        <PersonForm
        persons={persons}
        setPersons={setPersons}
        setNewName={setNewName}
        newName={newName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setNotificationMessage={setNotificationMessage}
        notificationType = {notificationType}
        setNotificationType = {setNotificationType}
        />

        <h2>Numbers</h2>
        <div>
          <ListPerson/>
        </div>
      </div>

    </div>
  )

}

export default App