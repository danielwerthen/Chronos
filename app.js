
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
	io.sockets.emit('flash', { at: (new Date).getTime() + 500 });
	res.end(JSON.stringify({'result': 'ok'}));
});

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

