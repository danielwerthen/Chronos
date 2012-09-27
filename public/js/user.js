define([ 'connector'
		, 'render-v2'
		, 'scenario'
		, 'jc'
		, 'jquery' ]
	, function (io, render, scene) {
	$(function () {
		var needLoad = true;
		render.onInit(function () {
			if (needLoad)
				startLoader();
			$(window).click(function (e) {
				jc.circle(e.offsetX / 2, e.offsetY / 2, 10, '#DDD', true).name('marker');
			});
		});
		render.init();
		io.onEstablished(function () {
			needLoad = false;
			loading.animate({ color: 'rgba(231, 231, 231, 0)' }, 1500);
			scene.run();
		});


		var loading;
		function startLoader() {
			loading = jc.circle(0.5 * render.width(), 0.5 * render.height(), 0.01, '#DDD', true)
			function loadPulse() {
				loading.animate({ radius: 500, opacity: 0 }, 1000, function () {
					this.animate({ radius: 0.01, opacity: 1 }, 1, function () {
					});
					setTimeout(loadPulse, 500);
				});
			}
			loadPulse();
		}
	});
});
