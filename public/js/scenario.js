define(['connector'
	, 'render-v2'
	, 'clock'
	, 'boom'
	, 'two-step'
	, 'pond'
	, 'jquery'
	, 'jc' ]
	, function (io, render, clock, boom, two, pond) {
	var scene = 1 
		, scenes = [ clock, boom, pond, two ]

	io.socket.on('trigger-scene', function (data) {
		var delay = data.at - io.currentTime();
		if (scene === data.scene) { return; }
		if (delay < 10) {
			scene = data.scene;
			drawScenes();
		}
		else {
			setTimeout(function () {
				scene = data.scene;
				drawScenes();
			}, delay - 50);
		}
	});

	io.socket.on('trigger-push', function (data) {
		setTimeout(function () {
		var boom = jc.circle(data.point.x * render.width(), data.point.y * render.height(), 0.01, '#FFF', true)
			.animate({ radius: 300 * scale(), opacity: 0 }, 1600, { type: 'inOut', fn: 'exp' }, function () {
				this.del();
			});
		}, data.at - io.currentTime());
	});

	io.socket.on('trigger-color', function (data) {
		var delay = data.at - io.currentTime()
			, fade = data.fade * 1000;
		if (delay < 10) {
			updateColor(1);
		}
		else if (delay < fade) {
			updateColor(delay);
		}
		else {
			setTimeout(function () {
				updateColor(fade);
			}, delay - fade);
		}
	});
	
	
	function x(x) {
		return x * render.width();
	}
	function y(x) {
		return x * render.height();
	}

	function scale() {
		return 1 / (window.innerWidth / render.width());
	}

	function drawCircle(x, y, color, rad, id, name) {
		return jc.circle(x,y, (rad || 10) * scale(), color || '#FFF', true)
			.id(id)
			.name(name);
	}
	//en fjärde del, åttondels paus, åttondel + fjärdedel, fjärdedel pause

	function markers(len) {
		jc('.marker').animate({ color: 'rgba(231,231,231,0)' }, len / 4, function () {
			this.animate({ color: 'rgba(231,231,231,1)' }, len / 4, function () {
			});
		});
	}

	function run () {
		render.onLoop(function (nr, len) {
			runScene(nr, len);
			markers(len);
			setTimeout(function () {
				markers(len);
			}, len / 2);
		});
	}

	function drawScenes() {
		for (var i in scenes) {
			scenes[i].update(i == scene);
		}
	}

	function runScene(nr, len) {
		if (scene >= 0 && scene < scenes.length) {
			scenes[scene].loop(nr, len);
		}
	}

	function updateColor(dur) {
		if (scene >= 0 && scene < scenes.length) {
			scenes[scene].updateColor(dur);
		}
	}

	render.onInit(drawObjects);
	function drawObjects() {
		drawScenes();
	}

	return {
		run: run
	};
});
