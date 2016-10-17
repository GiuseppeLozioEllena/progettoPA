var x,y,z;
var numero_lune;
var lune;
var nome, descrizione;
var texture, modello, scala;

function Planet(x, y, z, texture, modello, scala, numero_lune)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.texture = texture;
	this.modello = modello;
	this.scala = scala;
	this.numero_lune = numero_lune;
	this.create = create;
}

function create()
{
	var model = new Model(x,y,z);	
	p = model.LoadmodelScale(texture, modello, scala);
	return p;
	//if (luna > 0)
		//generateMoon(x,y,z);
}