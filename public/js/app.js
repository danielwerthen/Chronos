(function () {
	var socket = io.connect('/')
		, latency = 0
		, timeOffset = 0
		, currentTime = function () { return (new Date).getTime() - timeOffset; }
		, display = document.getElementById('display')

	/*setInterval(function () {
		display.innerText = '' + (new Date) + ' ms: ' + (new Date).getTime() + '\n' + new Date(currentTime()) + ' ms: ' + currentTime() + ' offsetted by: ' + timeOffset + 'ms, latency: ' + latency + 'ms';
	}, 200);*/
	
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
					width = 300,
					height = 150,
					//color = "rgba("+r+", "+g+", "+b+", 0.5)",
					color = '#000',
					filled = true

		return jc.rect(0,0, width, height, color, filled);
			/*.animate({color:'#000000'}, 200, function () {
				this.del();
			});*/
	}

	socket.on('flash', function (data) {
		var when = data.at - currentTime()
		if (when < 1)
			return;
		if (when < 5)
			flash(data.open, data.close);
		else
			setTimeout(function () { flash(data.open, data.close) }, when);
	});

	function flash(open, close) {
		open = open || 50;
		canvas.animate({color: '#FFF'}, open, function () {
			canvas.animate({color: '#000'}, close);
		});
	}

	socket.on('update', function (data) {
		var when = data.at - currentTime()
		if (when < 5)
			update(data.users);
		else
			setTimeout(function () { update(data.users) }, when);
	});

	var active = {}

	function update(users) {
		for (var e in users) {
			var usr = users[e];
			if (!active[usr.id] || !active[usr.id].circle) {
				console.log(usr);
				active[usr.id] = {
					circle: makeCircle(usr.location.x * 300, usr.location.y * 150)
				};
			}
			else {
				console.log('x: ' + usr.location.x, 'y: ' + usr.location.y);
				return;
				var circle = active[usr.id].circle
					, center = circle.getCenter()

				circle.animate({ x: usr.location.x * 300, y: usr.location.y * 150 }, 500);
				console.log('x: ' + center.x, 'y: ' + center.y);
			}
		}
	}

	function makeCircle(x,y, color) {
		var circle = jc.circle(x,y,1, color || 'rgba(255,255,255,0.5)', true);
		pulse(circle);
		return circle;
	}

	function pulse(circle) {
		circle.animate({ radius: 100, opacity:0}, 1500, function () {
			circle._radius = 1;
			circle._opacity = 0.5;
			pulse(circle);
		});
	}

	var canvas
		, moveTo

	function start() {
		jc.start(idCanvas, true);
		canvas = drawRect();
		canvas.click(function (point) {
			moveTo = { x: point.x / window.innerWidth, y: point.y / window.innerHeight };
			socket.emit('move', moveTo);
		});

	}

	var interval_1=0;
	document.onload = start()
})();
