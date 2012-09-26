define(['socket.io'], function () {
	var socket = io.connect('/')
		, latency = 0
		, timeOffset = 0
		, currentTime = function () { return (new Date).getTime() - timeOffset; }
	
	socket.on('ping', function (response) {
		latency = ((new Date).getTime() - response.yours.time ) / 2;
		timeOffset = (new Date).getTime() - (response.now + latency);
		setTimeout(sendPing, 2000);
	});
	function sendPing() {
		socket.emit('ping', { time: (new Date).getTime() });
	}
	sendPing();

	return { socket: socket
		, currentTime: currentTime
	};
});
