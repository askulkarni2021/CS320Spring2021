const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const assert = require('assert');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

/*
Kudo Schema:
kudo : {
	from : {type: int, explaination : "This is the userID is giving the kudo"},
	to : {type: int, explaination : "This is the userID that is recieving the kudo"},
	kudo : {type : String,  explaination : "The actual text of the kudo"},
	tags : {type: Array of strings, explaination : "The list of company value tags that the reciever displayed"},
	emotes:{IDK yet how to do this}
}

Thought - This is a great schema as it includes everything that we thought of to be included in the kudos. 
		  This can also be easily rendered into the feed when required by the frontend!

Removed Kudos:
kudo : {
	removed_by : {type: String, explaination : "This is the admin user that is removing the kudo"},
	from : {type: String, explaination : "This is the user that is giving the kudo"},
	to : {type: String, explaination : "This is the user that is recieving the kudo"},
	kudo : {type : String,  explaination : "The actual text of the kudo"},
	reson:
}

Rockstar of the month (user flow):

Having 2 endpoint using and an additional database for storing information abour the 
previos ROM employee. Using timestamp to see if it is the first of the month 
and then exploit a variable called kudosForThisMonth which needs to be set to 0 
on the first after aking the max of the previous month and storing it in the 
ROM database

*/



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// 	//correct password = rodriguezka
// 	query = {email:"Kaitlin_Rodriguez@outbacktechnology.com", password:"rodriguezka"}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const findEmployees = async (employeesCollection) => { 
	const employees = await employeesCollection.find({}).toArray();
	return employees;
};
const findKudos = async (kudosCollection,filter_query) => { 
	const kudos = await kudosCollection.find(filter_query).toArray();
	return kudos;
};
//Login Pages Endpoints

app.post('/api/verify', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");
		const employees = findEmployees(employeesCollection);

		const verify = async (employees,query) => {
			found = false;
			await employees.then(value  => {
				value.forEach(function(element){
				  if(element.email === query.email){
				    if(element.password===query.pass){
				    res.send({found:true, uid:element.employeeId});
				}}
				})
			});
			res.send({found:found});
		}
		verify(employees,req.body)
	});
});

//Home Pages Endpoints
app.post('/api/add_kudo', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		
		const add_kudo = async (query) => {
			const db = client.db(companyName);
			const kudos = db.collection("Kudos");
			// dont insert the whole query because otherwise the company name would be inserted in each kudo, which is unnecessary
			let resultDoc = await kudos.insertOne({from: query.from, to: query.to, kudo: query.kudo});
			addToIncomingAndOutgoing = (addedKudo) => {
				// NOTE: to and from are strings, not ints
				let to = req.body.to;
				let from = req.body.from;
				kudoID = addedKudo.insertedId;
				const employeesCollection = db.collection("Employees Database");
				const updateGiverAndRecipient = async () => {
					await employeesCollection.updateOne(
						{ "employeeId": parseInt(to) }, // get the employee that is recieving the kudo
						{ $push: { incoming : kudoID} } // want to push the kudo to the recipients incoming list
					);
					await employeesCollection.updateOne(
						{ "employeeId": parseInt(from) }, // get the employdd that is giving the kudo
						{ $push: { outgoing : kudoID} }   // and push the kudo to their outgoing list
					);
				}
				updateGiverAndRecipient();
			};
			addToIncomingAndOutgoing(resultDoc);
			// TODO: later on, we need to send better information here, like if the rockstar of the month has been updated
			res.send(true); 
		};
		add_kudo(req.body);
	});
});


//Expects the company name(as uri field of the incoming query) and returns all kudos within that company as an array
app.post('/api/all_kudos', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const kudosCollection = db.collection("Kudos");	
		const kudos = findKudos(kudosCollection,{});
		const find_all = async (kudos) => { 
			await kudos.then(value  => {
				res.send(value.reverse());
			});
		};
		find_all(kudos);
 	});
 });


//Profle page Endpoints

//Expects - {uri , uid(of user)}
//Returns - An array of all inccoming kudos for this user!

