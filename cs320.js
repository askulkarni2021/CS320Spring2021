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


*/



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// 	//correct password = rodriguezka
// 	query = {email:"Kaitlin_Rodriguez@outbacktechnology.com", password:"rodriguezka"}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const findEmployees = async (employeesCollection, filter_query = {}) => {
	const employees = await employeesCollection.find(filter_query).toArray();
	return employees;
};
const findKudos = async (kudosCollection,filter_query) => {
	const kudos = await kudosCollection.find(filter_query).toArray();
	return kudos;
};
//Login Pages Endpoints

app.post('/api/verify', (req, res) => {
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
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);

		const add_kudo = async (query) => {
			const db = client.db(companyName);
			const kudos = db.collection("Kudos");
			const curDate = new Date();
			const timestamp = ((curDate.getHours() + 24) % 12 || 12) + ':' + (curDate.getMinutes() < 10 ? '0' : '') + curDate.getMinutes() + '      ' + (curDate.getMonth() + 1) + '/' + curDate.getDate() + '/' + curDate.getFullYear();
			// dont insert the whole query because otherwise the company name would be inserted in each kudo, which is unnecessary
// <<<<<<< reactions
// 			let resultDoc = await kudos.insertOne({from: query.from, to: query.to, kudo: query.kudo, reactions: [], tags: query.tags});
// =======
// 			let resultDoc = await kudos.insertOne({from: query.from, to: query.to, kudo: query.kudo, reactions: {}, tags: query.tags, time: timestamp});
// >>>>>>> main
			let resultDoc = await kudos.insertOne({from: query.from, to: query.to, kudo: query.kudo, reactions: [], tags: query.tags, time: timestamp, report: []});
			addToIncomingAndOutgoing = (addedKudo) => {
				// NOTE: to and from are strings, not ints
				let to = req.body.to;
				let from = req.body.from;
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
// req := {uri: "company name", kudoID: "id of kudo to be updated", emoji: "emoji that is chosen", by: "uid of the employee giving the reaction"}
app.post('/api/add_kudo_reaction', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const kudoID = new ObjectId(req.body.kudoID);
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const kudosCollection = db.collection("Kudos");
		const addReaction = async () => {
			reactionObj = {emoji: req.body.emoji, by: parseInt(req.body.by)}
			await kudosCollection.updateOne(
				{ "_id" : kudoID },
				{
					$push : { reactions : reactionObj }
				}
			);
			client.close(); // db operations no longer needed
		};
		addReaction();
		res.send(true);
	});
});

// req := {uri: "company name", kudoID: "id of kudo to be updated", emoji: "emoji to be removed from kudo", by: "uid of the employee giving the reaction"}
app.post('/api/delete_kudo_reaction', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const kudoID = new ObjectId(req.body.kudoID);
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const kudosCollection = db.collection("Kudos");
		const deleteReaction = async () => {
			await kudosCollection.updateOne(
				{ "_id" : kudoID },
				{
					$pull : { reactions : { emoji : req.body.emoji , by : parseInt(req.body.by) } }
				}
			);
			client.close()
		};
		deleteReaction();
		res.send(true);
	});
});

// expects {uri: "companu name", kudoID: "id of kudo to get reactions from"}
app.post('/api/get_kudo_reactions', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const kudoID = new ObjectId(req.body.kudoID);
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const kudosCollection = db.collection("Kudos");
		const kudo = findEmployees(kudosCollection, { "_id" : kudoID });
		const sendReactions = async () => {
			await kudo.then(kudoVal => {
				// there is only going to be one kudo here because the query was filtered by ID
				res.send(kudoVal[0].reactions);
			});
			client.close();
		};
		sendReactions();
	});
});

//Expects the company name(as uri field of the incoming query) and returns all kudos within that company as an array
app.post('/api/all_kudos', (req, res) => {
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
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const employeeId = req.body.uid
  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
		const findKudos = async () => {
			const kudos = await Kudos.find({to: parseInt(employeeId)}).toArray();
			client.close();
			res.send(kudos.reverse());
			return kudos;
		};
		findKudos();
	});
});


