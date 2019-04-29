function startGame() 
{
    //play audioad
    playAudio("mario",true);

    score = 0;
    life = 3000;
    percentage_life = 100;
    spawn = 0;
    spawn2 = 0;
    id = 0;
    nEnemies = 15;
    nPowerups = 3;
    scorePerSecondTime = Date.now();

    if(powerups.length > 0){
        for(var i = 0; i < powerups.length; i++){
            scene.remove(powerups[i]);
        }   
    }

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
    powerups = [];
    shots = [];
    parts = [];
    explotionTimeRefreshRate = Date.now();


    document.getElementById("btn-start").hidden = true;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("timer").innerHTML = 60;
    //document.getElementById("life").innerHTML = life;
    document.getElementById("life-score").style.width = percentage_life + '%';
    document.getElementById("life-score").innerHTML = percentage_life + '%';
    document.getElementById("life-score").style.backgroundColor = '#4caf50';
    document.getElementById("game-menu").style.display = 'none';
    document.getElementById("game-menu").hidden = true;

    clock = new THREE.Clock();
    game = true;
    high_scores = document.getElementById("scores");
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

    if (now-explotionTimeRefreshRate > explotionRefreshRate)
    {
        while(pCount--) 
        {
    
            if (now - parts[pCount].createdAt  < lifetime_explotion && parts[pCount].exist)
            {
    
                parts[pCount].update();
            }
            else if (parts[pCount].exist)
            {
                parts[pCount].delete();
                parts[pCount].exist = false;
            }
        }
        explotionTimeRefreshRate = Date.now();
    }


    //movement function
    move();

    //stop powerups
    deActivatePowerUps()

    //distance update score
    if (now - scorePerSecondTime>1000)
    {
        updateScore(scorePerSecond);
        scorePerSecondTime = Date.now();
    }
    

    var timeRocks = now - currRockTime;
    var timeTrees = now - currTreeTime;
    var timeSpaceships = now - currSpaceShipTime;

    var timeSpeedBoost = now - currSpeedBoostTime;
    var timeImmunity = now - currImmunityTime;
    var timeLife = now - currLifeTime;

    var seconds = Math.floor(duration - clock.elapsedTime);
        if (seconds > 0){
            updateTimer(seconds);

            if (life <= 0){
                seconds = 0;
                endGame("¡GAME OVER! :(");      
                playAudio("dead",false);          
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

        /**************************************/
        /************** POWERUPS *************/
        /************************************/

        if (spawn2 < nPowerups) {
            if(timeSpeedBoost > nextSpeedBoost) {
                currSpeedBoostTime = now;
                spawn2++;
                nextSpeedBoost = 200;
                
                clonePowerup("speedBoost");
            }
        }

        if (spawn2 < nPowerups) {
            if(timeImmunity > nextImmunity) {
                currImmunityTime = now;
                spawn2++;
                nextImmunity = 200;
                
                clonePowerup("immunity");
            }
        }

        if (spawn2 < nPowerups) {
            if(timeLife > nextLife) {
                currLifeTime = now;
                spawn2++;
                nextLife = 200;
                
                clonePowerup("life");
            }
        }


        if ( powerups.length > 0 ) {
            
            for(var i = 0; i < powerups.length; i++){

                if (powerups[i].type == "speedBoost"){
                    powerups[i].position.z += speedBoostMovementSpeed * deltat;
                    powerups[i].rotation.y += 0.0020 * deltat;
                }

                if (powerups[i].type == "immunity"){
                    powerups[i].position.z += immunityMovementSpeed * deltat;
                    powerups[i].rotation.y += -0.0015 * deltat;
                }

                if (powerups[i].type == "life"){
                    powerups[i].position.z += lifeMovementSpeed * deltat;
                    powerups[i].rotation.y += -0.0015 * deltat;
                }
                
                if(powerups[i].position.z > 100 ) {  
                    if(powerups[i].alive == 1){
                        powerups[i].alive = 0;
                        spawn2--;
                        scene.remove(powerups[i]);
                        powerups.splice(i, 1);
                    }
                } 
                else{
                    arwing.box.setFromObject(arwing);
                    if(arwing.box.intersectsBox(powerups[i].box.setFromObject(powerups[i]))){
                        if (powerups[i].alive == 1){
                            if(powerups[i].type == "speedBoost"){
                                speedBoostStart();
                                spawn2--;
                            }

                            if(powerups[i].type == "immunity"){
                                immunityStart();
                                spawn2--;
                            }

                            if(powerups[i].type == "life"){
                                lifeBoostStart();
                                spawn2--;
                            }

                            powerups[i].alive = 0;
                            scene.remove(powerups[i]);
                            powerups.splice(i, 1);
                        }
                    }
                }
            }
        }


        if ( enemies.length > 0 ) {
        	
            for(var i = 0; i < enemies.length; i++){

            	if (enemies[i].type == "spaceship"){
            		enemies[i].position.z += spaceshipMovementSpeed * deltat;
            	}

            	if (enemies[i].type == "rock"){
            		enemies[i].position.z += rockMovementSpeed * deltat;
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
            		obstacles[i].position.z += treeMovementSpeed * deltat;
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
    if(scoreLock != 0 && n < 0)
    {
        n = 0;
    }
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
    if (immunityTimesInitiated == 0)
    {
        life = life + (n);
        //document.getElementById("life").innerHTML = life;
        percentage_life = Math.floor((life * 100) / 3000);
        document.getElementById("life-score").style.width = percentage_life + '%';
        document.getElementById("life-score").innerHTML = percentage_life + '%';
        if (percentage_life > 70){
            document.getElementById("life-score").style.backgroundColor = '#4caf50';
        }

        if (percentage_life < 70){
            document.getElementById("life-score").style.backgroundColor = '#f1c40f';
        }

        if (percentage_life < 30){
            document.getElementById("life-score").style.backgroundColor = '#e74c3c';
        }
         
    }

}

function getRandomArbitrary(min, max) 
{
    return Math.random() * (max - min) + min;
}

