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
	}
	function update(create) {
		boom = 
	}
	function updateColor(dur) {
	}

	return {
		loop: loop
	, update: update
	, updateColor: updateColor
	};
});
