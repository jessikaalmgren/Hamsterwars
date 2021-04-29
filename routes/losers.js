const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
	const hamstersRef = await db.collection('hamsters')
	let loserHamsters = []
	const snapshot = await hamstersRef.orderBy('defeats', 'desc').limit(5).get();

	if(snapshot.empty){
		res.status(404).send(`There's no hamsters here`)
		return
	}
	snapshot.forEach(doc => {
		const data = doc.data();
		data.id = doc.id;
		console.log(data.id);
		loserHamsters.push(data);
	});
	res.send(loserHamsters).status(200)
})


module.exports = router