var _ = require('underscore');

exports.server = function (socket, measurement) {
	var pings = [];
	socket.on('ping', function (data) {
		var delay = (new Date).getTime() - data.time;
		pings.push(delay);
		pings = pings.slice(0, 5);
		if (measurement)
			measurement(_.max(pings));
	});
	setInterval(function () {
		socket.emit('ping', { time: (new Date).getTime() });
	}, 1000);
};

exports.respond = function (socket, onPinged) {
	socket.on('ping', function (data) {
		socket.emit('ping', data);
		if (onPinged)
			onPinged();
	});
};
