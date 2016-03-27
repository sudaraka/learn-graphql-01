const
  axios = require('axios'),
  DataLoader = require('dataloader'),

  filmLoader = () => {
    return new DataLoader(ids => {
      return axios.all(
        ids.map(id => {
          const url = Number.isInteger(id) ? `http://swapi.co/api/films/${id}` : id

          return axios.get(url, { 'responseType': 'json' })
            .then(res => res.data)
        })
      )
    })
  },


  characterLoader = () => {
    return new DataLoader(ids => {
      return axios.all(
        ids.map(id => {
          const url = Number.isInteger(id) ? `http://swapi.co/api/people/${id}` : id

          return axios.get(url, { 'responseType': 'json' })
            .then(res => res.data)
        })
      )
    })
  },

  planetLoader = () => {
    return new DataLoader(ids => {
      return axios.all(
        ids.map(id => {
          const url = Number.isInteger(id) ? `http://swapi.co/api/planets/${id}` : id

          return axios.get(url, { 'responseType': 'json' })
            .then(res => res.data)
        })
      )
    })
  }

module.exports = () => ({
  'film': filmLoader(),
  'character': characterLoader(),
  'planet': planetLoader()
})
