const
  graphql = require('express-graph.ql'),
  express = require('express'),
  schema = require('./schema'),
  app = express()


app.post('/query', graphql(schema))

app.listen(5000, () => console.log('Server address: http://127.0.0.1:5000'))
