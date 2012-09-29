define([ 'render-v2'
	, 'jc'
	], function (render) {
	var boom
	function x(x) {
		return x * render.width();
	}
	function y(x) {
		return x * render.height();
	}

	function scale() {
		return 1 / (window.innerWidth / render.width());
	}

	function loop(nr, len) {
		if (!boom) { return; }
		if (nr % 2 == 0) { return; }
		boom.animate({ radius: 1000, opacity: 0 }, len * 1.8, { type: 'out', fn: 'exp' }, function () {
			boom.animate({ radius: 0.01, opacity: 1 }, 1);
		});
	}
	function update(create) {
		if (create)
			boom = jc.circle(x(0.66), y(0.66), 0.01, render.currentColor(), true)
				.name('boom')
		else
			jc('.boom').del();
	}
	function updateColor(dur) {
		jc('.boom').animate({ color: render.currentColor() }, dur);
	}

	return {
		loop: loop
	, update: update
	, updateColor: updateColor
	};
});
