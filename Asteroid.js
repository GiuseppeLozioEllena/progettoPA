/*
 * Asteroid
 * Classe per la creazione e update dei pianeti
 */
Asteroid = function () 
{	
	var MIN_FORCE = 0.0005;
	var MAX_FORCE = 0.005;
	var DISTANCE_MAX_FROM_SPACESHIP = 150;
	
	var ASTEROID_SIZE = 3000; // Forse da abbassare un po'
	
	this.create = create;
	this.createWithParameters = createWithParameters;
	
	this.getPosition = getPosition;
	
	this.update = update;
	this.addToScene = addToScene;
	this.removeFromScene = removeFromScene;
	
	this.generateOrigin = generateOrigin;
	this.generateDirection = generateDirection;
	this.generateForce = generateForce;
	
	this.inCollision = inCollision;
	
	this.distance = distance;
	
	this.explosion = null;
	this.explode = explode;
	
	/*
	 * update
	 * Modifica la posizione del mondo
	 * Richiede in input le forze dell'universo
	 * Generate quindi dai pianeti tramite la legge
	 * di gravitazione universale di Newton
	 */
	function update(worldTotalForce)
	{
		if (this.explosion != null)
			this.explosion.animate();
		else
		{
			this.asteroid.position.set(this.asteroid.position.x + worldTotalForce.x + this.direction.x * this.force,
									this.asteroid.position.y + worldTotalForce.y + this.direction.y * this.force,
									this.asteroid.position.z + worldTotalForce.z + this.direction.z * this.force);
		}
	}
	
	function create(navPosition, minimumDistance)
	{
		this.origin = this.generateOrigin(navPosition, minimumDistance);
		this.createWithParameters(this.origin, 
									this.generateDirection(navPosition), 
									this.generateForce());
	}
	
	function getPosition()
	{
		return this.asteroid.position;
	}
	
	function createWithParameters(o, d, f)
	{
		this.origin = o;
		this.direction = d;
		this.force = f;
		this.scala = Math.random();
		var model = new Model(this.origin.x, this.origin.y, this.origin.z);
		this.asteroid = model.LoadmodelScale('textures/planet/asteroid.png','model/Asteroid.obj', this.scala);
		return this.asteroid;
	}
	
	function addToScene(scene)
	{
		scene.add(this.asteroid);
	}
	
	function removeFromScene(scene)
	{
		scene.remove(this.asteroid);
	}
	
	function generateOrigin(navPosition, minimumDistance)
	{
		var randomDirection = new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
		var randomPoint = new THREE.Vector3(0,0,0);
		
		randomPoint = new THREE.Vector3(navPosition.x + randomDirection.x,
										navPosition.y + randomDirection.y,
										navPosition.z + randomDirection.z);
		
		while(this.distance(navPosition, randomPoint) < minimumDistance)
		{
			randomPoint = new THREE.Vector3(randomPoint.x + randomDirection.x,
											randomPoint.y + randomDirection.y,
											randomPoint.z + randomDirection.z);
		}
		return randomPoint;
	}
	
	function generateDirection(navPosition)
	{
		var randomDirection = new THREE.Vector3(Math.random() * DISTANCE_MAX_FROM_SPACESHIP - DISTANCE_MAX_FROM_SPACESHIP / 2, 
												Math.random() * DISTANCE_MAX_FROM_SPACESHIP - DISTANCE_MAX_FROM_SPACESHIP / 2, 
												Math.random() * DISTANCE_MAX_FROM_SPACESHIP - DISTANCE_MAX_FROM_SPACESHIP / 2);
		var internalPoint = new THREE.Vector3(navPosition.x + randomDirection.x,
									navPosition.y + randomDirection.y,
									navPosition.z + randomDirection.z);
		return new THREE.Vector3(internalPoint.x - this.origin.x,
								 internalPoint.y - this.origin.y,
								 internalPoint.z - this.origin.z);
	}
	
	function generateForce()
	{
		return Math.random() * (MAX_FORCE - MIN_FORCE) + MIN_FORCE;
	}
	
	function inCollision(navPosition)
	{
		if (this.explosion == null)
		{
			if (distance(navPosition, this.asteroid.position) < ASTEROID_SIZE * this.scala)
				return true;
			else
				return false;
		}
		else
			return false;
	}
	
	function explode(scene)
	{
		console.log("esplodo");
		var e = new ParticlesExplosion();
		e.init(scene, this.getPosition().x,
					this.getPosition().y,
					this.getPosition().z);
		this.explosion = e;
		this.removeFromScene(scene);
	}
	
	/*
    * distance
	* Dati due THREE.Vector3 calcola la distanza al quadrato tra i due
	* (non viene eseguita la radice per essere più veloce)
	*/
   function distance(p1, p2)
   {
	   return (p1.x - p2.x) * (p1.x - p2.x) +
				(p1.y - p2.y) * (p1.y - p2.y) +
				(p1.z - p2.z) * (p1.z - p2.z);
   }
}