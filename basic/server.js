const
  graphql = require('express-graph.ql'),
  express = require('express'),
  schema = require('./main'),
  loader = require('./loader'),
  app = express()


app.use((req, res, next) => {
  req.loader = loader()

  next()
})

app.post('/query', graphql(schema))

app.get('/', (req, res) => {
  const film = req.query.film

  console.time('With Data Loader')

  schema(req.loader)(`
    query find ($film: Int) {
      film(id: $film) {
        title
        release_date
        producers
        characters (limit: 3) {
          name,
          eye_color
          homeworld {
            name,
            population
          }
          films {
            title
          }
        }
      }
    }
  `, {
    'film': film
  }).then(result => {
    //console.dir(result, { 'colors': true, 'depth': Infinity })
    console.timeEnd('With Data Loader')
    res.send(result)
  })

})

app.listen(5000, () => console.log('Server address: http://127.0.0.1:5000'))
