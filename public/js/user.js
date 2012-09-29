define([ 'connector'
		, 'render-v2'
		, 'scenario'
		, 'jc'
		, 'jquery' ]
	, function (io, render, scene) {
	var markers = [];
	io.socket.on('trigger-push', function (data) {
		setTimeout(function() {
			setTimeout(function () {
				for (var i in markers) {
					markers[i].piece.del();
				}
				markers = [];
			}, data.at - io.currentTime());
			/*try {
				for (var i in markers) {
					var marker = markers[i];
					if (Math.abs(marker.point.x - data.point.x) < 0.1
						&& Math.abs(marker.point.y - data.point.y) < 0.1) {
							markers.splice(i, 1);
							marker.piece.del();
					}
				}
			}
			catch (e) {
			}*/
		}, data.at - io.currentTime());
	});

	$(function () {
		var needLoad = true;
		render.onInit(function () {
			if (needLoad)
				startLoader();
			$(window).click(function (e) {
				if ( markers.length > 0) {
					return;
				}
				var x = e.pageX / 2
					, y = e.pageY / 2
					, marker = jc.circle(x, y, 10, '#DDD', true).name('marker')
					, point = { x: x / render.width(), y: y / render.height() }
				$.get('/click/' + point.x + '/' + point.y, function (res) {
					try {
						var result = res.result;
						if (result !== 'OK')
							marker.del();
						else
							markers.push({ piece: marker, point: point });
					}
					catch (e) {
						marker.del();
					}
				});
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
