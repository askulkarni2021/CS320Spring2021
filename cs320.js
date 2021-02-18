const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// 	//correct password = rodriguezka
// 	query = {email:"Kaitlin_Rodriguez@outbacktechnology.com", password:"rodriguezka"}
	
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
				})
			});
			res.send(`${found}`,);
		}

		verify(employees,req.body)
	});
  // res.send(
  //   `I received your POST request. This is what you sent me: ${req.body.post}`,
  // );
});
