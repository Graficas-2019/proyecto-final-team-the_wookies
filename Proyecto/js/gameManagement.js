function startGame() 
{
    
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

function playAnimations() 
{    
	// opacity animation
    if (grassAnimator)
        grassAnimator.stop();

    if (animateGrass) 
    {
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

function updateTimer(seconds) 
{
    document.getElementById("timer").innerHTML = "Timer: " + seconds;
}

function updateScore(n) 
{
    score = score + (n);
    document.getElementById("score").innerHTML = "Score: " + score;
}

function updateHighScore() 
{
    if (highScore < score){
        highScore = score;
        document.getElementById("high-score").innerHTML = "High Score: " + highScore;
    }
}

function updateLife(n) 
{
    life = life + (n);
    document.getElementById("life").innerHTML = life;
}

function getRandomArbitrary(min, max) 
{
    return Math.random() * (max - min) + min;
}

