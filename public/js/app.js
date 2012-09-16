(function () {
	var socket = io.connect('/')
		, latency = 0
		, timeOffset = 0
		, currentTime = function () { return (new Date).getTime() - timeOffset; }
		, display = document.getElementById('display')

	setInterval(function () {
		display.innerText = '' + (new Date) + ' ms: ' + (new Date).getTime() + '\n' + new Date(currentTime()) + ' ms: ' + currentTime() + ' offsetted by: ' + timeOffset + 'ms, latency: ' + latency + 'ms';
	}, 20);
	
	ping(socket, function (delay) {
		latency = delay;
	});
	time(socket, function (serverNow) {
		timeOffset = (new Date).getTime() - (serverNow + latency);
	});
	var canvas = document.getElementById('canvas');

	function ping(socket, measurement) {
		socket.on('ping', function (data) {
			var delay = (new Date).getTime() - data.time;
			if (measurement)
				measurement(delay / 2);
		});
		socket.emit('ping', { time: (new Date).getTime() });
		setInterval(function () {
			socket.emit('ping', { time: (new Date).getTime() });
		}, 2000);
	}

	function time(socket, measurement) {
		socket.on('time', function (data) {
			if (measurement)
				measurement(data.now);

		});
	}

	var idCanvas = 'canvas';
	function drawRect() {
			var r = Math.floor(Math.random() * (254)),
					g = Math.floor(Math.random() * (254)),
					b = Math.floor(Math.random() * (254)),
					width = 1000000,
					height = 1000000,
					//color = "rgba("+r+", "+g+", "+b+", 0.5)",
					color = '#000',
					filled = true,
					radius = 1;
		return jc.rect(0,50, width, height, color, filled);
			/*.animate({color:'#000000'}, 200, function () {
				this.del();
			});*/
	}

	function start() {
		jc.start(idCanvas, true);
		var rect = drawRect();
		rect.animate({color:'#aaa'}, 1000);
	}

	var interval_1=0;
	document.onload = start()
})();
