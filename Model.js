var manager,texture;
var posx,posy,posz;

function Model(x,y,z) 
{
  
       posx=x;
       posy=y;
       posz=z;
       manager = new THREE.LoadingManager();
       texture = new THREE.Texture();
       this.Loadmodel=Loadmodel;
       this.Loadtexture=Loadtexture;
       this.LoadmodelScale=LoadmodelScale;
}
 var onError = function ( xhr ) 
      {
      
      };

function Loadtexture(texture_path)
{
     
        console.log(texture_path);
        var loader = new THREE.ImageLoader(manager);
        loader.load( texture_path, function ( image ) 
        {
          texture.image = image;
          texture.needsUpdate = true;
        } );
 
}

function Loadmodel(model_path)
{
        var loader = new THREE.OBJLoader(manager );
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

function LoadmodelScale(model_path,x,y,z)
{
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
              child.scale.set(x, y, z);
            }
          });
        container.add(object);
       
        },onError );

        return container;
}
