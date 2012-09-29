define([ 'render-v2'
	, 'jc'
	], function (render) {
	var big, small
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
		if (!big || !small) { return; }
		big.animate({ radius: 600 * scale(), opacity: 0 }, len / 1.2, { type: 'out', fn: 'exp' }, function() {
			this.animate({ radius: 0.01, opacity: 0.5 });
		});
		setTimeout(function () {
			small.animate({ radius: 400 * scale(), opacity: 0 }, len / 1.5, { type: 'out', fn: 'exp' }, function() {
				this.animate({ radius: 0.01, opacity: 0.5 });
			});
		}, (len * (3 / 8)));
	}
	function update(create) {
		jc('.two-step').del();
		if (create) {
			big = jc.circle(x(0.6), y(0.4), 0.01, render.currentColor(), true)
				.name('two-step');
			small = jc.circle(x(0.4), y(0.6), 0.01, render.currentColor(), true)
				.name('two-step');
		}
	}
	function updateColor(dur) {
		jc('.two-step').animate({ color: render.currentColor() }, dur);
	}

	return {
		loop: loop
	, update: update
	, updateColor: updateColor
	};
});
