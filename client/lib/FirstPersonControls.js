/* Adapted from the following contributors */

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function(object, domElement) {

  this.object = object;
  this.target = new THREE.Vector3(0, 0, 0);

  this.domElement = (domElement !== undefined) ? domElement : document;

  this.enabled = true;

  this.movementSpeed = 1.0;
  this.lookSpeed = 0.005;

  this.lookVertical = true;
  this.autoForward = false;

  this.activeLook = true;

  this.heightSpeed = false;
  this.heightCoef = 1.0;
  this.heightMin = 0.0;
  this.heightMax = 1.0;

  this.constrainVertical = false;
  this.verticalMin = 0;
  this.verticalMax = Math.PI;

  this.autoSpeedFactor = 0.0;

  this.mouseX = 0;
  this.mouseY = 0;

  this.lat = 0;
  this.lon = 0;
  this.phi = 0;
  this.theta = 0;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;

  this.mouseDragOn = false;

  this.viewHalfX = 0;
  this.viewHalfY = 0;

  if (this.domElement !== document) {
    this.domElement.setAttribute('tabindex', -1);
  }


  this.handleResize = function() {
    if (this.domElement === document) {
      this.viewHalfX = window.innerWidth / 2;
      this.viewHalfY = window.innerHeight / 2;
    } else {
      this.viewHalfX = this.domElement.offsetWidth / 2;
      this.viewHalfY = this.domElement.offsetHeight / 2;
    }
  };

  this.onMouseMove = function(event) {
    if (this.domElement === document) {
      // this.mouseX = event.pageX - this.viewHalfX;
      // this.mouseY = event.pageY - this.viewHalfY;
    } else {
      this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
      this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
    }
  };

  this.onKeyDown = function(event) {
    if (event.keyCode === 87) {
      this.moveForward = true;
    } /* W */
    if (event.keyCode === 65) {
      this.moveLeft = true;
    } /* A */
    if (event.keyCode === 83) {
      this.moveBackward = true;
    } /* S */
    if (event.keyCode === 68) {
      this.moveRight = true;
    } /* D */
  };

  // When key is released, stop moving
  this.onKeyUp = function(event) {
    if (event.keyCode === 87) {
      this.moveForward = false;
    } /* W */
    if (event.keyCode === 65) {
      this.moveLeft = false;
    } /* A */
    if (event.keyCode === 83) {
      this.moveBackward = false;
    } /* S */
    if (event.keyCode === 68) {
      this.moveRight = false;
    } /* D */
  };

  this.update = function(delta) {

    if (this.enabled === false) return;

    if (this.heightSpeed) {
      var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
      var heightDelta = y - this.heightMin;
      this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    } else {
      this.autoSpeedFactor = 0.0;
    }

    var actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward || (this.autoForward && !this.moveBackward)) this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
    if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

    var actualLookSpeed = delta * this.lookSpeed;

    if (!this.activeLook) {
      actualLookSpeed = 0;
    }

    var verticalLookRatio = 1;

    if (this.constrainVertical) {
      verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    }

    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat);

    this.theta = THREE.Math.degToRad(this.lon);

    if (this.constrainVertical) {
      this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    }

    // Set the point of focus for the camera
    var targetPosition = this.target;
    var position = this.object.position;

    targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    targetPosition.y = position.y + 100 * Math.cos(this.phi);
    targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this.object.lookAt(targetPosition);

  };


  this.domElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  }, false);
  this.domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);

  window.addEventListener('keydown', bind(this, this.onKeyDown), false);
  window.addEventListener('keyup', bind(this, this.onKeyUp), false);

  function bind(scope, fn) {
    return function() {
      fn.apply(scope, arguments);
    };
  };
  this.handleResize();

};
