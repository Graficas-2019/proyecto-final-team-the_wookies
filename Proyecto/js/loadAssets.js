function loadObj() {	
	if (index > type.length - 1) return;

	if(!mtlLoader) {
        mtlLoader = new THREE.MTLLoader();
    }

    if(!objLoader) {
        objLoader = new THREE.OBJLoader();
    }

    mtlURL = './models/' + type[index] + '.mtl';
    objURL = './models/' + type[index] + '.obj';
    
    mtlLoader.load(mtlURL, 
        function( materials ) {
           materials.preload();
           objLoader.setMaterials(materials);
            
            objLoader.load(objURL,
                function( object ) {
                    object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    } );
                    
                    // load Tree
                    if (index == 0){
                    	tree = object;
                		tree.scale.set(5, 5, 5);
                		tree.position.z = 0;
                		tree.position.x = 0;
                		tree.rotation.x = 0;
                		tree.rotation.y = Math.PI / 180 * 90;
                    }
                    
                    // load Arwing
                    if (index == 1){
                    	arwing = object;

                		arwing.scale.set(0.04, 0.04, 0.04);
                		
                		arwing.position.x = 0;
                		arwing.position.y = 15;
                		arwing.position.z = 50;

                		arwing.rotation.x = 0;
                		arwing.rotation.y = Math.PI;

                        arwing.box = new THREE.Box3().setFromObject(arwing);

                		group.add(object);
                    }
                    // load Laser
                    if (index == 2){
                    	laser = object;
                		laser.scale.set(0.7, 0.7, 0.7);
                		laser.position.z = 0;
                		laser.position.x = 0;

                		laser.rotation.x = 0;
                		laser.rotation.y = Math.PI / 180 * 90;
                    }
                    
                    // load Spaceship
                    if (index == 3){
                    	spaceship = object;
                		spaceship.scale.set(1.5, 1.5, 1.5);
                		
                		spaceship.position.x = 0;
                		spaceship.position.z = 0;

                		spaceship.rotation.x = 0;
                		spaceship.rotation.y = Math.PI * 90;
                    }
                    
                    // load Rock
                    if (index == 4){
                    	rock = object;
                		rock.scale.set(1.7, 1.7, 1.7);
                		rock.position.z = 0;
                		rock.position.x = 0;

                		rock.rotation.x = 0;
                		rock.rotation.y = Math.PI / 180 * 90;
                    }

                	index ++;
                	loadObj();
                },

                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                // called when loading has errors
                function ( error ) {
                    console.log( 'An error happened' );
                }
            );
        }
    );
}

function cloneObj(type) {
	var x = getRandomArbitrary(30, -30);
	var z = getRandomArbitrary(-250, -260);
	
	if (type == "spaceship"){
    	var y = getRandomArbitrary(8, 15);

    	var clone = spaceship.clone();
    	clone.position.set(x, y, z);
	}

	else if (type == "tree"){
		var clone = tree.clone();
		clone.position.set(x, -4.5, z);
        clone.rotation.set(0, getRandomArbitrary(10, 20), 0);
		
	}

	else if (type == "rock"){
		var clone = rock.clone();
		clone.position.set(x, -1, z);	
	}

    clone.box = new THREE.Box3();
    clone.score = 1;
    clone.alive = 1;
    clone.type = type;

    if (type == "rock" || type == "spaceship"){
    	enemies.push(clone);
    }

    else if (type == "tree"){
    	obstacles.push(clone);
    }
    
    scene.add(clone);
}


function cloneLaser(position) {
	var clone = laser.clone();
   
    clone.position.set(position.x, position.y, position.z);
    clone.alive = 1;
    clone.box = new THREE.Box3();

    shots.push(clone);
    scene.add(clone);
}
































/*
//Scene variables
var renderer = scene = camera = root = group = null;


//game variables
var game = false;
var duration = 60;
var life = score = highscore = spawn = nEnemies = 0;
var clock = null;
var currentTime = Date.now();
var high_scores = null;

//luces
var directionalLight = spotLight = ambientLight = null;
var mapUrl = "./images/grass.jpg";

//sombras
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

//objectos
var arwing = laser = tree = spaceship = rock = null;
var type = ["tree", "arwing", "laser", "spaceship", "rock"];
var index = 0;

var grass = grassAnimator = null;
var animateGrass = true;

var objLoader = mtlLoader = null;
var currTreeTime = currSpaceShipTime = currRockTime = 0;

var nextSpaceship = 1500,
nextTree = 1500,
nextRock = 1500;

var enemies = obstacles = shots = [];

//explosion
var movementSpeed = 80;
var totalObjects = 1000;
var objectSize = 10;
var sizeRandomness = 4000;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];

var dirs = parts = [];
var scene = container = material = particles = null;*/


