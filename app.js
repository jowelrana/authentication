const express = require('express')
const app = express()
var path = require('path');
const cors = require('cors')
require('dotenv').config()

require('./index') 
app.use(require('cors')()) 

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
    cors({
      origin: "http://localhost:8080",
      credentials: true
    })
  );
  
  
// app.use(express.static(__dirname + "dist/"));
// app.get(/.*/, function(req, res){
//   res.sendfile(__dirname + "/dist/index.html");
// });
// app.get('/', (req, res) => res.send('Welcome to node js api authentication project'))


  // Set static folder
  app.use('/', express.static(path.join(__dirname, './client/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/dist', 'index.html'))
  })


app.use('/api/auth', require('./routes/users'))

// app.use((req, res, next) => {
//     res.status(404).json({
//         message: 'No Resource found',
//     })
// })

module.exports = app
