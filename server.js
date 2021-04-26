const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const hamsters = require('./routes/hamsters.js')

const PORT = 1440
const staticFolder = path.join(__dirname, 'public')
const staticFolder2 = path.join(__dirname, 'assets')


//Middleware
//Logger - skriver ut info om kommande request

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.params)
	next()
})

app.use(express.json())
app.use(cors())
app.use(express.static(staticFolder))
app.use(express.static(staticFolder2))


//Bygga rest api för hamsters
app.use('/hamsters', hamsters)

app.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT)
})