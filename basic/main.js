const
  axios = require('axios'),
  Schema = require('graph.ql')

module.exports = loader => {
  return Schema(`
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
      character (id: Int): Character
    }
  `, {
    Date: {
      serialize: v => new Date(v)
    },
    Film: {
      producers: (film, args) => film.producer.split(/,/),
      characters: (film, args) => {
        const characters = args.limit ? film.characters.slice(0, args.limit) : film.characters

        return loader.character.loadMany(characters)
      }
    },
    Character: {
      homeworld: (character, args) => loader.planet.load(character.homeworld),

      films: (character, args) => {
        return loader.film.loadMany(character.films)
      }
    },
    Query: {
      film: (query, args) => loader.film.load(args.id),

      character: (query, args) => loader.character.load(args.id)
    }
  })
}
