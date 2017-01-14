/*
 * Asteroid
 * Classe per la creazione e update dei pianeti
 */
Asteroid = function () 
{	
	var MIN_FORCE = 0.0005; // Minima forza spostamento
	var MAX_FORCE = 0.005; // Massima forza spostamento
	var DISTANCE_MAX_FROM_SPACESHIP = 150;	// Distanza massima di sopravvivenza dalla navicella
	var ASTEROID_SIZE = 3000; // Dimensione
	
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
	
	this.getMesh = getMesh;
	
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
	
	/*
	 * create
	 * Data la posizione della navicella e una distanza minima oltre alla quale
	 * poter creare l'asteroide, crea un nuovo asteroide con forza e direzioni casuali
	 */
	function create(navPosition, minimumDistance)
	{
		this.origin = this.generateOrigin(navPosition, minimumDistance);
		this.createWithParameters(this.origin, 
									this.generateDirection(navPosition), 
									this.generateForce());
	}
	
	/*
	 * getPosition
	 * Ritorna la posizione dell'asteroid
	 */
	function getPosition()
	{
		return this.asteroid.position;
	}
	
	/*
	 * createWithParameters
	 * Richiamata da create, ha in input l'origine, la direzione e la forza dell'asteroide,
	 * si occupa di caricare l'oggetto e di ritornarlo
	 */
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
	
	/*
	 * getMesh
	 * Ritorna la mesh dell'asteroide
	 */
	function getMesh()
	{
		if (this.asteroid.children.length == 1)
			if (this.asteroid.children[0].children.length == 1)
				if (this.asteroid.children[0].children[0]  instanceof THREE.Mesh)
					return this.asteroid.children[0].children[0];
		return null;
	}
	
	/*
	 * addToScene
	 * Aggiunge l'asteroide alla scena
	 */
	function addToScene(scene)
	{
		scene.add(this.asteroid);
	}
	
	/*
	 * removeFromScene
	 * Rimuove l'asteroide dalla scena (usata quando l'asteroide è troppo lontano)
	 */
	function removeFromScene(scene)
	{
		scene.remove(this.asteroid);
	}
	
	/*
	 * generateOrigin
	 * Genera la posizione di origine dell'asteroide
	 */
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
	
	/* 
     * generateDirection
	 * Genera la direzione dell'asteroide
	 */
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
	
	/*
	 * generateForce
	 * Genera la forza (ossia la velocità) dell'asteroide
	 */
	function generateForce()
	{
		return Math.random() * (MAX_FORCE - MIN_FORCE) + MIN_FORCE;
	}
	
	/*
	 * inCollision
	 * True se è in collisione con la posizione data in input, false altrimenti
	 * Nota: non viene più usato, è stato sostituto dai raggi che partono dalla navicella
	 */
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
	
	/*
	 * explode
	 * Per sviluppi futuri: fa esplodere l'asteroide
	 * Non usata attualmente
	 */
	function explode(scene)
	{
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