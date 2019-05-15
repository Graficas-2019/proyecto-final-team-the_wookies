//Scene variables
var renderer = scene = camera = root = group = null;

//game variables
var game = false;
var duration = 180;
var life = score = highScore = spawn = spawn2 = nEnemies = nPowerups = 0;
var clock = null;
var currentTime = Date.now();
var high_scores = null;
var deltat = null;
var scorePerSecondTime = null;
var scorePerSecond = 100; 
var gameDifficulty = 1;
var gameDifficultyLimit = 3;

//luces
var directionalLight = spotLight = ambientLight = null;
var mapUrl = "./images/grass.jpg";

//sombras
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

//objectos
var arwing = laser = tree = spaceship = rock = null;
var rocket = immunityPowerup = lifeBoostPowerup = speedPowerup = null;
var arwingSize = null;

var type = ["tree", "arwing", "laser", "spaceship", "rock", "speed", "life", "immunity", "rocket"];
var index = 0;

var levelDifficultySpawnRock = 1;
var levelDifficultySpawnTree = 2;
var levelDifficultySpawnSpaceship = 3;

var nextLevel = 20000;
var lastLevelChanged = 0;

var grass = grassAnimator = null;
var animateGrass = true;

var arwingAnimator = null;
var animateArwing = true;

var objLoader = mtlLoader = null;
var currTreeTime = currSpaceShipTime = currRockTime = 0;

var currSpeedUpTime = currImmunityTime = currLifeTime = currSpeedTime = 0;

var nextSpaceship = 500,
nextTree = 500,
nextRock = 500;


var nextSpeedUp = 1500,
nextImmunity = 1500,
nextLife = 1500,
nextSpeed = 1500;

var enemies = [];
var obstacles = [];
var shots = [];
var powerups = [];
var nextPowerUp = 5000;
var lastPowerUp = 0; 

var movementSpeed = 3;
var movementSpeed2 = 1;
var totalObjects = 200;
var objectSize = 3;
var sizeRandomness = 10;
var explotionRefreshRate = 20;
var lifetime_explotion = 400;

var explotionTimeRefreshRate = 0;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];

var dirs = [];
var parts = [];
var scene = container = material = particles = null;

//go up delay
var timeTransition = 100;
var transitionRefres = 5;

var heightLimit = 30
var heightMin = 15;
var heightSum = (transitionRefres*(heightLimit - heightMin))/timeTransition;
var arwingRotation = 0.3;

var lastUpdate = 0;
var lastUpdateTime = 0;

var transitionUp = false;
var transitionDown = false;


//velocidad objetos
var arwingMovementSpeed = 0.1;
var treeMovementSpeed = 0.075;
var rockMovementSpeed = 0.20;
var spaceshipMovementSpeed = 0.095;

var speedBoostMovementSpeed = 0.095;
var immunityMovementSpeed = 0.095;
var lifeMovementSpeed = 0.095;
var speedMovementSpeed = 0.095;

//movimiento
var xRClicked = false;
var xRMove = 0;
var xLClicked = false;
var xLMove = 0;

var yRClicked = false;
var yRMove = 0;
var yLClicked = false;
var yLMove = 0;


//powerups
var timeLeftPrintRate = 1000; //se imprime el tiempo restante cada segundo

var speedUpStatus = false;
var speedUpStartTime = null;
var speedUpDuration = 5000; //en milisegundos
var speedUpEnemiesSpeedMultiplier = 4;
var speedUpScoreBoost = 4;
var speedUpLastTimePrinted = null;
var speedUpSecondsLeft = null;
var scoreLock = 0;

var immunityStatus = false;
var immunityTimesInitiated = 0;
var immunityDuration = 5000;
var immunityStartTime = null;
var immunityLastTimePrinted = null;
var immunitySecondsLeft = null;

var lifeBoost = 500;
var lifeLimit = 3000;

var speedMovementBoost = 0.005;
var speedMovementBoostSpwanSpeedBoost = true;
var speedMovementBoostSpeedLimit = 0.15;

//sonidos
sounds = {}


// Shield Particles
var particleShieldGroup = null;
var particleValues = null; 
// Glow
var glowPowerup = null;
// Flame Particles
var particleFlameGroup = null;
// Skybox
var skyBox = null;

////
var particleTreeGeometry = null;
var particleTreeGroup = null;



//////////////
var particleCountFlame = 0;
var particleCountShield = 0;
var particleCountTree = 0;
var explosionTreePower = 1.06;

var glowFog = null;
var percentage_life = 0;

