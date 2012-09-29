define([ 'render-v2'
	, 'jc'
	], function (render) {
	var p1, p2, p3
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
		if (!p1 || !p2 || !p3) { return; }
		if (nr % 2 != 0) { return; }
		var px = 0.3 + Math.random() * 0.4
			, py = 0.3 + Math.random() * 0.4
			, vx = 0.5 - px
			, vy = 0.5 - py
		p1.animate({ radius: 400, opacity: 0 }, len / 0.55, { type: 'out', fn: 'exp' }, function () {
			this.animate({ radius: 0.01, opacity: 0.5, x: x(px), y: y(py) }, 1);
		});
		setTimeout(function () {
			p2.animate({ radius: 350, opacity: 0 }, len / 0.6, { type: 'out', fn: 'exp' }, function () {
				this.animate({ radius: 0.01, opacity: 0.7, x: x(px + 0.25 * vx), y: y(py + 0.25 * vy)}, 1);
			});
		}, (len / 8));
		setTimeout(function () {

			p3.animate({ radius: 300, opacity: 0 }, len / 0.65, { type: 'out', fn: 'exp' }, function () {
				this.animate({ radius: 0.01, opacity: 0.9, x: x(px + 0.5 * vx), y: y(py + 0.5 * vy) }, 1);
			});
		}, 2 * (len / 8));
	}
	var loaded = false;
	function update(create) {
		jc('.pond').del();
		loaded = false;
		if (create) {
			var px = 0.3 + Math.random() * 0.4
				, py = 0.3 + Math.random() * 0.4
				, vx = 0.5 - px
				, vy = 0.5 - py
			p1 = jc.circle(x(px), y(py), 0.01, render.currentColor(), true)
				.name('pond')
				.animate({ opacity: 0.5 }, 1)
			p2 = jc.circle(x(px + 0.25 * vx), y(py + 0.25 * vy), 0.01, render.currentColor(), true)
				.name('pond')
				.animate({ opacity: 0.7 }, 1)
			p3 = jc.circle(x(px + 0.5 * vx), y(py + 0.5 * vy), 0.01, render.currentColor(), true)
				.name('pond')
				.animate({ opacity: 0.9 }, 1)
			loaded = true;
		}
	}
	function updateColor(dur) {
		jc('.pond').animate({ color: render.currentColor() }, dur);
	}

	return {
		loop: loop
	, update: update
	, updateColor: updateColor
	, isLoaded = function () { return loaded; }
	};
});
