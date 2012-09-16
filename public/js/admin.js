$(function () {
	$('a.async').click(function (e) {
		var btn = $(this)
		if (e.preventDefault)
			e.preventDefault();
		$.get(btn.attr('href'));
		return true;
	});
});
