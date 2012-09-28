define(['connector'
	, 'render-v2'
	, 'jquery'
	, 'jc' ]
	, function (io, render) {
	var color = 0
		, scene = 1 
		, colors = [ '#F00', '#0F0', '#00F' ]
		, scenes = [ 0, 1, 2 ]
		, currentColor = function () {
			if (color < 0)
				return colors[0];
			if (color >= colors.length)
				return colors[colors.length - 1];
			return colors[color];
		}

	io.socket.on('trigger-scene', function (data) {
		var delay = data.at - io.currentTime();
		scene = data.scene;
		if (delay < 10) {
			drawScenes();
		}
		else {
			setTimeout(drawScenes, delay);
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
		color = data.color;
		if (delay < 10) {
			jc('.baseline').animate({ color: currentColor() }, 1);
		}
		else if (delay < fade) {
			jc('.baseline').animate({ color: currentColor() }, delay);
		}
		else {
			setTimeout(function () {
				jc('.baseline').animate({ color: currentColor() }, fade);
			}, delay - fade);
		}
	});
	
	$(function () {
		var contain = $('#container')
		color = contain.data('color')
		scene = contain.data('scene')
		console.log('Current color: ' + color);
		console.log('Current scene: ' + scene);
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
	var helan
		, halvan
		, left = []
		, right = []
	//en fjärde del, åttondels paus, åttondel + fjärdedel, fjärdedel pause
	function baseline(nr, len) {
		if (!helan || !halvan)
			return;
		helan.animate({ radius: 400 * scale(), opacity: 0 }, len / 1.5, { type: 'inOut', fn: 'exp' }, function() {
			this.animate({ radius: 0.01, opacity: 0.5 });
		});
		setTimeout(function () {
			halvan.animate({ radius: 300 * scale(), opacity: 0 }, len / 1.5, { type: 'inOut', fn: 'exp' }, function() {
				this.animate({ radius: 0.01, opacity: 0.5 });
			});
		}, (len * (3 / 8)));
	}

	function sideSwipe(nr, len, c) {
		var run = function () {
			if (!left[c] || !right[c])
				return;
			left[c].animate({ radius: 100 * scale(), opacity: 0 }, len / 4, { type: 'inOut', fn: 'exp' }, function () {
				this.animate({ radius: 0.01, opacity: 0.5 });
			});
			setTimeout(function () {
				right[c].animate({ radius: 100 * scale(), opacity: 0 }, len / 4, { type: 'inOut', fn: 'exp' }, function () {
					this.animate({ radius: 0.01, opacity: 0.5 });
				});
			}, len / 8);
		}
		if (c == 0)
			run();
		else {
			setTimeout(run, len * ( c / 4 ));
		}
	}

	function markers(len) {
		jc('.marker').animate({ color: 'rgba(231,231,231,0)' }, len / 4, function () {
			this.animate({ color: 'rgba(231,231,231,1)' }, len / 4, function () {
				/*this.animate({ color: 'rgba(231,231,231,0)' }, len / 4, function () {
					this.animate({ color: 'rgba(231,231,231,1)' }, len / 4, function () {
					});
				});*/
			});
		});
	}

	function run () {
		render.onLoop(function (nr, len) {
			baseline(nr, len);
			for (var i = 0; i < 4; i++) {
				sideSwipe(nr, len, i);
			}
			markers(len);
			setTimeout(function () {
				markers(len);
			}, len / 2);
			if (false && render.getBackground()) {
				render.getBackground().animate({ color: '#161316' }, len / 2, function () {
					render.getBackground().animate({ color: '#131013' }, len / 2);
				});
			}
		});
	}

	function drawScenes() {
		for (var i in scenes) {
			if (i == scene) {
				drawScene(i);
			}
			else {
				jc('.scene' + i).del();
			}
		}
	}

	function drawScene(nr) {
		if (nr == 1) {
			helan = drawCircle(x(0.75), y(0.5), currentColor(), 0.01, 'helan', 'scene1');
			helan.animate({ opacity: 0.5 });
			halvan = drawCircle(x(0.25), y(0.5), currentColor(), 0.01, 'halvan', 'scene1');
			halvan.animate({ opacity: 0.5 });
		}
		else {
			left = [];
			left.push(drawCircle(x(0.1), y(0.1), currentColor(), 0.01, 'left01', 'scene2'));
			left.push(drawCircle(x(0.1), y(0.9), currentColor(), 0.01, 'left04', 'scene2'));
			left.push(drawCircle(x(0.1), y(0.3333), currentColor(), 0.01, 'left02', 'scene2'));
			left.push(drawCircle(x(0.1), y(0.6667), currentColor(), 0.01, 'left03', 'scene2'));

			right = [];
			right.push(drawCircle(x(0.9), y(0.9), currentColor(), 0.01, 'right04', 'scene2'));
			right.push(drawCircle(x(0.9), y(0.1), currentColor(), 0.01, 'right01', 'scene2'));
			right.push(drawCircle(x(0.9), y(0.6667), currentColor(), 0.01, 'right03', 'scene2'));
			right.push(drawCircle(x(0.9), y(0.3333), currentColor(), 0.01, 'right02', 'scene2'));
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
