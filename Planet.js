Planet = function ( x_pianeta, y_pianeta, z_pianeta ) {
	this.x = x_pianeta;
	this.y = y_pianeta;
	this.z = z_pianeta;
	this.numero_lune = 0;
	this.create = create;
	this.generateMoon = generateMoon;
	this.createMoon = createMoon;
	this.update = update;
	this.position=position;
	

	function update()
	{
		this.planet_reference.rotation.z += 0.003;
		
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
		this.modello = "model/earth.obj";
		this.scala = Math.random() * 20 + 80;
	
		var model = new Model(this.x,this.y,this.z);	
		this.planet_reference = model.LoadmodelScale(this.texture, this.modello, this.scala);
		return this.planet_reference;
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
		
		var model = new Model(0, Math.random() * 20 + 70, 0);
		var luna = model.LoadmodelScale('textures/planet/moon.jpg','model/moon.obj',2.5 * (Math.random() * 2 + 6));
		luna.rotation.z = 0;
		parent.add(luna);
		
		this.master_reference.add(parent);
	}

	function position()
	{
		var pos=new THREE.Vector3(this.x, this.y,this.z);
		return pos;
	}
}