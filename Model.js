var posx,posy,posz;
function Model(x,y,z) 
{
       posx=x;
       posy=y;
       posz=z;
       this.Loadmodel=Loadmodel;
       this.LoadmodelScale=LoadmodelScale;
}
 var onError = function ( xhr ) 
      {
      
      };

function Loadmodel(texture_path,model_path)
{
     var manager = new THREE.LoadingManager();
     var  texture = new THREE.Texture();
        console.log(texture_path);
        var loader = new THREE.ImageLoader(manager);
        loader.load( texture_path, function ( image ) 
        {
          texture.image = image;
          texture.needsUpdate = true;
        } );

        var loader = new THREE.OBJLoader(manager);
        var container = new THREE.Object3D();
        container.position.set(posx,posy,posz);
        loader.load( model_path, function ( object )
        {
          object.traverse( function ( child ) 
          {
            if ( child instanceof THREE.Mesh ) 
            {
              child.material.map = texture;
              
            }
          });
        container.add(object);
        },onError );

        return container;
}

function LoadmodelScale(texture_path,model_path,scale)
{

       var manager = new THREE.LoadingManager();
       var  texture = new THREE.Texture();
        console.log(texture_path);
        var loader = new THREE.ImageLoader(manager);
        loader.load( texture_path, function ( image ) 
        {
          texture.image = image;
          texture.needsUpdate = true;
        } );

        var loader = new THREE.OBJLoader(manager );
        var container = new THREE.Object3D();
        container.position.set(posx,posy,posz);
   

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
