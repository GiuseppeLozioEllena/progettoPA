Planet = function ( x_pianeta, y_pianeta, z_pianeta ) {
	this.x = x_pianeta;
	this.y = y_pianeta;
	this.z = z_pianeta;
	this.numero_lune = 0;
	this.create = create;
	this.createClouds = createClouds;
	this.generateMoon = generateMoon;
	this.createMoon = createMoon;
	this.update = update;
	this.position=position;
	this.getPlanet = getPlanet;
	this.getMoons = getMoons;
	this.getClouds = getClouds;	
	
	var SCALA_MINIMA = 40;
	var SCALA_VARIAZIONE_MASSIMA = 20;

	function update()
	{
		this.planet_reference.rotation.z += 0.001;
		//this.clouds.rotation.z -= .00025;
		
		for (i = 0; i < this.numero_lune; i++)
		{
			this.master_reference.children[i].rotation.x += this.moons_velocity[i];
			this.master_reference.children[i].rotation.y += this.moons_velocity[i];
			//master_reference.children[i].rotation.z += 0.005;
		}
	}

	function create()
	{
		this.texture = "textures/planets_downloaded/texture" + Math.round(Math.random() *100+1) + ".jpg";
		//this.texture = "textures/planet/earth_texture_2.jpg";
		this.scala = Math.random() * SCALA_VARIAZIONE_MASSIMA + SCALA_MINIMA;
		var model=new Model(this.x,this.y,this.z);
		var modelM = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          specular: 0x333333,
          shininess: 25});
		this.planet_reference = model.loadModelTexture(this.texture,this.scala,modelM);
		
	
		return this.planet_reference;
	}
	
	function createClouds()
	{
		var model=new Model(this.x,this.y,this.z);
		var modelM = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.1});
		this.clouds =  model.loadModelTexture("textures/clouds/clouds_2.jpg",this.scala + 2.5,modelM);
		
		return this.clouds;
	}

	function generateMoon(numero_lune_pianeta)
	{
		this.numero_lune = numero_lune_pianeta;
		this.master_reference = new THREE.Object3D();
		this.master_reference.position.set(this.x,this.y,this.z);
		this.moons_velocity = []
		for (i = 0; i < this.numero_lune; i++)
		{
			this.createMoon(this.x,this.y,this.z);
			this.moons_velocity[i] = Math.random() / 100;
		}
		return this.master_reference;
	}

	function createMoon()
	{	
		parent = new THREE.Object3D();
		parent.position.set(0,0,0);
		
		var model=new Model(0, Math.random() * 20 + 100, 0);
	     var modelM = new THREE.MeshPhongMaterial({
          });
		this.moon =  model.loadModelTexture("textures/planet/moon.jpg",2.5 * (Math.random() * 2 + 4),modelM);
		
		parent.add(this.moon);
		this.master_reference.add(parent);
	}

	function position()
	{
		var pos=new THREE.Vector3(this.x, this.y,this.z);
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
}