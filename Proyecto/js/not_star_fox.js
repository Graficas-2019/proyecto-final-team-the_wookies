var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null;

var game = false,
life = 0,
score = 0,
highScore = 0,
spawn = 0,
nEnemies = 0,
duration = 60,
clock = null,
currentTime = Date.now();

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "./images/grass.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

var arwing = null,
laser = null,
tree = null,
spaceship = null,
rock = null;

var type = ["tree", "arwing", "laser", "spaceship", "rock"];
var index = 0;

var grass = null;
var grassAnimator = null;
var animateGrass = true;

var objLoader = null;
var mtlLoader = null;

var currTreeTime = 0,
currSpaceShipTime = 0,
currRockTime = 0;

var nextSpaceship = 1500,
nextTree = 1500,
nextRock = 1500;

var enemies = [];
var obstacles = [];
var shots = [];

///////////////////////////////////////////explosion
//////////////settings/////////
var movementSpeed = 80;
var totalObjects = 1000;
var objectSize = 10;
var sizeRandomness = 4000;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
/////////////////////////////////
var dirs = [];
var parts = [];
var scene = null;
var camera = null;
var container = null;
var renderer = null;
var material = null;
var particles = null;
////////////////////////////////////////////explosion

//var score = game.querySelector("section#game span.score");
var high_scores = null;
function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene

    camera = new THREE.PerspectiveCamera(  60, canvas.width / canvas.height, 0.1, 1000 );
    camera.position.set(0, 20, 100);

    scene.add(camera);

    //orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight (0x888888);
    spotLight.position.set(0, 170, 0);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 300;
    spotLight.shadow.camera.fov = 5;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create the objects
    loadObj();
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var waterMap = new THREE.TextureLoader().load(mapUrl);
    waterMap.wrapS = waterMap.wrapT = THREE.RepeatWrapping;
    waterMap.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(500, 200, 50, 50);
    grass = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:waterMap, side:THREE.DoubleSide}));
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -4.02;

    // Add the mesh to our group
    group.add( grass );
    grass.castShadow = false;
    grass.receiveShadow = true;

    // Create the skybox
    var directory = "images/";
	var cubeSides  = ["RIGHT", "LEFT", "TOP", "BUTTON", "BACK", "FRONT"];
	var imageSuffix = ".jpg";

	var arr = [];
	for (var i = 0; i < 6; i++){
		arr.push( new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( directory + cubeSides[i] + imageSuffix ), side: THREE.BackSide }));
	}

	// Add the skybox to our group
	var skyGeom = new THREE.CubeGeometry( 800, 400, 500 );
	var skyBox = new THREE.Mesh( skyGeom, arr );
	skyBox.position.y = 80;
	root.add( skyBox );

    // Now add the group to our scene
    scene.add( root );

    window.addEventListener( 'resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function run() {
    requestAnimationFrame(function() { run(); });
    // Render the scene
    renderer.render(scene, camera);
    // Update the animations
    animate();
}

function animate() {
    if ( game ){
        var now = Date.now();
        var deltat = clock.getDelta() * 1000;
        currentTime = now;

        generateGame(deltat, now);

        KF.update();
        
    }
}

function startGame() {
    
    score = 0;
    life = 3000;
    spawn = 0;
    id = 0;
    nEnemies = 15;

    if(enemies.length > 0){
        for(var i = 0; i < enemies.length; i++){
            scene.remove(enemies[i]);
        }   
    }

    if(obstacles.length > 0){
        for(var i = 0; i < obstacles.length; i++){
            scene.remove(obstacles[i]);
        }   
    }

    if(shots.length > 0){
        for(var i = 0; i < shots.length; i++){
            scene.remove(shots[i]);
        }   
    }

    enemies = [];
    obstacles = [];
    shots = [];

    document.getElementById("btn-start").hidden = true;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("timer").innerHTML = 60;
    document.getElementById("life").innerHTML = life;
    document.getElementById("game-menu").style.display = 'none';
    document.getElementById("game-menu").hidden = true;

    clock = new THREE.Clock();
    game = true;
    high_scores = document.getElementById("ola");
    //console.log(high_scores);
    HighScores();
}

function endGame(message){
    game = false;

    updateHighScore();
    UpdateScores();
    document.getElementById("timer").innerHTML = message;
    document.getElementById("btn-start").hidden = false;
    document.getElementById("btn-start").value = "Restart Game";
    document.getElementById("game-menu").style.display = 'flex';
    document.getElementById("game-menu").hidden = false;
}

