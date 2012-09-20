
module.exports = {
	init: function (io) {
		io.sockets.on('ping', function (data) {
			console.dir(data);
		});
	}
}
