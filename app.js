
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
	} 
	catch (e) {
	}
	res.redirect('/admin');
});

var settings = { delay: 500, open: 50, close: 250 };
app.locals.settings = settings;

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
	ping.respond(socket);
	time.server(socket);
	socket.on('disconnect', function () {
		/*var idx = players.indexOf(player);
		if (!idx)
			players.splice(idx, 1);*/
	});
});

