
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

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server);

var players = [];
io.sockets.on('connection', function (socket) {
	var player = { 
		delay: 0
		, setColor: function (col) { socket.emit('color', [ col ]); } };
	ping.server(socket, function (_delay) {
		player.delay = _delay;
	});
	players.push(player);
	socket.on('disconnect', function () {
		var idx = players.indexOf(player);
		if (!idx)
			players.splice(idx, 1);
	});
});

var schedule = [];
for (var i = 0; i < 100; i += 1) {
	var col = Math.sin(i / 100 * Math.PI) * 255.0;
	schedule.push({ time: 250, color: col });
}

function execute(i) {
	var next = {};
	if (i >= schedule.length)
		i = 0;
	next = schedule[i];
	for (var idx in players) {
		var p = players[idx];

		setTimeout(function () {
			p.setColor(next.color);
		}, next.time - p.delay)
	}
	_.delay(function () { execute(i + 1); }, next.time);
}
execute(0);

