define(['connector'
	, 'render-v2'
	, 'jquery'
	, 'jc' ]
	, function (io, render) {
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
				this.animate({ color: 'rgba(231,231,231,0)' }, len / 4, function () {
					this.animate({ color: 'rgba(231,231,231,1)' }, len / 4, function () {
					});
				});
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
			if (false && render.getBackground()) {
				render.getBackground().animate({ color: '#161316' }, len / 2, function () {
					render.getBackground().animate({ color: '#131013' }, len / 2);
				});
			}
		});
	}
	
	render.onInit(drawObjects);
	function drawObjects() {
		helan = drawCircle(x(0.75), y(0.5), '#003780', 0.01, 'helan', 'baseline');
		helan.animate({ opacity: 0.5 });
		halvan = drawCircle(x(0.25), y(0.5), '#003780', 0.01, 'halvan', 'baseline');
		halvan.animate({ opacity: 0.5 });

		left = [];
		left.push(drawCircle(x(0.1), y(0.1), 'rgba(96, 35, 123, 0.5)', 0.01, 'left01', 'side-swipe'));
		left.push(drawCircle(x(0.1), y(0.9), 'rgba(96, 35, 123, 0.5)', 0.01, 'left04', 'side-swipe'));
		left.push(drawCircle(x(0.1), y(0.3333), 'rgba(96, 35, 123, 0.5)', 0.01, 'left02', 'side-swipe'));
		left.push(drawCircle(x(0.1), y(0.6667), 'rgba(96, 35, 123, 0.5)', 0.01, 'left03', 'side-swipe'));

		right = [];
		right.push(drawCircle(x(0.9), y(0.9), 'rgba(96, 35, 123, 0.5)', 0.01, 'right04', 'side-swipe'));
		right.push(drawCircle(x(0.9), y(0.1), 'rgba(96, 35, 123, 0.5)', 0.01, 'right01', 'side-swipe'));
		right.push(drawCircle(x(0.9), y(0.6667), 'rgba(96, 35, 123, 0.5)', 0.01, 'right03', 'side-swipe'));
		right.push(drawCircle(x(0.9), y(0.3333), 'rgba(96, 35, 123, 0.5)', 0.01, 'right02', 'side-swipe'));

	}

	return {
		run: run
	};
});
