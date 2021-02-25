/* The purpose of this is to add an "incoming" and "outgoing" list to each employee entry.
 * This will make it much faster to display incoming and outgoing kudos on the profile page.
 * hopefully soon we will modify this script so that
 * it can take any arbitrary database name as input, not just outback tech*/
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

// testing strategy: run this script, then modify some of the arrays that were created.
// run this script again, and make sure the arrays werent modified
