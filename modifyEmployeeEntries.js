/* This script could really be used to modify / delete / add any fields to the database, you just need to use a different function and change the arguments
 * TODO: allow command line arguments to modify any arbitrary database (or maybe have an "all" option to modify every database...) */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
	const db = client.db("outback-tech");
	const employeesCollection = db.collection("Employees Database");
	const modifyEmployees = async () => {
		// mongodb docs explain whats going on here pretty well: https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/
		await employeesCollection.updateMany(
			{'isAdmin': {$exists : false}}, 
			{ $set : 
				{
					"idAdmin": false,
				}
			}
		);
		// now we want to update CEO to have admin role
		await employeesCollection.updateOne(
			{'position': 'CEO'},
			{ $set : 
				{
					"idAdmin": true,
				}
			}
		);
		client.close();
	}
	modifyEmployees();
});
