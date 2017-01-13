/*
 * Sun
 * Classe per la creazione del sole
 */
Sun = function ( ) 
{	
	this.init = init;
	this.render = render;

	this.composer = null;

	this.uniforms = null;
	this.material = null;
	
	this.mesh = null;
	
	this.r = null;
	this.c = null;
	
	this.onWindowResize = onWindowResize;
	
	this.clock = new THREE.Clock();
	
	function init(xc, yc, zc, scene, camera, renderer) {		
		this.r = renderer;
		this.c = camera;
		var textureLoader = new THREE.TextureLoader();
		
		uniforms = {
			fogDensity: { value: 0.45 },
			fogColor:   { value: new THREE.Vector3( 0, 0, 0 ) },
			time:       { value: 1.0 },
			resolution: { value: new THREE.Vector2() },
			uvScale:    { value: new THREE.Vector2( 3.0, 1.0 ) },
			texture1:   { value: textureLoader.load( "textures/lava/cloud.png" ) },
			texture2:   { value: textureLoader.load( "textures/lava/lavatile.jpg" ) }

		};

		uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
		uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

		var size = 0.65;

		this.material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShaderSun' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShaderSun' ).textContent
		} );

		this.mesh = new THREE.Mesh( new THREE.SphereGeometry( size, 32, 32 ), material );
		this.mesh.rotation.x = 0.3;
		this.mesh.position.set(xc, yc, zc);
		scene.add( this.mesh );

		var renderModel = new THREE.RenderPass( scene, camera );
		//var effectBloom = new THREE.BloomPass( 1.25 );
		var effectFilm = new THREE.FilmPass( 0, 0, 0, false );

		effectFilm.renderToScreen = true;

		this.composer = new THREE.EffectComposer( renderer );

		//this.composer.addPass( renderModel );
		//this.composer.addPass( effectBloom );
		this.composer.addPass( effectFilm );
		
		//this.onWindowResize();

		//window.addEventListener( 'resize', this.onWindowResize, false );
	}

	function render() 
	{
		var delta = 5 * this.clock.getDelta();
		uniforms.time.value += 0.2 * delta;
		this.mesh.rotation.y += 0.0125 * delta;
		this.mesh.rotation.x += 0.05 * delta;
		this.r.clear();
		this.composer.render( 0.01 );
	}
	
	function onWindowResize( event ) 
	{
		uniforms.resolution.value.x = window.innerWidth;
		uniforms.resolution.value.y = window.innerHeight;

		this.r.setSize( window.innerWidth, window.innerHeight );

		this.c.aspect = window.innerWidth / window.innerHeight;
		this.c.updateProjectionMatrix();

		this.composer.reset();
	}
}