function createScene(canvas) 
{
    
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
    
    /////////////////////////////////////////////
    ////////////////// LIGHTS //////////////////
    ///////////////////////////////////////////

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

    /////////////////////////////////////////////
    /////////////// LOAD MODELS ////////////////
    ///////////////////////////////////////////

    // Create the objects
    loadObj();
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    /////////////////////////////////////////////
    ////////////////// PLANE ///////////////////
    ///////////////////////////////////////////

    // Create a texture map
    var grassMap = new THREE.TextureLoader().load(mapUrl);
    grassMap.wrapS = grassMap.wrapT = THREE.RepeatWrapping;
    grassMap.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(100, 500, 50, 50);
    grass = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:grassMap, side:THREE.DoubleSide}));
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -4.02;

    // Add the mesh to our group
    group.add( grass );
    grass.castShadow = false;
    grass.receiveShadow = true;


    /////////////////////////////////////////////
    /////////////// FOG EMISOR /////////////////
    ///////////////////////////////////////////
    const near = 100;
    const far = 300;
    scene.fog = new THREE.Fog(0xffffff, near, far);

    var fogEmitter = new THREE.SpriteMaterial( 
    { 
        map: new THREE.TextureLoader().load( 'images/glow.png' ), 
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
        fog: false
    });
    
    glowFog = new THREE.Sprite( fogEmitter );
    glowFog.scale.set(300, 300, 50);
    glowFog.position.set(0, 0, -400);

    group.add( glowFog );
    
    
    /////////////////////////////////////////////
    ////////////////// SKYBOX //////////////////
    ///////////////////////////////////////////

    // Create the skybox
    var directory = "images/";
	var cubeSides  = ["RIGHT", "LEFT", "TOP", "BUTTON", "BACK", "FRONT"];
	var imageSuffix = ".jpg";

	var arr = [];
    for (var i = 0; i < 6; i++)
    {
		arr.push( new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( directory + cubeSides[i] + imageSuffix ), side: THREE.BackSide, fog: false }));
	}

	// Add the skybox to our group
	var skyGeom = new THREE.CubeGeometry( 600, 500, 600 );
	skyBox = new THREE.Mesh( skyGeom, arr );
    skyBox.position.x = 0;
	skyBox.position.y = 120;
    skyBox.position.z = -140;
	root.add( skyBox );

    /////////////////////////////////////////////
    ///////////// IMMUNITY EFFECT //////////////
    ///////////////////////////////////////////

    // Create the shield
    var particleTexture = new THREE.TextureLoader().load('images/spark.png' );

    particleShieldGroup = new THREE.Object3D();
    particleValues = { startSize: [], startPosition: [], randomness: [] };
    
    particleCountShield = 200;
    var radius = 10;
    for( var i = 0; i < particleCountShield; i++ ) 
    {
        var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, color: 0x000000, fog: false } );
        
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 2, 2, 3.0 );
        sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

        // Set length for position of sprite for a spherical shell
        sprite.position.setLength( radius * (Math.random() * 0.1 + 0.9) );
        
        // Set material colors
        sprite.material.color.setHSL( Math.random(), 0.9, 0.7 ); 
        
        // Set glowing particles
        sprite.material.blending = THREE.AdditiveBlending;
        
        particleShieldGroup.add( sprite );
       
        // Add variable things to array
        particleValues.startPosition.push( sprite.position.clone() );
        particleValues.randomness.push( Math.random() );
    }
    root.add( particleShieldGroup );
    particleShieldGroup.visible = false;

    /////////////////////////////////////////////
    /////////////// FIRE EFFECT ////////////////
    ///////////////////////////////////////////
    particleCountFlame = 80;
    particleFlameGroup = new THREE.Object3D();
    // Texture
    var texture =  new THREE.TextureLoader().load("./images/flame_texture.png");
    // Material
    var material = new THREE.SpriteMaterial({
        color: 0xff4502,
        map: texture,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        fog: false
    });
    
    // Creation of particle
    for (var i = 0; i < particleCountFlame; i++) {
        var particle = new THREE.Sprite(material.clone());
        particle.scale.multiplyScalar(Math.random() * 4);
        // Velocity
        particle.velocity = new THREE.Vector3( 0, Math.random(), 0 );
        
        particleFlameGroup.add( particle );
    }

    particleFlameGroup.rotation.x = Math.PI / 180 * 90;
    root.add( particleFlameGroup );
    particleFlameGroup.visible = false;



    /////////////////////////////////////////////
    ////////////// GLOW EFFECT /////////////////
    ///////////////////////////////////////////
    // Glow Effect
    var spriteMaterial = new THREE.SpriteMaterial( 
    { 
        map: new THREE.TextureLoader().load( 'images/glow.png' ), 
        color: 0xfff200,
        transparent: true, 
        blending: THREE.AdditiveBlending,
        fog: false
    });
    
    glowPowerup = new THREE.Sprite( spriteMaterial );

    /////////////////////////////////////////////
    ///////////// TREE EXPLOSION ///////////////
    ///////////////////////////////////////////
    
    particleCountTree = 50;
    var leafTexture = new THREE.TextureLoader().load('images/leaf.png');
    particleTreeGeometry = new THREE.Geometry();
    for (var i = 0; i < particleCountTree; i ++ ) {
        var vertex = new THREE.Vector3();
        particleTreeGeometry.vertices.push( vertex );
    }
    var pMaterial = new THREE.PointsMaterial({
        map: leafTexture, 
        transparent: true,
        opacity: 0.8,
        size: 1.5,
        fog: false
    });
    particleTreeGroup = new THREE.Points( particleTreeGeometry, pMaterial );
    root.add( particleTreeGroup );
    particleTreeGroup.visible=false;


    
    // Now add the group to our scene
    scene.add( root );

    /////////////////////////////////////////////
    ///////////// EVENT LISTENERS //////////////
    ///////////////////////////////////////////
    window.addEventListener( 'resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp);


    /////////////////////////////////////////////
    ////////////////// AUDIO ///////////////////
    ///////////////////////////////////////////
    //load the audio
    // Themes
    loadAudio("background", "./music/background1.mp3", 0.3);
    loadAudio("lose", "./music/lose.wav", 1);
    loadAudio("win", "./music/win.wav", 1);

    // Powerups
    loadAudio("life", "./music/powerups/life.wav", 1);
    loadAudio("shield", "./music/powerups/shield.wav", 1);
    loadAudio("speed", "./music/powerups/speed.wav", 0.3);
    loadAudio("speedBoost", "./music/powerups/speedBoost.wav", 1);
    
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    // Render the scene
    renderer.render(scene, camera);
    // Update the animations
    animate();
}

