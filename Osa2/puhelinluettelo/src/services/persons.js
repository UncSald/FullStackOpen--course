import axios from 'axios'
const baseURL = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseURL)
}

const create = newObject => {
    return axios.post(baseURL, newObject)
}

const delete_person = id => {
    return axios.delete(`${baseURL}/${id}`)
}

const updateNumber = ( id, name, newNumber ) => {

    return axios.put(`${baseURL}/${id}`, { name:name, number:newNumber, id:id })
}

export default { getAll, create, delete_person, updateNumber }