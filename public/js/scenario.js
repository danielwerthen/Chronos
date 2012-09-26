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
	//en fjärde del, åttondels paus, åttondel + fjärdedel, fjärdedel pause
	function baseline(nr, len) {
		helan.animate({ radius: 400, opacity: 0 }, len / 1.5, { type: 'inOut', fn: 'exp' }, function() {
			this.animate({ radius: 0, opacity: 0.5 });
		});
		setTimeout(function () {
			halvan.animate({ radius: 300, opacity: 0 }, len / 1.5, { type: 'inOut', fn: 'exp' }, function() {
				this.animate({ radius: 0, opacity: 0.5 });
			});
		}, (len * (3 / 8)));
	}

	render.onLoop(function (nr, len) {
		baseline(nr, len);
	});
	
	render.onInit(drawObjects);
	function drawObjects() {
		helan = drawCircle(x(0.75), y(0.5), '#003780', 0, 'helan', 'baseline');
		helan.animate({ opacity: 0.5 });
		halvan = drawCircle(x(0.25), y(0.5), '#003780', 0, 'halvan', 'baseline');
		halvan.animate({ opacity: 0.5 });
	}
});
