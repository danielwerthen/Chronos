requirejs.config({
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
	, 'socket.io': '/socket.io/socket.io'
	}
});

require([ 'connector'
		, 'render-v2'
		, 'scenario'
		, 'jquery'
		, 'three.min'
	 	, 'jc'	], function (io, render, scene) {
	$(function () {
		var canvas = document.createElement('canvas');
		canvas.width = window.innerWidth / 8;
		canvas.height = window.innerHeight / 8;
		render.init(canvas);
		initThree(canvas);
		io.onEstablished(function () {
			scene.run();
		});

	});
});

function initThree(template) {
	var camera, scene, renderer;
	var geometry, material, mesh;
	var loadTexture;
	var canvas;

	init();
	animate();

	function init() {
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 1000;
		camera.position.x = -200;

		scene = new THREE.Scene();

		var texture = new THREE.Texture(template);
		material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true });
		loadTexture = function () {
			var image = new Image();
			image.onload = function () {
				texture.needsUpdate = true;
				material.map.image = this;
				loadTexture();
			}
			image.src = template.toDataURL('image/png');
		};
		loadTexture();

		geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1,1);
		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		canvas = document.createElement('canvas');
		canvas.id = 'viewport';
		canvas.width = window.innerWidth / 2;
		canvas.height = window.innerHeight / 2;
		renderer = new THREE.WebGLRenderer( { canvas: canvas });
		$('#container').append( renderer.domElement );

	}

	function animate() {
		requestAnimationFrame(animate);
		//mesh.rotation.y = Math.PI / 6;
		renderer.render(scene, camera);
	}

	window.onresize = function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
	}
}
