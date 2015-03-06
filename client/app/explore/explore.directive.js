angular.module('thesisApp')
  .directive('threeWorld', function() {
    return {
      restrict: 'E',
      controller: ['$scope', 'catalogFactory', 'modelData', function($scope, catalogFactory, modelData) {
        $scope.catalogFactory = catalogFactory;
        $scope.modelData = modelData;

        // Do range query to find 100 products with nearest x, y, z coordinates to camera
        $scope.doCoordinatesSearch = function(coordinatesObject, modelMap) {
          var coordinateFilters = [];
          for(var key in coordinatesObject) {
            coordinateFilters.push({
              term: key,
              value: coordinatesObject[key]
            });
          }

          $scope.catalogFactory.doSearch('', 0, coordinateFilters, 100, function(newProducts) {
            for(var j = 0; j < newProducts.results.length; j++) {
              var product = newProducts.results[j];
              $scope.createObject(modelMap, product);
            }
          });
        };
      }],
      link: function(scope) {
        var groundGeometry;
        var groundMaterial;
        var ground;

        var raycaster;
        var mouse = new THREE.Vector2();
        var collision;
        var radius = 100;
        var theta = 0;

        var clock = new THREE.Clock();

        var container, stats;
        var camera, scene, renderer;
        var sphere;
        var waterNormals;

        var WATER_WIDTH = 1000000;

        var parameters = {
          width: 2000,
          height: 2000,
          widthSegments: 250,
          heightSegments: 250,
          depth: 1500,
          param: 4,
          filterparam: 1
        };

        init();
        animate();

        function init() {

          /******************************************/
          /*         Window, renderer, scene        */
          /******************************************/

          container = document.createElement('div');
          container.id = 'three-world';
          document.body.appendChild(container);
          renderer = new THREE.WebGLRenderer();
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setSize(window.innerWidth, window.innerHeight);
          // Show shadows
          renderer.shadowMapEnabled = true;

          renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

          scene = new THREE.Scene();

          container.appendChild(renderer.domElement);

          // Set cursor as crosshair
          container.style.cursor = 'crosshair';

          /******************************************/
          /*            Camera controls             */
          /******************************************/

          camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 3000000);
          camera.position.set(2000, 750, 2000);

          controls = new THREE.FirstPersonControls(camera, renderer.domElement);
          controls.movementSpeed = 30000;
          controls.lookSpeed = 0.1;

          /******************************************/
          /*               Raycaster                */
          /******************************************/

          // Used to select objects on the screen
          raycaster = new THREE.Raycaster();

          /******************************************/
          /*               SpotLight                */
          /******************************************/

          var spotLight = new THREE.SpotLight(0xffffff);
          spotLight.position.set(-100000, 900000, 110000);

          // Show shadows, and show light source
          spotLight.castShadow = true;
          spotLight.shadowCameraVisible = false;

          spotLight.shadowMapWidth = 4096;
          spotLight.shadowMapHeight = 4096;

          // Where shadow starts and ends
          spotLight.shadowCameraNear = 1500;
          spotLight.shadowCameraFar = 1000000;

          // Defines how focused the light is
          spotLight.shadowCameraFov = 300;

          scene.add(spotLight);

          /******************************************/
          /*               Hemisphere               */
          /******************************************/

          var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
          light.position.set(-1, WATER_WIDTH, -1);

          light.shadowCameraVisible = true;

          scene.add(light);

          /******************************************/
          /*             Water surface              */
          /******************************************/

          waterNormals = new THREE.ImageUtils.loadTexture('assets/images/waternormals.jpg');
          waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

          water = new THREE.Water(renderer, camera, scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 1.0,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0
          });

          waterMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
            water.material
          );
          waterMesh.add(water);
          waterMesh.rotation.x = -Math.PI * 0.5;

          waterMesh.name = "waterMesh";

          scene.add(waterMesh);

          /******************************************/
          /*    Skybox / surrounding environment    */
          /******************************************/

          var cubeMap = new THREE.CubeTexture([]);
          cubeMap.format = THREE.RGBFormat;
          cubeMap.flipY = false;

          var loader = new THREE.ImageLoader();
          loader.load('assets/images/sky.jpg', function(image) {

            var getSide = function(x, y) {

              var size = 1024;

              var canvas = document.createElement('canvas');
              canvas.width = size;
              canvas.height = size;

              var context = canvas.getContext('2d');
              context.drawImage(image, -x * size, -y * size);

              return canvas;

            };
            cubeMap.images[0] = getSide(2, 1); // px
            cubeMap.images[1] = getSide(0, 1); // nx
            cubeMap.images[2] = getSide(1, 0); // py
            cubeMap.images[3] = getSide(1, 2); // ny
            cubeMap.images[4] = getSide(1, 1); // pz
            cubeMap.images[5] = getSide(3, 1); // nz
            cubeMap.needsUpdate = true;

          });

          var cubeShader = THREE.ShaderLib['cube'];
          cubeShader.uniforms['tCube'].value = cubeMap;

          var skyBoxMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
          });

          var skyBox = new THREE.Mesh(
            new THREE.BoxGeometry(WATER_WIDTH, WATER_WIDTH, WATER_WIDTH), skyBoxMaterial
          );

          skyBox.position.y += WATER_WIDTH / 2;
          skyBox.name = "skyBox";

          scene.add(skyBox);

          /******************************************/
          /*                Products                */
          /******************************************/

          // use model data to get modelToCategoryMap.json
          scope.modelData.get({}, function(modelMap) {
            var modelMap = modelMap;

            // Add multiple objects from cloudsearch product index
            scope.catalogFactory.doSearch('', 0, null, 100, function(newProducts) {
              for(var j = 0; j < newProducts.results.length; j++) {
                var product = newProducts.results[j];
                scope.createObject(modelMap, product);
              }
            });
          });
        }

        var colorTexture = ['blue', 'green', 'pink', 'red', 'yellow'];

        // create product 3D object
        scope.createObject = function(modelMap, product) {
          // load correct model based on product's category
          var loader = new THREE.OBJLoader();
          loader.load('assets/models/' + modelMap[product.category] + '.obj', function(object) {

            var objTexture = new THREE.Texture();
            var imgLoader = new THREE.ImageLoader();

            var idxCol = Math.floor( Math.random() * colorTexture.length );
            imgLoader.load( 'assets/images/' + colorTexture[idxCol] + 'Texture.jpg', function (image) {
              objTexture.image = image;
              objTexture.needsUpdate = true;
            });

            object.traverse(function(child) {
              if(child instanceof THREE.Mesh) {
                child.material.map = objTexture;
                child.material.side = THREE.DoubleSide;
                child.castShadow = true;
                child.receiveShadow = true;
                // child.material.wireframe = true;
                // child.material.overdraw = 0.5;
              }
            });

            object.position.x = product.x - 200000;
            object.position.y = product.y - 50000;
            object.position.z = product.z - 200000;
            // object.position.x = Math.random() * 500000 - 200000;
            // object.position.y = Math.random() * 300000 - 50000;
            // object.position.z = Math.random() * 500000 - 200000;
            object.rotation.x = degInRad(Math.random() * 90);
            object.rotation.y = degInRad(Math.random() * 90);
            object.rotation.z = degInRad(Math.random() * 90);

            object.scale.set(500, 500, 500);

            object.castShadow = true;
            object.receiveShadow = true;

            // add item to object
            object.name = "";
            object.product = product;

            // Add each item in scene
            scene.add(object);
          })
        };

        // handles resizing the renderer when the window is resized
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onDocumentMouseDown(event) {

          event.preventDefault();

          var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
          // Set the raycaster
          var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
          var intersects = raycaster.intersectObjects(scene.children, true);

          var selected = intersects[0].object;

          if(intersects.length > 0 && selected.name === "") {
            scope.showcaseProduct(selected.parent.product);
          }
        }

        function animate() {
          requestAnimationFrame(animate);
          render();
        }

        /******************************************/
        /*               Render scene             */
        /******************************************/

        function render() {

          var time = performance.now() * 0.001;

          water.material.uniforms.time.value += 1.0 / 60.0;
          water.render();

          // Bounding box for navigation in all axes
          if(controls.object.position.y > 2200000) {

            controls.moveForward = false;
            controls.moveBackward = false;
            controls.object.position.y -= 50;

          } else if(controls.object.position.y < 100) {

            controls.moveForward = false;
            controls.moveBackward = false;
            controls.object.position.y += 2;

          } else if(controls.object.position.x > (WATER_WIDTH / 2 - 300000)) {

            controls.moveForward = false;
            controls.moveBackward = false;
            controls.object.position.x -= 100;

          } else if(controls.object.position.x < -(WATER_WIDTH / 2 - 300000)) {

            controls.moveForward = false;
            controls.moveBackward = false;
            controls.object.position.x += 100;

          } else if(controls.object.position.z > (WATER_WIDTH / 2 - 300000)) {

            controls.moveForward = false;
            controls.moveBackward = false;
            controls.object.position.z -= 100;

          } else if(controls.object.position.z < -(WATER_WIDTH / 2 - 300000)) {

            controls.moveForward = false;
            controls.moveBackward = false;
            controls.object.position.z += 100;

          } else {
            controls.object.position.x;
            controls.object.position.y;
            controls.object.position.z;
          }

          controls.update(clock.getDelta());
          renderer.render(scene, camera);
        }

        // Convert radiant into degrees
        function degInRad(deg) {
          return deg * Math.PI / 180;
        }

        // hide the showcase by default
        $('#showcase-container').css('margin-right', '-1000px');

        scope.showcaseProduct = function(product) {
          var pastProduct = scope.showcase;
          scope.showcase = product;
          scope.$apply();

          // if no product previously showing, animate window out
          if(!pastProduct) {
            $('#showcase-container').animate({
              'margin-right': '+=1000px'
            }, 500);
          }
        };

        scope.close = function() {
          $('#showcase-container').animate({
            'margin-right': '-=1000px'
          }, 500);
          scope.showcase = null;
        }
      }
    };
  });