//Expects - {uri , uid(of user as a string)}
//Returns - An array of all outgoing kudos for this user!

app.post('/api/profile_outgoing', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const employeeId = req.body.uid;
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
		const findKudos = async () => {
			const kudos = await Kudos.find({from: parseInt(employeeId)}).toArray(); //find kudos with field 'from' that is the same as employeeID
			client.close();
			res.send(kudos.reverse());
			return kudos;
		};
		findKudos();
	});
});

// Data Sending Endpoints


app.post('/api/data/name_map_uid', (req, res) => {
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
				position = element.positionTitle;
				isAdmin = element.isAdmin;
				const data = {id:id, position:position, isAdmin:isAdmin};
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
				position = element.positionTitle;
				isAdmin = element.isAdmin;
				const data = {name:employee, position:position, idAdmin:isAdmin}
				emp[id]=data;
			})
			client.close();
			res.send(emp);
		});
		};
		send_data(employees);
	});
});

// Takes in the company name
// Responds with {name: "name of employee", position: "position of employee", numKudos: "number of kudos received for that month", employeeId: "employeeid of employee"}
app.post('/api/get_rockstar', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const rockStarsCollection = db.collection("Rockstars");
		const getRockstars = async () => {
			return await rockStarsCollection.find({}).toArray();
			client.close()
		}
		rockStarsPromise = getRockstars()
		const sendData = async (rockStars) => {
			await rockStars.then(value => {
				mostRecentROM = value[value.length - 1];
				const ROMname = mostRecentROM.firstName + " " + mostRecentROM.lastName;
				res.send({name: ROMname, position: mostRecentROM.positionTitle, numKudos: mostRecentROM.numKudos,
							employeeId: mostRecentROM.employeeId, month: mostRecentROM.month});
			});
		};
		sendData(rockStarsPromise);
	});
});

app.post('/api/data/get_core_values', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err =>  {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");

		const val_em = findEmployees(Collection);

		const send_data = async (val_em) => {
			await val_em.then(value  => {
			console.log(value[0].values);
			client.close();
			res.send(value[0].values);
		});
		};
		send_data(val_em);
	});
  });

// Settings endpoints

//Expects : uri, uid and password
app.post('/api/verify_settings', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");
		const employees = findEmployees(employeesCollection, {employeeId:req.body.uid});

		const verify = async (employees,query) => {
			found = false;
			await employees.then(value  => {
				//console.log(value.password);
				found = (req.body.pass === value[0].password)
				//if (found===true){
				client.close()
				res.send({found:found, pass:value[0].password});
			//}
			});
		}
		verify(employees,req.body)
	});
});

// "weaverol"
app.post('/api/data/change_password', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const password = req.body.password;

  	client.connect(err =>  {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");
		const employees = findEmployees(employeesCollection, {employeeId:req.body.uid});

		const change_password = async (employees) => {
			await employeesCollection.updateOne(
				{employeeId: req.body.uid},
				{$set: {password: password}}
			);
			client.close();
			res.send(true);
		};
		change_password(employees);
	});
  });

app.post('/api/data/get_emojis', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  	client.connect(err =>  {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");

		const val_em = findEmployees(Collection);

		const send_data = async (val_em) => {
			await val_em.then(value  => {
			console.log(value[0].emojis);
			client.close();
			res.send(value[0].emojis);
		});
		};
		send_data(val_em);
	});
});


//Expects uri and string for the value and the color of the value to be added
app.post('/api/data/add_value', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const value = req.body.value;
	const color = req.body.color;

	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");
		const insertValue = async (value) => {
			await Collection.updateOne(
				{},
				{$push: {values: {value: value, color: color , active: 1, numTagged:0}}}
				);
			client.close();
			res.send(true)
		};
		insertValue(value);
	});

});

