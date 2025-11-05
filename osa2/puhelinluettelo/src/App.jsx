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

const Person = ({ id, name, number, people, setPeople, setNotificationMessage, setNotificationType }) => {
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
        const newData=people.filter(person => person.id !=id)
        setPeople(newData)
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


const PersonForm = ({ people , setPeople, setNewName, newName, newNumber, setNewNumber, setNotificationMessage, notificationType, setNotificationType}) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const nameInBook = (newName) => {
    const found = people.find((props) => props.name === newName)
    return found
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    if (nameInBook(newName) != undefined) {
      const thisPerson = people.find((props) => newName===props.name)
      if(window.confirm(`${thisPerson.name} is already added to the phonebook, replace the old number with a new one?`)){
      personService
        .updateNumber(thisPerson.id, thisPerson.name, newNumber)
        .then(response => {
          setPeople(people.map(person => person.id !== thisPerson.id ? person : response.data))
          setNotificationType(false)
          setNotificationMessage(
            `Updated ${newName}'s number`
          )
          window.setTimeout(() => {
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
      id: String(people.length + 1),
    }
    personService
      .create(personObject)
      .then(response => {
        setPeople(people.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(
          `Added ${newName}`
        )
        window.setTimeout(() => {
            setNotificationMessage(null)
        }, 5000)
      })
      .catch(error => {
        setNotificationType(true)
        setNotificationMessage(error.response.data.error)
        window.setTimeout(() => {
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

  const [people, setPeople] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPeople(response.data)
      })
  } , [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [numbersShown, setShowNumbers] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(false)
  const numbersToShow = numbersShown === ''
  ? people
  : people.filter(person => person.name.toLowerCase().match(numbersShown.toLowerCase()))





  const ListPerson = () => {
    return (
      <>
        {numbersToShow.map(person =>
          <Person
          key={person.name} 
          id={person.id}
          name={person.name}
          number={person.number}
          people={people}
          setPeople={setPeople}
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
        people={people}
        setPeople={setPeople}
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