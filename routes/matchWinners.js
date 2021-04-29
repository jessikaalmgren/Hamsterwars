const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()

router.get('/:id', async (req, res) => {
	const matchesRef = db.collection('matches')
	const snapshot = await matchesRef.where('winnerId', '==', req.params.id).get();

	if(snapshot.empty){
		res.status(404).send(`No matching results`)
	}

	let matches = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;

            matches.push(data);
		})

	res.status(200).send(matches);
})




module.exports = router