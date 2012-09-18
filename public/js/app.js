(function () {
	var socket = io.connect('/')
		, latency = 0
		, timeOffset = 0
		, currentTime = function () { return (new Date).getTime() - timeOffset; }
		, $canvas = $('#canvas')

	function resize() {
		$canvas.attr('height', window.innerHeight);
		$canvas.attr('width', window.innerWidth);
	}
	resize();
	$(window).resize(resize);

	ping(socket, function (delay) {
		latency = delay;
	});
	time(socket, function (serverNow) {
		timeOffset = (new Date).getTime() - (serverNow + latency);
	});

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
					width = window.innerWidth,
					height = window.innerHeight,
					//color = "rgba("+r+", "+g+", "+b+", 0.5)",
					color = '#131013',
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

	socket.on('setPulse', function (data) {
		pulse = data;
	});

	function flash(open, close) {
		open = open || 50;
		canvas.animate({color: '#FFF'}, open, function () {
			canvas.animate({color: '#131013'}, close);
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
		for (var e in active) {
			if (active[e])
				active[e].markAsDeleted = true;
		}
		for (var e in users) {
			var usr = users[e];
			if (!active[usr.id] || !active[usr.id].circle) {
				active[usr.id] = {
					circle: makeCircle(usr.location.x * window.innerWidth, usr.location.y * window.innerHeight)
				};
			}
			else {
				var circle = active[usr.id].circle
					, center = circle.getCenter()
				active[usr.id].markAsDeleted = false;

				circle.animate({ x: usr.location.x * window.innerWidth, y: usr.location.y * window.innerHeight }, 500);
			}
		}
		for (var e in active) {
			if (active[e] && active[e].markAsDeleted) {
				if (active[e].circle)
					active[e].circle.del();
				active[e] = undefined;
			}
		}
	}

	function makeCircle(x,y, color) {
		var circle = jc.circle(x,y,10, color || '#FFFFFF', true);
		pulseAnima(circle);
		return circle;
	}

	var pulse = 1000;
	function pulseAnima(circle) {
		circle.animate({ radius: 100, opacity:0}, pulse, {type: 'inOut', fn: 'exp'}, function () {
			circle._radius = 10;
			circle._opacity = 1;
			pulseAnima(circle);
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
