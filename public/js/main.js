requirejs.config({
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
	, 'socket.io': '/socket.io/socket.io'
	}
});

require(['jquery'
		, 'jc'
	 	, 'user'	], function () {
	$(function () {
	});
});
