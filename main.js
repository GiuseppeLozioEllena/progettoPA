$(function()
{
  var scene,camera,renderer;
  var controls,guiControls,datGUI;
  var stats;
  var spotLight,hemi;
  var SCREEN_WIDTH,SCREEN_HEIGHT;
  var loader,model;
  var navicella;
  
  var clock = new THREE.Clock();
  var textureFlare0, textureFlare2, textureFlare3;
  
  var terra;

  function init()
  {
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,500);
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	
	scene.add(setSkybox());

    //renderer.setClearColor(0xdddddd);
    renderer.setSize(window.innerWidth,window.innerHeight);
    //renderer.shadowMap.enabled=true;
    //renderer.shadowMap.soft=true;

  	//controls=new THREE.OrbitControls(camera,renderer.domElement);
    //controls.addEventListener('change',animate);

	   camera.position.x=40;
	   camera.position.y=50;
	   camera.position.z=10;
	   //camera.lookAt(scene.position);
	   
	container = document.getElementById("webGL-container");

  spotLight=new THREE.SpotLight(0xffffff,4,40);
  spotLight.castShadow=true;
	//spotLight.position.set(20,30,40);
	spotLight.position.set(40, 55, 10);
	
	scene.add(new THREE.SpotLightHelper(spotLight));

  scene.add(spotLight);
  
  
  caricaNavicella();
  /*
  for (i = 0; i < 20; i++)
  {
	x = getRandomInt(-30,30); 
	y = getRandomInt(-30,30); 
	z = getRandomInt(-30,30); 
	generaPianeta(x,y,z);
  }
  */
  generaPianeta(41,50,10);
  
  generateLensFlares();
  //generateAsteroids();
  
  function generateMoon(parent)
  {
	// Parent
	//parent = new THREE.Object3D();
	//scene.add( parent );

	// pivots
	//var pivot1 = new THREE.Object3D();

	//pivot1.rotation.z = 0;
	
	//parent.add( pivot1 );
	
	generateGenericPlanet(0, 1, 0, "textures/planet/moon.jpg");

	// mesh
	//var mesh1 = new THREE.Mesh( geometry, material );

	//mesh1.position.y = 5;

	//pivot1.add( mesh1 );
  }
  
  function createMoonCallBack(mesh)
  {
	  //mesh1.position.y = 5;
  }
  
  function generateAstoroids()
  {
	  
  }
  
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
	skyBox.rotation.x += Math.PI / 2;
	return skyBox;
  }
  
  function generaPianeta(x,y,z)
  {
        var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();

        var onError = function ( xhr ) {
        };

        var loader = new THREE.ImageLoader( manager );
        loader.load( 'textures/planet/earth.jpg', function ( image ) {
          texture.image = image;
          texture.needsUpdate = true;
        } );
		
        // model
        var loader = new THREE.OBJLoader( manager );
        loader.load( 'model/earth.obj', function ( object )
        {
          object.traverse( function ( child ) 
          {
            if ( child instanceof THREE.Mesh ) 
            {
              child.material.map = texture;
			  
            }
		  });
		object.position.set(x,y,z);
        scene.add( object );
		terra = object;
		generateMoon(object);
        },onError );
  }
  
  function generateGenericPlanet(x,y,z, texture_path)
  {
        var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();

        var onError = function ( xhr ) {
        };

        var loader = new THREE.ImageLoader( manager );
        loader.load( texture_path, function ( image ) {
          texture.image = image;
          texture.needsUpdate = true;
        } );
		
        // model
        var loader = new THREE.OBJLoader( manager );
        loader.load( 'model/earth.obj', function ( object )
        {
          object.traverse( function ( child ) 
          {
            if ( child instanceof THREE.Mesh ) 
            {
              child.material.map = texture;
			  child.scale.set( 0.166, 0.166, 0.166 );
            }
		  });
		object.position.set(x,y,z);
        scene.add( object );

		object.rotation.z = 0;
		terra.add( object );
		
        },onError );
  }
  
  function caricaNavicella()
  {
		var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();

        var onError = function ( xhr ) {
        };

        var loader = new THREE.ImageLoader( manager );
        loader.load( 'textures/spaceship/diffuse.bmp', function ( image ) {
          texture.image = image;
          texture.needsUpdate = true;
        } );
		
        // model
        var loader = new THREE.OBJLoader( manager );
        loader.load( 'model/Feisar_Ship.obj', function ( object )
        {
          object.traverse( function ( child ) 
          {
            if ( child instanceof THREE.Mesh ) 
            {
              child.material.map = texture;
			  child.scale.set( 0.005, 0.005, 0.005 );
            }
		  });
		object.position.set(40,50,10);
		object.rotation.set(0,0,0);
		
		camera.position.set(40, 45, 15); // FUNGE SENZA FIGLIO
		//object.add(camera);	
		
		//camera.position.set(0, -0.25, 3); // FUNGE CON FIGLIO
		camera.lookAt(object.position);
		
		navicella = object;
		
		controls = new THREE.FlyControls( navicella );
		controls.movementSpeed = 1000;
		controls.domElement = container;
		controls.rollSpeed = Math.PI / 24;
		controls.autoForward = false;
		controls.dragToLook = false;
		
		var axis = new THREE.AxisHelper(5);
		navicella.add(axis);
		
        scene.add( object );
        },onError );
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
		d = 2;
		if (controls != null)
		{
			controls.movementSpeed = 0.33 * d;
			controls.update( delta );
			seguiNavicella();
		}
		
		if (terra != null)
			terra.rotation.z += 0.01;
   }
   
   function seguiNavicella()
   {
	   // X red, Y green , Z blue
	   camera.position.set(navicella.position.x, navicella.position.y - 5, navicella.position.z + 5);
	   spotLight.position.set( navicella.position.x, navicella.position.y + 3, navicella.position.z);
	   //spotLight.target.position.set(navicella.position);
	   camera.lookAt(navicella.position);
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