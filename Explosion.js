Explosion = function()
{
	// Settings
	var movementSpeed = 80;
	var totalObjects = 5000;
	var objectSize = 1;
	var sizeRandomness = 4000;
	var colors = [0xFF0000];
	
	var dirs = [];
	var parts = [];
	
	this.esplodi = esplodi;
	this.render = render;

	this.ExplodeAnimation = ExplodeAnimation;

	function ExplodeAnimation(x, y, z, scene)
	{
	  var geometry = new THREE.Geometry();
	  
	  for (i = 0; i < totalObjects; i ++) 
	  { 
		var vertex = new THREE.Vector3();
		vertex.x = x;
		vertex.y = y;
		vertex.z = z;
	  
		geometry.vertices.push( vertex );
		dirs.push({x: (Math.random() * movementSpeed) - (movementSpeed / 2),
					y: (Math.random() * movementSpeed) - (movementSpeed / 2),
					z: (Math.random() * movementSpeed) - (movementSpeed / 2)});				
	  }
	  var material = new THREE.ParticleBasicMaterial( { size: objectSize,  color: colors[0] });
	  var particles = new THREE.ParticleSystem( geometry, material );
	  
	  this.object = particles;
	  this.status = true;
	  
	  this.xDir = (Math.random() * movementSpeed) - (movementSpeed/2);
	  this.yDir = (Math.random() * movementSpeed) - (movementSpeed/2);
	  this.zDir = (Math.random() * movementSpeed) - (movementSpeed/2);
	  
	  scene.add( this.object  ); 
	  
	  this.update = function(){
		if (this.status == true){
		  var pCount = totalObjects;
		  while(pCount--) {
			var particle =  this.object.geometry.vertices[pCount]
			particle.y += dirs[pCount].y;
			particle.x += dirs[pCount].x;
			particle.z += dirs[pCount].z;
		  }
		  this.object.geometry.verticesNeedUpdate = true;
		}
	  }
	  
	}

	//parts.push(new ExplodeAnimation(0, 0));
	//render();

	function render() 
	{
		//requestAnimationFrame( render ); 
		var pCount = parts.length;
		while(pCount--)
			parts[pCount].update();
	}

	function esplodi(x,y,z, scene)
	{
		//parts.push(new ExplodeAnimation((Math.random() * sizeRandomness)-(sizeRandomness / 2), (Math.random() * sizeRandomness) - (sizeRandomness / 2)));
		parts.push(new ExplodeAnimation(x,y,z, scene));
	}
}