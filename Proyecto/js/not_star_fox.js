//Scene variables
var renderer = scene = camera = root = group = null;

//game variables
var game = false;
var duration = 60;
var life = score = highScore = spawn = nEnemies = 0;
var clock = null;
var currentTime = Date.now();
var high_scores = null;
var deltat = null;
var scorePerSecondTime = null;
var scorePerSecond = 100; 

//luces
var directionalLight = spotLight = ambientLight = null;
var mapUrl = "./images/grass.jpg";

//sombras
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

//objectos
var arwing = laser = tree = spaceship = rock = null;
var arwingSize = null;

var type = ["tree", "arwing", "laser", "spaceship", "rock"];
var index = 0;


var grass = grassAnimator = null;
var animateGrass = true;

var objLoader = mtlLoader = null;
var currTreeTime = currSpaceShipTime = currRockTime = 0;

var nextSpaceship = 1500,
nextTree = 1500,
nextRock = 1500;

var enemies = [];
var obstacles = [];
var shots = [];


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



//velocidad objetos
var arwingMovementSpeed = 0.1;
var treeMovementSpeed = 0.075;
var rockMovementSpeed = 0.050;
var spaceshipMovementSpeed = 0.095;

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
    for (var i = 0; i < 6; i++)
    {
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
    document.addEventListener('keyup', onKeyUp);


    //load the audio
    loadAudio("mario","./music/mario.mp3");
    loadAudio("dead","./music/sound.mp3");
    
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

        KF.update();
        
    }
}