var express = require('express'),
	app = express(),
	engine = require('consolidate'), //template engine consolidation library
	bodyParser = require('body-parser'), //body parsing middleware
	mongoClient = require('mongodb').MongoClient,
	session = require('express-session'), //session handling
    MongoDBStore = require('connect-mongodb-session')(session);

app.engine('html', engine.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('assets'));
app.use(express.static('views'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// session handling

var store = new MongoDBStore({uri:'mongodb://localhost:27017/marlabs', collection:'marlabs_session'});
app.use(session({
        secret:'marlabs_sess_secret_key',
        resave:true,
        saveUninitialized:true,
        store:store
    }));

store.on('error', function(error){
    console.log(error)
});

// app.get('/', function(req, res) {
// 	res.render('index');
// });

// app.get('/login.html', function(req, res) {
// 	res.render('login');
// });

// app.get('/signUp.html', function(req, res) {
// 	res.render('signUp');
// });

// app.get('/home.html', function(req, res) {
// 	res.render('home');
// });

// app.get('/addStudent.html', function(req, res) {
// 	res.render('addStudent');
// });

// app.get('/monitorClass.html', function(req, res) {
// 	res.render('monitorClass');
// });

app.get('/logout', function(req, res) {
	req.session.destroy();
	//res.render('login'); //res.send('login');
});

var conn_str = 'mongodb://localhost:27017/marlabs';

app.post('/postdata', function(req, res) {
	//console.log('Username = '+ req.body.uname + ', Password = ' + req.body.pwd);

	mongoClient.connect(conn_str, function(err, db) {
		if(err) {
			console.log('Error while connecting to database');
		} else {
			console.log('Connection eshtablished');
			//console.log(db);
			
			var doc = db.collection('admin').find({'username':req.body.uname, 'password':req.body.pwd});
			doc.count(function(err, resp) {
				var auth;
				if(resp == 0) {
					auth = 'N';
					console.log('Login failed');
				} else {
					auth = 'Y';
					console.log('Login successful');
						req.session.isLoggedIn = true;
    					req.session.username = req.body.uname;
				}
				//console.log(auth);
				res.send(auth);
			})
		}
		db.close();
	});
})

app.post('/postdata2', function(req, res) {
	//console.log('Username = '+ req.body.username + ', Phone = ' + req.body.phone + ', Age = ' + req.body.age);

	mongoClient.connect(conn_str, function(err, db) {
		if(err) {
			console.log('Error while connecting to database');
		} else {
			console.log('Connection eshtablished');
			//console.log(db);
			var newDoc = {'username': req.body.username ,'password': req.body.password};

			db.collection('admin').insert(newDoc, function(err, res) {
				if(err) {
					console.log('Error happened while trying to insert a new document');
				} else {
			 		console.log('Document added');
				}
			})
		}
		db.close();
	});	
})

app.post('/postdata3', function(req,res) {
	mongoClient.connect(conn_str, function(err, db) {
		if(err) {
			console.log('Error while connecting to database');
		} else {
			console.log('Connection eshtablished');
			var newDoc = {'class': req.body.class ,'studentName': req.body.sName,'studentAge': req.body.sAge, 'csMarks': req.body.sub1, 'bioMarks': req.body.sub2, 'chemMarks': req.body.sub3};

			db.collection('student').insert(newDoc, function(err, res) {
				if(err) {
					console.log('Error happened while trying to insert a new document');
				} else {
			 		console.log('Document added');
				}
			})
		}
		db.close();
	});
})

// populating student names

app.post('/postdata5', function(req,res) {
	//console.log(req.body.classId);
	mongoClient.connect(conn_str, function(err, db) {
		if(err) {
			console.log('Error while connecting to database');
		} else {
			console.log('Connection eshtablished');
			db.collection('student').find({'class':req.body.classId}).toArray(function(err, resp) {
				if (err) {
					console.log('Error happened');
				} else {
					//console.log(resp);
					res.send(resp);
				}
			})
		}
		db.close();
	});
})

// Fetching student information

app.post('/postdata4', function(req,res) {
	mongoClient.connect(conn_str, function(err, db) {
		if(err) {
			console.log('Error while connecting to database');
		} else {
			console.log('Connection eshtablished');
			//console.log(db);
			
			//var doc = db.collection('credentials').find({'username':req.body.uname});
			db.collection('student').findOne({'class':req.body.class, 'studentName':req.body.sName}, function(err, resp) {
				if (err) {
					console.log('Error happened');
				} else {
					console.log(resp);
					res.send(resp);
				}
			})
		}
		db.close();
	});
})

app.use(function(req,res) {
	res.send('Invalid URL');
})

app.listen(3312, function() {
	console.log('Server is listening at port 3312');
})