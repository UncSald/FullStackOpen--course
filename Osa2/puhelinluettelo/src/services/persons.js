import axios from 'axios'
const baseURL = '/api/persons'

const getAll = async () => {
    const res = await axios.get(baseURL)
    return res
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