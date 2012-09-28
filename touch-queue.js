var clicks = []
	, queueLength = 8
	//, loop = require('./loop-master')

function push(len, stop) {
	if (clicks.length == 0) { return; }
	function push(delay) {
		if (clicks.length > 0) {
			var toPush = clicks.splice(0, 1)[0];
			sockets.emit('trigger-push', { point: toPush, at: (new Date).getTime() + delay });
		}
	}
	for (var i in clicks) {
		push(len + (i * (len / 8)));
	}
	if (stop) {
		setTimeout(function () {
			push(len, true);
		}, len);
	}
}

/*loop.onLoop(function (nr, len) {
	push(len / 2);
});*/

function limit(x) {
	if (x > 1)
		return 1;
	if (x < 0)
		return 0;
	return x;
}

var sockets;

module.exports = {
	register: function (app, io) {
		/*sockets = io.sockets;
		app.get('/click/:x/:y', function (req, res) {
			var x = limit(Number(req.params.x))
				, y = limit(Number(req.params.y))
			res.writeHead(200, { 'Content-Type': 'application/json' });
			if (clicks.length >= queueLength) {
				res.end(JSON.stringify({ result: 'FULL' }));
			}
			else if (_.isNumber(x) && _.isNumber(y)) {
				clicks.push({ x: x, y: y });
				res.end(JSON.stringify({ result: 'OK' }));
			}
			else {
				res.end(JSON.stringify({ result: 'ERROR' }));
			}
		});*/
	}, 
	open: function (socket) {
	}
};
