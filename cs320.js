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
	const employeeId = req.body.uid
  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
			
		const findKudos = async () => { 
			const kudos = await Kudos.find({to: employeeId}).toArray();
			console.log(kudos);
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
			console.log(kudos);
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

/* ************ not ready to merge yet, we need to populate the test db and test on that first ************
 * So each employee needs a field called numKudos, which is reset whenever we need to get a new ROM
 * Get the current month. 
 * If rockstar hasnt yet been updated, we need to update rockstar of the month 
 * In order to check if rockstar of the month has yet been updated,
 * we need to store the rockstar of the month in each company's Rockstars collection
 * Rockstars is a collection that stores all previous and current rockstars. Each entry is an empid, along with month
 * If the most recent entry in Rockstars is not from last month, then we need to update the Rockstars collection with the ROM from this month
 * Logic for why we are checking if the most recent entry is NOT from last month: 
 * 		The ROM that is being displayed on the home page should be the employee with the most kudos from LAST month
 * 		On the current month, we are still accumulating the numKudos for each employee. 
 * 		Therefore, when querying the Rockstars collection, we want the CURRENT ROM to be dated as last month (because that is when they got their kudos)
 * 		So lastMonth = currentMonth - 1
 * Updating it should be straight forward. 
 * After updating the ROM for the company, set the numKudos counter for each employee back to 0.
 * Then we can just query the rockstars collection again, get the most recent, and send that into the response */
// TODO: for testing this endpoint, just copy all the data thats currently in the outback-tech db into the test db
// TODO: change the add_kudo endpoint to not push the kudo to incoming/outgoing arrays, increment numKudos for recipient
// We will also need to initialize the Rockstars collection to some arbitrary employee as the first ROM (the ROM of february)
// request consists of the company for which the rockstar is desired
app.post('/api/get_rockstar', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const rockStarsCollection = db.collection("Rockstars");
		const employeesCollection = db.collection("Employees Database");
		const getROMs = async () => await rockStarsCollection.find({}).toArray();
		let ROMsPromise = getROMS();
		const employeesPromise = findEmployees(employeesCollection);
		// TODO: Test this code on the test db
		ROMsPromise.then(rockStars => {
			// when getMonth returns 0 here, we end up with -1. -1 is not a month, so we need it to "wrap" around to 
			// the last month (represented by 11). if javascript did modulo the expected way, -1 % 12 would return 11 like a cycle.
			// instead, it returns -1. this breaks the definition of modulo in math :(
			let lastMonth = new Date().getMonth() - 1;
			// so we get expected modulo behavior on negative numbers
			lastMonth = (12 + (lastMonth % 12)) % 12;
			const mostRecentRockStar = rockStars[rockStars.length - 1];
			// if the most recent rockstar of the month is not for last month, then we will need to update 
			if (lastMonth != mostRecentRockStar.month) {
				const insertNewROM = (employees) => {
					// find the employee with the max number of kudos
					const newROM = employees.reduce((acc, curr) => acc.numKudos >= curr.numKudos ? acc : curr);
					// timestamp this newROM as the current month
					newROM.month = (lastMonth + 1) % 12; // mod 12 because 12 months in a year
					// now we need to insert this newROM into the rockStarsCollection (does this need to be async / await?)
					rockStarsCollection.insertOne(newROM);
				};
				employeesPromise.then(insertNewROM);
				// now we need to reset all the current employees numKudos to 0
				const resetNumKudos = async () => {
					await employeesCollection.updateMany(
						{}, // update every employee
						{ $set : // and set their numKudos field to 0
							{
								"numKudos": 0
							}
						}
					);
				};
				resetNumKudos();
			} 
		});
		// at this point, we need to get the (possibly) updated array of rockstars, and just send the most recent one into the response
		ROMsPromise = getROMS();
		ROMsPromise.then(rockStars => {
			const ROM = rockStars[rockStars.length - 1];
			res.send({employeeId : ROM.employeeId, month: ROM.month})
		});
	});
});
