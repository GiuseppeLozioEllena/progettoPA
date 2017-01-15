/*
 * FlyControls
 * Classe per gestire i comandi della navicella
 */
THREE.FlyControls = function ( object, domElement ) 
{
	var TURBO_MULTIPLIER = 10; // Velocità del turbo
	var TURBO_MAX_DURATION = 3; // Durata turbo
	var SOGLIA_DECELERAZIONE = -0.055; // Decelerazione navicella
	
	this.TURBO_SLEEP_TIME; // Si può richiamare solo dopo x secondi che lo si è usato
	
	this.listener = null;
	this.usable = true;
	this.fire = null;
	
	this.clock = new THREE.Clock();
	this.turboDuration = -1;
	this.lastTurboUsedTime = -1;

	this.object = object;
	this.navicella = object;
	
	this.oldVel = new THREE.Vector3(0,0,0);

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;
	this.play = false;
	this.pause = false;
	
	this.start_is_pressing = false;
	
	this.startPressed = startPressed;
	
	this.camera = null;
	this.setCamera = setCamera;
	
	this.checkXBoxController = checkXBoxController;
	this.doTurbo = doTurbo;
	
	this.manageFire = manageFire;
	this.setFire = setFire;

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0, turbo: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
	
	/* Variabili fuoco */
	var fireWidth  = 1.25;
	var fireHeight = 1;
	var fireDepth  = 1.75;
	var sliceSpacing = 0.25;

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {
			this[ event.type ]( event );
		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {
			return;
		}

		switch ( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;
			case 13: /* enter */ this.startPressed(); break;
			
			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 87: /*W*/ this.moveState.forward = 1; 
							this.manageFire(1);	
							break;

			case 38: /*up*/ this.moveState.pitchUp = 2; break;
			case 40: /*down*/ this.moveState.pitchDown = 2; break;

			case 65: /*A*/ this.moveState.yawLeft = 0; this.moveState.rollLeft = 15; this.pressed = true; break;
			case 68: /*D*/ this.moveState.yawRight = 0; this.moveState.rollRight = 15; this.pressed = true; break;
			
			case 32: /*Space*/  this.doTurbo(); break; 
		}

		this.updateMovementVector();
		this.updateRotationVector();
	};
	
	/*
     * setCamera
	 * Setta la camera del giocatore
	 */
	function setCamera(c)
	{
		this.camera = c;
	}
	
	/*
	 * setFire
	 * Setta il fuoco della navicella
	 */
	function setFire(f)
	{
		this.fire = f;
		this.manageFire(0);
	}
	
	/*
	 * manageFire
	 * Modifica la posizione (e quindi l'intensità) del fuoco, in base allo stato
	 * della navicella (ferma, avanti, turbo)
	 */
	function manageFire(s)
	{
		if (s == 0)
		{
			this.fire.mesh.position.z = 20; // Dietro la navicella, così non si vede
		}
		
		if (s == 1)
		{
			this.fire.mesh.position.z = 6.5;
		}
		
		if (s == 2)
		{
			this.fire.mesh.position.z = 10.5;
		}
	}
	
	/*
	 * startPressed
	 * Chiamato quando il giocatore preme start (su controller) o invio sulla tastiera	 
	 */
	function startPressed()
	{
		if(!this.play && !this.pause)
		{
			this.play=true;
		}
        else
        {
			if(!this.pause && this.play)
            {
				this.pause=true;
             	this.play=false;
            }
	    }
	}
	
	/*
	 * doTurbo
	 * Esegue il turbo della navicella
	 */
	function doTurbo()
	{
		if (this.usable)
		{
			this.moveState.turbo = 1; 
			if (this.turboDuration == -1)
			{
				this.turboDuration = 0;
				var audioLoader = new THREE.AudioLoader();

				if (this.listener == null)
				{
					this.listener = new THREE.AudioListener();
					this.object.add( this.listener );
				}
				
				var sound1 = new THREE.PositionalAudio( this.listener );
				audioLoader.load( 'sounds/propulsion.wav', function( buffer ) {
					sound1.setBuffer( buffer );
					sound1.setRefDistance( 20 );
					sound1.play();
				});
				
				this.manageFire(2);
				this.object.add(sound1);
			}
		}
	}

	/*
	 * keyup
	 * Funzione chiamata sull'evento keyup
	 */
	this.keyup = function( event ) {

		switch ( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;
			
			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 87: /*W*/ this.moveState.forward = 0;
						   this.manageFire(0);
						   break;
			case 83: /*S*/ this.moveState.back = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 65: /*A*/ this.moveState.yawLeft = 0; this.moveState.rollLeft = 0; break;
			case 68: /*D*/ this.moveState.yawRight = 0; this.moveState.rollRight = 0; break;
		}

		this.updateMovementVector();
		this.updateRotationVector();
	};
	
	/*
	 * checkXBoxController
	 * Controlla se il pad è collegato e in caso positivo
	 * verifica se sono stati premuti dei tasti
	 */
	function checkXBoxController()
	{	
		if (Gamepad.supported) 
		{
			var pads = Gamepad.getStates();
			var pad = pads[0];
			
			if (pad)
			{
				if (pad.leftStickX < -0.4)
					this.moveState.yawLeft = 1;
					
				if (pad.leftStickX > 0.4)
					this.moveState.yawRight = 1;
					
				if (pad.leftStickX >= -0.4 && pad.leftStickX <= 0.4)
				{
					this.moveState.yawLeft = 0;
					this.moveState.yawRight = 0;
				}
				
				if (pad.leftStickY < -0.4)
					this.moveState.pitchUp = 2;
				
				if (pad.leftStickY > 0.4)
					this.moveState.pitchDown = 2;
				
				if (pad.leftStickY >= -0.4 && pad.leftStickY <= 0.4)
				{
					this.moveState.pitchUp = 0;
					this.moveState.pitchDown = 0;
				}
								
				if (pad.leftShoulder1.pressed)
					this.moveState.rollLeft = 15; 
				else
					this.moveState.rollLeft = 0; 
				
				if (pad.rightShoulder1.pressed)
					this.moveState.rollRight = 15; 
				else
					this.moveState.rollRight = 0; 
				
				if (pad.faceButton0.pressed) // A on Xbox
				{
					this.moveState.forward = 1;
					this.manageFire(1);
				}
				else
					if (this.moveState.turbo == 0)
					{
						this.moveState.forward = 0;
						this.manageFire(0);
					}
				
				if (pad.faceButton3.pressed) // Y on Xbox
				{
					this.doTurbo();
				}
					
				if (pad.start.pressed && !this.start_is_pressing)
				{
					this.startPressed();
					this.start_is_pressing = true;
				}
				else
				{
					if (!pad.start.pressed)
						this.start_is_pressing = false;
				}
				
				/*
					Esempi di stati 
					if ( pad.faceButton0 ) // A on Xbox
					if ( pad.faceButton1 ) // B on Xbox
					if ( pad.faceButton2 ) // X on Xbox
					if ( pad.faceButton3 ) // Y	on Xbox
					if ( pad.start )
					if ( pad.select )
				*/
			}
		
			this.updateMovementVector();
			this.updateRotationVector();		
		}
	}

	/*
	 * update
	 */
	this.update = function( delta ) 
	{
		this.checkXBoxController();
	
		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;
		
		var turboZ = (this.moveState.turbo == 1) ? TURBO_MULTIPLIER : 1;
		
		var delta = this.clock.getDelta();
		if (this.usable)
		{
			if (this.turboDuration >= 0)
				this.turboDuration += delta;
		}

		if (this.moveState.turbo == 1 && this.usable)
		{
			if (this.turboDuration >= TURBO_MAX_DURATION)
			{
				this.usable = false;
				turboZ = 1;
				this.moveState.turbo = 0;
				this.lastTurboUsedTime = 0;
				if (this.moveState.forward == 0)
					this.manageFire(0);
				else
					this.manageFire(1);
			}
			else
			{
				this.usable = true;
				this.manageFire(2);
			}
		}
		else
		{
			if (this.usable == false)
			{
				this.lastTurboUsedTime += delta;
				if (this.lastTurboUsedTime >= this.TURBO_SLEEP_TIME)
				{
					this.turboDuration = -1;
					this.lastTurboUsedTime = -1;
					this.usable = true;
				}
			}
		}
		
		if (!this.usable)
			turboZ = 1;
		
		var vel = new THREE.Vector3(this.moveVector.x * moveMult, this.moveVector.y * moveMult, this.moveVector.z * moveMult * turboZ);
		
		if (Math.abs(vel.z) - Math.abs(this.oldVel.z) <	SOGLIA_DECELERAZIONE)
			vel.z = this.oldVel.z - SOGLIA_DECELERAZIONE;
		
		this.object.translateX( vel.x );
		this.object.translateY( vel.y );
		this.object.translateZ( vel.z );	
		
		this.oldVel = vel;
	
		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiply( this.tmpQuaternion );	
		this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
	};

	/*
	 * updateMovementVector
	 */
	this.updateMovementVector = function() {

		var forward = ( this.moveState.forward || this.moveState.turbo || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( - this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( - this.moveState.down    + this.moveState.up );
		this.moveVector.z = ( - forward + this.moveState.back );
	};

	/*
	 * updateRotationVector
	 */
	this.updateRotationVector = function() {

		this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );
	};

	/*
	 * getContainerDimensions
	 */
	this.getContainerDimensions = function() {

		if ( this.domElement != document ) 
		{
			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};
		} 
		else 
		{
			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};
		}

	};

	/* 
	 * bind
	 */
	function bind( scope, fn ) 
	{
		return function () {
			if (fn != null)
				fn.apply( scope, arguments );
		};
	}

	/* 
	 * contextmenu
	 */
	function contextmenu( event ) 
	{
		event.preventDefault();
	}

	/*
	 * dispose
	 */
	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _mousedown, false );
		this.domElement.removeEventListener( 'mousemove', _mousemove, false );
		this.domElement.removeEventListener( 'mouseup', _mouseup, false );

		window.removeEventListener( 'keydown', _keydown, false );
		window.removeEventListener( 'keyup', _keyup, false );

	}

	var _mousemove = bind( this, this.mousemove );
	var _mousedown = bind( this, this.mousedown );
	var _mouseup = bind( this, this.mouseup );
	var _keydown = bind( this, this.keydown );
	var _keyup = bind( this, this.keyup );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );

	this.domElement.addEventListener( 'mousemove', _mousemove, false );
	this.domElement.addEventListener( 'mousedown', _mousedown, false );
	this.domElement.addEventListener( 'mouseup',   _mouseup, false );

	window.addEventListener( 'keydown', _keydown, false );
	window.addEventListener( 'keyup',   _keyup, false );

	this.updateMovementVector();
	this.updateRotationVector();
};
