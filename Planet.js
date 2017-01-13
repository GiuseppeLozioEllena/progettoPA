/*
 * Planet
 * Classe per la creazione e update dei pianeti
 */
Planet = function ( x_pianeta, y_pianeta, z_pianeta ) 
{	
	this.x = x_pianeta;
	this.y = y_pianeta;
	this.z = z_pianeta;
	this.numero_lune = 0;
	this.create = create;
	this.createClouds = createClouds;
	this.generateMoon = generateMoon;
	this.createMoon = createMoon;
	this.createGlow = createGlow;
	this.update = update;
	this.position = position;
	this.getPlanet = getPlanet;
	this.getMoons = getMoons;
	this.getClouds = getClouds;	
	this.getMass = getMass;
	this.isNear = isNear;
	this.inCollision = inCollision;
	this.addToScene = addToScene;
	this.removeFromScene = removeFromScene;	
	this.removeGlowFromScene = removeGlowFromScene;
	this.getPlanetReference = getPlanetReference;
	this.moon_scales = [];
	this.getRings = getRings;
	this.createRings = createRings;

	/*
	 * update
	 * Gestisce rotazione del pianeta e luna (se c'è)
	 */
	function update(camera)
	{
		this.planet_reference.rotation.z += 0.001;
		//this.clouds.rotation.z -= .00025;
		
		for (i = 0; i < this.numero_lune; i++)
		{
			this.master_reference.children[i].rotation.x += this.moons_velocity[i];
			this.master_reference.children[i].rotation.y += this.moons_velocity[i];
			//master_reference.children[i].rotation.z += 0.005;
		}
		
		if (this.planetGlow != null)
			this.planetGlow.material.uniforms.viewVector.value =  new THREE.Vector3().subVectors( camera.position, this.planetGlow.position );
	}
	
	/*
	 * getPlanetReference
	 * Ritorna il riferimento al pianeta
	 */
	function getPlanetReference()
	{
		return this.planet_reference.children[0];
	}
	
	/*
	 * addToScene
	 * Aggiunge pianeta, atmosfera, luna (se c'è) e anelli (se ci sono) alla scena
	 */
	function addToScene(scene)
	{
		scene.add(this.planet_reference);
		
		if (this.clouds != null)
			scene.add(this.clouds);
		
		scene.add(this.master_reference);
		
		if (this.glow != null)
			scene.add(this.glow);
		
		if (this.rings != null)
			scene.add(this.rings);
	}
	
	/*
	 * removeFromScene
	 * Rimuove pianeta, luna e anelli dalla scena
	 */
	function removeFromScene(scene)
	{
		scene.remove(this.planet_reference);
		if (this.clouds != null)
			scene.remove(this.clouds);
		scene.remove(this.master_reference);
	}

	/*
	 * create
	 * Dati in input scala del pianeta e numero di texture
	 * crea il nuovo pianeta
	 */
	function create(scalaPianeta, numeroTexture)
	{
		this.scala = scalaPianeta;
		this.texture = "textures/planets_downloaded/texture" + numeroTexture + ".jpg";

		this.textureNumber = numeroTexture;
		//this.texture = "textures/planet/earth_texture_2.jpg";	// Texture pianeta terra, da usare per debugging
		this.mass = this.scala;
		var model=new Model(this.x,this.y,this.z);
		var modelM = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          specular: 0x333333,
          shininess: 25});
	    this.planet_reference = model.loadModelTexture(this.texture, this.scala, modelM);
		
		return this.planet_reference;
	}
	
	/*
	 * createClouds
	 * Crea l'atmosfera, ha in input la texture
	 */
	function createClouds(texture)
	{
		var model = new Model(this.x,this.y,this.z);
		var modelM = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.3});
		 		  
		this.clouds =  model.loadModelWithTexture(texture,this.scala + 2.5,modelM);
		
		return this.clouds;
	}
	
	/*
	 * createGlow
	 * Data la camera e la scena, aggiunta lo shader rappresentante il pianeta selezionato al pianeta
	 */
	function createGlow(camera, scene)
	{
		var customMaterial = new THREE.ShaderMaterial( 
		{
			uniforms: 
			{ 
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 1.4 },
				glowColor: { type: "c", value: new THREE.Color(0x2FFF00) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		
		var ballGeometry = new THREE.SphereGeometry( this.scala + 7.5, 64, 64 );
		this.planetGlow = new THREE.Mesh( ballGeometry, customMaterial );
		
		this.planetGlow.position.set(this.x, this.y, this.z);
		
		scene.add(this.planetGlow);
	}
	
	/* 
	 * removeGlowFromScene
	 * Rimuove il glow dalla scena
	 */
	function removeGlowFromScene(scene)
	{
		scene.remove(this.planetGlow);
		this.planetGlow = null;
	}

	/* 
	 * generateMoon
	 * Crea le lune del pianeta
	 * Attualmente limitato a massimo una luna per problemi di performance
	 */
	function generateMoon(numero_lune_pianeta, velocity, positions, scales, texture)
	{
		this.numero_lune = numero_lune_pianeta;
		this.master_reference = new THREE.Object3D();
		this.master_reference.position.set(this.x,this.y,this.z);
		this.moons_velocity = [];
		this.moon_scales = scales;
		for (i = 0; i < this.numero_lune; i++)
		{
			this.createMoon(positions[i], scales[i], texture);
			this.moons_velocity[i] = velocity[i];
		}
		return this.master_reference;
	}
	
	/*
	 * createMoon
	 * Crea l'oggetto l'una vero e proprio
	 */
	function createMoon(position, scale, texture)
	{	
		parent = new THREE.Object3D();
		parent.position.set(0,0,0);
		
		var model = new Model(0, position, 0);
	    var modelM = new THREE.MeshPhongMaterial({ });
		this.moon =  model.loadModelWithTexture(texture, scale, modelM);
		
		parent.add(this.moon);
		this.master_reference.add(parent);
	}

	/*
	 * position
	 * Ritorna la posizione del pianeta
	 */
	function position()
	{
		var pos = new THREE.Vector3(this.x, this.y,this.z);
		return pos;
	}

	/*
	 * getPlanet
	 */
	function getPlanet()
	{
		return this.planet_reference;
	}

	/*
	 * getMoons
	 */
	function getMoons()
	{
		return this.master_reference;
	}

	/*
	 * getClouds
	 */
	function getClouds()
	{
		return this.clouds;
	}
	
	/*
	 * inCollision
	 * Data la posizione della navicella, ritorna true se è in corso una collisione, false altrimenti
	 */
	function inCollision(navPosition)
	{
		if (distance(navPosition, new THREE.Vector3(this.x, this.y, this.z)) < this.scala * this.scala + 5)
			return true;
		
		for (i = 0; i < this.numero_lune; i++)
		{
			var v = new THREE.Vector3();
			v.setFromMatrixPosition( this.master_reference.children[i].children[0].matrixWorld );
		
			if (distance(navPosition, v) < this.moon_scales[i] * this.moon_scales[i] + 1)
				return true;	
		}

		return false;
	}
	
	/*
	 * createRings
	 * Crea gli anelli intorno al pianeta
	 */
	function createRings(radius, rotation, textureNumber, segments) 
	{ 
		var manager = new THREE.LoadingManager();
		var texture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
		loader.load( 'textures/rings/rings' + textureNumber + '.png', function ( image ) 
		{
			texture.image = image;
			texture.needsUpdate = true;
		} );
		
		this.rings = new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 2 * radius, 2 * segments, 5, 0, Math.PI * 2), 
			new THREE.MeshBasicMaterial(
			{ 
				map: texture,
				side: THREE.DoubleSide, 
				transparent: true, 
				opacity: 0.6 
			})); 
					
		this.rings.position.set(this.x,this.y,this.z);
		this.rings.rotation.set(rotation.x, rotation.y, rotation.z);
		return this.rings;
	} 
	
	/*
	 * isNear
	 * Ritorna true se la navicella è vicina al pianeta, false altrimenti
	 */
	function isNear(navPosition)
	{
		if (distance(navPosition, new THREE.Vector3(this.x, this.y, this.z)) < (this.scala * this.scala + 5) * 20)
			return true;
		return false;
	}
	
	/*
	 * getMass
	 */
	function getMass()
	{
		return this.mass;
	}
	
	/*
	 * distance
	 * Calcola la distanza tra due punti (non fa la radice)
	 */
    function distance(p1, p2)
    {
	    return (p1.x - p2.x) * (p1.x - p2.x) +
				(p1.y - p2.y) * (p1.y - p2.y) +
				(p1.z - p2.z) * (p1.z - p2.z);
    }
	
	/*
	 * getRings
	 */
	function getRings()
	{
		return this.rings;
	}
}