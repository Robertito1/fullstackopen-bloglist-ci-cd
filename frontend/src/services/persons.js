import axios from 'axios'
const baseUrl = '/api/persons'

const getPersons = () => {
    return axios.get(baseUrl)
}

const createPerson = newObject => {
    return axios.post(baseUrl, newObject)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (objectUpdate, name, id) => {
    return axios.put(`${baseUrl}/${id}`, objectUpdate)
}

export default {
    getPersons,
    createPerson,
    deletePerson,
    updatePerson
}