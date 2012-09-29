define(['socket.io', '_'], function () {
	var socket = io.connect('/')
		, latencies = []
		, latency = 0
		, timeOffset = 0
		, currentTime = function () { return (new Date).getTime() - timeOffset; }	
		, established = false
	
	socket.on('ping', function (response) {
		latency = ((new Date).getTime() - response.yours.time ) / 2;
		latencies.push(latency);
		if (latencies.length > 3)
			latencies.splice(0,1);
		var avg = _.reduce(latencies, function (memo, num) { return memo + num; }, 0) / latencies.length;
		timeOffset = (new Date).getTime() - (response.now + avg);
		if (latencies.length < 3)
			sendPing();
		else {
			setTimeout(sendPing, 7000);
			if (!established) {
				for ( var i in onEst) {
					onEst[i]();
				}
				established = true;
			}
		}
	});
	function sendPing() {
		socket.emit('ping', { time: (new Date).getTime() });
	}
	sendPing();

	var onEst = [];
	return { socket: socket
		, currentTime: currentTime
		, onEstablished: function (ev) { 
			if (established)
				ev();
			else
				onEst.push(ev); 
		}
	};
});
