var _ = require('underscore')
	, loops = []
	, start = (new Date).getTime()
	, bpm = 66

loops.push({ start: 0
	, duration: 2 
	, selector: '#background'
	, animations: [ { start: 0
		, duration: 1 
		, keypoints: [ 
			 [0.5, { 'color': '#999', 'radius': 100 } ]
			, [0.5, { 'color': '#131013', 'radius': 10 } ]
			]
		}
	]
});


loops.push({ start: 0
	, duration: 1
	, selector: '.user-circle'
	, animations: [ { start: 0
		, duration: 0.9 
		, keypoints: [ 
			 [0.6, { opacity: 0, 'radius': 100 }, { type: 'inOut', fn: 'exp' } ]
			, [0.6, { opacity: 1, 'radius': 10 }, { type: 'inOut', fn: 'exp' } ]
			]
		}
	]
});

function setLoops() {
}

function sendLoops(to) {
	to.emit('loops', loops);
}

function sendLoopStats(to) {
	to.emit('loop-stats', { 'start': start, 'bpm': bpm });
}

module.exports = {
	register: function (app, io) {
		app.post('/loops', function (req, res) {
			console.dir(req.params);
			setLoops(req.params);
			sendLoops(io.sockets);
		});
		app.get('/loop-stats', function (req, res) {
			res.end(JSON.stringify({ 'start': start, 'bpm': bpm }));
		});
	},
	open: function (socket) {
		sendLoops(socket);
		sendLoopStats(socket);
		socket.on('getLoops', function () {
			sendLoops(socket);
		});
	}
};
