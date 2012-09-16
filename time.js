exports.server = function (socket) {
	setInterval(function () {
		socket.emit('time', { now: (new Date).getTime() });
	}, 2000);
};
