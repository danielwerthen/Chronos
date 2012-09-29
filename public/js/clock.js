define([ 'render-v2'
	, 'jc'
	], function (render) {
	var tr, tl, br, bl
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
		if (!tr || !tl || !bl || !br) { return; }
		tr.animate({ opacity: 1 }, len / 8, function () {
			this.animate({ opacity: 0 }, len / 8);
		});
		setTimeout(function () {
			tl.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, (len / 8));
		setTimeout(function () {
			bl.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, 2 * (len / 8));
		setTimeout(function () {
			br.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, 3 * (len / 8));
		setTimeout(function () {
			tr.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, 4 * (len / 8));
		setTimeout(function () {
			tl.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, 5 * (len / 8));
		setTimeout(function () {
			bl.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, 6 * (len / 8));
		setTimeout(function () {
			br.animate({ opacity: 1 }, len / 8, function () {
				this.animate({ opacity: 0 }, len / 8);
			});
		}, 7 * (len / 8));
	}

	function drawRect(x, y, w, h, color) {
		return jc.rect(x,y, w, h, color || '#FFF', true)
			.name('clock');
	}

	function update(create) {
		if (create) {
			tr = drawRect(x(0), y(0), render.width() * 0.3, render.height() * 0.3, render.currentColor())
				.animate({ opacity: 0 }, 1)
			tl = drawRect(x(0.7), y(0), render.width() * 0.3, render.height() * 0.3, render.currentColor())
				.animate({ opacity: 0 }, 1)
			br = drawRect(x(0), y(0.7), render.width() * 0.3, render.height() * 0.3, render.currentColor())
				.animate({ opacity: 0 }, 1)
			bl = drawRect(x(0.7), y(0.7), render.width() * 0.3, render.height() * 0.3, render.currentColor())
				.animate({ opacity: 0 }, 1)
		}
		else {
			jc('.clock').del();
		}
	}

	function updateColor(duration) {
		jc('.clock').animate({ color: render.currentColor() }, duration);
	}
	return {
		loop: loop
	, update: update
	, updateColor: updateColor
	};
});
