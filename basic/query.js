const
  axios = require('axios'),
  Schema = require('graph.ql'),
  schema = Schema(`
    scalar Date

    type Character {
      name: String!
      eye_color: String
      gender: String
      homeworld(): Planet
      films(): [ Film ]
    }

    type Planet {
      name: String!
      population: Int
    }

    type Film {
      title: String!
      producers(): [String]
      characters(limit: Int): [Character]
      release_date: Date
    }

    type Query {
      film (id: Int): Film
      find_character (id: Int): Character
    }
  `, {
    Date: {
      serialize: v => new Date(v)
    },
    Film: {
      producers: (film, args) => film.producer.split(/,/),
      characters: (film, args) => {
        const characters = args.limit ? film.characters.slice(0, args.limit) : film.characters

        return axios.all(
            characters.map(c => {
              return axios.get(c).then(res => res.data)
            })
        )
      }
    },
    Character: {
      homeworld: (character, args) => {
        return axios.get(character.homeworld, { 'responseType': 'json' })
          .then(res => res.data)
      },
      films:(character, args) => {
        return axios.all(
          character.films.map(url => {
            return axios.get(url, { 'responseType': 'json' })
              .then(res => res.data)
          })
        )
      }
    },
    Query: {
      film (query, args) {
        return axios.get(
          `http://swapi.co/api/films/${args.id}`,
          { 'responseType': 'json' }
        ).then(res => res.data)
      },

      find_character (query, args) {
        console.log(query, args)
      }
    }
  })

schema(`
  query find ($film: Int) {
    film(id: $film) {
      title
      release_date
      producers
      characters (limit: 2) {
        name,
        homeworld {
          name,
          population
        },
        films {
          title
          release_date
        }
      }
    }
  }
`, {
  'film': 1
}).then(res => {
  console.dir(res, { 'colors': true, 'depth': Infinity })
})

