$(function()
{
	var scene,camera,renderer;
	var controls,guiControls,datGUI;
	var stats;
	var spotLight,hemi;
	var SCREEN_WIDTH,SCREEN_HEIGHT;
	var navicella;
	var camera;
	
	var planets_reference; // Array con i riferimenti ai pianeti
	var skybox; // Skybox, viene spostato con la navicella
	var lensflares; // Array con i riferimenti alle lensflares
	var lights;
	var textureFlare1, textureFlare2, textureFlare3; // Texture dei lansflares
	var lensflaresOriginalPositions;
  
	// Parametri
	var LENS_FLARES_NUMBER = 5;
	var PLANETS_NUMBER = 15;
	var RANGE = 1000;
	var PLANETS_TOTAL_NUMBER = 1000;
	var DISTANZA_MINIMA_TRA_PIANETI = 60000;
	var SOGLIA_VISUALE_NAVICELLA = 6000000;
	var RANGE_UNIVERSO = RANGE * (PLANETS_TOTAL_NUMBER / PLANETS_NUMBER) / 11; // Era diviso 13
	var ASTEROIDS_NUMBER = 1; //3; // Numero di asteroidi contemporaneamente presenti in scena
	var SOGLIA_DISTANZA_EFFETTO_GRAVITA = 300000;
	var MAX_DISTANCE_CAMERA = 5000;
	var DIM_SKYBOX = 4000;
	var SOGLIA_AVVISO_ASTEROIDE = 750000;
  
	// Tasti per visualizzare info pianeti
	var SHOW_INFO_BUTTON = 81; // Q
	var SHOW_INFO_FORWARD = 69; // E
	//var SHOW_INFO_BACKWARD = 90; // Z
	
	var NUMERO_LUCI = 1;
	
	var clock;
	var fire;
  
	var G = 6.67408 * 0.1; // Costante di gravitazione universale (cambiata la scala rispetto all'originale, sorry Newton)
	var MASSA_NAVICELLA = 1;
	
	var listener;
	
	var universeInfo;
	var planetsInfo;
	var asteroids_reference;
	
	var planetInfoManager;
	
	var PlayText;
	
	var e; // Esplosione
	
	var isExplode=false;
  
	var button1Pressed = false;
	var leftShoulderPressed = false;
	var rightShoulderPressed = false;
  
	/* Variabili per la gestione del cambio delle texture */
	var manager;
	var blue_texture, red_texture;
	var is_red;
	var clouds_texture;
	var moon_texture;
	var earth_texture; // Usata solo per debuggare
  
	/* Variabili fuoco */
	var fireWidth  = 1.25;
	var fireHeight = 1;
	var fireDepth  = 1.75;
	var sliceSpacing = 0.25;

	var arrow, fake_arrow, arrow_presente;
	var wireframe, fake_wireframe;
	
	var engine;
	
	var t = 0;
	var time = 0;
	
	var diffManager;

	/*
	 * init
	 * Inizializza tutto
	 */
	function init()
	{
		document.getElementById("intro").style.display = 'none'; 
		document.getElementById("time").style.display = 'block'; 
		document.getElementById("turboInfo").style.display = 'block'; 
		manager = new THREE.LoadingManager();
		is_red = false;
		
		diffManager = new DifficultyManager(document.forms.diff.level.value);
	
		arrow_presente = false;
	
		blue_texture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( 'textures/spaceship/diffuse.bmp', function ( image ) 
		{
			blue_texture.image = image;
			blue_texture.needsUpdate = true;
		} );
				
		red_texture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( 'textures/spaceship/diffuse red.bmp', function ( image ) 
		{
			red_texture.image = image;
			red_texture.needsUpdate = true;
		} );				
	
		clouds_texture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( "textures/clouds/clouds_2.jpg", function ( image ) 
		{
			clouds_texture.image = image;
			clouds_texture.needsUpdate = true;
		} );
	
		moon_texture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( "textures/planet/moon.jpg", function ( image ) 
		{
			moon_texture.image = image;
			moon_texture.needsUpdate = true;
		} );
	
		earth_texture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( "textures/planet/earth.jpg", function ( image ) 
		{
			earth_texture.image = image;
			earth_texture.needsUpdate = true;
		} );	

		clock = new THREE.Clock();
		
		planetInfoManager = new PlanetInfoManager();
		planetInfoManager.hideAll();

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, .1, MAX_DISTANCE_CAMERA);
	
		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		/*
		scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
		scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
		renderer.setClearColor( scene.fog.color );
		*/
	
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight);
		
		skybox = setSkybox();
		scene.add(skybox);
	
		renderer.setSize(window.innerWidth,window.innerHeight);
	
		camera.position.x = 40;
		camera.position.y = 50;
		camera.position.z = 10;
	
		listener = new THREE.AudioListener();
		camera.add( listener );
	
		var audioLoader = new THREE.AudioLoader();

		var backgroundMusic = new THREE.PositionalAudio( listener );
		audioLoader.load( 'sounds/358232_j_s_song.ogg', function( buffer ) {
			backgroundMusic.setLoop(true);
			backgroundMusic.setBuffer( buffer );
			backgroundMusic.setRefDistance( 20 );
			backgroundMusic.play();
		});
	
		engine = new THREE.PositionalAudio( listener );
		audioLoader.load( 'sounds/engine.wav', function( buffer ) {
			engine.setLoop(true);
			engine.setBuffer( buffer );
			engine.setRefDistance( 20 );
		});
	
		container = document.getElementById("webGL-container");
		
		caricaNavicella(40,50,15);
		LoadMenu();
	
		navicella.add(backgroundMusic);
		navicella.add(engine);
		
		fire = new VolumetricFire(
			fireWidth,
			fireHeight,
			fireDepth,
			sliceSpacing,
			camera
		);
	
		controls.setFire(fire);
		
		fire.mesh.rotation.x = 90;
		fire.mesh.position.z = 100; // Nascosto
		navicella.add(fire.mesh);
	
		populate_universe(PLANETS_TOTAL_NUMBER);
	
		generateAsteroids(ASTEROIDS_NUMBER);
  	
		generateLensFlares();
		setupScene();
	
	/*
	 * populate_universe
	 * Dato il numero totale di pianeti dell'universo genera le loro
	 * caratteristiche (vedere classe PlanetInfo per vedere cosa viene generato)
	 */
	function populate_universe(n)
	{
		planets_reference = [];

		planetsInfo = [];
		for (var i = 0; i < n; i++)
		{
			var x,y,z;
			do{
				x = (Math.random() * (RANGE_UNIVERSO * 2) - RANGE_UNIVERSO) + navicella.position.x;
				y = (Math.random() * (RANGE_UNIVERSO * 2) - RANGE_UNIVERSO) + navicella.position.y;
				z = (Math.random() * (RANGE_UNIVERSO * 2) - RANGE_UNIVERSO) + navicella.position.z;
			}while(!lontanoDaPianeti(planetsInfo, x,y,z));
			
			var pos = new THREE.Vector3();
			pos.set(x,y,z);
			
			var p_info = new PlanetInfo(pos);
			p_info.setScale(p_info.generateScale());
			p_info.setTextureNumber(p_info.generateTextureNumber());
			p_info.setMoonNumber(p_info.generateMoonNumber());
			p_info.setMoonVelocities(p_info.generateMoonVelocities());
			p_info.setMoonPositions(p_info.generateMoonPositions());
			p_info.setMoonScales(p_info.generateMoonScales());
			p_info.setRingSize();
			p_info.setRingRotation();
			p_info.setRingTexture();
			planetsInfo.push(p_info);
		}
	}
	
	/*
	 * generateAsteroid
	 * Genera un numero di asteroidi pari a quello che gli 
	 * viene passato in input
	 */
	function generateAsteroids(n)
	{
		asteroids_reference = [];
		for (var i = 0; i < n; i++)
		{
			var asteroid = new Asteroid();
			asteroid.create(navicella.position, SOGLIA_VISUALE_NAVICELLA);
			asteroid.addToScene(scene);
			asteroids_reference.push(asteroid);
		}
	}
  
	/*
	* generateLensFlares
	* Genera le lensflare e le posiziona casualmente in scena
	*/
	function generateLensFlares()
	{
		lensFlares = [];
		lights = [];
		lensflaresOriginalPositions = [];
		var textureLoader = new THREE.TextureLoader();

		textureFlare1 = textureLoader.load( "textures/lensflare/lensflare0.png" );
		textureFlare2 = textureLoader.load( "textures/lensflare/lensflare2.png" );
		textureFlare3 = textureLoader.load( "textures/lensflare/lensflare3.png" );

		textureFlare1.minFilter = THREE.LinearFilter;
		textureFlare2.minFilter = THREE.LinearFilter;
		textureFlare3.minFilter = THREE.LinearFilter;
	
		for (var i = 0; i < LENS_FLARES_NUMBER; i++)
		{
			var x = random(-RANGE / 2, RANGE / 2);
			var y = random(-RANGE / 2, RANGE / 2);
			var z = random(-RANGE / 2, RANGE / 2);
			lensflaresOriginalPositions.push(new THREE.Vector3(x,y,z));
			addLensFlares(random(0.50, 1), random(0.65, 0.85), random(0.4, 1), x, y, z);
		}
	}
  
	/*
	 * addLensFlare
	 * Ha in input i parametri di una lensflare e la aggiunge alla scena
	 */
	function addLensFlares( h, s, l, x, y, z ) 
	{
		var textureFlare0 = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( "textures/lensflare/lensflare0.png", function ( image ) 
		{
			textureFlare0.image = image;
			textureFlare0.needsUpdate = true;
		} );
		//var textureFlare0 = THREE.ImageUtils.loadTexture("textures/lensflare/lensflare0.png");
		
		/*
		var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
		light.color.setHSL( h, s, l );
		light.position.set( x, y, z );
		scene.add( light );
		*/

		var flareColor = new THREE.Color( 0xffffff );
		flareColor.setHSL( h, s, l + 0.5 );

		var lensFlare = new THREE.LensFlare( textureFlare0, 600, 0.0, THREE.AdditiveBlending, flareColor );
		
		lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
		lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
		lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

		lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

		//lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		
		lensFlare.position.set(x,y,z);
		
		lensFlares.push(lensFlare);

		scene.add( lensFlare );
	}  
    
	/*
	 * lensFlareUpdateCallback
	 * Callback lensflare, per ora non usato
	 */
	function lensFlareUpdateCallback( object ) 
	{
		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;

		for( f = 0; f < fl; f++ ) 
		{
			flare = object.lensFlares[ f ];

			flare.x = object.positionScreen.x + vecX * flare.distance;
			flare.y = object.positionScreen.y + vecY * flare.distance;

			flare.rotation = 0;
		}

		object.lensFlares[ 2 ].y += 0.025;
		object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
	}
	
	/*
	 * getRandomInt
	 * Ritorna un intero tra min e max
	 */
	function getRandomInt(min, max) 
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/*
	 * setSkybox
	 * Setta lo skybox in scena
	 */
	function setSkybox()
	{
		var imagePrefix = "skybox/skybox-";
		var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
		var imageSuffix = ".png";

		var materialArray = [];
		for (var i = 0; i < 6; i++)
		{
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide}));
		}
		var skyGeometry = new THREE.CubeGeometry(DIM_SKYBOX, DIM_SKYBOX, DIM_SKYBOX);
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		skyBox.renderDepth = 5000.0;  
		skyBox.rotation.x += Math.PI / 2;
		return skyBox;
	}

	/*
	 * caricaNavicella
	 * Carica modello 3D di navicella, inizializza controlli e ecamera
	 */ 
	function caricaNavicella(x,y,z)
	{
		var model = new Model(x,y,z);
		navicella = model.LoadmodelScale('textures/spaceship/diffuse.bmp','model/spaceship.obj',0.025);
		navicella.rotation.set(0,0,0);
		
		var geometry = new THREE.CylinderGeometry( 0, 1, 3, 12 );
		geometry.rotateX( Math.PI / 2 );
		
		var material = new THREE.MeshNormalMaterial();
		
		arrow = new THREE.Mesh( geometry, material );
		fake_arrow = new THREE.Object3D();
				
		camera.position.set(0, 3, 20);
		controls = new THREE.FlyControls(navicella);
		controls.TURBO_SLEEP_TIME = diffManager.getTurboSleepTime();
		
		controls.setCamera(camera);
		controls.movementSpeed = 1000;
		controls.domElement = container;
		controls.rollSpeed = Math.PI / 24;
		controls.autoForward = false;
		controls.dragToLook = false;
		
		var cubeGeometry = new THREE.CubeGeometry(5,2,3,4,4,4);
		var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
		wireframe = new THREE.Mesh( cubeGeometry, wireMaterial );
		wireframe.position.set(navicella.position.x, navicella.position.y, navicella.position.z);	
		
		fake_wireframe = new THREE.Object3D();
		fake_wireframe.position.set(0, 1, 0);
		
		navicella.add(fake_wireframe);
		
		//scene.add(wireframe);
		
		//var axis = new THREE.AxisHelper(5);
		//navicella.add(axis);
		scene.add(navicella);
		
		fake_arrow.position.set(0, 10, -25);
	
		arrow.position.set(40, 50, 15);
		
		camera.add(fake_arrow);
		
		camera.position.set(0,0,15);
		
		navicella.add(camera);
	}	
	
	/*
	 * generateSprite
	 * Non più usata
	 */
	function generateSprite() 
	{

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
		gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		return canvas;
	}


	$("#webGL-container").append(renderer.domElement);
        stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '800px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );  
	}

 
 
 	/*
	 * isVisibleFromCamera
	 * Ritorna true se l'oggetto passato è visibile dalla camera, false altrimenti
	 */
	function isVisibleFromCamera(object)
	{
		var frustum = new THREE.Frustum();
		var cameraViewProjectionMatrix = new THREE.Matrix4();

		camera.updateMatrixWorld();
		camera.matrixWorldInverse.getInverse( camera.matrixWorld );
		cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
		frustum.setFromMatrix( cameraViewProjectionMatrix );
		
		if (object != null)
			return frustum.intersectsObject(object);
		else
			return null;
	}
	
	/*
	 * checkXBoxController
	 * Controlla se vengono premuti i tasti del controller
	 */
	function checkXBoxController()
	{	
		if (Gamepad.supported) 
		{
			var pads = Gamepad.getStates();
			var pad = pads[0];
			
			if (pad)
			{
				if (pad.faceButton1.pressed && !button1Pressed)
				{
					startShowInfoPlanet();
					button1Pressed = true;
				}
				else
					if (!pad.faceButton1.pressed)
						button1Pressed = false;
					
				if (pad.rightShoulder0.pressed && !rightShoulderPressed)
				{
					infoForward();
					rightShoulderPressed = true;
				}
				else
					if (!pad.rightShoulder0.pressed)
						rightShoulderPressed = false;
				
				if (pad.leftShoulder0.pressed && !leftShoulderPressed)
				{
					infoBackward();
					leftShoulderPressed = true;
				}
				else
					if (!pad.leftShoulder0.pressed)
						leftShoulderPressed = false;
			}
		}
	}
	
	/*
	 * animate
	 */
	function animate()
	{
		var delta = clock.getDelta();
		requestAnimationFrame(animate);
		stats.update();
   		renderer.render(scene,camera);
		
		document.getElementById("time").innerHTML = "Time: " + parseInt(time);
   		
		d = 100;
		
		if (e != null)
			e.animate();
		
		showPlanets(navicella.position.clone());
		
		checkCollisions();

		if(controls.pause && !controls.play)
		{
			LoadMenu();
			controls.pause=false;
		}

		oldNavicellaPosition = navicella.position.clone();
		
		if (controls != null && controls.play && !isExplode && !controls.pause)
		{
			camera.remove(PlayText);
			controls.movementSpeed = 0.33 * d;
			controls.update( delta );
			checkXBoxController();
		}
		else
			controls.checkXBoxController();

		if(controls.play && !controls.pause)
		{
			for (var i = 0; i < asteroids_reference.length; i++)
			{
				asteroids_reference[i].update(calcolateWorldTotalForceOnPosition(asteroids_reference[i].getPosition()));
				if (distance(navicella.position, asteroids_reference[i].getPosition()) > SOGLIA_VISUALE_NAVICELLA * 2)
				{
					// Asteroide troppo lontano, va eliminato e creato uno nuovo
					asteroids_reference[i].removeFromScene(scene);
					var asteroid = new Asteroid();
					asteroid.create(navicella.position, SOGLIA_VISUALE_NAVICELLA);
					asteroid.addToScene(scene);
					asteroids_reference[i] = asteroid;
				}
			}
	
			for (var i = 0; i < planets_reference.length; i++)		
				planets_reference[i].update(camera);
			
			if (!isExplode)
				applyForces(diffManager.calcolaMoltiplicatore(time));
			
			time += delta;
			
			if (time > 1 && diffManager.calcolaNumeroAsteroidi(time) != ASTEROIDS_NUMBER)
			{
				ASTEROIDS_NUMBER = diffManager.calcolaNumeroAsteroidi(time);
				addAsteroid();
			}
			
			if (controls.usable && controls.moveState.turbo == 0)
				document.getElementById("turboInfo").innerHTML = "<font color='green'>Turbo available</font>";
			else
				document.getElementById("turboInfo").innerHTML = "<font color='red'>Turbo not available</font>";
		}
		
		scene.updateMatrixWorld();		
				
		for (var i = 0; i < lensFlares.length; i++)
		{
			lensFlares[i].position.set(lensflaresOriginalPositions[i].x + navicella.position.x - 40,
										lensflaresOriginalPositions[i].y + navicella.position.y - 50,
										lensflaresOriginalPositions[i].z + navicella.position.z - 15);
		}
		
		skybox.position.x = navicella.position.x;
		skybox.position.y = navicella.position.y;
		skybox.position.z = navicella.position.z;

		var elapsed = clock.getElapsedTime();
		//fire.update(elapsed);
		//t += elapsed;
		if (fire != null)
			fire.update(elapsed);
		
		var matrix = new THREE.Matrix4();
		matrix.extractRotation( navicella.matrix );
	
		var directionZ = new THREE.Vector3(0, 0, 1);
		directionZ.applyMatrix4(matrix);	
		
		var matrix2 = new THREE.Matrix4();
		matrix2.extractRotation( camera.matrix );		
							
		if (controls.moveState.forward == 0)
		{			
			try {
				if (engine.isPlaying)
					engine.stop();
			}
			catch(err) {
				// Significa che non ha ancora finito la chiamata asincrona per il caricamento, bisogna solo attendere
			} 
		}
		else
		{
			try {
				if (!engine.isPlaying)
					engine.play();
			}
			catch(err) {
				// Significa che non ha ancora finito la chiamata asincrona per il caricamento, bisogna solo attendere
			} 
		}
		
		//camera.rotation.z = -navicella.rotation.z;
		
		scene.updateMatrixWorld();
		var v = new THREE.Vector3();
		v.setFromMatrixPosition( fake_wireframe.matrixWorld );

		wireframe.position.set(v.x, v.y, v.z)
		wireframe.rotation.set(navicella.rotation.x, navicella.rotation.y, navicella.rotation.z);

		manageArrow();
   }
   
   /*
    * addAsteroid
	* Aggiunge gli asteroidi finchè non arriva al numero corretto
	*/
   function addAsteroid()
   {
		for (var i = asteroids_reference.length; i < ASTEROIDS_NUMBER; i++)
		{
			var asteroid = new Asteroid();
			asteroid.create(navicella.position, SOGLIA_VISUALE_NAVICELLA);
			asteroid.addToScene(scene);
			asteroids_reference.push(asteroid);	   
			console.log("Nuovo asteroide, ora in scena ci sono: " + asteroids_reference.length);
		}
   }
   
   /*
    * manageArrow
	* Gestisce l'apparizione e la scomparsa dell'indicatore dell'asteroide
    */
	function manageArrow()
	{
		var nearestAsteroidPosition = getNearestAsteroidPosition();
		if (distance(navicella.position, nearestAsteroidPosition) < SOGLIA_AVVISO_ASTEROIDE)
			p = true;
		else
			p = false;
		
		if (p && !arrow_presente)
			scene.add(arrow);
		else
		{
			if (!p && arrow_presente)
				scene.remove(arrow);
		}
		
		arrow_presente = p;
		
		if (arrow_presente)
		{
			arrow.lookAt( nearestAsteroidPosition );
		
			var v = new THREE.Vector3();
			v.setFromMatrixPosition( fake_arrow.matrixWorld );
		
			arrow.position.set(v.x, v.y, v.z);
		}
	}
	
	/*
	 * getNearestAsteroidPosition
	 * Ritorna la posizione dell'asteroide più vicino
	 */
	function getNearestAsteroidPosition()
	{
		var d = 999999999;
		var index = -1;
		for (var i = 0; i < asteroids_reference.length; i++)
		{
			var dist = distance(navicella.position, asteroids_reference[i].getPosition());
			if (dist < d)
			{
				d = dist;
				index = i;
			}
		}
		return asteroids_reference[index].getPosition();
	}
   
   /*
    * checkCollisions
	* Controlla se vi sono collisioni tra la navicella e pianeti o asteroidi
	* Modifica anche la texture della navicella se necessario
	*/
	function checkCollisions()
	{
		var inCollision = false;
		scene.updateMatrixWorld();
		var isNear = false;
		for (var i = 0; i < planets_reference.length && !inCollision; i++)
		{
			if (planets_reference[i].inCollision(navicella.position))
			{
				explode();
				console.log("Distrutto da un pianeta");
				inCollision = true;
			}
			
			if (planets_reference[i].isNear(navicella.position))
			{
				isNear = true;
				if (!is_red)
				{
					is_red = true;
					for (var j = 0; j < navicella.children.length; j++)
					{
						if (navicella.children[j].children != null && navicella.children[j].children.length > 0 && navicella.children[j].children[0] instanceof THREE.Mesh)
						{
							var f = navicella.children[j].children[0];
								f.material.map = red_texture;
						}
					}
				}
			}
		}
		
		if (!isNear && is_red)
		{
			is_red = false;
			for (var j = 0; j < navicella.children.length; j++)
			{
				if (navicella.children[j].children != null && navicella.children[j].children.length > 0 && navicella.children[j].children[0] instanceof THREE.Mesh)
				{
					var f = navicella.children[j].children[0];
					f.material.map = blue_texture;
				}
			}
		}
		
		/*
		 * Collisioni con anelli
		 */
		var collidableMeshList1 = [];
		var collidableMeshList2 = [];
		for (var i = 0; i < planets_reference.length; i++)
		{
			var mesh = planets_reference[i].getRings();
			if (mesh != null)
				collidableMeshList1.push(mesh);
		}
		
		for (var i = 0; i < asteroids_reference.length; i++)
		{
			var mesh = asteroids_reference[i].getMesh();
			if (mesh != null)
				collidableMeshList2.push(mesh);
		}
		
		var originPoint = wireframe.position.clone();
		for (var vertexIndex = 0; vertexIndex < wireframe.geometry.vertices.length && !inCollision; vertexIndex++)
		{		
			var localVertex = wireframe.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( wireframe.matrix );
			var directionVector = globalVertex.sub( wireframe.position );
		
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( collidableMeshList1 );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			{
				console.log("Distrutto da anelli");
				explode();
				inCollision = true;
			}
		}
		
		for (var vertexIndex = 0; vertexIndex < wireframe.geometry.vertices.length && !inCollision; vertexIndex++)
		{		
			var localVertex = wireframe.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( wireframe.matrix );
			var directionVector = globalVertex.sub( wireframe.position );
		
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( collidableMeshList2 );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			{
				var nearestAsteroidPosition = getNearestAsteroidPosition();
				var distanza = distance(navicella.position, nearestAsteroidPosition);
				if (distanza < 3000)
				{
					console.log("Distrutto da un asteroide");
					console.log("Distanza: " + distance(navicella.position, nearestAsteroidPosition));
					explode();
					inCollision = true;
				}
			}
		}
	}
   
   /*
    * explode
	* Chiamata in caso di collisione tra navicella e pianeti/asteroidi
	* La navicella esplode e si viene riportati al menu
	*/
   function explode()
   {
	   if(!isExplode)
	   {
			var matrix = new THREE.Matrix4();
			matrix.extractRotation( navicella.matrix );		
		
			var directionZ = new THREE.Vector3(0, 0, 1);
			directionZ.applyMatrix4(matrix);	
		
			scene.remove(navicella);
			isExplode=true;

			e = new ParticlesExplosion();
			e.init(scene, navicella.position.x + directionZ.x * 5,
							navicella.position.y + directionZ.y * 5 ,
							navicella.position.z + directionZ.z * 5);
							
			var audioLoader = new THREE.AudioLoader();
			
			var sound1 = new THREE.PositionalAudio( listener );
			audioLoader.load( 'sounds/explosion.mp3', function( buffer ) {
				sound1.setBuffer( buffer );
				sound1.setRefDistance( 20 );
				sound1.play();
			});
			
			navicella.add(sound1);
							
			clearScene();
		}
	}
	
	/* 
	 * clearScene
	 * Aggiorna la scena (usata quando la navicella viene distrutta)
	 */
	function clearScene()
	{
		setTimeout(function()
		{
			location.reload();		
		}, 3000);
	}
   
   /*
    * calcolateWorldTotalForceOnPosition
	* Dato un punto dell'universo calcola le forze gravitazionali che agiscono su quel punto
	*/
   function calcolateWorldTotalForceOnPosition(position)
   {
	   return new THREE.Vector3(0,0,0); // Per ora non applico le forze dei pianeti
   }
   
   /*
    * showPlanets
	* Data in input la posizione della navicella mostra i pianeti che hanno una distanza entro SOGLIA_VISUALE_NAVICELLA
	* e nasconde quelli oltre questa soglia
	*/
   function showPlanets(pos)
   {
	   var nav_position = new THREE.Vector3(pos.x % RANGE_UNIVERSO, pos.y % RANGE_UNIVERSO, pos.z % RANGE_UNIVERSO);
	   var diff = new THREE.Vector3(pos.x - nav_position.x, pos.y - nav_position.y, pos.z - nav_position.z);	   
	   
	   for (var i = 0; i < planets_reference.length; i++)
		   if (distance(planets_reference[i].position(), pos) >= SOGLIA_VISUALE_NAVICELLA)
				planets_reference[i].removeFromScene(scene);
		   
	   for (var i = 0; i < PLANETS_TOTAL_NUMBER; i++)
	   {
		   if (distance(planetsInfo[i].getPosition(), nav_position) < SOGLIA_VISUALE_NAVICELLA)
		   {
			   var pon = new THREE.Vector3(planetsInfo[i].getPosition().x + diff.x, planetsInfo[i].getPosition().y + diff.y, planetsInfo[i].getPosition().z + diff.z);
			   if (!planetsInfo[i].isVisible())
			   {
				 var p = new Planet(planetsInfo[i].getPosition().x + diff.x, planetsInfo[i].getPosition().y + diff.y, planetsInfo[i].getPosition().z + diff.z);
				 p.create(planetsInfo[i].getScale(), planetsInfo[i].getTextureNumber());
				 p.createClouds(clouds_texture);
				 
				 p.generateMoon(planetsInfo[i].getMoonNumber(), 
									planetsInfo[i].getMoonVelocities(), 
									planetsInfo[i].getMoonPositions(), 
									planetsInfo[i].getMoonScales(),
									moon_texture);
									
				if (planetsInfo[i].getRingSize() > 0)
					p.createRings(planetsInfo[i].getRingSize(), planetsInfo[i].getRingRotation(), planetsInfo[i].getRingTexture(), 32);
				
				 p.addToScene(scene);
				 planets_reference.push(p);
				 
				 planetsInfo[i].setVisibility(true);
			   }	
		   }
		   else
		   {
			   planetsInfo[i].setVisibility(false);
		   }
	   }
   }
   
   /*
    * distance
	* Dati due THREE.Vector3 calcola la distanza al quadrato tra i due
	* (non viene eseguita la radice per essere più veloce)
	*/
   function distance(p1, p2)
   {
	   return (p1.x - p2.x) * (p1.x - p2.x) +
				(p1.y - p2.y) * (p1.y - p2.y) +
				(p1.z - p2.z) * (p1.z - p2.z);
   }
   
   /*
    * applyForces
	* Applica la legge di gravitazione universale di Netwon
	* Applicata solo sulla navicella (si presume che lo spostamento che la gravità della navicella influisce sui pianeti sia trascurabile)
	* Calcola le singole forze di attrazione dei pianeti e applica la forza totale risultante
    */
   function applyForces(mol)
   {
		var finalForce = new THREE.Vector3();
		for (var i = 0; i < planets_reference.length; i++)
	    {
			var distanza = (planets_reference[i].position().x - navicella.position.x) * (planets_reference[i].position().x - navicella.position.x) +
						(planets_reference[i].position().y - navicella.position.y) * (planets_reference[i].position().y - navicella.position.y) +
						(planets_reference[i].position().z - navicella.position.z) * (planets_reference[i].position().z - navicella.position.z);
				
			if (distanza < SOGLIA_DISTANZA_EFFETTO_GRAVITA)
			{
				var direzione = new THREE.Vector3(planets_reference[i].position().x - navicella.position.x,
											planets_reference[i].position().y - navicella.position.y,
											planets_reference[i].position().z - navicella.position.z);
			
				var m1 = planets_reference[i].getMass();
				var m2 = MASSA_NAVICELLA;
				var forza = (G * mol) * (m1 * m2) / distanza;
			 
				finalForce.x += forza * direzione.x;
				finalForce.y += forza * direzione.y;
				finalForce.z += forza * direzione.z;
		   
				var np = new THREE.Vector3(navicella.position.x + finalForce.x,
											navicella.position.y + finalForce.y,
											navicella.position.z + finalForce.z);
				navicella.position.set(np.x, np.y, np.z);	
			}
	    }	
   }
   
   /*
    * printVector3
	* Usato per debuggare, stampa un Vector3
	*/
	function printVector3(v)
	{
		return "(" + v.x + ";" + v.y + ";" + v.z + ")";
	}
   
	/*
	 * aggiungi
	 * Aggiunge un nuovo pianeta
	 * Non più usata
	 */
	function aggiungi(p)
	{
		var pos = -1;
		if (Math.random() * 100 < 50)
			pos = 1;
		
		var x,y,z;
		
		do{
			x = (Math.random() * (RANGE / 2) + (RANGE / 2)) * pos + navicella.position.x;
			y = (Math.random() * (RANGE / 2) + (RANGE / 2)) * pos + navicella.position.y;
			z = (Math.random() * (RANGE / 2) + (RANGE / 2)) * pos + navicella.position.z;
		}while(!lontanoDaPianeti(x,y,z));
				
		var p = new Planet(x, y, z);
		scene.add(p.create());
		scene.add(p.generateMoon(Math.random() * 5));
		return p;
   }
   
   /*
    * lontanoDaPianeti
	* Ritorna true se le coordinate date in input sono troppo vicine ad un altro pianeta
	* false altrimenti
	*/
	function lontanoDaPianeti(planetsInfo, x,y,z)
	{
		for (var i = 0; i < planetsInfo.length; i++)	 
			if (distanza(new THREE.Vector3(x,y,z), planetsInfo[i].getPosition()) < DISTANZA_MINIMA_TRA_PIANETI)
				return false;
		return true;
	} 
   
	/*
	 * distanza
	 * Ritorna la distanza tra due punti (senza radice)
	 */
	function distanza(p1, p2)
	{
		return Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2) + Math.pow(p1.z - p2.z,2);
	}

	/*
	 * LoadMenu
	 * Carica la scritta 
	 */
	function LoadMenu()
	{
		height = 1,
		size = 10,
		hover = 30,
		curveSegments = 20,
		bevelEnabled = false,
		font = undefined,
		fontName = "optimer",
		fontWeight = "bold";

		material = new THREE.MultiMaterial( [
			new THREE.MeshPhongMaterial( { color: 0xff0000} ), // front
			new THREE.MeshPhongMaterial( { color: 0xff0000 } ) // side
		] );
		loadFont();
	}

	/*
	 * loadFont
	 * Carica font scritta start per iniziare
	 */
	function loadFont() 
	{
		var loader = new THREE.FontLoader();
		loader.load( './fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
			font = response;
		createText();
		} );
    }  
	
	/* 
	 * createText
	 * Crea scritta inizia partita / pausa
	 */
	function createText() 
	{
		var text;
		if(!controls.pause)
			text="Press ENTER  to start";
		textGeo = new THREE.TextGeometry(text, {
			font: font,
			size: size,
			height: height,
			curveSegments: curveSegments,
			bevelEnabled: bevelEnabled,
			material: 0,
			extrudeMaterial: 1
		});
		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();

		var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
		PlayText = new THREE.Mesh( textGeo, material );

		camera.add(PlayText);
		PlayText.position.x = -60;
		PlayText.position.y = 25;
		PlayText.position.z = -80;

		//scene.add(PlayText);
	}
		
	/*
	 * startShowInfoPlanet
	 * Funziona chiamata quando si apre/chiude la modalità informazioni pianeta
	 */
	function startShowInfoPlanet()
	{
		if (!planetInfoManager.active)
		{
			var visiblePlanets = ordinaPerDistanza(getVisiblePlanets());
			if (visiblePlanets.length != 0)
			{
				planetInfoManager.selectedIndex = 0;
				planetInfoManager.selectedPlanet = visiblePlanets[planetInfoManager.selectedIndex];
				planetInfoManager.selectedPlanet.createGlow(camera, scene);
				planetInfoManager.loadInfoFromFile("./planets_info/info" + planetInfoManager.selectedPlanet.textureNumber + ".txt");
				planetInfoManager.show();
			}
		}
		else
		{
			planetInfoManager.selectedPlanet.removeGlowFromScene(scene);
			planetInfoManager.selectedPlanet = null;
			planetInfoManager.hideAll();
		}
	}
	
	/*
	 * infoForward
	 * Mostra le informazioni del pianeta successivo
	 */
	function infoForward()
	{
		var visiblePlanets = ordinaPerDistanza(getVisiblePlanets());
		if (visiblePlanets.length != 0  && planetInfoManager.selectedPlanet != null)
		{
			planetInfoManager.selectedPlanet.removeGlowFromScene(scene);
			
			planetInfoManager.selectedIndex = (planetInfoManager.selectedIndex + 1) % visiblePlanets.length;
			planetInfoManager.selectedPlanet = visiblePlanets[planetInfoManager.selectedIndex];
			planetInfoManager.selectedPlanet.createGlow(camera, scene);
			
			planetInfoManager.loadInfoFromFile("./planets_info/info" + planetInfoManager.selectedPlanet.textureNumber + ".txt");
			planetInfoManager.show();
		}		
	}
	
	/*
	 * infoBackward
	 * Mostra le informazioni del pianeta precedente
	 */
	function infoBackward()
	{
		var visiblePlanets = ordinaPerDistanza(getVisiblePlanets());
		if (visiblePlanets.length != 0 && planetInfoManager.selectedPlanet != null)
		{
			planetInfoManager.selectedPlanet.removeGlowFromScene(scene);
			
			planetInfoManager.selectedIndex--;
			if (planetInfoManager.selectedIndex == -1)
				planetInfoManager.selectedIndex = visiblePlanets.length - 1;
			planetInfoManager.selectedPlanet = visiblePlanets[planetInfoManager.selectedIndex];
			planetInfoManager.selectedPlanet.createGlow(camera, scene);
			
			planetInfoManager.loadInfoFromFile("./planets_info/info" + planetInfoManager.selectedPlanet.textureNumber + ".txt");
			planetInfoManager.show();
		}
	}
	
	/*
	 * Evento keydown
	 */
	this.keydown = function( event ) {
		if ( event.altKey ) {
			return;
		}
		
		if (event.keyCode == SHOW_INFO_BUTTON)
			startShowInfoPlanet();
		
		if (planetInfoManager.active)
		{
			if (event.keyCode == SHOW_INFO_FORWARD)
				infoForward();
			
			//if (event.keyCode == SHOW_INFO_BACKWARD)
				//infoBackward();
		}
	};
	
	var _keydown = bind( this, this.keydown );
	window.addEventListener( 'keydown', _keydown, false );
	
	function bind( scope, fn ) {

		return function () {
			if (fn != null)
				fn.apply( scope, arguments );
		};
		
	}
	
	/*
	 * getVisiblePlanets
	 * Ritorna un array con i pianeti visibili
	 */
	function getVisiblePlanets()
	{
		var vis = [];
		for (var i = 0; i < planets_reference.length; i++)
			if (isVisibleFromCamera(planets_reference[i].getPlanetReference()))
				vis.push(planets_reference[i]);
		return vis;
	}
	
	/*
	 * ordinaPerDistanza
	 * Dati in input i pianeti visibili li ordina per distanza
	 */
	function ordinaPerDistanza(pianeti)
	{
		var distanze = []
		for (var i = 0; i < pianeti.length; i++)
			distanze.push(distanza(navicella.position, pianeti[i].position()));
		
		var pianetiOrdinati = [];
		for (var i = 0; i < pianeti.length; i++)
		{
			var distMin = 0, iMin = -1;
			for (var j = 0; j < distanze.length; j++)
				if ((distanze[j] <= distMin || iMin == -1) && distanze[j] >= 0)
				{
					distMin = distanze[j];
					iMin = j;
				}
				
			distanze[iMin] = -1;
			pianetiOrdinati.push(pianeti[iMin]);
		}
	
		return pianetiOrdinati;
	}

	/*
	 * random
	 * Ritorna un numero compreso tra minimo e massimo
	 */
	function random(min, max)
	{
	  return Math.random() * (max - min) + min;
	}
    
	/*
	 * setupScene
	 * Crea una luce ambientale nella scena
	 */
	function setupScene()
	{
		var ambientLight,
			geometry,
			material;

		ambientLight = new THREE.AmbientLight(0x2c3e50);
		scene.add(ambientLight);    
	
		for (var i = 0; i < NUMERO_LUCI; i++)
		{
			var x = random(-RANGE / 2, RANGE / 2);
			var y = random(-RANGE / 2, RANGE / 2);
			var z = random(-RANGE / 2, RANGE / 2);
			addLight(x, y, z);
		}
	}

	/*
	 * addLight
	 * Aggiunge la luce
	 */
	function addLight(x, y, z ) 
	{
		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(x,y,z);
		scene.add(pointLight);		
	}

   init();
   animate(); 

   $(window).resize(function(){
   		SCREEN_WIDTH=window.innerWidth;
   		SCREEN_HEIGHT=window.innerHeight;
   		camera.aspect=SCREEN_WIDTH/SCREEN_HEIGHT;
   		camera.updateProjectionMatrix();
   		renderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);

   });
});