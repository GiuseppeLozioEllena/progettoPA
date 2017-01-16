/*
 * Model
 * Classe utilizzata per caricare modelli 3D (navicella, asteroidi),
 * o per creare pianeti, lune
 */
 
 /*
  * Model
  * Costruttore: inizializza funzioni e coordinate
  */
	function Model(x_m,y_m,z_m) 
	{
       this.x = x_m;
       this.y = y_m;
       this.z = z_m;
       this.LoadmodelScale = LoadmodelScale;
       this.loadModelTexture = loadModelTexture;
	   this.loadModelWithTexture = loadModelWithTexture;
	}
	
	var onError = function ( xhr ) 
      {
      
      };

	  /*
	   * LoadmodelScale
	   * Dato il percorso di texture e modello, unito alla scala
	   * crea un nuovo oggetto
	   */
	function LoadmodelScale(texture_path,model_path,scale)
	{
		var manager = new THREE.LoadingManager();
		var texture = new THREE.Texture();
        var loader = new THREE.ImageLoader(manager);
        loader.load( texture_path, function ( image ) 
        {
			texture.image = image;
			texture.needsUpdate = true;
        });

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

	/*
	 * loadModelTexture
	 * Data la texture, la scala e il material, crea una sfera con tali caratteristiche
	 */
	function loadModelTexture(texture_path,scale,material)
	{
		var container = new THREE.Object3D();
		var loader = new THREE.TextureLoader();
		container.position.set(this.x,this.y,this.z);

		loader.load( texture_path, function ( texture ) 
		{
			var modelG = new THREE.SphereGeometry(scale,25,25);
			var modelM = material;
			texture.minFilter = THREE.LinearFilter;
			modelM.map=texture;
			var mesh=new THREE.Mesh(modelG,modelM);
			container.add(mesh);
		} );

		return container;
	}

	/*
	* loadModelWithTexture
	* A differenza di loadModelTexture qui viene passata direttamente la texture
	* in modo che non debba venir caricata ogni volta dal file
	*/
	function loadModelWithTexture(texture,scale,material)
	{
		var container = new THREE.Object3D();
		container.position.set(this.x,this.y,this.z);
		
		var modelG = new THREE.SphereGeometry(scale,25,25);
		var modelM = material;
		modelM.map=texture;
		var mesh=new THREE.Mesh(modelG,modelM);
		container.add(mesh);

		return container;
	}
