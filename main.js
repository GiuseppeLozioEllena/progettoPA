$(function()
{
  var scene,camera,renderer;
  var controls,guiControls,datGUI;
  var stats;
  var spotLight,hemi;
  var SCREEN_WIDTH,SCREEN_HEIGHT;
  var navicella;

  var planets_reference; // Array con i riferimenti ai pianeti
  var skybox; // Skybox, viene spostato con la navicella
  var lensflares; // Array con i riferimenti alle lensflares
  var textureFlare1, textureFlare2, textureFlare3; // Texture dei lansflares
  
  // Parametri
  var LENS_FLARES_NUMBER = 8;
  var PLANETS_NUMBER = 15;
  var RANGE = 1000;
  var PLANETS_TOTAL_NUMBER = 1000;
  var DISTANZA_MINIMA_TRA_PIANETI = 60000;
  var SOGLIA_VISUALE_NAVICELLA = 1000000;
  var RANGE_UNIVERSO = RANGE * (PLANETS_TOTAL_NUMBER / PLANETS_NUMBER) / 20;
  var ASTEROIDS_NUMBER = 5; // Numero di asteroidi contemporaneamente presenti in scena

  var clock;
  var fire;
  
  var lastRotationY = 0;
  var lastSettedY = 0;
  
  var G = 6.67408 * 0.01; // Costante di gravitazione universale (cambiata la scala rispetto all'origianale, sorry Newton)
  var MASSA_NAVICELLA = 1;
  
  var universeInfo;
  var planetsInfo;
  var asteroids_reference;
  
  var e; // Esplosione
  
  /*
    var text2 = document.createElement('div');
	text2.style.position = 'absolute';
	//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text2.style.width = 300;
	text2.style.height = 300;
	text2.innerHTML = "<font color='white'>4708 Mrigashirsha VI<br/>Type=Small iron/silicate<br/>Radius=2457.46 km &nbsp; (0.39 x earth)<br/>Surface Area=7.59 x 10<sup>7</sup> km<sup>2</sup><br/>Land Area=3.11 x 10<sup>7</sup> km<sup>2</sup> &nbsp; (0.21 x earth)<br/>Mass=3.19 x 10<sup>23</sup> kg &nbsp; (0.05 x earth)<br/>Density=5.14 g/cm<sup>3</sup> &nbsp; (0.93 x earth)<br/>Composition=39.8% oxygen, 34.4% iron, 15.7% silicon, 5.0% aluminum, 5.0% other metals, trace other elements<br/>Gravity=3.51 m/s<sup>2</sup> &nbsp; (0.36 x earth)<br/>Escape Velocity=4.15 km/s<br/>Period=36.09 hours<br/>Axis Tilt=24.51 &deg;<br/>Water=60 %<br/>Ice=9 %<br/>Type=Thin toxic<br/>Pressure=11.67 kPa &nbsp; (0.12 x earth)<br/>Composition=44.8% carbon dioxide, 32.7% nitrogen, 17.5% sulfur dioxide, 3.2% methane, 1.7% argon, trace other gases<br/>Type=Standard<br/>Min Temp=126 K &nbsp; (-146 &deg;C)<br/>Avg Temp=292 K &nbsp; (19 &deg;C)<br/>Max Temp=371 K &nbsp; (97 &deg;C)<br/>Chemistry=Nitrogen-phosphorous<br/>Lifeforms=Microbes, algae, sentient animals<br/>Type=Alien Homeworld<br/>Population=16.24 million<br/>Society=Military Dictatorship<br/>Tech Level=Iron Age (water power, iron tools and weapons)<br/>Features=Ruins of an ancient civilization</font>";
	text2.style.bottom = 0 + 'px';
	text2.style.left = 0 + 'px';
	document.body.appendChild(text2);
	*/
	
	
	window.addEventListener( 'mousedown', onclick, false );
	
	function onclick()
	{
		/*
		e = new Explosion();
		e.esplodi(navicella.position.x, navicella.position.y, navicella.position.z, scene);
		*/
		//e = new ParticlesExplosion(navicella.position.x, navicella.position.y, navicella.position.z);
		e = new ParticlesExplosion();
		e.init(scene, navicella.position.x, navicella.position.y, navicella.position.z);
	}
	

  function init()
  {
  	clock = new THREE.Clock();

    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,10000);
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	
	skybox = setSkybox();
	scene.add(skybox);
   
  	renderer.setSize(window.innerWidth,window.innerHeight);
 
	camera.position.x=40;
	camera.position.y=50;
	camera.position.z=10;
	
	container = document.getElementById("webGL-container");

  	spotLight=new THREE.SpotLight(0xffffff);
  	spotLight.castShadow=true;
	spotLight.angle = 1	;
	spotLight.intensity = 2;	
	spotLight.distance = 50;
	spotLight.penumbra = 0;
	
	//spotLight.rotation.set(0, 0, 0);

	spotLight.position.set(0, 0, 20);
	
  	caricaNavicella(40,50,15); 
	camera.add(spotLight);
	//navicella.add(spotLight);
	
	spotLight.target = navicella;
	
	//navicella.add(spotLight);
	
	//scene.add(spotLight);
	var s = new THREE.SpotLightHelper(spotLight);
	scene.add(s);


  	var fireWidth  = 1.25;
	var fireHeight = 1;
	var fireDepth  = 1.75;
	var sliceSpacing = 0.25;


	fire = new VolumetricFire(
		fireWidth,
		fireHeight,
		fireDepth,
		sliceSpacing,
		camera
	);
	
	
	// you can set position, rotation and scale
	// fire.mesh accepts THREE.mesh features
	
	fire.mesh.rotation.x = 90;
	//fire.mesh.position.x += 0.73;
	fire.mesh.position.z = navicella.position.z - 10.5;
	navicella.add(fire.mesh);
	
	populate_universe(PLANETS_TOTAL_NUMBER);
	
	generateAsteroids(ASTEROIDS_NUMBER);
  	
  	generateLensFlares();
	
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
  
  function generateLensFlares()
  {
	lensFlares = [];
	var textureLoader = new THREE.TextureLoader();

	textureFlare1 = textureLoader.load( "textures/lensflare/lensflare0.png" );
	textureFlare2 = textureLoader.load( "textures/lensflare/lensflare2.png" );
	textureFlare3 = textureLoader.load( "textures/lensflare/lensflare3.png" );

	textureFlare1.minFilter = THREE.LinearFilter;
	textureFlare2.minFilter = THREE.LinearFilter;
	textureFlare3.minFilter = THREE.LinearFilter;

	for (var i = 0; i < LENS_FLARES_NUMBER; i++)
		addLight(random(0.50, 1), random(0.65, 0.85), random(0.4, 1), random(-RANGE, RANGE), random(-RANGE, RANGE), random(-RANGE, RANGE));
  }
  
  function random(min, max)
  {
	  return Math.random() * (max - min) + min;
  }
    
 function lensFlareUpdateCallback( object ) {

	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;


	for( f = 0; f < fl; f++ ) {

		flare = object.lensFlares[ f ];

		flare.x = object.positionScreen.x + vecX * flare.distance;
		flare.y = object.positionScreen.y + vecY * flare.distance;

		flare.rotation = 0;

	}

	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

}
  
function addLight( h, s, l, x, y, z ) {

	var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
	light.color.setHSL( h, s, l );
	light.position.set( x, y, z );
	scene.add( light );

	var flareColor = new THREE.Color( 0xffffff );
	flareColor.setHSL( h, s, l + 0.5 );

	var lensFlare = new THREE.LensFlare( textureFlare1, 500, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 50, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	lensFlare.position.copy( light.position );

	lensFlares.push(lensFlare);
	
	scene.add( lensFlare );
}
  
  function getRandomInt(min, max) 
  {
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function setSkybox()
  {
	var imagePrefix = "skybox/skybox-";
	var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";

	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
	map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
	side: THREE.BackSide}));
	var skyGeometry = new THREE.CubeGeometry(10000,10000, 10000 );
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.renderDepth = 5000.0;  
	skyBox.rotation.x += Math.PI / 2;
	return skyBox;
	
	/*
	var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
	var starMaterial = new THREE.MeshPhongMaterial({
	  map: new THREE.ImageUtils.loadTexture("/skybox/skybox-xpos.png"),
	  side: THREE.DoubleSide,
	  shininess: 0
	});
	var starField = new THREE.Mesh(starGeometry, starMaterial);
	return starField;
	*/
  }
  
  function caricaNavicella(x,y,z)
  {
  
    var model = new Model(x,y,z);
    navicella = model.LoadmodelScale('textures/spaceship/diffuse.bmp','model/spaceship.obj',0.025);
	navicella.rotation.set(0,0,0);
	
	navicella.add(camera);
    		
	camera.position.set(0, 3, 20);
	controls = new THREE.FlyControls(navicella);
	controls.movementSpeed = 1000;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
		
	//var axis = new THREE.AxisHelper(5);
	//navicella.add(axis);
    scene.add(navicella);
  }
  

	function generateSprite() {

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

	guiControls=new function()
	{
		this.rotationX=0.0;
		this.rotationY=0.0;
		this.rotationZ=0.0;	
	}
	datGUI=new dat.GUI();
	datGUI.close();


 $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );    
 }

   function animate()
   {
		var delta = clock.getDelta();
		requestAnimationFrame(animate);
		stats.update();
   		renderer.render(scene,camera);
		d = 100;
		
		if (e != null)
			e.animate();
		
		showPlanets(navicella.position);
		
		if (controls != null)
		{
			controls.movementSpeed = 0.33 * d;
			controls.update( delta );
			//seguiNavicella();
			//console.log(camera.rotation);
			
			//if (controls.isPressed())
				//camera.rotation.z = -(controls.getRotation().y - lastRotationY);
			if (controls.isPressed())
			{
				camera.rotation.z = -(controls.getRotation().y + lastRotationY);
				lastSettedY = controls.getRotation().y + lastRotationY;
				//console.log("1Camera rotation z: " + camera.rotation.z + ", lastSetted: " + lastSettedY);
			}
			else	
			{
				lastRotationY = lastSettedY - controls.getRotation().y;
				//console.log("1lastRotationY: " + lastRotationY);
			}
			//console.log("z: " + controls.getRotation().x + ", " + controls.getRotation().y + ", " + controls.getRotation().z);
			//else
			//{				
				//camera.rotation.z = -controls.getRotation().y;
				/*
				if (camera.rotation.z >= 0.1)
					camera.rotation.z -= 0.1;
				if (camera.rotation.z <= -0.1)
					camera.rotation.z += 0.1;
				
				lastRotationY = controls.getRotation().y;
				*/
			//}
			
			/*
			if (camera.rotation.z < -90)
				camera.rotation.z = 90;
			if (camera.rotation.z > 90)
				camera.rotation.z = 90;
			*/
		}

		for (var i = 0; i < asteroids_reference.length; i++)
		{
			asteroids_reference[i].update(calcolateWorldTotalForceOnPosition(asteroids_reference[i].getPosition()));
			if (distance(navicella.position, asteroids_reference[i].getPosition()) > SOGLIA_VISUALE_NAVICELLA)
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
			planets_reference[i].update();
		
		skybox.position.x = navicella.position.x;
		skybox.position.y = navicella.position.y;
		skybox.position.z = navicella.position.z;
		
		//applyForces();

		var elapsed = clock.getElapsedTime();
		fire.update(elapsed);
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
   function showPlanets(nav_position)
   {
	   for (var i = 0; i < planets_reference.length; i++)
		   if (distance(planets_reference[i].position(), nav_position) >= SOGLIA_VISUALE_NAVICELLA)
		   {
				planets_reference[i].removeFromScene(scene);
		   }
		   
	   for (var i = 0; i < PLANETS_TOTAL_NUMBER; i++)
	   {
		   if (distance(planetsInfo[i].getPosition(), nav_position) < SOGLIA_VISUALE_NAVICELLA)
		   {
			   if (!planetsInfo[i].isVisible())
			   {
				 var p = new Planet(planetsInfo[i].getPosition().x, planetsInfo[i].getPosition().y, planetsInfo[i].getPosition().z);
				 p.create(planetsInfo[i].getScale(), planetsInfo[i].getTextureNumber());
				 p.createClouds();
				 p.generateMoon(planetsInfo[i].getMoonNumber(), planetsInfo[i].getMoonVelocities(), planetsInfo[i].getMoonPositions(), planetsInfo[i].getMoonScales());
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
   function applyForces()
   {
		var finalForce = new THREE.Vector3();
		for (var i = 0; i < planets_reference.length; i++)
	    {
			var distanza = (planets_reference[i].position().x - navicella.position.x) * (planets_reference[i].position().x - navicella.position.x) +
						(planets_reference[i].position().y - navicella.position.y) * (planets_reference[i].position().y - navicella.position.y) +
						(planets_reference[i].position().z - navicella.position.z) * (planets_reference[i].position().z - navicella.position.z);
			
			var direzione = new THREE.Vector3(planets_reference[i].position().x - navicella.position.x,
											planets_reference[i].position().y - navicella.position.y,
											planets_reference[i].position().z - navicella.position.z);
			
			var m1 = planets_reference[i].getMass();
			var m2 = MASSA_NAVICELLA;
			var forza = G * (m1 * m2) / distanza;
			
			finalForce.x += forza * direzione.x;
			finalForce.y += forza * direzione.y;
			finalForce.z += forza * direzione.z;
		   
		   var np = new THREE.Vector3(navicella.position.x + finalForce.x,
											navicella.position.y + finalForce.y,
											navicella.position.z + finalForce.z);
			navicella.position.set(np.x, np.y, np.z);
			
	    }	
   }
   
   function printVector3(v)
   {
	   return "(" + v.x + ";" + v.y + ";" + v.z + ")";
   }
   
   function aggiungi(p)
   {
		console.log("add new planet");
		
		var pos = -1;
		if (Math.random() * 100 < 50)
			pos = 1;
		
		var x,y,z;
		
		do{
			x = (Math.random() * (RANGE / 2) + (RANGE / 2)) * pos + navicella.position.x;
			y = (Math.random() * (RANGE / 2) + (RANGE / 2)) * pos + navicella.position.y;
			z = (Math.random() * (RANGE / 2) + (RANGE / 2)) * pos + navicella.position.z;
		}while(!lontanoDaPianeti(x,y,z));
		
		console.log("navicella x: " + navicella.position.x);
		console.log("navicella y: " + navicella.position.y);
		console.log("navicella z: " + navicella.position.z);
		
		console.log("pianeta x: " + x);
		console.log("pianeta y: " + y);
		console.log("pianeta z: " + z);
		
		
		var p = new Planet(x, y, z);
		scene.add(p.create());
		scene.add(p.generateMoon(Math.random() * 5));
		return p;
   }
   
   function lontanoDaPianeti(planetsInfo, x,y,z)
   {
	   for (var i = 0; i < planetsInfo.length; i++)	 
		   if (distanza(new THREE.Vector3(x,y,z), planetsInfo[i].getPosition()) < DISTANZA_MINIMA_TRA_PIANETI)
			   return false;
	   return true;
   } 
   
   function distanza(p1, p2)
   {
	   return Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2) + Math.pow(p1.z - p2.z,2);
   }
   
   function seguiNavicella()
   {
	   spotLight.position.set( navicella.position.x, navicella.position.y, navicella.position.z);
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