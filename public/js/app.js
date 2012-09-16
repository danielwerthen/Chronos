(function () {
	var socket = io.connect('/');
	ping(socket, function (delay) {
	});
	var canvas = document.getElementById('canvas');

	function ping(socket, measurement) {
		socket.on('ping', function (data) {
			var delay = (new Date).getTime() - data.time;
			if (measurement)
				measurement(delay / 2);
		});
		socket.emit('ping', { time: (new Date).getTime() });
		setInterval(function () {
			socket.emit('ping', { time: (new Date).getTime() });
		}, 2000);
	}
})();

var interval_1=0;
var idCanvas = 'canvas';
document.onload = onload_1()
function startShow()
{
    var r = Math.floor(Math.random() * (254)),
        g = Math.floor(Math.random() * (254)),
        b = Math.floor(Math.random() * (254)),
        x = Math.floor(Math.random() * (439)),
        y = Math.floor(Math.random() * (554)),
        color = "rgba("+r+", "+g+", "+b+", 0.5)",
        filled = true,
        radius = 1;
    jc.circle(x, y, radius, color, filled)
        .animate({radius:100, opacity:0}, 1500, function(){
            this.del();
        });
}

function onload_1()
{
    jc.start(idCanvas, true);
    interval_1 = setInterval(startShow, 200);
}

function start_1(idCanvas)
{
    if(interval_1)return;
    onload_1();
}

function stop_1(idCanvas)
{
    clearInterval(interval_1);
    interval_1 = 0;
    jc.clear(idCanvas);
}

