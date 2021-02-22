const MongoClient = require('mongodb').MongoClient;
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
*/


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// 	//correct password = rodriguezka
// 	query = {email:"Kaitlin_Rodriguez@outbacktechnology.com", password:"rodriguezka"}

const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/verify', (req, res) => {
	console.log(req.body);
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db("outback-tech");
		const employeesCollection = db.collection("Employees Database");
		const findItems = async () => { 
			const employees = await employeesCollection.find({}).toArray();
			//console.log(employees);
			client.close();
			return employees;
		};

		const employees = findItems();

		const verify = async (employees,query) => {
			found = false;
			await employees.then(value  => {
				value.forEach(function(element){
				  if(element.email === query.email){
				    found = element.password===query.password;}
				    res.send({found:found, uid:element.employeeId});
				})
			});
			res.send({found:found});
		}
		verify(employees,req.body)
	});
});

app.post('/api/add_kudo', (req, res) => {
	console.log(req.body);
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
	assert.equal(err, null);
	
	const add_kudo = async (query) => {
		const db = client.db("outback-tech");
		const kudos = db.collection("Kudos");
		kudos.insertOne(query, function(err, res) {
		    if (err) throw err;
		});
		res.send(`${true}`,);
	}
	
	add_kudo(req.body)
	});
});

app.post('/api/profile_incoming', (req, res) => {
	console.log(req.body);
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
	assert.equal(err, null);
	const db = client.db("outback-tech");
	const employeesCollection = db.collection("Employees Database");
	const findEmployees = async () => { 
		const employees = await employeesCollection.find({}).toArray();
			//console.log(employees);
		return employees;
	};
	const kudosCollection = db.collection("Kudos");	
	const findKudos = async () => { 
		const kudos = await kudosCollection.find({}).toArray();
			//console.log(employees);
		return kudos;
	};
	const employees = findEmployees();
	const kudos = findKudos();

	const find_incoming = async (employees,kudos,user) => { 
		var employee;
		await employees.then(value  => {
			value.forEach(function(element){
				if(element.email === user.email){
				 	employee = element;
				}
			})
		});
		await kudos.then(value  => {
			const incoming_kudos = [];
			value.forEach(function(element){
			//Need to work on this part, need help. Cant access the employee variable
				
			})
			console.log(incoming_kudos);
		});
		
	}
	find_incoming(employees,kudos,req.body);
	});
});


