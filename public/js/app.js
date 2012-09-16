$(function () {
	var socket = io.connect('/');
	ping(socket, function (delay) {
		canvas.html(delay);
	});
	socket.on('color', function (col) {
		//canvas.html(JSON.stringify(col));
		color = col;
	});
	var canvas = $('#canvas');
	//var processingInstance = new Processing(canvas[0], setColor);
});

function ping(socket, measurement) {
	socket.on('ping', function (data) {
		var delay = (new Date).getTime() - data.time;
		if (measurement)
			measurement(delay / 2);
	});
	setInterval(function () {
		socket.emit('ping', { time: (new Date).getTime() });
	}, 1000);
}

var color = [0,0,0];
function setColor(processing) {
	processing.draw = function () {
		processing.background.apply(processing, color);
	};
}

function sketchProc(processing) {
	processing.draw = function () {
		var centerX = processing.width / 2, centerY = processing.height / 2;
		var maxArmLength = Math.min(centerX, centerY);

		function drawArm(position, lengthScale, weight) {
			processing.strokeWeight(weight);
			processing.line(centerX, centerY,
				centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
				centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
		}

		processing.background(224);

		var now = new Date();

		var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
		drawArm(hoursPosition, 0.5, 5);

		var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
		drawArm(minutesPosition, 0.80, 3);

		var secondsPosition = now.getSeconds() / 60;
		drawArm(secondsPosition, 0.90, 1);
	};
}
