define([ 'connector'
		, 'render-v2'
		, 'jquery' ]
	, function (io, render) {
	function x(x) {
		return x * window.innerWidth;
	}
	function y(x) {
		return x * window.innerHeight;
	}

	render.onLoop(function (nr, len) {
		console.log(len);
		if (!render.getBackground())
			return;
		if (nr % 2 == 0) {
			render.getBackground().animate({ color: '#262326' }, len / 2, function () {
				render.getBackground().animate({ color: '#131013' }, len / 2);
			});
		}
	});

	render.onInit(function () {
		//var circle = render.createCircle(x(0.5),y(0.5), '#EEE', 10);
		/*var star = render.createStar(x(0.2), y(0.8));
		setInterval(function () {
			star.rotate(-1, 'center');
		}, 50);
		star.translate(-50,-50);*/
		//star.translateTo(100,100);
		//star.translate(x(Math.random()), y(Math.random()), 2000);

		
		//move(circle);
	});
});
