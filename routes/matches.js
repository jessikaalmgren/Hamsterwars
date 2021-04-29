const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()

//GET ALL MATCHES
router.get('/', async (req, res) => {
	const matchesRef = db.collection('matches')
	const snapshot = await matchesRef.get()

	if (snapshot.empty){
		res.send ([])
		return
	}
	let matches = []
	snapshot.forEach (doc => {
		const data = doc.data()
		data.id = doc.id
		matches.push(data)
	})
	res.send(matches)
})

//GET MATCH BY ID
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('matches').doc(id).get()

	if(!docRef.exists){
		res.status(404).send(`Match does not exist.`)
		return
	}
	const data = docRef.data()
	data.id = docRef.id
	res.status(200).send(data)
})

router.post('/', async (req, res) => {
	const object = req.body
	const docRef = await db.collection('matches').add(object);

	if(!Object.keys(object).length){
		res.status(400).send(`Wrong body`)
		return
	}
	
	res.status(200).send({id: docRef.id})

})

router.delete('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('matches').doc(id).get()

	if(!docRef.exists){
		res.sendStatus(404)
		return
	}

	await db.collection('matches').doc(id).delete()
	res.sendStatus(200)
})

module.exports = router