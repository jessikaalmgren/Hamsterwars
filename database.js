const admin = require("firebase-admin");

let serviceAccount;
if(process.env.PRIVATE_KEY){
	const serviceAccount = JSON.parse(process.env.PRIVATE_KEY)
} else{
	const serviceAccount = require("./firebase-private-key.json");
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//const db = admin.firestore()

function getDatabase() {
	return admin.firestore()
}

module.exports = getDatabase