function generateGame(deltat, now){


    var pCount = parts.length;
    while(pCount--) 
    {
      parts[pCount].update();
    }

    var timeRocks = now - currRockTime;
    var timeTrees = now - currTreeTime;
    var timeSpaceships = now - currSpaceShipTime;
    
    var seconds = Math.floor(duration - clock.elapsedTime);
        if (seconds > 0){
            updateTimer(seconds);

            if (life <= 0){
                seconds = 0;
                endGame("¡GAME OVER! :(");                
            }

        }
        else{
            seconds = 0;
            endGame("¡YOU WON! :)");
        }
        
        if (spawn < nEnemies) {
            if(timeRocks > nextRock) {
                currRockTime = now;
                spawn++;
                nextRock = 900;

                cloneObj("rock");

            }
        }

    	if (spawn < nEnemies) {
        	if(timeTrees > nextTree) {
                currTreeTime = now;
                spawn++;
	            nextTree = 400;
	            
	            cloneObj("tree");
        	}
    	}

	    if (spawn < nEnemies) {
	        if(timeSpaceships > nextSpaceship) {
	            currSpaceShipTime = now;
                spawn++;
                nextSpaceship = 200;
	            
	            cloneObj("spaceship");

	        }
		}

        if ( enemies.length > 0 ) {
        	
            for(var i = 0; i < enemies.length; i++){

            	if (enemies[i].type == "spaceship"){
            		enemies[i].position.z += 0.095 * deltat;
            	}

            	if (enemies[i].type == "rock"){
            		enemies[i].position.z += 0.050 * deltat;
            		enemies[i].rotation.x += 0.010 * deltat;
            	}
            	
                if (enemies[i].alive == 1){
                    if(enemies[i].position.z > 100 ) {  

                        if(enemies[i].score == 1){
                        	//console.log("-25 Dejó pasar");
                            enemies[i].score = 0;
                            updateScore(-25);
                            spawn--;
                            scene.remove(enemies[i]);
                            enemies.splice(i, 1);
                        }
                    } 
                }

                arwing.box.setFromObject(arwing);
                if(arwing.box.intersectsBox(enemies[i].box.setFromObject(enemies[i]))){
                    if (enemies[i].alive == 1){
                        if(enemies[i].score == 1){
                        	
                            if(enemies[i].type == "rock"){
                                updateLife(-20);
                                //console.log("Roca -20");
                                spawn--;
                            }

                            if(enemies[i].type == "spaceship"){
                                updateLife(-50);
                                var position = new THREE.Vector3();
                                position.getPositionFromMatrix( enemies[i].matrixWorld );
                                //console.log(position);
                                parts.push(new ExplodeAnimation(position.x,position.y,position.z));

                                //console.log("Nave -50");
                                spawn--;
                            }
                            enemies[i].alive = 0;
                        }
                    }
                }
            }
        }

        if ( obstacles.length > 0 ) {
        	for(var i = 0; i < obstacles.length; i++){

        		if (obstacles[i].type == "tree"){
            		obstacles[i].position.z += 0.075 * deltat;
            	}

            	if (obstacles[i].alive == 1){
                    if(obstacles[i].position.z > 100 ) {  

                        if(obstacles[i].score == 1){
                            obstacles[i].score = 0;
                            updateScore(-25);
                            spawn--;
                            scene.remove(obstacles[i]);
                            obstacles.splice(i, 1);
                        }
                    } 
                }

                arwing.box.setFromObject(arwing);
                if(arwing.box.intersectsBox(obstacles[i].box.setFromObject(obstacles[i]))){
                    if (obstacles[i].alive == 1){
                        if(obstacles[i].score == 1){

                            if(obstacles[i].type == "tree"){
                                updateLife(-70);
                                
                                //console.log("Árbol -70");
                                spawn--;
                            }
                            obstacles[i].alive = 0;
                        }
                    }
                }
        	}
        }
        if ( shots.length > 0 ){
            for(var j = 0; j < shots.length; j++){
                shots[j].position.z -= 0.5 * deltat;
                
                if(shots[j].position.z == -150) {
                    scene.remove(shots[j]);
                    shots.splice(j, 1);
                }

                else{
                
	                shots[j].box.setFromObject(shots[j]);
	                for(var k = 0; k < enemies.length; k++){

	                    if(shots[j].box.intersectsBox(enemies[k].box) && shots[j].alive == 1){
	                        scene.remove(shots[j]);



	                        if (enemies[k].alive == 1){
	                            if(enemies[k].score == 1){
	                                enemies[k].alive = 0;
	                            }
	                        }

	                        if (enemies[k].alive == 0){
	                            if(enemies[k].score == 1){

	                                enemies[k].score = 0;
	                                shots[j].alive = 0;
	                                

	                                if(enemies[k].type == "rock"){
	                                    updateScore(500);
	                                    scene.remove(enemies[k]);
	                                    console.log("Roca +500");
	                                    spawn--;
	                                }

	                                /*
	                                if(enemies[k].type == "tree"){
	                                    updateScore(750);
	                                    scene.remove(enemies[k]);
	                                    console.log("Árbol +750");
	                                    spawn--;
	                                }*/

	                                if(enemies[k].type == "spaceship"){
	                                    updateScore(1000);
	                                    scene.remove(enemies[k]);
                                        console.log("Nave +1000");
                                        var position = new THREE.Vector3();
                                        position.getPositionFromMatrix( enemies[k].matrixWorld );
                                
                                        parts.push(new ExplodeAnimation(position.x,position.y,position.z));
	                                    spawn--;
	                                }

	                                enemies.splice(k, 1);
	                            }
	                        }
	                    }
	                }
            	}
            }
        }
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

function onKeyDown(event){
	// Spacebar
    if( event.keyCode == 32){
	    var position = arwing.position;
	    cloneLaser(position);
    }

	// Top (W or arrow up)
	if ( event.keyCode == 87 || event.keyCode == 38 ){
		//console.log("Arriba");
        if(arwing.position.y <= 15){
        	arwing.position.y += 1.75;
    	}
    }
    
    // Button (S or arrow down)
    if ( event.keyCode == 83 || event.keyCode == 40 ){
    	//console.log("Abajo");
        if(arwing.position.y >= 0){
       		arwing.position.y -= 1.75;
   		}
    }
    
    // Right (D or arrow right)
    if ( event.keyCode == 68 || event.keyCode == 39 ) {
    	//console.log("Derecha");
        if(arwing.position.x <= 30){
        	arwing.position.x += 1.75;
    	}

	}

	// Left (A or arrow left)
    if ( event.keyCode == 65 || event.keyCode == 37 ) {
    	//console.log("Izquierda");
        if(arwing.position.x >= -30){
        	arwing.position.x -= 1.75;
    	}
    }
}

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

function playAnimations() {    
	// opacity animation
    if (grassAnimator)
        grassAnimator.stop();

    if (animateGrass) {
        grassAnimator = new KF.KeyFrameAnimator;
        grassAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, 1], 
                        values:[
                                { x : 0, y : 0 },
                                { x : 0, y : 1 },
                                ],
                        target:grass.material.map.offset
                    },
                ],
            loop: true,
            duration:0.25 * 1000
        });
        grassAnimator.start();
    }
}

