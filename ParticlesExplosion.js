/*
 * ParticlesExplosion
 * Esplosione particellare, utilizzata quando esplode la navicella
 */
ParticlesExplosion = function()
{
	var particle;
	
	this.init = init;
	this.animate = animate;
	
	var PARTICLES_NUMBER = 60;
	
	var MIN_SIZE = 1;	
	var MAX_VARIATION = 4;
	
	/*
	 * init
	 * Crea l'esplosione nella scene scene alle coordinate (x,y,z)
	 */
	function init(scene, x, y, z) {	
		
		var material = new THREE.SpriteMaterial( {
			map: new THREE.CanvasTexture( generateSprite() ),
			blending: THREE.AdditiveBlending
		} );
		
		for ( var i = 0; i < PARTICLES_NUMBER; i++ ) {
			particle = new THREE.Sprite( material );
			initParticle( particle, i * 10, x, y, z );
			scene.add( particle );
		}
	}
	
	/*
	 * generateSprite
	 */
	function generateSprite() {
		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;
		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
		gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );
		return canvas;
	}
	
	/*
	 * initParticle
	 */
	function initParticle( particle, delay, x, y, z ) {
		var particle = this instanceof THREE.Sprite ? this : particle;
		var delay = delay !== undefined ? delay : 0;
		particle.position.set( x, y, z );
		particle.scale.x = particle.scale.y = Math.random() * MAX_VARIATION + MIN_SIZE;
		new TWEEN.Tween( particle )
			.delay( delay )
			.to( {}, 10000 )
			.onComplete( initParticle )
			.start();
		new TWEEN.Tween( particle.position )
			.delay( delay )
			.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 4000 - 2000, z: Math.random() * 4000 - 2000 }, 10000 )
			.start();
		new TWEEN.Tween( particle.scale )
			.delay( delay )
			.to( { x: 0.01, y: 0.01 }, 10000 )
			.start();
	}
	
	/*
	 * animate
	 */
	function animate() {
		requestAnimationFrame( animate );
		TWEEN.update();
	}
}