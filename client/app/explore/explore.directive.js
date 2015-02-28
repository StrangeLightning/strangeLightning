angular.module('thesisApp')
  .directive('threeWorld', function() {
    return {
      restrict: 'E',
<<<<<<< HEAD
<<<<<<< HEAD
      controller: ['$scope', 'catalogFactory', 'modelData', function($scope, catalogFactory, modelData) {
        $scope.catalogFactory = catalogFactory;
        $scope.modelData = modelData;
      }],
      link: function(scope) {
        var groundGeometry;
        var groundMaterial;
        var ground;
=======
      link: function (scope) {
>>>>>>> Have books in 3D world
=======
      link: function (scope) {
>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe

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
        var redTexture;

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

        var globalObject;

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
          spotLight.position.set(-10000, 10000, -10000);

          spotLight.castShadow = true;

          spotLight.shadowCameraVisible = true;

          spotLight.shadowMapWidth = 1024;
          spotLight.shadowMapHeight = 1024;

          spotLight.shadowCameraNear = 500;
          spotLight.shadowCameraFar = 4000;
          spotLight.shadowCameraFov = 30;

          scene.add(spotLight);

          /******************************************/
          /*               Hemisphere               */
          /******************************************/

          var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
          light.position.set(-1, 1000000, -1);

          light.shadowCameraVisible = true;

<<<<<<< HEAD
          scene.add(light);
=======
          scene.add( light );
>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe

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
            new THREE.BoxGeometry(1000000, 1000000, 1000000), skyBoxMaterial
          );

          skyBox.position.y += 1000000 / 2;
          skyBox.name = "skyBox";

          scene.add(skyBox);

          /******************************************/
<<<<<<< HEAD
<<<<<<< HEAD
          /*            Products                    */
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
=======
          /*           Object2 - character          */
          /******************************************/

=======
          /*           Object2 - character          */
          /******************************************/

>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe
          var texture = new THREE.Texture();
          var loader = new THREE.ImageLoader();
          loader.load( 'assets/images/redTexture.jpg', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;
<<<<<<< HEAD
>>>>>>> Have books in 3D world
=======
>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe
          });
        }

<<<<<<< HEAD
        // create product 3D object
        scope.createObject = function(modelMap, product){
          // load correct model based on product's category
          var loader = new THREE.OBJLoader();
          loader.load('assets/models/'+  modelMap[product.category] + '.obj', function(object) {
=======
          // Add OBJ object
          var loader = new THREE.OBJLoader();
          loader.load( 'assets/models/character.obj', function ( object ) {
            object.traverse( function ( child ) {
              if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
              }
            });

            object.position.set(1000, 20000, 1000);

            object.scale.set(500, 500, 500);

            object.receiveShadow = true;
            object.castShadow = true;

            globalObject = object;

            scene.add( object );
          });

          /******************************************/
          /*          Object3 - disco ball          */
          /******************************************/

          var geometry = new THREE.IcosahedronGeometry( 2000, 4 );

          for ( var i = 0, j = geometry.faces.length; i < j; i ++ ) {
            geometry.faces[ i ].color.setHex( 0xffffff );
          }

          var material = new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            shininess: 50,
            envMap: cubeMap
          });

          sphere = new THREE.Mesh( geometry, material );
          sphere.name = "centerSphere";
          sphere.position.set(3500,2500,5500);

          scene.add( sphere );

          /******************************************/
          /*            Multiple cubes              */
          /******************************************/

          // Add multiple objects
          for (var i = 0; i < 100; i++) {
            // Set a geometry for the object
            var geometry = new THREE.BoxGeometry(5000, 5000, 5000);
            //  Mesh the created geometry
            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }) );

            object.castShadow = true;
            object.receiveShadow = true;

>>>>>>> Have books in 3D world
            object.position.x = Math.random() * 500000 - 200000;
            object.position.y = Math.random() * 500000 - 50000;
            object.position.z = Math.random() * 500000 - 200000;
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

<<<<<<< HEAD
        function onDocumentMouseDown(event) {
=======
        /******************************************/
        /*            Selecting objects           */
        /******************************************/

        function onDocumentMouseDown( event ) {
>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe

          event.preventDefault();

          var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
          // Set the raycaster
          var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
          var intersects = raycaster.intersectObjects(scene.children, true);

<<<<<<< HEAD
          var selected = intersects[0].object;
=======
          if (SELECTED.type === '') {
            $state.transitionTo('product', {"id":"B002PNV6YE","price":"69.0","title":"Darice 120-Piece Deluxe Art Set","mediumImage":"http://ecx.images-amazon.com/images/I/51yN6cH-OfL._SL160_.jpg","category":"Art and Craft Supply","prodAttributes":{"Binding":["Office Product"],"Brand":["Darice"],"CatalogNumberList":[{"CatalogNumberListElement":["445060","NMC445060","110302","1103-02","FPS-298095"]}],"Color":["Multi"],"Department":["unisex-child"],"EAN":["0652695514296"],"EANList":[{"EANListElement":["0652695514296"]}],"Feature":["120-Piece deluxe art set with lots of art supplies for drawing, painting and more.","Includes markers, pencils, pastels, watercolors and plenty of accessories","Provides excellent way for kids and adults to experiment with a variety of artistic media","All in a black, snap-shut portable case","Small parts, not for children under 3 years"],"IsAdultProduct":["0"],"ItemDimensions":[{"Height":[{"_":"160","$":{"Units":"hundredths-inches"}}],"Length":[{"_":"1480","$":{"Units":"hundredths-inches"}}],"Weight":[{"_":"160","$":{"Units":"hundredths-pounds"}}],"Width":[{"_":"1100","$":{"Units":"hundredths-inches"}}]}],"ItemPartNumber":["1103-02"],"Label":["Darice"],"ListPrice":[{"Amount":["6995"],"CurrencyCode":["USD"],"FormattedPrice":["$69.95"]}],"Manufacturer":["Darice"],"ManufacturerMinimumAge":[{"_":"96","$":{"Units":"months"}}],"Model":["1103-02"],"MPN":["1103-02"],"NumberOfItems":["1"],"PackageDimensions":[{"Height":[{"_":"161","$":{"Units":"hundredths-inches"}}],"Length":[{"_":"1500","$":{"Units":"hundredths-inches"}}],"Weight":[{"_":"160","$":{"Units":"hundredths-pounds"}}],"Width":[{"_":"1110","$":{"Units":"hundredths-inches"}}]}],"PackageQuantity":["1"],"PartNumber":["1103-02"],"ProductGroup":["Art and Craft Supply"],"ProductTypeName":["OFFICE_PRODUCTS"],"Publisher":["Darice"],"ReleaseDate":["2013-07-28"],"Size":["120 Piece Set"],"Studio":["Darice"],"Title":["Darice 120-Piece Deluxe Art Set"],"UPC":["652695514296"],"UPCList":[{"UPCListElement":["652695514296"]}]}});
          }

          if ( intersects.length > 0 && SELECTED.name === "" ) {

            controls.enabled = false;

            SELECTED.scale.x *= 5;
            SELECTED.scale.y *= 5;
            SELECTED.scale.z *= 5;
>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe

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
          if(controls.object.position.y > 22000) {

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

<<<<<<< HEAD
        // hide the showcase by default
        $('#showcase-container').css('margin-right', '-1000px');

        scope.showcaseProduct = function(product) {
          var pastProduct = scope.showcase;
          scope.showcase = product;
          scope.$apply();

          // if no product previously showing, animate window out
          if(!pastProduct) {
            $('#showcase-container').animate({
              'margin-right': '+=1000'
            }, 500);
          }
        };

        scope.close = function() {
          $('#showcase-container').animate({
            'margin-right': '-=1000'
          }, 500);
          scope.showcase = null;
        }
=======
>>>>>>> d342fe4198d9c6bbfd3b492a35f62e31fe8361fe
      }
    };
  });
