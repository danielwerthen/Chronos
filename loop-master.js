var _ = require('underscore')
	, loopStats = { start: (new Date).getTime(), bpm: 100 }
	, scene = 1
	, color = 0

function setLoops(_loops) {
	loops = _loops;
	sendLoops(sockets);
}

function setLoopStats(_loopStats) {
	if (_loopStats.start) {
		loopStats.start = Number(_loopStats.start);
	}
	if (_loopStats.bpm) {
		loopStats.bpm = Number(_loopStats.bpm);
	}
	sendLoopStats(sockets);
}

function setObjects(_objs) {
	objects = _objs;
	sendObjects(sockets);
}

function sendObjects(to) {
	to.emit('objects', objects);
}

function sendLoops(to) {
	to.emit('loops', loops);
}

function sendLoopStats(to) {
	to.emit('loop-stats', loopStats);
}

var sockets

function triggerNewColor(newColor, fade, at) {
	color = newColor;
	console.log('New color: ' + newColor + ' in: ' + (at - (new Date).getTime()));
	sockets.emit('trigger-color', { color: newColor, fade: fade, at: at });
	clearInterval(sanity);
	clearTimeout(next);
	next = setTimeout(function () {
		sanity = setInterval(sanityCheck, 5000);
	}, (at - (new Date).getTime()) + 500);
}

function triggerNewScene(newScene, at) {
	scene = newScene;
	console.log('New scene: ' + newScene + ' in: ' + (at - (new Date).getTime()));
	sockets.emit('trigger-scene', { scene: newScene, at: at });
	clearInterval(sanity);
	clearTimeout(next);
	next = setTimeout(function () {
		sanity = setInterval(sanityCheck, 5000);
	}, (at - (new Date).getTime()) + 500);
}

function sanityCheck() {
	sockets.emit('sanity-check', { scene: scene, color: color });
}

var next = -1;
var sanity = setInterval(sanityCheck, 5000);

function scheduleLoop() {
	var nextBeat
		, length = (60000 / loopStats.bpm) * 4
		, now = (new Date).getTime()
		, at = Number(loopStats.start) + Math.ceil((now - loopStats.start) / length) * length
	setTimeout(function () {
		loopStart(Math.round((now - loopStats.start) / length), length);
	}, at - now);
}
scheduleLoop();

var onLoops = [];
function loopStart(beatNr, length) {
	for (var i in onLoops) {
		onLoops[i](beatNr, length);
	}
	setTimeout(function () {
		scheduleLoop();
	}, 10);
}

module.exports = {
	onLoop: function (ev) { onLoops.push(ev); },
	register: function (app, io) {
		app.locals.loopStats = function () { return loopStats; }
		app.locals.scene = function () { return scene; }
		app.locals.color = function () { return color; }
		app.get('/admin', function (req, res) {
			res.render('admin');
		});
		app.post('/time/:start', function (req, res) {
			if (Math.abs(req.params.start - loopStats.start) > 5) {
				console.log('Start will be shifted: ' + (req.params.start - loopStats.start) + 'ms');
				setLoopStats({ start: req.params.start });
			}
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ result: 'OK' }));
		});
		app.post('/scene/:scene/:at', function (req, res) {
			var nScene = Number(req.params.scene)
				, triggerAt = Number(req.params.at)
			triggerNewScene(nScene, triggerAt);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ result: 'OK' }));
		});
		
		app.post('/color/:color/:at/:fade', function (req, res) {
			var nColor = Number(req.params.color)
				, fade = Number(req.params.fade)
				, triggerAt = Number(req.params.at)
			triggerNewColor(nColor, fade, triggerAt);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ result: 'OK' }));
		});
		app.get('/loop-stats', function (req, res) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ 'start': start, 'bpm': bpm }));
		});
		sockets = io.sockets;
	},
	open: function (socket) {
		socket.on('getLoopStats', function () {
			sendLoopStats(socket);
		});
		socket.on('setLoopStats', function (_stats) {
			setLoopStats(_stats);
		});
	}
};
