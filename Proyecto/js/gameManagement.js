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
    nEnemies = 4;
    nPowerups = 1;
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

    if(parts.length > 0){
        for(var i = 0; i < parts.length; i++){
            scene.remove(parts[i]);
        }   
    }

    gameDifficulty = 1;
    enemies = [];
    obstacles = [];
    powerups = [];
    shots = [];
    parts = [];

    explotionTimeRefreshRate = Date.now();
    lastLevelChanged = Date.now();

    lastUpdate = Date.now();

    particleTreeGroup.visible = false;

    document.getElementById("btn-start").hidden = true;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("timer").innerHTML = duration;
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

    if(transitionUp)
    {
        if(now - lastUpdate > transitionRefres )
        {
            if (arwing.position.y<heightLimit)
            {
                arwing.position.y += heightSum; 
                lastUpdate = Date.now();
            }
            else
            {
                arwing.rotation.x -= arwingRotation;
                transitionUp = false;
            }
            
        }
    }

    if(transitionDown)
    {
        if(now - lastUpdate > transitionRefres )
        {
            if (arwing.position.y>heightMin)
            {
                arwing.position.y -= heightSum; 
                lastUpdate = Date.now();
            }
            else
            {
                arwing.rotation.x += arwingRotation;
                transitionDown = false;
            }
            
        }
    }


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

    //change level difficulty
    if (now-lastLevelChanged > nextLevel )
    {
        lastLevelChanged = Date.now();
        if ( gameDifficulty <= gameDifficultyLimit )
        {
            gameDifficulty += 1;
        }
        nEnemies+= 2;
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

    var timeSpeedUp = now - currSpeedUpTime;
    var timeImmunity = now - currImmunityTime;
    var timeLife = now - currLifeTime;
    var timeSpeed = now - currSpeedTime;

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
        
        if (spawn < nEnemies && levelDifficultySpawnRock <=gameDifficulty) 
        {
            if(timeRocks > nextRock) 
            {
                currRockTime = now;
                spawn++;
                nextRock = 900;

                cloneObj("rock");

            }
        }

        if (spawn < nEnemies && levelDifficultySpawnTree<=gameDifficulty) 
        {
            if(timeTrees > nextTree) 
            {
                currTreeTime = now;
                spawn++;
	            nextTree = 400;
	            cloneObj("tree");
        	}
    	}

        if (spawn < nEnemies && levelDifficultySpawnSpaceship<=gameDifficulty) 
        {
            if(timeSpaceships > nextSpaceship) 
            {
	            currSpaceShipTime = now;
                spawn++;
                nextSpaceship = 200;
	            
	            cloneObj("spaceship");

	        }
		}

        /**************************************/
        /************** POWERUPS *************/
        /************************************/

        if (spawn2 < nPowerups && now-lastPowerUp > nextPowerUp) 
        {
            nextPowerUp = (Math.floor(Math.random() *(10*gameDifficulty)))*1000;
            selectedPU = Math.floor(Math.random() * 4); 
            lastPowerUp = now;
            if(selectedPU == 0 && timeSpeedUp > nextSpeedUp) 
            {
                currSpeedUpTime = now;
                spawn2++;
                nextSpeedUp = 10000;
                
                clonePowerup("speedBoost");
            }

            if(selectedPU == 1 && timeImmunity > nextImmunity) 
            {
                currImmunityTime = now;
                spawn2++;
                nextImmunity = 10000;
                
                clonePowerup("immunity");
            }

            if(selectedPU == 2 && timeLife > nextLife) 
            {
                currLifeTime = now;
                spawn2++;
                nextLife = 10000;
                
                clonePowerup("life");
            }

            if(selectedPU == 3 && timeSpeed > nextSpeed) 
            {
                currSpeedTime = now;
                spawn2++;
                nextSpeed = 10000;
                
                clonePowerup("speed");
            }
        }


        if ( powerups.length > 0 ) {
            
            for(var i = 0; i < powerups.length; i++){

                if (powerups[i].type == "speedBoost"){
                    powerups[i].position.z += speedBoostMovementSpeed * deltat;
                    powerups[i].rotation.y += 0.0020 * deltat;
                }

                else if (powerups[i].type == "immunity"){
                    powerups[i].position.z += immunityMovementSpeed * deltat;
                    powerups[i].rotation.y += -0.0015 * deltat;
                }

                else if (powerups[i].type == "life"){
                    powerups[i].position.z += lifeMovementSpeed * deltat;
                    powerups[i].rotation.y += -0.0015 * deltat;
                }

                else if (powerups[i].type == "life"){
                    powerups[i].position.z += lifeMovementSpeed * deltat;
                    powerups[i].rotation.y += -0.0015 * deltat;
                }
                
                else if (powerups[i].type == "speed"){
                    powerups[i].position.z += speedMovementSpeed * deltat;
                    //powerups[i].position.y += -0.0015 * deltat;
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
                                playAudio("speedBoost", false);
                                spawn2--;
                            }

                            else if(powerups[i].type == "immunity"){
                                immunityStart();
                                playAudio("shield", false);
                                spawn2--;
                            }

                            else if(powerups[i].type == "life"){
                                lifeBoostStart();
                                playAudio("life", false);
                                spawn2--;
                            }

                            else if(powerups[i].type == "speed"){
                                speedMovementBoostStart();
                                playAudio("speed", false);
                                spawn2--;
                                //console.log("entre");
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
            	
                
                if(enemies[i].position.z > 100 ) {
                    if (enemies[i].alive == 1){

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

                else{
                    arwing.box.setFromObject(arwing);
                    if(arwing.box.intersectsBox(enemies[i].box.setFromObject(enemies[i])))
                    {
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
                                scene.remove(enemies[i]);
                                enemies.splice(i, 1);
                            }
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

            	
                if(obstacles[i].position.z > 100 ) { 
                    if (obstacles[i].alive == 1){
                        if(obstacles[i].score == 1){
                            obstacles[i].score = 0;
                            updateScore(-25);
                            spawn--;
                            scene.remove(obstacles[i]);
                            obstacles.splice(i, 1);
                        }
                    } 
                }
                else{
                    arwing.box.setFromObject(arwing);
                    if(arwing.box.intersectsBox(obstacles[i].box.setFromObject(obstacles[i]))){
                        if (obstacles[i].alive == 1){
                            if(obstacles[i].score == 1){

                                if(obstacles[i].type == "tree"){
                                    updateLife(-70);
                                    explode();
                                    //console.log("Árbol -70");
                                    spawn--;
                                }
                                obstacles[i].alive = 0;
                                scene.remove(obstacles[i]);
                                obstacles.splice(i, 1);
                            }
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
	                                    //console.log("Roca +500");
	                                    spawn--;
	                                }

	                                if(enemies[k].type == "spaceship"){
	                                    updateScore(1000);
	                                    scene.remove(enemies[k]);
                                        //console.log("Nave +1000");
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

function playArwingAnimations(side)
{    
    if (arwingAnimator)
        arwingAnimator.stop();

    if (animateArwing) 
    {
        arwingAnimator = new KF.KeyFrameAnimator;

        if (side == 0.65 || side == -0.65){
            arwingAnimator.init({ 
                interps:
                    [
                        { 
                            keys:[0, 0.2, 0.4, 0.6, 0.8, 1], 
                            values:[
                                    { x : 0, y : arwing.rotation.y, z : side },
                                    { x : 0, y : arwing.rotation.y, z : Math.PI * side / 90 },
                                    { x : 0, y : arwing.rotation.y, z : Math.PI * side / 80},
                                    { x : 0, y : arwing.rotation.y, z : Math.PI * side / 70},
                                    { x : 0, y : arwing.rotation.y, z : Math.PI * side / 60},
                                    { x : 0, y : arwing.rotation.y, z : 0 },
                                    ],
                            target:arwing.rotation
                        },
                    ],
                loop: false,
                duration: 2000,
                easing:TWEEN.Easing.Sinusoidal.In,
            });
            arwingAnimator.start();
        }

        else if(side == 0.5 || side == -0.5){
             arwingAnimator.init({ 
                interps:
                    [
                        { 
                            keys:[0, 0.2, 0.4, 0.6, 0.8, 1], 
                            values:[
                                    { x : side, y : arwing.rotation.y, z : 0 },
                                    { x : 0.4 * side, y : arwing.rotation.y, z : 0 },
                                    { x : 0.3 * side, y : arwing.rotation.y, z : 0 },
                                    { x : 0.2 * side, y : arwing.rotation.y, z : 0 },
                                    { x : 0.1 * side, y : arwing.rotation.y, z : 0 },
                                    { x : 0, y : arwing.rotation.y, z : 0 },
                                    ],
                            target:arwing.rotation
                        },
                    ],
                loop: false,
                duration: 2000,
                easing:TWEEN.Easing.Sinusoidal.In,
            });
            arwingAnimator.start();
        }
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

function explode()
{
    //console.log("explode");
    for (var i = 0; i < particleCountTree; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = -0.1 + Math.random() * 0.3;
        vertex.y = -0.1 + Math.random() * 0.3 ;
        vertex.z = -0.1 + Math.random() * 0.3;
        particleTreeGeometry.vertices[i] = vertex;
    }
    explosionPower = 1.25;
    particleTreeGroup.visible = true;
}
