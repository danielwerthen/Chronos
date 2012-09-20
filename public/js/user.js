define([ 'connector'
		, 'render'
		, 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js' ]
	, function (io, render) {
	function x(x) {
		return x * window.innerWidth;
	}
	function y(x) {
		return x * window.innerHeight;
	}

	function move(cir) {
		cir.animate({x: x(Math.random()), y: y(Math.random())}, 4000, { type: 'inOut', fn: 'exp' }, function () {
			move(this);
		});
	}
	render.onActive(function () {
		var circle = render.createCircle(x(0.5),y(0.5), '#EEE', 10);
		
		//move(circle);
	});
});
