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

	var width, height;
	width = function () { return window.innerWidth / 2; };
	height = function () { return window.innerHeight / 2; };
	function init(objCanvas) {
		if (objCanvas) {
			jc.start('canvas', objCanvas, true);
			width = function () { return $(objCanvas).attr('width'); };
			height = function () { return $(objCanvas).attr('height'); };
		}
		else {
			jc.start('canvas', true);
			var $canvas = $('#canvas');
			$canvas.attr('height', height());
			$canvas.attr('width', width());
		}
		background = jc.rect(0,0, width(), height(), '#131013', true).id('background');
		if (onInit)
			onInit();
	}
	$(window).resize(function () {
		jc.clear();
		init();
	});

	$(function () {
		var $container = $('#container');
		stats.bpm = Number($container.data('bpm'));
		stats.start = Number($container.data('start'));
	});

	io.socket.on('loop-stats', function (_stats) {
		stats = _stats;
	});
	
	function scheduleLoop() {
		var nextBeat
			, length = mspb() * 4
			, now = io.currentTime()
			, at = Number(stats.start) + Math.ceil((now - stats.start) / length) * length
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
	var color = 0
		, colors = [ 'rgb(0,0,255)'
		, 'rgb(255, 80, 0)'
		, 'rgb(255, 255, 0)' 
		, 'rgb(0, 255, 0)'
		, 'rgb(0, 255, 221)'
		, 'rgb(255, 0, 255)'
		, 'rgb(117, 255, 4)'
		, 'rgb(255, 0, 28)'
		]
	$(function () {
		var contain = $('#container')
		color = contain.data('color')
		scene = contain.data('scene')
	});
	function currentColor() {
		if (color < 0)
			return colors[0];
		if (color >= colors.length)
			return colors[colors.length - 1];
		return colors[color];
	}
	io.socket.on('trigger-color', function (data) {
		color = data.color;
	});
	return {
		getBackground: function () { return background; }
		, onInit: function (ev) { onInits.push(ev); }
		, onLoop: function (ev) { onLoops.push(ev); }
		, stats: stats
		, init: init
		, width: function () { return width(); }
		, height: function () { return height(); }
		, currentColor: currentColor
	};
});
