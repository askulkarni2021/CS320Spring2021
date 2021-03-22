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
				    	client.close();
				    res.send({found:true, uid:element.employeeId});
				}}
				})
			});
			client.close();
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
			let resultDoc = await kudos.insertOne({from: query.from, to: query.to, kudo: query.kudo, reactions: {}});
			addToIncomingAndOutgoing = (addedKudo) => {
				// NOTE: to and from are strings, not ints
				let to = req.body.to;
				let from = req.body.from;
				kudoID = addedKudo.insertedId;
				const employeesCollection = db.collection("Employees Database");
				const incrementNumKudos = async () => {
					await employeesCollection.updateOne(
						{ "employeeId": parseInt(to) }, // get the employee that is recieving the kudo
						{ $inc: { "numKudos" : 1} } // increment the number of kudos this employee has recieved
					);
					// for some reason calling client.close() outside of addToIncomingAndOutgoing caused the client to close before numKudos was incremented
					// putting client.close() still ensures the client is closed before the response is sent and is closed after any db operation is done
					client.close(); 
				}
				incrementNumKudos();
			};
			addToIncomingAndOutgoing(resultDoc);
			res.send(true); 
		};
		add_kudo(req.body);
	});
});

// the request should contain the company name, the reaction (just an emoji) and the _id of the kudo
// the front end should have the _id of the kudo from the all_kudos endpoint
app.post('api/add_kudo_reaction', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const kudosCollection = db.collection("Kudos");
		const addReaction = async () => {
			let kudoDocument = await kudosCollection.findOne(
				{ "_id" : req.body.kudoID },
			).toArray()[0]; // this is in an array, so get the first (and only) element
			const reaction = req.body.reaction;
			const reactionsTable = kudoDocument.reactions;
			if (reactionsTable[reaction]) { // if the reaction is already in the table, just increment its value
				reactionsTable[reaction] += 1;
			} else {
				reactionsTable[reaction] = 1;
			}
			return await kudosCollection.updateOne(
				{ "_id" : req.body.kudoID },
				{ $set:
					{ "reactions": reactionsTable }
				}
			);
		};
		const updatedDocument = addReaction();
		// this needs to be tested
		updatedDocument.then(doc => {
			res.send(true);
		});
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
				client.close();
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
	const employeeId = req.body.uid
  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
			
		const findKudos = async () => { 
			const kudos = await Kudos.find({to: employeeId}).toArray();
			client.close();
			res.send(kudos);
			return kudos;
		};
		findKudos();
	});
});


//Expects - {uri , uid(of user as a string)}
//Returns - An array of all outgoing kudos for this user!

app.post('/api/profile_outgoing', (req, res) => { 
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const employeeId = req.body.uid;
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");

		const findKudos = async () => {
			const kudos = await Kudos.find({from: employeeId}).toArray(); //find kudos with field 'from' that is the same as employeeID
			client.close();
			res.send(kudos);
			return kudos;
		};
		findKudos();
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
			client.close();
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
			client.close();
			res.send(emp);
		});
		};
		send_data(employees);
	});
  });
