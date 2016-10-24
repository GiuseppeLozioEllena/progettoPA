$(function()
{
  var scene,camera,renderer;
  var controls,guiControls,datGUI;
  var stats;
  var spotLight,hemi;
  var SCREEN_WIDTH,SCREEN_HEIGHT;
  var navicella;
  

  var flipdirection;
  
  var clock = new THREE.Clock();
  
  var asteroid_center;

  var planets_reference; // Array con i riferimenti ai pianeti
  var skybox; // Skybox, viene spostato con la navicella
  var lensflares; // Array con i riferimenti alle lensflares
  var textureFlare1, textureFlare2, textureFlare3; // Texture dei lansflares
  
  // Parametri
  var LENS_FLARES_NUMBER = 8;
  var MAX_MOONS_NUMBER = 3;
  var PLANETS_NUMBER = 5;
  var RANGE = 1000;
  
  var index_planets_update;

  function init()
  {
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,10000);
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	
	index_planets_update = 0;
	
	skybox = setSkybox();
	scene.add(skybox);
   
  	renderer.setSize(window.innerWidth,window.innerHeight);
 
	camera.position.x=40;
	camera.position.y=50;
	camera.position.z=10;
	
	container = document.getElementById("webGL-container");

  	spotLight=new THREE.SpotLight(0xffffff,4,40);
  	spotLight.castShadow=true;

	spotLight.position.set(40, 55, 10);

  	scene.add(spotLight);
   
  	caricaNavicella(40,50,15); 
	
  	raycaster = new THREE.Raycaster();

	planets_reference = [];
	for (var i = 0; i < PLANETS_NUMBER; i++)
	{
		var x,y,z;
		
		do{
			x = (Math.random() * (RANGE * 2) - RANGE) + navicella.position.x;
			y = (Math.random() * (RANGE * 2) - RANGE) + navicella.position.y;
			z = (Math.random() * (RANGE * 2) - RANGE) + navicella.position.z;
		}while(!lontanoDaPianeti(x,y,z));
		
		var p = new Planet(x, y, z);
		scene.add(p.create());
		scene.add(p.createClouds());
		scene.add(p.generateMoon(Math.round(Math.random() * MAX_MOONS_NUMBER)));
		planets_reference.push(p);
	}
  	//generateAsteroid(60,50,10);
  	
  	generateLensFlares();

  
  function generateLensFlares()
  {
	lensFlares = [];
	var textureLoader = new THREE.TextureLoader();

	textureFlare1 = textureLoader.load( "textures/lensflare/lensflare0.png" );
	textureFlare2 = textureLoader.load( "textures/lensflare/lensflare2.png" );
	textureFlare3 = textureLoader.load( "textures/lensflare/lensflare3.png" );

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

	var lensFlare = new THREE.LensFlare( textureFlare1, 700, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
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

  function generateAsteroid(x,y,z)
  {

  flipdirection=1
  parent = new THREE.Object3D();
  parent.position.set(x,y,z);
  scene.add( parent );
  asteroid_center = parent;
  var model=new Model(0,10,0);
  var asteroid = model.LoadmodelScale('textures/planet/moon.jpg','model/Asteroid.obj',0.05);
  scene.add(asteroid);
  asteroid.rotation.z = 0;
  asteroid_center.add(asteroid);

  }


  
  function caricaNavicella(x,y,z)
  {
  
    var model=new Model(x,y,z);
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
		if (controls != null)
		{
			controls.movementSpeed = 0.33 * d;
			controls.update( delta );
			seguiNavicella();
		}
	
		for (var i = 0; i < PLANETS_NUMBER; i++)		
			planets_reference[i].update();
		
		skybox.position.x = navicella.position.x;
		skybox.position.y = navicella.position.y;
		skybox.position.z = navicella.position.z;
		
		if (distanza(planets_reference[index_planets_update].position(), navicella.position) > RANGE * RANGE * 3)
		{
			var pos = planets_reference[index_planets_update].position();
			console.log("elimina pianeta");
			//scene.remove(planets_reference[index_planets_update]);
			scene.remove(planets_reference[index_planets_update].getPlanet());
			scene.remove(planets_reference[index_planets_update].getMoons());
			scene.remove(planets_reference[index_planets_update].getClouds());
			planets_reference[index_planets_update] = aggiungi(pos);
		}

		console.log(scene.children.length);

		index_planets_update = (index_planets_update + 1) % PLANETS_NUMBER;

		/*
		if(asteroid_center.position.z>=20.01)
			flipdirection=0;
		else
		  if(asteroid_center.position.z<=-0.01)
			 flipdirection=1;
			
   
		if(asteroid_center!=null &&  flipdirection==1)
			asteroid_center.position.z+=0.05;
		else
			if(asteroid_center!=null && flipdirection==0)
			    asteroid_center.position.z-=0.05;

		//console.log(asteroid_center.position.z);
			
		*/
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
   
   function lontanoDaPianeti(x,y,z)
   {
	   for (var i = 0; i < planets_reference.length; i++)	 
		   if (distanza(new THREE.Vector3(x,y,z), planets_reference[i].position()) < 500)
			   return false;
	   return true;
   } 
   
   function distanza(p1, p2)
   {
	   return Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2) + Math.pow(p1.z - p2.z,2);
   }
   
   function seguiNavicella()
   {
	   
	   spotLight.position.set( navicella.position.x, navicella.position.y + 3, navicella.position.z);
	  
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