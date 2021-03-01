/* The purpose of this is to initalize an "incoming" and "outgoing" list to each employee entry.
 * For each company added, the script only needs to be ran once, but running it more than once shouldnt hurt anything :) 
 * Hopefully soon this script can be modified to take in any company that is in the db as input, and operate on that instead of just outback-tech */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
	const db = client.db("outback-tech");
	const employeesCollection = db.collection("Employees Database");
	const initializePersonalKudos = async () => {
		// mongodb docs explain whats going on here pretty well: https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/
		await employeesCollection.updateMany(
			{'incoming': {$exists : false}, 'outgoing': {$exists : false}}, // only want to set fields if incoming and outgoing fields dont yet exist!
			{ $set : // $set is the operation that sets a field to a specified value. in this case, we are just setting the fields to empty lists
				{
					"incoming": [],
					"outgoing": []
				}
			}
		);
		client.close();
	}
	initializePersonalKudos();
});
