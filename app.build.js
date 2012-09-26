({
	appDir: './public/',
	baseUrl: 'js/',
	dir: './public-build',
	paths: {
		'jquery': 'empty:'
	, 'socket.io': 'empty:'
	},
	modules: [
		{
			name: "main"
		},
		{
			name: "admin"
		}
	]
})
