
function Model(x_pianeta,y_pianeta,z_pianeta) 
{
       this.x = x_pianeta;
       this.y = y_pianeta;
       this.z = z_pianeta;
       this.LoadmodelScale=LoadmodelScale;
       this.loadModelTexture=loadModelTexture;
}
 var onError = function ( xhr ) 
      {
      
      };

function LoadmodelScale(texture_path,model_path,scale)
{
       var manager = new THREE.LoadingManager();
       var texture = new THREE.Texture();
        //console.log(texture_path);
        var loader = new THREE.ImageLoader(manager);
        loader.load( texture_path, function ( image ) 
        {
          texture.image = image;
          texture.needsUpdate = true;
        } );

        var loader = new THREE.OBJLoader(manager );
        var container = new THREE.Object3D();
        container.position.set(this.x,this.y,this.z);

        loader.load(model_path, function ( object )
        {
		  object.traverse( function ( child ) 
          {
            if ( child instanceof THREE.Mesh ) 
            {
			  child.material.map = texture;
              child.scale.set(scale,scale,scale);
            }
          });
        container.add(object);
       
        },onError );

        return container;
}


function loadModelTexture(texture_path,scale,material)
{
   var container = new THREE.Object3D();
   var loader = new THREE.TextureLoader();
   container.position.set(this.x,this.y,this.z);

	loader.load( texture_path, function ( texture ) 
	{
	  var modelG = new THREE.SphereGeometry(scale,50,50);
	  var modelM = material;
	  modelM.map=texture;
	  var mesh=new THREE.Mesh(modelG,modelM);
	  container.add(mesh);
	} );

	return container;
}
