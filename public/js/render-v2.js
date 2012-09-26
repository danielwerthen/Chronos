define(['connector'
	, '_'
	, 'jc'
	, 'jquery'
	], function (io) {
	var background
		, stats = { bpm: 100, start: (new Date).getTime() }

	function mspb() {
		return 60000 / (stats.bpm || 100);
	}

	function init() {
		jc.start('canvas', true);
		background = jc.rect(0,0, window.innerWidth, window.innerHeight, '#131013', true).id('background');
		if (onInit)
			onInit();
	}

	$(function () {
		var $canvas = $('#canvas');
		stats.bpm = Number($canvas.data('bpm'));
		stats.start = Number($canvas.data('start'));
		function resize() {
			$canvas.attr('height', window.innerHeight);
			$canvas.attr('width', window.innerWidth);
		}
		$(window).resize(function () {
			resize();
			jc.clear();
			init();
		});
		resize();
		init();
	});

	io.socket.on('loop-stats', function (_stats) {
		stats = _stats;
	});
	
	function scheduleLoop() {
		var nextBeat
			, length = mspb() * 4
			, now = io.currentTime()
			, at = stats.start + Math.ceil((now - stats.start) / length) * length
		setTimeout(function () {
			loopStart(Math.round((io.currentTime() - stats.start) / length), length);
		}, at - io.currentTime());
	}
	scheduleLoop();

	function loopStart(beatNr, length) {
		if (onLoop)
			onLoop(beatNr, length);
		setTimeout(function () {
			scheduleLoop();
		}, 10);
	}

	var onInits = [];
	function onInit() {
		for (var i in onInits) {
			onInits[i]();
		}
	}
	var onLoops = [];
	function onLoop(nr, len) {
		for (var i in onLoops) {
			onLoops[i](nr, len);
		}
	}
	return {
		getBackground: function () { return background; }
		, onInit: function (ev) { onInits.push(ev); }
		, onLoop: function (ev) { onLoops.push(ev); }
		, stats: stats
	};
});