function animate() 
{
    if ( game )
    {
        var now = Date.now();
        deltat = clock.getDelta() * 1000;
        currentTime = now;

        generateGame(deltat, now);
        skyBox.rotation.y = clock.elapsedTime * 0.040;
        if(arwing.shield.visible == true){
            generateShield();
        }

         if(arwing.flame.visible == true){
            generateFlame();
        }
        if (particleTreeGroup.visible == true){
            generateTreeExplosion();
        }

        KF.update();     
    }

}


function generateShield(){
    var time = 4 * clock.elapsedTime;
    for ( var c = 0; c < particleShieldGroup.children.length; c ++ ) 
    {
        var sprite = particleShieldGroup.children[ c ];

        // individual rates of movement
        var a = particleValues.randomness[c] + 1;
        var pulse = Math.sin(a * time) * 0.1 + 0.9;
        sprite.position.x = particleValues.startPosition[c].x * pulse;
        sprite.position.y = particleValues.startPosition[c].y * pulse;
        sprite.position.z = particleValues.startPosition[c].z * pulse;    
    }

    // Rotation of particles
    particleShieldGroup.rotation.y = time * 0.75;
    var position = arwing.position;
    particleShieldGroup.position.set(position.x, position.y, position.z);
}

function generateFlame() {
    for (var i = 0; i < particleFlameGroup.children.length; i++) {
        var particle = particleFlameGroup.children[i];
        if(particle.position.y > 10) {
            particle.position.y = 0;
            particle.velocity.y = Math.random() + 1;
            particle.material.opacity = 1;
        }
        particle.material.opacity -= 0.1;
        particle.velocity.y += 0.0001;
        particle.position.add(particle.velocity);
    }

    var position = arwing.position;
    particleFlameGroup.position.set(position.x, position.y, position.z);
}

function generateTreeExplosion()
{
    for (var i = 0; i < particleCountTree; i ++ ) {
        particleTreeGeometry.vertices[i].multiplyScalar(explosionTreePower);
    }
    
    if(explosionTreePower > 1.05){
        explosionTreePower -= 0.001;
    }
    else{
        particleTreeGroup.visible = false;
    }
    
    var position = arwing.position;
    particleTreeGroup.position.set(position.x, position.y, position.z - 5);
    particleTreeGeometry.verticesNeedUpdate = true;
}