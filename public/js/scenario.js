define(['connector'
	, 'render-v2'
	, 'jc' ]
	, function (io, render) {
	function x(x) {
		return x * window.innerWidth;
	}
	function y(x) {
		return x * window.innerHeight;
	}

	function drawCircle(x, y, color, rad, id, name) {
		return jc.circle(x,y, rad || 10, color || '#FFF', true)
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
		helan.animate({ radius: 400, opacity: 0 }, len / 1.5, { type: 'inOut', fn: 'exp' }, function() {
			this.animate({ radius: 1, opacity: 0.5 });
		});
		setTimeout(function () {
			halvan.animate({ radius: 300, opacity: 0 }, len / 1.5, { type: 'inOut', fn: 'exp' }, function() {
				this.animate({ radius: 1, opacity: 0.5 });
			});
		}, (len * (3 / 8)));
	}

	function sideSwipe(nr, len, c) {
		var run = function () {
			left[c].animate({ radius: 100, opacity: 0 }, len / 4, { type: 'inOut', fn: 'exp' }, function () {
				this.animate({ radius: 1, opacity: 0.5 });
			});
			setTimeout(function () {
				right[c].animate({ radius: 100, opacity: 0 }, len / 4, { type: 'inOut', fn: 'exp' }, function () {
					this.animate({ radius: 1, opacity: 0.5 });
				});
			}, len / 8);
		}
		if (c == 0)
			run();
		else {
			setTimeout(run, len * ( c / 4 ));
		}
	}

	render.onLoop(function (nr, len) {
		baseline(nr, len);
		for (var i = 0; i < 4; i++) {
			sideSwipe(nr, len, i);
		}
	});
	
	render.onInit(drawObjects);
	function drawObjects() {
		helan = drawCircle(x(0.75), y(0.5), '#003780', 1, 'helan', 'baseline');
		helan.animate({ opacity: 0.5 });
		halvan = drawCircle(x(0.25), y(0.5), '#003780', 1, 'halvan', 'baseline');
		halvan.animate({ opacity: 0.5 });

		left = [];
		left.push(drawCircle(x(0.1), y(0.1), 'rgba(96, 35, 123, 0.5)', 1, 'left01', 'side-swipe'));
		left.push(drawCircle(x(0.1), y(0.9), 'rgba(96, 35, 123, 0.5)', 1, 'left04', 'side-swipe'));
		left.push(drawCircle(x(0.1), y(0.3333), 'rgba(96, 35, 123, 0.5)', 1, 'left02', 'side-swipe'));
		left.push(drawCircle(x(0.1), y(0.6667), 'rgba(96, 35, 123, 0.5)', 1, 'left03', 'side-swipe'));

		right = [];
		right.push(drawCircle(x(0.9), y(0.9), 'rgba(96, 35, 123, 0.5)', 1, 'right04', 'side-swipe'));
		right.push(drawCircle(x(0.9), y(0.1), 'rgba(96, 35, 123, 0.5)', 1, 'right01', 'side-swipe'));
		right.push(drawCircle(x(0.9), y(0.6667), 'rgba(96, 35, 123, 0.5)', 1, 'right03', 'side-swipe'));
		right.push(drawCircle(x(0.9), y(0.3333), 'rgba(96, 35, 123, 0.5)', 1, 'right02', 'side-swipe'));

	}
});
