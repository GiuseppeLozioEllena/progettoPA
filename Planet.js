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
	this.inCollision = inCollision;
	this.addToScene = addToScene;
	this.removeFromScene = removeFromScene;	
	this.removeGlowFromScene = removeGlowFromScene;
	this.getPlanetReference = getPlanetReference;
	this.moon_scales = [];

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
	
	function getPlanetReference()
	{
		return this.planet_reference.children[0];
	}
	
	function addToScene(scene)
	{
		scene.add(this.planet_reference);
		if (this.clouds != null)
			scene.add(this.clouds);
		scene.add(this.master_reference);
		if (this.glow != null)
			scene.add(this.glow);
	}
	
	function removeFromScene(scene)
	{
		scene.remove(this.planet_reference);
		if (this.clouds != null)
			scene.remove(this.clouds);
		scene.remove(this.master_reference);
	}

	function create(scalaPianeta, numeroTexture)
	{
		this.scala = scalaPianeta;
		this.texture = "textures/planets_downloaded/texture" + numeroTexture + ".jpg";
		this.textureNumber = numeroTexture;
		//this.texture = "textures/planet/earth_texture_2.jpg";		
		this.mass = this.scala;
		var model=new Model(this.x,this.y,this.z);
		var modelM = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          specular: 0x333333,
          shininess: 25});
		this.planet_reference = model.loadModelTexture(this.texture, this.scala, modelM);
		
		return this.planet_reference;
	}
	
	function createClouds()
	{
		var model = new Model(this.x,this.y,this.z);
		var modelM = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.3});
		 		  
		this.clouds =  model.loadModelTexture("textures/clouds/clouds_2.jpg",this.scala + 2.5,modelM);
		
		return this.clouds;
	}
	
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
	
	function removeGlowFromScene(scene)
	{
		scene.remove(this.planetGlow);
		this.planetGlow = null;
	}

	function generateMoon(numero_lune_pianeta, velocity, positions, scales)
	{
		this.numero_lune = numero_lune_pianeta;
		this.master_reference = new THREE.Object3D();
		this.master_reference.position.set(this.x,this.y,this.z);
		this.moons_velocity = [];
		this.moon_scales = scales;
		for (i = 0; i < this.numero_lune; i++)
		{
			this.createMoon(positions[i], scales[i]);
			this.moons_velocity[i] = velocity[i];
		}
		return this.master_reference;
	}

	function createMoon(position, scale)
	{	
		parent = new THREE.Object3D();
		parent.position.set(0,0,0);
		
		var model = new Model(0, position, 0);
	    var modelM = new THREE.MeshPhongMaterial({ });
		this.moon =  model.loadModelTexture("textures/planet/moon.jpg", scale, modelM);
		
		parent.add(this.moon);
		this.master_reference.add(parent);
	}

	function position()
	{
		var pos = new THREE.Vector3(this.x, this.y,this.z);
		return pos;
	}

	function getPlanet()
	{
		return this.planet_reference;
	}

	function getMoons()
	{
		return this.master_reference;
	}

	function getClouds()
	{
		return this.clouds;
	}
	
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
	
	function getMass()
	{
		return this.mass;
	}
	
    function distance(p1, p2)
    {
	    return (p1.x - p2.x) * (p1.x - p2.x) +
				(p1.y - p2.y) * (p1.y - p2.y) +
				(p1.z - p2.z) * (p1.z - p2.z);
    }
}