const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()


//REST API
router.get('/', async (req, res)=>{
	//console.log('/tools REST API')
	//res.send('/tools REST API')

	const hamstersRef = db.collection('hamsters')
	const snapshot = await hamstersRef.get()

	if (snapshot.empty) {
		res.send([])
		return
	}
	let items = []
	snapshot.forEach( doc => {
		const data = doc.data()
		data.id = doc.id
		items.push(data)
	})

	res.send(items)
})





module.exports = router