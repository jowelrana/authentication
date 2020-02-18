const app = require('./app')
const mongoose = require('mongoose')

mongoose.connect(
    process.env.DBPATH,
    { useNewUrlParser: true }
)


mongoose.connection.on('connected', () => {
    console.log(`Connected to mongodb → ${process.env.DBPATH}`)
})
mongoose.connection.on('disconnected', () => {
    console.log( `Application disconnected from mongodb → ${process.env.DBPATH}`)
})
mongoose.connection.on('error', () => {
    console.log(`Something wrong, couldn't connect to mongodb → ${process.env.DBPATH}`)
})

const PORT = process.env.PORT || 2525
app.listen(PORT, () => {
    console.log(`Server working at port ${PORT}`)
})
