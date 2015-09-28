/* =========================================================
*
*	Farmville 
*
* =========================================================*/
	URL = require('url');
	swig = require("swig");
	mysql = require("mysql");
	express = require("express");

// ===================================================
// Configuration Variable globales
// ===================================================
	CFG = {
		controllers: "./core/controllers/",
		httpPort : 1337,
		www : "./core/www/",
		db:{
			host: "localhost",
			user : "root",
			pass : "",
			name : "supwars"
		}
	}

	CONNECTEDPLAYERS = new Array();
	MESSAGES = new Array();

// ===================================================
// Modules
// ===================================================
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
    
    server.listen(CFG.httpPort);

	// ===================================================
	// Server Initialisation
	// ===================================================

	server.listen(CFG.httpPort);

	app.engine('html', swig.renderFile);
	app.use(express.bodyParser());
	app.set('view engine', 'html');
	app.set('views', __dirname+'/core/views/');

	// ===================================================
	// SWIG
	// ===================================================
	
	swig.setDefaults({ cache: false });


	// ===================================================
	// MySQL Database
	// ===================================================

	db = mysql.createConnection({
	  host     : CFG.db.host,
	  user     : CFG.db.user,
	  password : CFG.db.pass,
	  database : CFG.db.name,
	});

	db.connect(function (error){
		if (error) console.log("[ERR] Not connected to MySQL");
		else console.log("[OK] Connected to MySQL");
		console.log ("\nListening on 127.0.0.1:"+CFG.httpPort+" / localhost:"+CFG.httpPort);
		console.log(__dirname);
	});


	// ===================================================
	// Loading Controllers
	// ===================================================

	page = require(CFG.controllers + "page.js");
	socketController = require(CFG.controllers + "socketController.js");
	FUNCTIONS = require(CFG.controllers + "functions.js");

	// ===================================================
	// Socket.io
	// ===================================================
	io.set('log level', 1);
	io.sockets.on("connection", socketController.socketHandler);

	// ===================================================
	// Routes
	// ===================================================

	app.use("/", express.static(CFG.www));

	app.get('/', page.index);
	app.post('/play', page.login);
	app.post('/register',page.register);