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
  var textureFlare0, textureFlare2, textureFlare3;
  
  var terra,luna_center,asteroid_center;

  function init()
  {
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,500);
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	
	scene.add(setSkybox());

   
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
  	generaPianeta(41,50,10);
  	generateAsteroid(60,50,10);
  	
  	generateLensFlares();

  
  function generateLensFlares()
  {
	var textureLoader = new THREE.TextureLoader();

	textureFlare0 = textureLoader.load( "textures/lensflare/lensflare0.png" );
	textureFlare2 = textureLoader.load( "textures/lensflare/lensflare2.png" );
	textureFlare3 = textureLoader.load( "textures/lensflare/lensflare3.png" );

	addLight( 0.55, 0.9, 0.5, 50, 0, 10 );
	addLight( 0.08, 0.8, 0.5,    0, 0, 10 );
	addLight( 0.995, 0.5, 0.9, 40, 50, 10 );
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

	var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	lensFlare.position.copy( light.position );

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
	var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.renderDepth = 1000.0;  
	skyBox.rotation.x += Math.PI / 2;
	return skyBox;
  }
  
  function generaPianeta(x,y,z)
  {


    var model=new Model(x,y,z);
    terra = model.LoadmodelScale('textures/planet/earth.jpg','model/earth.obj',10);
    scene.add(terra);
    generateMoon(x,y,z);
   
  }


   function generateMoon(x,y,z)
  {
  parent = new THREE.Object3D();
  parent.position.set(x,y,z);
  scene.add( parent );
  luna_center = parent;
  generateGenericPlanet(0, 10, 0);

  }
  
  function generateGenericPlanet(x,y,z)
  {
    
    var model=new Model(x,y,z);
    var luna = model.LoadmodelScale('textures/planet/moon.jpg','model/moon.obj',2.5);
    scene.add(luna);
    luna .rotation.z = 0;
    luna_center.add(luna);
    
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

	var axis = new THREE.AxisHelper(5);
	navicella.add(axis);
		
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
		d = 10;
		if (controls != null)
		{
			controls.movementSpeed = 0.33 * d;
			controls.update( delta );
			seguiNavicella();
		}
		
		if (terra != null)
			terra.rotation.z += 0.001;
		
		if (luna_center != null)
			luna_center.rotation.z += 0.005;


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