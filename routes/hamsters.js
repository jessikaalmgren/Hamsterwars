const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()

//GET ALL HAMSTERS
router.get('/', async (req, res)=>{
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

//GET RANDOM HAMSTER
router.get('/random', async (req, res) => {
	const docRef = db.collection('hamsters')
	let random
	try {
		const snapshot = await docRef.get()
		if( snapshot.empty ){
			res.sendStatus(404)
			return
		}
		let items = []
		snapshot.forEach( doc => {
			const data = doc.data()
			data.id = doc.id
			items.push(data)
		})
		random = Math.floor(Math.random() * items.length)
		res.status(200).send(items[random])
	}catch( error ){
		res.status(500).send(error.message)
	}
})

//GET HAMSTER BY ID
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()

	if(!docRef.exists) {
		res.status(404).send(`Hamster does not exist.`)
		return
	}
	const data = docRef.data()
	res.status(200).send(data)
})



//POSTAR ETT NYTT HAMSTEROBJEKT. RETURNERAR DET NYA ID:ET FÖR OBJEKTET. 
router.post('/', async (req, res) => {
	const object = req.body 

	if(!Object.keys(object).length){
		res.status(400).send('Fel request, funkar inte')
		return
	}

	const docRef = await db.collection('hamsters').add(object)
	res.status(200).send({id: docRef.id})

})


router.put('/:id', async (req, res) =>{
	const object = req.body
	const id = req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()
	
	if(!Object.keys(object).length){
		res.sendStatus(400)
		console.log(400)
		return
	}else if( !docRef.exists ){
		res.sendStatus(404)
		console.log(404)
		return
	} 
	await db.collection ('hamsters').doc(id).set(object, {merge: true})
	res.sendStatus(200)
	console.log(200)
	
})



//DELETE Tar bort en hamster beroende på vilket ID man skriver in. Här kan man också göra en koll som tittar om objektet finns först. 
router.delete('/:id', async (req, res)=>{
	const id =  req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()

	if(!docRef.exists){
		res.sendStatus(404)
		return
	}

	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200)
})





module.exports = router