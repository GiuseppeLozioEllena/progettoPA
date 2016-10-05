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

  function init()
  {

    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,500);
    renderer=new THREE.WebGLRenderer({antialias:true});

    renderer.setClearColor(0xdddddd);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.soft=true;

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
  for (i = 0; i < 20; i++)
  {
	x = getRandomInt(-30,30); 
	y = getRandomInt(-30,30); 
	z = getRandomInt(-30,30); 
	generaPianeta(x,y,z);
  }
  generaPianeta(41,50,10);
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
  function generaPianeta(x,y,z)
  {
        var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();

        var onError = function ( xhr ) {
        };

        var loader = new THREE.ImageLoader( manager );
        loader.load( 'model/earth.jpg', function ( image ) {
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
        },onError );
  }
  
  function caricaNavicella()
  {
		var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();

        var onError = function ( xhr ) {
        };

        var loader = new THREE.ImageLoader( manager );
        loader.load( 'model/texture_navicella_blu.jpg', function ( image ) {
          texture.image = image;
          texture.needsUpdate = true;
        } );
		
        // model
        var loader = new THREE.OBJLoader( manager );
        loader.load( 'model/navicella.obj', function ( object )
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
		
		var axis = new THREE.AxisHelper(100);
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
   }
   
   function seguiNavicella()
   {
	   // X red, Y green , Z blue
	   camera.position.set(navicella.position.x, navicella.position.y - 5, navicella.position.z + 5);
	   spotLight.position.set( navicella.position.x, navicella.position.y + 8, navicella.position.z);
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