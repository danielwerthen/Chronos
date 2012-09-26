var _ = require('underscore')
	, loops = []
	, loopStats = { start: (new Date).getTime(), bpm: 100 }
	, objects = []

objects.push({ name: 'user-circle'
	, type: 'circle'
	, local: { x: 0.2, y: 0.2 }
	, constructor: [ 0.2, 0.2, 10, '#FFF', true ]
	});

objects.push({ name: 'user-circle'
	, type: 'circle'
	, local: { x: 0.8, y: 0.8 }
	, constructor: [ 0.8, 0.8, 10, '#FFF', true ]
	});

loops.push({ start: 0
	, duration: 4 
	, selector: '#background'
	, animations: [ { start: 0
		, duration: 4 
		, keypoints: [ 
			 [0.5, { 'color': '#262326', 'radius': 100 } ]
			, [1, { 'color': '#131013', 'radius': 10 } ]
			]
		}
	]
});


loops.push({ start: 0
	, duration: 2
	, selector: '.user-circle'
	, animations: [ { start: 0
		, duration: 2
		, keypoints: [ 
			 [0.95, { opacity: 0, 'radius': 100 }, { type: 'inOut', fn: 'exp' } ]
			, [0.95, { opacity: 1, 'radius': 10 }, { type: 'inOut', fn: 'exp' } ]
			]
		}
	]
});

loops.push({ start: 0
	, duration: 4
	, selector: '&star-gradient'
	, animations: [ { start: 0
		, duration: 4
		, keypoints: [ 
			 [0.5, { r2: 40 }, { type: 'inOut', fn: 'exp' } ]
			, [0.95, { r2: 30 }, { type: 'inOut', fn: 'exp' } ]
			]
		}
	]
});

function setLoops(_loops) {
	loops = _loops;
	sendLoops(sockets);
}

function setLoopStats(_loopStats) {
	if (_loopStats.start) {
		loopStats.start = _loopStats.start;
	}
	if (_loopStats.bpm) {
		loopStats.bpm = _loopStats.bpm;
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

module.exports = {
	register: function (app, io) {
		app.locals.loops = loops;
		app.locals.loopStats = loopStats;
		app.locals.objects = objects;
		app.get('/admin', function (req, res) {
			res.render('admin');
		});
		app.post('/loops', function (req, res) {
			console.dir(req.params);
			setLoops(req.params);
			sendLoops(io.sockets);
		});
		app.get('/loop-stats', function (req, res) {
			res.end(JSON.stringify({ 'start': start, 'bpm': bpm }));
		});
		sockets = io.sockets;
	},
	open: function (socket) {
		sendObjects(socket);
		sendLoops(socket);
		sendLoopStats(socket);
		socket.on('getLoops', function () {
			sendLoops(socket);
		});
		socket.on('getLoopStats', function () {
			sendLoopStats(socket);
		});
		socket.on('getObjects', function () {
			sendObjects(socket);
		});
		socket.on('setLoops', function (_loops) {
			setLoops(_loops);
		});
		socket.on('setLoopStats', function (_stats) {
			setLoopStats(_stats);
		});
		socket.on('setObjects', function (_objects) {
			setObjects(_objects);
		});
	}
};
