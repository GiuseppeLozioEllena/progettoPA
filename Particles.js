Particles = function (x, y, z)
{
	this.engine = new ParticleEngine();
	//Examples.fireball.positionBase = new THREE.Vector3(x, y, z);
	this.engine.setValues( Examples.fireball );
	this.engine.initialize();
	this.update = update;
	this.restartEngine = restartEngine;
	
	var clock = new THREE.Clock();
	
	/*
	function restartEngine(parameters)
	{
		this.engine.destroy();
		this.engine = new ParticleEngine();
		this.engine.setValues( parameters );
		this.engine.initialize();
	}
	
	function update()
	{	
		controls.update();
		
		var dt = clock.getDelta();
		engine.update( dt * 0.5 );	
	}
	*/
}