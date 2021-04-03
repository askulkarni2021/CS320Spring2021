/* This script could really be used to modify / delete / add any fields to the database, you just need to use a different function and change the arguments
 * TODO: allow command line arguments to modify any arbitrary database (or maybe have an "all" option to modify every database...) 
 * ****** HOW TO USE THIS SCRIPT ***********
 * Enter the command "node modifyCollection.js <Database name> <collection name> 
 * If you want to make the same collection modification to each company, you can use node modifyCollection.js <all> <collection name>
 * If the name of the collection is separated by a space (like 'Employees Database') you need to enter it like so: 'Employees\ Database'
 * Before running the script, you need to change the modifyEntries function to actually do anything */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const outbackuri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
const outbackClient = new MongoClient(outbackuri, { useNewUrlParser: true, useUnifiedTopology: true });

const testuri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
const testClient = new MongoClient(testuri, { useNewUrlParser: true, useUnifiedTopology: true });

testClient.connect(err => {
	/*const args = process.argv.slice(2);
	console.log(args);
	const company = args[0];
	const collectionName = args[1];
	assert.equal(err, null);*/
	const test_db = testClient.db('Test');
	const testValues = test_db.collection("Values-Emojis");
	const modifyCollection = async () => {
		// ************ ONLY CHANGE THINGS BETWEEN THESE CURLY BRACES *************** 
		// write code for removing incoming/outgoing arrays from employees,
		// as we remove incoming/outgoing array, $set a new field which is just the length of the incoming field
		await testValues.updateMany(
			{},
			{ 
				// store values as a dictionary of dictionaries for fast lookup (when stored as an array, we have to do linear scan to find the desired core_value). 
				// the key for each dictionary is the name of the core_value
				// the value for the key is the color and active field associated with the core_value
				$set : {
					values : {
						'Selfless'		: { 'color' : '', 'active' : 1},
						'Nimble'		: { 'color' : '', 'active' : 1},
						'Mentoring'		: { 'color' : '', 'active' : 1},
						'hardworking'	: { 'color' : '', 'active' : 1},
						'Inspirational' : { 'color' : '', 'active' : 1},
						'Smart' 		: { 'color' : '', 'active' : 1},
					}
				}
			});
		testClient.close();
	};
	modifyCollection();
});
