const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const { Router } = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
	const hamstersRef = await db.collection('hamsters')
	let winnerHamsters = []
	const snapshot = await hamstersRef.orderBy('wins', 'desc').limit(5).get();

	if(snapshot.empty){
		res.status(404).send(`There are no hamsters here`)
	}
	snapshot.forEach(doc => {
		const data = doc.data();
		data.id = doc.id;
		console.log(data.id);
		winnerHamsters.push(data);
	});
	res.send(winnerHamsters).status(200)
})






module.exports = router