app.post('/api/profile_incoming', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");
		const findEmployees = async () => { 
			const employees = await employeesCollection.find({'employeeId':req.body.uid}).toArray();
			return employees;
		};
		const kudosCollection = db.collection("Kudos");	
		
		
		const employees = findEmployees();
		var temp_incoming = []; // try

		const find_incoming = async (employees) => { 
			await employees.then(value  => {
				//adding incoming kudos
				value.forEach(function (e) {
					for (let i in e.incoming){
						console.log(e.incoming[i]);
						temp_incoming.push(e.incoming[i])}
					}
				);
				// //testing with uid:7, so I had to use outgoing instead of incoming kudos
				// console.log("I'm in");
				// value.forEach(function (e) {
				// 	for (let i in e.outgoing){
				// 		console.log(e.outgoing[i]);
				// 		temp_incoming.push(e.outgoing[i])}
				// 	}
				// );
				// //Testing by printing out array
				// console.log(temp_incoming);
				});
		}

		find_incoming(employees);
		const findKudos = async () => { 
			//cannot find by a list of ObjectId, so use from instead
			const kudos = await kudosCollection.find({"from": req.body.uid.toString()}).toArray();
			return kudos;
		};
		const kudos = findKudos();
		const find_incoming_kudos = async (kudos) => { 
			await kudos.then(value  => {
				console.log(value);
				});
		}
		find_incoming_kudos(kudos);
		});
});


//Expects - {uri , uid(of user as a string)}
//Returns - An array of all outgoing kudos for this user!

app.post('/api/profile_outgoing', (req, res) => { 
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const employeeId = req.body.uid
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");

		const findKudos = async () => {
			const kudos = await Kudos.find({from: employeeId}).toArray(); //find kudos with field 'from' that is the same as employeeID
			console.log(kudos);
			res.send(kudos);
			return kudos;
		};
		findKudos()
	});
});

// Data Sending Endpoints

app.post('/api/data/name_map_uid', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");

		const employees = findEmployees(employeesCollection);

		const send_data = async (employees,query) => {
			const emp = {};
			await employees.then(value  => {
			value.forEach(function(element){
				employee = element.firstName+" "+element.lastName;
				id = element.employeeId;
				position = element.positionTitle
				const data = {id:id, position:position}
				emp[employee]=data;
			})
			res.send(emp);
		});
		};
		send_data(employees);
	});
  });

app.post('/api/data/uid_map_name', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");

		const employees = findEmployees(employeesCollection);

		const send_data = async (employees,query) => {
			const emp = {};
			await employees.then(value  => {
			value.forEach(function(element){
				employee = element.firstName+" "+element.lastName;
				id = element.employeeId;
				position = element.positionTitle
				const data = {name:employee, position:position}
				emp[id]=data;
			})
			res.send(emp);
		});
		};
		send_data(employees);
	});
});

//var month = 2;
/* So each employee needs a field called numKudos, which is reset on the first of every month
 * This end point should take an employeeId, and company name in the request.
 * Get the current month. 
 * If it is the first of the month, and rockstar hasnt yet been updated, we need to update rockstar of the month 
 * Checking if it is the first of the month is easy. In order to check if rockstar of the month has yet been updated,
 * we need to store the rockstar of the month in each company's meta collection (this is the data which contains name, company ID, and values)
 * ROM entry is a JSON which has employeeId, and the month for which that employee is ROM. 
 * If it is the first of the month, and the month in the ROM entry for the company meta collection is LAST month, 
 * then the current ROM has to be updated. NOTE: I THINK WE ONLY NEED TO CHECK IF THE ROM MONTH IS FROM LAST MONTH, NOTHING TO DO WITH THE EXACT DATE
 * Updating it should be straight forward. 
 * After updating the ROM for the company, set the numKudos counter for each employee back to 0.
 * After exiting that whole if block, fall through out of the if stmt (no else)
 * In this place, just get the current ROM for the company requested. */
// TODO: for testing this endpoint, just copy all the data thats currently in the outback-tech db into the test db
// request consists of the month for which the rockstar is desired
app.post('/api/get_rockstar', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		// We first need to get the ROM entry from the company's values collection
		const db = client.db(companyName);
		const valuesCollection = db.collection("Values");
		// first arg is the filter (empty), second arg is the fields we want to select (only ROM)
		// equivalent to "select _id, ROM from valuesCollection"
		const getROM = async () => await valuesCollection.findOne({}, { ROM : 1});
		// The ROM entry is of the format {employeeId: int, month: int} 
		// The month field represents the most recent month for which ROM was updated
		let romEntry = getROM();
		// TODO: I think there might be some problems with promises in this code, so make sure to test on the test db
		romEntry.then(ROM => {
			const currentMonth = new Date().getMonth();
			if (currentMonth != ROM.month) { // this is the case where ROM needs to be updated, but hasnt been updated yet
				// find next ROM by going through employees collection and finding max numKudos
				// then set numKudos to zero for all employees
				// then update the valuesCollection ROM field to the new ROM's employeeId, and current month
				// and also assign ROM to the new ROM
			}
			// at this point, either the ROM was correctly updated, or it didnt need to be updated, so we can just send the ROM
			res.send(ROM);
		});
	});
});