//Expects uri and string for the emoji to be added
app.post('/api/data/add_emoji', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const emoji = req.body.emoji;

	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");

		const insertEmoji = async (emoji) => {
			await Collection.updateOne(
					{},
					{$push: {emojis: emoji}}
				);
			client.close();
			res.send(true)
		};
		insertEmoji(emoji);
	});
});



//Expects uri and string for the emoji to be deleted
app.post('/api/data/delete_emoji', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const emoji = req.body.emoji;

	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");

		const removeEmoji = async (emoji) => {
			await Collection.updateOne(
					{},
					{$pull: {emojis: emoji}}
				);
			client.close();
			res.send(true)
		};
		removeEmoji(emoji);
	});
});

//Expects uri and string for the value to be deleted
app.post('/api/data/delete_value', (req, res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const value = req.body.value;



	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");
		const removeValue = async (value) => {
			await Collection.findOneAndUpdate(
					{"values.value": value},
					{$set: {"values.$.active": 0}}
				);
			client.close();
			res.send(true)
		};
		removeValue(value);
	});

});

app.post('/api/data/export_data',(req ,res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const employeeId = req.body.uid;

	client.connect(err => {
		assert.equal(err,null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
		const findData = async () => {
			const kudos_received = await Kudos.find({to: employeeId}).toArray();
			const kudos_given = await Kudos.find({from: employeeId}).toArray();
			
			const k_given = [];
			for (i = 0; i <kudos_given.length; i++){
				k_given.push(kudos_given[i].kudo);
			}

			const k_received = [];
			for (i = 0; i <kudos_received.length; i++){
				k_received.push(kudos_received[i].kudo);
			}

			num_reaction = 0;
			for (i = 0; i < kudos_received.length; i++){
				num_reaction += kudos_received[i].reactions.length;
			}

			client.close();
			result = {given: k_given, received: k_received, numreact: num_reaction};
			res.send(result);
			return result;
		};
		findData();
	})
});

app.post('/api/data/reported_kudo', (req,res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	client.connect(err => {
		assert.equal(err,null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
		const find_reported = async() => {
			const reported = await Kudos.find({report: {$not: {$size: 0}}}).toArray();
			client.close();
			res.send(reported);
			return reported
		};
		find_reported();
	})
});

app.post('/api/data/report_kudo', (req,res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const kudoID = req.body.kid;
	const empID = req.body.uid;
	const reas = req.body.reason;

	client.connect(err => {
		assert.equal(err,null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
		const report = async() => {
			await Kudos.findOneAndUpdate({_id:ObjectId(kudoID)}, {$push: {report: {by: empID, reason: reas}}});
			client.close();
			res.send(true);
		};
		report();
	});
});

app.post('/api/data/delete_kudo', (req,res) => {
	console.log(req.body);
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const kudoID = req.body.kid;

	client.connect(err => {
		assert.equal(err,null);
		const db = client.db(companyName);
		const Kudos = db.collection("Kudos");
		const del = async() => {
			await Kudos.deleteOne({_id:ObjectId(kudoID)});
			client.close();
			res.send(true);
		};
		del();
	});
});

// request contains company uri
app.post('/api/get_all_avatars', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const Collection = db.collection("Values-Emojis");

		const val_em = findEmployees(Collection);

		const send_data = async (val_em) => {
			await val_em.then(value  => {
			client.close();
			res.send(value[0].avatars);
		});
		};
		send_data(val_em);
	});
});

// request contains company uri and uid of user who is changing the avatar
app.post('/api/change_avatar', (req, res) => {
	const companyName = req.body.uri;
	const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/" + companyName + "?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		assert.equal(err, null);
		const db = client.db(companyName);
		const employeesCollection = db.collection("Employees Database");
		const changeAvatar = async (employeesCollection) => {
			await employeesCollection.updateOne(
				{ employeeId : req.body.uid },
				{ 
					$set : { avatar : req.body.avatar } 
				}
			);
			client.close();
			res.send(true)
		};
		changeAvatar(employeesCollection);
	});
});
