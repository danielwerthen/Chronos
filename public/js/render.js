define(['connector'
	, '/js/underscore-min.js'
	, '/js/jCanvaScript.1.5.15.js' 
	, 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
	], function (io) {
	var background
		, loops
		, stats
		, update = true
		, objects
		, activeObjects

	function init() {
		jc.start('canvas', true);
		background = jc.rect(0,0, window.innerWidth, window.innerHeight, '#131013', true).id('background');
		for (var i in onActive) {
			onActive[i]();
		}
	}

	$(function () {
		var $canvas = $('#canvas');
		function resize() {
			$canvas.attr('height', window.innerHeight);
			$canvas.attr('width', window.innerWidth);
		}
		$(window).resize(function () {
			resize();
			jc.clear();
			init();
			update = true;
		});
		resize();
		init();
	});

	io.socket.on('objects', function (_objects) {
		objects = _objects;
		update = true;
	});

	io.socket.on('loops', function (_loops) {
		loops = _loops;
		update = true;
	});

	io.socket.on('loop-stats', function (_stats) {
		stats = _stats;
		update = true;
	});

	setInterval(function () {
		if (!update) return;
		update = false;
		initLoops();
	}, 1000);

	var activeLoops = []
		, activeTimeouts = []
	function initLoops() {
		if (!loops || !stats) return;

		for (var i in activeObjects) {
			activeObjects[i].del();
		}
		activeObjects = [];

		for (var i in objects) {
			activeObjects.push(createObject(objects[i]));
		}

		for (var i in activeLoops) {
			clearInterval(activeLoops[i]);
		}
		activeLoops = [];
		for (var i in activeTimeouts) {
			clearTimeout(activeTimeouts[i]);
		}
		activeTimeouts = [];
		for (var i in loops) {
			var loop = loops[i];
			schedule(loop);
		}
	}

	function createObject(object) {
		var obj = jc[object.type].apply(jc, object.constructor);
		if (object.name)
			obj.name(object.name);
		if (object.id)
			obj.id(object.id)
		if (object.local)
			obj.animate({ x: object.local.x * window.innerWidth, y: object.local.y * window.innerHeight });
		return obj;	
	}

	function bpmInMs(bpm) {
		return 60000 / bpm;
	}

	function loopLength(loop, bpm) {
		return (loop.start + loop.duration) * bpmInMs(bpm);
	}

	function schedule(loop) {
		var at = stats.start + loop.start * bpmInMs(stats.bpm)
			, length = loopLength(loop, stats.bpm)
			, now = io.currentTime()
		if (at <= now) {
			at = at + Math.ceil((now - at) / length) * length;
		}
		var timeout = setTimeout(function () {
			start(loop);
			var interval = setInterval(function () {
				start(loop);
			}, length);
			activeLoops.push(interval);
		}, at - now);
		activeTimeouts.push(timeout);
	}

	function start(loop) {
		for (var i in loop.animations) {
			scheduleAnima(loop.selector, loop.animations[i]);
		}
	}

	function scheduleAnima(selector, anima) {
		setTimeout(function () {
			startAnima(selector, anima);
		}, anima.start * bpmInMs(stats.bpm));
	}

	function startAnima(selector, anima) {
		var on = jc(selector)
			, unit = bpmInMs(stats.bpm)
			, dur = anima.duration * unit
		if (selector.charAt(0) === '&') {
			if (specials[selector])
				on = specials[selector];
		}
		var anis = [];
		var passover;
		for (var i = anima.keypoints.length - 1; i >= 0; i--) {
			var key = anima.keypoints[i]
				, _start = key[0]
				, _prev = 0
			if (i > 0) {
				_prev = anima.keypoints[new Number(i) - new Number(1)][0];
			}
			passover = makeAniFun(key[1], (_start - _prev) * dur, key[2], passover);
		}
		passover.apply(on);
	}

	function makeAniFun(state, length, opt, callback) {
		return function () {
			if (length == 0) {
				if (_.isArray(this)) {
					for (var i in this) {
						this[i].animate(state);
					}
				}
				else
					this.animate(state);
				if (callback)
					callback();
			}
			else {
				if (_.isArray(this)) {
					for (var i in this) {
						this[i].animate(state, length, opt, callback);
					}
				}
				else
					this.animate(state, length, opt, callback);
			}
		};
	}

	function createCircle(x,y, color, rad) {
		return jc.circle(x,y, rad || 10, color || '#FFF', true)
			.name('user-circle');
	}

	var specials = {};
	function register(special, name) {
		if (!specials['&' + name])
			specials['&' + name] = [];
		specials['&' + name].push(special);
	}

	function createStar(x, y) {
		var img = jc.image(flareImg, x, y, 100, 100)
			.layer('star');
		var colors=[[0,'rgba(249, 237, 220, 0.4)']
								, [0.4,'rgba(249, 237, 220, 0.3)']
								, [0.43,'rgba(249, 237, 220, 0.2)']
								, [1,'rgba(249, 237, 220, 0)']];
		var gradient=jc.rGradient(x + 50,y + 50,1,x + 50, y + 50,30,colors)
			.layer('star');
		register(gradient, 'star-gradient');
		//starPulse(gradient);
		/*var glow = jc.circle(x + 50, y + 50, 15, 'rgba(249, 237, 220, 1)', true)
			.layer('star');
		glow.animate({ opacity: 0.5 }, 1000)*/
		var glow = jc.circle(x + 50,y + 50, 50, gradient, true)
			.layer('star')

		return jc.layer('star');
	}

	function starPulse(grad) {
		var _stats = stats || { bpm: 120 }
			, dur = bpmInMs(_stats.bpm);
		grad.animate({ r2: 40 }, dur, { type: 'inOut', fn: 'exp' }, function () {
			this.animate({ r2: 30 }, dur * 3, { type: 'inOut', fn: 'exp' }, function () {
				starPulse(this);
			});
		});
	}

	var onActive = [];
	return {
		background: background
			, createCircle: createCircle
			, createStar: createStar
			, onActive: function (ev) { onActive.push(ev); }
	};

});
