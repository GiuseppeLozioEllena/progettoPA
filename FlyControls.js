THREE.FlyControls = function ( object, domElement ) {

	var TURBO_MULTIPLIER = 10;
	var TURBO_MAX_DURATION = 3;
	var TURBO_SLEEP_TIME = 6; // Si può richiamare solo dopo x secondi che lo si è usato
	
	this.listener = null;
	this.usable = true;
	
	MAX_Y = 26;
	MIN_Y = -26;
	
	this.clock = new THREE.Clock();
	this.turboDuration = -1;
	this.lastTurboUsedTime = -1;

	this.object = object;
	
	this.lastAngle = 0;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;
	this.play=false;
	this.pause=false;
	
	this.start_is_pressing = false;
	
	this.startPressed = startPressed;
	
	this.checkXBoxController = checkXBoxController;
	this.doTurbo = doTurbo;

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0, turbo: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {
			this[ event.type ]( event );
		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;
			case 13: /* enter */ this.startPressed(); break;

			//case 87: /*W*/ this.moveState.forward = 1; break;
			//case 83: /*S*/ this.moveState.back = 1; break;

			//case 65: /*A*/ this.moveState.left = 1; break;
			//case 68: /*D*/ this.moveState.right = 1; break;
			
			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			//case 83: /*S*/ this.moveState.back = 1; break;
			case 87: /*W*/ this.moveState.forward = 1; break;

			case 38: /*up*/ this.moveState.pitchUp = 2; break;
			case 40: /*down*/ this.moveState.pitchDown = 2; break;

			case 65: /*A*/ this.moveState.yawLeft = 0; this.moveState.rollLeft = 15; this.pressed = true; break;
			case 68: /*D*/ this.moveState.yawRight = 0; this.moveState.rollRight = 15; this.pressed = true; break;
			
			case 32: /*Space*/  this.doTurbo(); break; 
			//case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			//case 69: /*E*/ this.moveState.rollRight = 1; break
		}


		this.updateMovementVector();
		this.updateRotationVector();

	};
	
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
			this.moveState.forward = 1;
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
				
				this.object.add(sound1);
			}
		}
	}

	this.keyup = function( event ) {

		switch ( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

			
			  //space bar
			//case 87: /*W*/ this.moveState.forward = 0; break;
			//case 83: /*S*/ this.moveState.back = 0; break;

			//case 65: /*A*/ this.moveState.left = 0; break;
			//case 68: /*D*/ this.moveState.right = 0; break;
			
			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 83: /*S*/ this.moveState.back = 0; break;
			case 87: /*W*/ this.moveState.forward = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 65: /*A*/ this.moveState.yawLeft = 0; this.moveState.rollLeft = 0; this.lastAngle = this.object.rotation.y; break;
			case 68: /*D*/ this.moveState.yawRight = 0; this.moveState.rollRight = 0; break;
			
			//case 32: /*Space*/ this.moveState.turbo = 0; this.moveState.forward = 0; break;

			//case 81: /*Q*/ this.moveState.rollLeft = 0; break;
			//case 69: /*E*/ this.moveState.rollRight = 0; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	/*
	this.mousedown = function( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus ++;

		} else {

			switch ( event.button ) {

				case 0: this.moveState.forward = 1; break;
				case 2: this.moveState.back = 1; break;

			}

			this.updateMovementVector();

		}

	};

	this.mousemove = function( event ) {

		if ( ! this.dragToLook || this.mouseStatus > 0 ) {

			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();

		}

	};

	this.mouseup = function( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus --;

			this.moveState.yawLeft = this.moveState.pitchDown = 0;

		} else {

			switch ( event.button ) {

				case 0: this.moveState.forward = 0; break;
				case 2: this.moveState.back = 0; break;

			}

			this.updateMovementVector();

		}

		this.updateRotationVector();

	};
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
					this.moveState.forward = 1;
				else
					if (this.moveState.turbo == 0)
						this.moveState.forward = 0;
				
				if (pad.faceButton3.pressed) // Y on Xbox
					this.doTurbo();
					
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
					Other potential events to handle:
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
				this.moveState.forward = 0;
				this.lastTurboUsedTime = 0;
			}
			else
				this.usable = true;
		}
		else
		{
			if (this.usable == false)
			{
				this.lastTurboUsedTime += delta;
				if (this.lastTurboUsedTime >= TURBO_SLEEP_TIME)
				{
					this.turboDuration = -1;
					this.lastTurboUsedTime = -1;
					this.usable = true;
				}
			}
		}
		
		if (!this.usable)
			turboZ = 1;
		
		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateY( this.moveVector.y * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult * turboZ);	
			
		var angoloInGradi = this.object.rotation.y * 180 / Math.PI;
		
		var canModifyY = 0;
		if (angoloInGradi >= MIN_Y && angoloInGradi <= MAX_Y || 
			(angoloInGradi >= MAX_Y && this.moveState.yawRight != 0) ||
			(angoloInGradi <= MIN_Y && this.moveState.yawLeft != 0))
			canModifyY = 1;
			
		canModifyY = 1; // DA ELIMINARE
			
		if (canModifyY == 1)
		{
			//console.log("ruoto di: " + this.rotationVector.x * rotMult + ", " + this.rotationVector.y * rotMult + ", " + this.rotationVector.z * rotMult);
			this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
			//console.log("ruoto di1: " + this.tmpQuaternion.x + ", " + this.tmpQuaternion.y + ", " + this.tmpQuaternion.z);
			this.object.quaternion.multiply( this.tmpQuaternion );
			/*
			this.object.quaternion.set( this.object.rotation.x + this.rotationVector.x * rotMult, 
											 this.object.rotation.y + this.rotationVector.y * rotMult, 
											 this.object.rotation.z + this.rotationVector.z * rotMult, 1 );
			*/
			//console.log("ruoto di2: " + this.object.quaternion.x + ", " + this.object.quaternion.y + ", " + this.object.quaternion.z);
			this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
		}
		else
		{
			this.tmpQuaternion.set( this.rotationVector.x * rotMult, 0, 0, 1 ).normalize();
			this.object.quaternion.multiply( this.tmpQuaternion );
			this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
		}
	};
	
	this.getRotation = function()
	{
		return this.object.rotation;
	}
	
	this.getLastAngle = function()
	{
		return this.lastAngle;
	}

	this.updateMovementVector = function() {

		var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( - this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( - this.moveState.down    + this.moveState.up );
		this.moveVector.z = ( - forward + this.moveState.back );

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};

	this.getContainerDimensions = function() {

		if ( this.domElement != document ) {

			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};

		} else {

			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};

		}

	};

	function bind( scope, fn ) {

		return function () {
			if (fn != null)
				fn.apply( scope, arguments );

		};

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

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
