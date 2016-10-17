var x,y,z;
var numero_lune;
var lune;
var nome, descrizione;
var texture, modello, scala;

var planet_reference;

var master_reference;
var moons_velocity;

function Planet(x_pianeta, y_pianeta, z_pianeta, texture_pianeta, modello_pianeta, scala_pianeta)
{
	x = x_pianeta;
	y = y_pianeta;
	z = z_pianeta;
	texture = texture_pianeta;
	modello = modello_pianeta;
	scala = scala_pianeta;
	numero_lune = 0;
	this.create = create;
	this.generateMoon = generateMoon;
	this.createMoon = createMoon;
	this.update = update;
}

function update()
{
	planet_reference.rotation.z += 0.001;
	
	for (i = 0; i < numero_lune; i++)
	{
		master_reference.children[i].rotation.x += moons_velocity[i];
		master_reference.children[i].rotation.y += moons_velocity[i];
		//master_reference.children[i].rotation.z += 0.005;
	}
}

function create()
{
	var model = new Model(x,y,z);	
	planet_reference = model.LoadmodelScale(texture, modello, scala);
	return planet_reference;
}

function generateMoon(numero_lune_pianeta)
{
	numero_lune = numero_lune_pianeta;
	master_reference = new THREE.Object3D();
	master_reference.position.set(x,y,z);
	moons_velocity = []
	for (i = 0; i < numero_lune; i++)
	{
		createMoon(x,y,z);
		moons_velocity[i] = Math.random() / 100;
	}
	return master_reference;
}

function createMoon()
{	
	parent = new THREE.Object3D();
	parent.position.set(0,0,0);
	
	var model = new Model(0, Math.random() * 10 + 10, 0);
    var luna = model.LoadmodelScale('textures/planet/moon.jpg','model/moon.obj',2.5);
    luna.rotation.z = 0;
	parent.add(luna);
	
	master_reference.add(parent);
}