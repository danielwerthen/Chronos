var _ = require('underscore')
	, currentTime = function () { return (new Date).getTime(); }

module.exports = {
	open: function (socket) {
		socket.on('ping', function (data) {
			socket.emit('ping', { now: currentTime(), yours: data});
		});
	},
	currentTime: currentTime
};
