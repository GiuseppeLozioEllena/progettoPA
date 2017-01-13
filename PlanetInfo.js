/*
 * PlanetInfo
 * Classe che gestisce le informazioni su un pianeta
 */
PlanetInfo = function (position, scale, visibility) {
	var SCALA_MINIMA = 40; // Scala minima
	var SCALA_VARIAZIONE_MASSIMA = 15; // Scala massima = scala minima + variazione massima
	var MAX_MOONS_NUMBER = 1; // Numero di lune massimo
	var TEXTURES_NUMBER = 130; // Numero di texture pianeti diverse
	var RING_TEXTURES_NUMBER = 5; // Numero di texture anelli diversi
	var DISTANZA_MINIMA_LUNE = 25; // Distanza minima tra le lune (se ce ne sono più di una)
	
	var SCALA_MINIMA_ANELLI = 45; // Scala minima anelli
	var SCALA_MASSIMA_ANELLI = 60; // Scala massima anelli
	var PROBABILITA_ANELLI = 5; // Probabilità che un pianeta abbia gli anelli
	
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
	
	this.setRingSize = setRingSize;
	this.getRingSize = getRingSize;
	this.setRingRotation = setRingRotation;
	this.getRingRotation = getRingRotation;
	this.setRingTexture = setRingTexture;
	this.getRingTexture = getRingTexture;
	
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
		return Math.round(Math.random() * (TEXTURES_NUMBER - 1) + 1);
	}
	
	function generateMoonVelocities()
	{
		moonVelocities = [];
		for (var i = 0; i < this.moonNumber; i++)
			moonVelocities.push(Math.random() / 400);
		return moonVelocities;
	}
	
	function generateMoonPositions()
	{
		moonPositions = [];
		for (var i = 0; i < this.moonNumber; i++)
		{
			var pos;
			do{
				pos = Math.random() * 130 + 70;
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
	
	function setRingSize()
	{
		if (Math.random() * 100 < PROBABILITA_ANELLI)
		{
			this.ringSize = Math.random() * SCALA_MINIMA_ANELLI + SCALA_MASSIMA_ANELLI;
			this.moonNumber = 0; // Se ci sono gli anelli non ci sono lune (per evitare collisioni)
		}
		else
			this.ringSize = -1;
	}
	
	function getRingSize()
	{
		return this.ringSize;
	}
	
	function setRingRotation()
	{
		this.ringRotation = new THREE.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
	}
	
	function getRingRotation()
	{
		return this.ringRotation;
	}
	
	function setRingTexture()
	{
		this.ringTexture = Math.round(Math.random() * (RING_TEXTURES_NUMBER - 1) + 1);
	}
	
	function getRingTexture()
	{
		return this.ringTexture;
	}
}