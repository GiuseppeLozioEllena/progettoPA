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
		this.scala = Math.random() * SCALA_VARIAZIONE_MASSIMA + SCALA_MINIMA;
		/*
		
		this.modello = "model/earth.obj";
	
		var model = new Model(this.x,this.y,this.z);	
		this.planet_reference = model.LoadmodelScale(this.texture, this.modello, this.scala);
		return this.planet_reference;
		*/
		
		var earthGeometry = new THREE.SphereGeometry( this.scala, 50, 50 );
		var earthMaterial = new THREE.MeshPhongMaterial({
		  map: new THREE.ImageUtils.loadTexture(this.texture),
		  color: 0x99FF99,
		  specular: 0x333333,
		  shininess: 50
		});

		this.planet_reference = new THREE.Mesh(earthGeometry, earthMaterial);
		this.planet_reference.position.x = this.x;
		this.planet_reference.position.y = this.y;
		this.planet_reference.position.z = this.z;
	
		return this.planet_reference;
	}
	
	function createClouds()
	{
		var cloudGeometry = new THREE.SphereGeometry(this.scala + 2.5,  50, 50);
		var cloudMaterial = new THREE.MeshPhongMaterial({
		  map: new THREE.ImageUtils.loadTexture("textures/clouds/clouds_2.jpg"),
		  transparent: true,
		  opacity: 0.1
		});

		this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
		this.clouds.position.x = x_pianeta;
		this.clouds.position.y = y_pianeta;
		this.clouds.position.z = z_pianeta;
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
		
		/*
		var model = new Model(0, Math.random() * 20 + 70, 0);
		var luna = model.LoadmodelScale('textures/planet/moon.jpg','model/moon.obj',2.5 * (Math.random() * 2 + 6));
		luna.rotation.z = 0;
		parent.add(luna);
		
		this.master_reference.add(parent);
		*/
		
		var moonGeometry = new THREE.SphereGeometry(2.5 * (Math.random() * 2 + 4), 50,50);
		var moonMaterial = new THREE.MeshPhongMaterial({
		  map: THREE.ImageUtils.loadTexture("textures/planet/moon.jpg")
		});
		var moon = new THREE.Mesh(moonGeometry, moonMaterial);
		moon.position.set(0, Math.random() * 20 + 100, 0);
		
		parent.add(moon);
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