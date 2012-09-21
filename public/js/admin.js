require([
		'connector'
		, 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
		, '/js/underscore-min.js'
		], function (io) {
	var t = require(['/js/bootstrap.js'], function () {
	});
	$(function () {
		$('a.async').click(function (e) {
			var btn = $(this)
			if (e.preventDefault)
				e.preventDefault();
			$.get(btn.attr('href'));
			return false;
		});

		var preventChange = 0
		$('#bpm-input').change(function () {
			var field = $(this)
				, val = field.val()
				, stats = { bpm: Number(val) }
			if (tap_start)
				stats.start = tap_start;
			if (preventChange)
				clearTimeout(preventChange);
			preventChange = setTimeout(function () {
				io.socket.emit('setLoopStats', stats);
			}, 1000);
		});

		var tap_start
			, tap_prev
			, taps = []
			, reset = 0
		$('#bpm-tap').click(function (e) {
			if (e.preventDefault)
				e.preventDefault();
			var btn = $(this)
				, now = (new Date).getTime()
			
			if (!tap_start) {
				btn.removeClass('btn-success');
				btn.addClass('btn-danger');
				tap_start = io.currentTime();
				tap_prev = tap_start;
			}
			else {
				taps.push(now - tap_prev);
				if (taps.length >= 4) {
					var avg = _.reduce(taps, function (memo, num) { return memo + num; }, 0) / taps.length
						, old = $('#bpm-input').val()
						, newVal = Math.floor(60000 / avg);
					if (newVal + '' == old) {
						return false;
					}

					$('#bpm-input').val(newVal);
				}
				
				tap_prev = now;
			}

			if (reset)
				clearTimeout(reset);
			reset = setTimeout(function () {
				btn.addClass('btn-success');
				btn.removeClass('btn-danger');
				tap_start = undefined;
				tap_prev = undefined;
				taps = [];
			}, 4000);

			return false;
		});
	});
});
