var express = require('express')
	, http = require('http')
	, path = require('path')
	, socketio = require('socket.io')
	, time = require('./time-keeper')
	, user = require('./user-keeper')
	, looper = require('./loop-master')

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('A Tree in your hand is better than 5 birds in the forest.'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

app.get('/', function (req, res) {
	res.render('index');
});

var server = http.createServer(app).listen(app.get('port'), function () {
	console.log('Chronos is running on port ' + app.get('port'));
});

var io = socketio.listen(server, {
	'log level': 0
});

looper.register(app, io);

io.sockets.on('connection', function (socket) {
	time.open(socket);
	looper.open(socket);
	socket.on('disconnect', function () {

	});
});
