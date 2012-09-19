
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
	, socketio = require('socket.io')
	, ping = require('./ping')
	, time = require('./time')
	, _ = require('underscore')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/admin', function (req, res) {
  res.render('admin', { title: 'Express' });
});

app.get('/admin/flash', function (req, res) {
	io.sockets.emit('flash', { 
		at: (new Date).getTime() + settings.delay
		, open: settings.open
		, close: settings.close
	});
	res.end(JSON.stringify({'result': 'ok'}));
});

app.post('/admin/set', function (req, res) {
	try {
		settings.delay = parseFloat(req.body.delay);
		settings.open = parseFloat(req.body.open);
		settings.close = parseFloat(req.body.close);
		var pulse = parseFloat(req.body.pulse);
		if (settings.pulse != pulse) {
			settings.pulse = pulse;
			io.sockets.emit('setPulse', pulse);
		}
	} 
	catch (e) {
	}
	res.redirect('/admin');
});

var settings = { delay: 500, open: 50, close: 250, pulse: 1000 };
app.locals.settings = settings;

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server, {
	'log level': 0
})
	, users = []
	, userCount = 0
	, update = false

function getLocation(x, y) {
	x = x || Math.random();
	y = y || Math.random();
	return { x: limit(x), y: limit(y) };
}

function isValidCoord(x) {
	return x && _.isNumber(x);
}

function limit(x) {
	if (x > 1.0)
		return 1.0;
	if (x < 0)
		return 0;
	return x;
}

io.sockets.on('connection', function (socket) {
	var user = { 
		id: userCount++ 
	}
	, die = 0
	user.location = getLocation();
	socket.emit('yourUser', user);
	socket.emit('setPulse', settings.pulse);

	ping.respond(socket);
	time.server(socket);

	users.push(user);
	update = true;

	socket.on('move', function (loc) {
		if (isValidCoord(loc.x) && isValidCoord(loc.y)) {
			user.location = getLocation(loc.x, loc.y);
			update = true;
		}
	});

	socket.on('disconnect', function () {
		console.log('disconnected');
		removeUser();
	});

	function removeUser() {
		var idx = users.indexOf(user);
		if (idx) {
			users.splice(idx, 1);
			update = true;
		}
	}

});

setInterval(function () {
	if (!update)
		return;	
	var data = { 
		at: (new Date).getTime() + 1000,
		users: _.map(users, function (u) { return { id: u.id, location: u.location } })
	};
	io.sockets.emit('update', data);
	update = false;
}, 1000);


