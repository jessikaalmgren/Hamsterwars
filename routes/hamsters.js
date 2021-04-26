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

//GET HAMSTER BY ID
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()

	if(!docRef.exists) {
		res.status(404).send(`Hamster does not exist.`)
		return
	}
	const data = docRef.data()
	res.send(data)
})

//POSTAR ETT NYTT HAMSTEROBJEKT. RETURNERAR DET NYA ID:ET FÖR OBJEKTET. 
router.post('/', async (req, res) => {
	const object = req.body 

	if(!object || !object.name || !object.age){
		req.sendStatus(400).send('Fel request, funkar inte')
		return
	}

	const docRef = await db.collection('hamsters').add(object)
	res.send(docRef.id)
	//Har inte lyckats få med hela objektet utan endast id. 

})

//Vi kan kontrollera om id:et finns i databasen. Det behöver jag lägga till i denna. Denna kod kontrollerar inte och lägger isåfall till ett nytt doc i databasen.
router.put('/:id', async (req, res) =>{
	const object = req.body
	const id = req.params.id
//Kan lägga till flera grejer som begränsar vad man ska kunna ändra och inte. Kan också göra en funktion utanför detta som bestämmer dessa regler och beslut. Just nu behöver det vara ett objekt och ett namn för att man ska kunna ändra datan med put. 
	if(!object || !object.name){
		res.sendStatus(400)
		return
	}

	const docRef = db.collection('hamsters').doc(id)
	await docRef.set(object, {merge: true})
	res.sendStatus(200)
})

//DELETE Tar bort en hamster beroende på vilket ID man skriver in. Här kan man också göra en koll som tittar om objektet finns först. 
router.delete('/:id', async (req, res)=>{
	const id =  req.params.id

	if(!id ){
		res.sendStatus(400)
		return
	}

	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200)
})



// function isHamstersObject(maybeObject){
// 	if(!maybeObject || !maybeObject.name || !maybeObject.age){
// 		return false
// 	}
// 	else if(!maybeObject.name || !maybeObject.age){
// 		return false
// 	}
// }


module.exports = router