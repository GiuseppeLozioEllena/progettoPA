/*
 * PlanetInfo
 * Classe che gestisce le informazioni su un pianeta
 */
PlanetInfo = function (position, scale, visibility) {
	
	var SCALA_MINIMA = 40;
	var SCALA_VARIAZIONE_MASSIMA = 20;
	var MAX_MOONS_NUMBER = 3;
	var TEXTURES_NUMBER = 100;
	var DISTANZA_MINIMA_LUNE = 10;
	
	this.position = position;
	this.scale = scale;
	this.visibility = visibility;

	this.getPosition = getPosition;
	
	this.getScale = getScale;
	this.setScale = setScale;
	
	this.getMoonNumber = getMoonNumber;
	this.setMoonNumber = setMoonNumber;
	
	this.getMoonVelocities = getMoonVelocities;
	this.setMoonVelocities = setMoonVelocities;
	
	this.getMoonPositions = getMoonPositions;
	this.setMoonPositions = setMoonPositions;
	
	this.getMoonScales = getMoonScales;
	this.setMoonScales = setMoonScales;
	
	this.getTextureNumber = getTextureNumber;
	this.setTextureNumber = setTextureNumber;
	
	this.generateScale = generateScale;
	this.generateMoonNumber = generateMoonNumber;
	this.generateTextureNumber = generateTextureNumber;
	this.generateMoonVelocities = generateMoonVelocities;
	this.generateMoonPositions = generateMoonPositions;
	this.generateMoonScales = generateMoonScales;
	
	this.isVisible = isVisible;
	this.setVisibility = setVisibility;
	
	this.moonDistantFromOtherMoons = moonDistantFromOtherMoons;
	
	function getPosition()
	{
		return this.position;
	}
	
	function getMoonNumber()
	{
		return this.moonNumber;
	}
	
	function getMoonVelocities()
	{
		return this.moonVelocities;
	}
	
	function getScale()
	{		
		return this.scale;
	}
	
	function getTextureNumber()
	{
		return this.textureNumber;
	}
	
	function getMoonPositions()
	{
		return this.moonPositions;
	}
	
	function getMoonScales()
	{
		return this.moonScale;
	}
	
	function setScale(scala)
	{
		this.scale = scala;
	}
	
	function setMoonNumber(numero)
	{
		this.moonNumber = numero;
	}
	
	function setTextureNumber(texture)
	{
		this.textureNumber = texture;
	}
	
	function setMoonVelocities(velocities)
	{
		this.moonVelocities = velocities;
	}
	
	function setMoonPositions(pos)
	{
		this.moonPositions = pos;
	}
	
	function setMoonScales(scales)
	{
		this.moonScale = scales;
	}
	
	function generateScale()
	{
		return Math.random() * SCALA_VARIAZIONE_MASSIMA + SCALA_MINIMA;
	}
	
	function generateMoonNumber()
	{
		return Math.round(Math.random() * MAX_MOONS_NUMBER);
	}
	
	function generateTextureNumber()
	{
		return Math.round(Math.random() * TEXTURES_NUMBER +1);
	}
	
	function generateMoonVelocities()
	{
		moonVelocities = [];
		for (var i = 0; i < this.moonNumber; i++)
			moonVelocities.push(Math.random() / 100);
		return moonVelocities;
	}
	
	function generateMoonPositions()
	{
		moonPositions = [];
		for (var i = 0; i < this.moonNumber; i++)
		{
			var pos;
			do{
				pos = Math.random() * 160 + 20;
			}while(!this.moonDistantFromOtherMoons(moonPositions, pos));
			moonPositions.push(pos);
		}
		return moonPositions;
	}
	
	function moonDistantFromOtherMoons(moons, pos)
	{
		for (var i = 0; i < moons.length; i++)
			if (Math.abs(moons[i], pos) < DISTANZA_MINIMA_LUNE)
				return false;
		return true;
	}
	
	function generateMoonScales()
	{
		moonScales = [];
		for (var i = 0; i < this.moonNumber; i++)
			moonScales.push(2.5 * (Math.random() * 2 + 4));
		return moonScales;
	}
	
	function isVisible()
	{
		return this.visibility;
	}
	
	function setVisibility(vis)
	{
		this.visibility = vis;
	}
}