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
                        arwingSize = arwing.box.getSize();

                        arwing.shield = particleGroup;

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


                    //Powerup - speed
                    if (index == 5){
                        speedPowerup = object;
                        speedPowerup.scale.set(1.2, 1.2, 1.2);
                        
                        speedPowerup.position.x = 0;
                        speedPowerup.position.y = 4;
                        speedPowerup.position.z = 0;

                        speedPowerup.rotation.x = Math.PI / 360 * 90;
                        speedPowerup.rotation.y = Math.PI;

                        var glow = glowPowerup.clone();
                        glow.scale.set(12, 12, 1.0);
                        glow.position.set(0, -2, 0);
                        speedPowerup.add(glow);
                    }

                    //Powerup - life
                    if (index == 6){
                        lifeBoostPowerup = object;
                        lifeBoostPowerup.scale.set(0.12, 0.12, 0.12);

                        lifeBoostPowerup.position.x = 0;
                        lifeBoostPowerup.position.y = -3;
                        lifeBoostPowerup.position.z = 0;

                        var glow = glowPowerup.clone();
                        glow.scale.set(110, 110, 1.0);
                        glow.position.set(0, 30, 0);
                        lifeBoostPowerup.add(glow);
                    }

                    //Powerup - immunity
                    if (index == 7){
                        immunityPowerup = object;
                        immunityPowerup.scale.set(12, 12, 12);
                        
                        immunityPowerup.position.x = 0;
                        immunityPowerup.position.y = 2;
                        immunityPowerup.position.z = 0;

                        var glow = glowPowerup.clone();
                        glow.scale.set(1.2, 1.2, 1.0);
                        glow.position.set(0, 0, 0);
                        immunityPowerup.add(glow);
                    }

                    //Powerup - speedboost
                    if (index == 8){
                        speedUpPowerup = object;
                        speedUpPowerup.scale.set(10, 10, 10);
                        
                        speedUpPowerup.position.x = 0;
                        speedUpPowerup.position.y = 2;
                        speedUpPowerup.position.z = 0;

                        var glow = glowPowerup.clone();
                        glow.scale.set(1, 1, 1.0);
                        glow.position.set(0, 0, 0);
                        speedUpPowerup.add(glow);


                        document.getElementById("btn-start").classList.remove("disabled");
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
        var y = getRandomArbitrary(1, 15);
		clone.position.set(x, y, z);	
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

function clonePowerup(type) {
    var x = getRandomArbitrary(30, -30);
    var y = getRandomArbitrary(8, 15);
    var z = getRandomArbitrary(-250, -260);
    
    if (type == "speedBoost"){ var clone = speedUpPowerup.clone(); }
    if (type == "immunity"){ var clone = immunityPowerup.clone(); }
    if (type == "life"){ var clone = lifeBoostPowerup.clone(); }
    if (type == "speed"){ var clone = speedPowerup.clone(); }
    
    clone.position.set(x, y, z);
    clone.box = new THREE.Box3();
    clone.alive = 1;
    clone.type = type;

    powerups.push(clone);
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