function updateTimer(seconds) {
    document.getElementById("timer").innerHTML = "Timer: " + seconds;
}

function updateScore(n) {
    score = score + (n);
    document.getElementById("score").innerHTML = "Score: " + score;
}

function updateHighScore() {
    if (highScore < score){
        highScore = score;
        document.getElementById("high-score").innerHTML = "High Score: " + highScore;
    }
}

function updateLife(n) {
    life = life + (n);
    document.getElementById("life").innerHTML = life;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


//explosiones
function ExplodeAnimation(x,y,z)
{
  var geometry = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++) 
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;
  
    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }

  material = new THREE.PointsMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  particles = new THREE.Points( geometry, material );

  this.object = particles;
  this.status = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.object  ); 
  
  this.update = function()
  {
    if (this.status == true)
    {
      var pCount = totalObjects;
      while(pCount--) 
      {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
  
}



function HighScores() {
    if(typeof(Storage)!=="undefined"){
        var scores = false;
        if(localStorage["high-scores"]) {
            high_scores.style.display = "block";
            high_scores.innerHTML = '';
            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort(function(a,b){return parseInt(b)-parseInt(a)});

            for(var i = 0; i < 5; i++){
                var s = scores[i];

                if (i == 0){
                    var h = document.createElement("h2");
                    var t = document.createTextNode("Score");
                    h.appendChild(t);
                    high_scores.appendChild(h);       
                }                        
                var fragment = document.createElement('p');
                fragment.innerHTML = (typeof(s) != "undefined" ? s : "" );
                high_scores.appendChild(fragment);
            }
        }
    } else {
        high_scores.style.display = "none";
    }
}

function UpdateScores() {
    if(typeof(Storage)!=="undefined"){
        var current = parseInt(score);
        var scores = false;
        if(localStorage["high-scores"]) {

            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort(function(a,b){return parseInt(b)-parseInt(a)});
            
            for(var i = 0; i < 5; i++){
                var s = parseInt(scores[i]);
                
                var val = (!isNaN(s) ? s : 0 );
                if(current > val)
                {
                    val = current;
                    scores.splice(i, 0, parseInt(current));
                    break;
                }
            }
            
            scores.length = 5;                                
            localStorage["high-scores"] = JSON.stringify(scores);

        } else {                        
            var scores = new Array();
            scores[0] = current;
            localStorage["high-scores"] = JSON.stringify(scores);
        }
        
        HighScores();
    } 
}