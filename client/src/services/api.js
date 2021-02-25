import axios from 'axios';

export default {
  getThesis(cb) {
    axios.get(`${process.env.VUE_APP_API_URL}/thesis`)
      .then(response => {
        cb(response.data, null)
      })
      .catch(error => {
        cb(null, error)
      })
  },
  getOriginals(cb) {
    axios.get(`${process.env.VUE_APP_API_URL}/originals`)
      .then(response => {
        cb(response.data, null)
      })
      .catch(error => {
        cb(null, error)
      })
  },
  getColophon(cb) {
    axios.get(`${process.env.VUE_APP_API_URL}/colophon`)
      .then(response => {
        cb(response.data, null)
      })
      .catch(error => {
        cb(null, error)
      })
  },
}