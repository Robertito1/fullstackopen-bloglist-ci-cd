import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Person from './components/Person'
import NewPersonForm from './components/NewPersonForm'
import FilterNames from './components/FilterNames'
import Notification from './components/Notification'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [shown, setShown] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState(true)

  useEffect(() => {
    personService
      .getPersons()
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.log('fail', error)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newPhone,
    }

    const duplicateName = persons.find(person => person.name === personObject.name)
    if (duplicateName) {
      if (window.confirm(`${duplicateName.name} already added to phonebook, repace the old phone number with a new one? `)) {
        const id = duplicateName.id
        personService
          .updatePerson({ ...duplicateName, number: personObject.number }, personObject.name, id)
          .then(response => {
            setPersons(persons.map(person => person.id !== id ? person : response.data))
            setNotificationStatus(true)
            setNotificationMessage(`${personObject.name}'s Number Updated Successfully`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
            setNewName('')
            setNewPhone('')
          }).catch(error => {
            setNewName('')
            setNewPhone('')
            setNotificationStatus(false)
            setNotificationMessage(`${error.response.data.error}`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
            console.log(error.response.data.error)
          })
      } else {
        setNotificationStatus(false)
        setNotificationMessage(`process cancelled`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)
        setNewName('')
        setNewPhone('')
      }
    } else if (!personObject.name) {
      alert('input field is empty')
    } else {
      personService
        .createPerson(personObject)
        .then(response => {
          console.log(response)
          setPersons(persons.concat(personObject))
          setNotificationStatus(true)
          setNotificationMessage(
            `Added ${personObject.name} to the phonebook`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
          setNewName('')
          setNewPhone('')
        })
        .catch(error => {
          setNewName('')
          setNewPhone('')
          setNotificationStatus(false)
          setNotificationMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
          console.log(error.response.data.error)
        })
    }
  }


  const handleNameInputChange = (e) => {
    setNewName(e.target.value)
  }

  const handlePhoneInputChange = (e) => {
    setNewPhone(e.target.value)
  }

  const handleFilter = (e) => {
    setShown(e.target.value.toLowerCase())
  }

  const personsToShow = shown.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(shown))

  const handleDeleteOf = (id, name) => {
    console.log(id)
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationStatus(true)
          setNotificationMessage(
            `${name} was deleted from the phonebook `
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        }).catch(error => {
          console.log('fail', error)
          setNotificationStatus(false)
          setNotificationMessage(`Information of ${name} has already been removed from server`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notificationMessage === null ? null : <Notification message={notificationMessage} status={notificationStatus} />}
      <FilterNames onInput={handleFilter} value={shown} />
      <NewPersonForm addPerson={addPerson}
        inputName={handleNameInputChange}
        inputPhone={handlePhoneInputChange}
        newName={newName}
        newPhone={newPhone}
      />

      {
        personsToShow.map((person, i) =>
          <Person key={i}
            person={person}
            handleDelete={() => handleDeleteOf(person.id, person.name)}
          />)
      }
    </div>
  )
}

export default App

