
//Animacion de inicio y termino de speedBoost
//mostrar los timers de los powerups
//hacer que no aparezcan mas bloques de speedMovementBoost si speedBoostSpwanSpeeBoost es falso
//ejemplo de cancion ejecutandose en la ultima linea de cuando se crea la escena archivo not_star_fox
//ejemplo power up en control con tecla 16

function speedBoostStart()
{
    if(!speedUpStatus)
    {
        arwing.position.y = 30;
        speedUpStartTime = Date.now();
        speedUpStatus = true;

        //speedup enemies
        treeMovementSpeed = treeMovementSpeed * speedUpEnemiesSpeedMultiplier;
        rockMovementSpeed = rockMovementSpeed * speedUpEnemiesSpeedMultiplier;
        spaceshipMovementSpeed = spaceshipMovementSpeed * speedUpEnemiesSpeedMultiplier;

        //add score speed multiplier
        scorePerSecond = scorePerSecond * speedUpScoreBoost;

        //para que el score no baje por colosiones
        scoreLock = scoreLock + 1;

        //Agregar inmunidad al jugador
        immunityTimesInitiated += 1;

        speedUpSecondsLeft = speedUpDuration/1000;
    }
}

function speedBoostStop()
{
    if(speedUpStatus)
    {
        arwing.position.y = 15;
        speedUpStatus = false;

        //return to normal state enemies
        treeMovementSpeed = treeMovementSpeed / speedUpEnemiesSpeedMultiplier;
        rockMovementSpeed = rockMovementSpeed / speedUpEnemiesSpeedMultiplier;
        spaceshipMovementSpeed = spaceshipMovementSpeed / speedUpEnemiesSpeedMultiplier;

        //return to normal score per second
        scorePerSecond = scorePerSecond / speedUpScoreBoost;

        //Para que el score pueda volver a bajar
        scoreLock = scoreLock - 1;

        //quitar inmunidad al jugador
        immunityTimesInitiated -= 1;

        speedUpLastTimePrinted = null;
    }
}

function immunityStart()
{
    if(!immunityStatus)
    {
        immunityStartTime = Date.now();
        immunityStatus = true;
        immunityTimesInitiated += 1;
        scoreLock = scoreLock + 1;
        immunitySecondsLeft = immunityDuration/1000;
    }
    
}

function immunityStop()
{    
    if(immunityStatus)
    {
        immunityStatus = false;
        immunityTimesInitiated -= 1;
        scoreLock = scoreLock - 1;
        console.log(scoreLock);
        immunityLastTimePrinted = null;
    }
}

function lifeBoostStart()
{
    
    life += lifeBoost;
    if(life > lifeLimit)
    {
        life = lifeLimit;
    }

    percentage_life = Math.floor((life * 100) / 3000);
    document.getElementById("life-score").style.width = percentage_life + '%';
    document.getElementById("life-score").innerHTML = percentage_life + '%';
    //document.getElementById("life").innerHTML = life;
}

function speedMovementBoostStart()
{
    if(speedMovementBoostSpwanSpeedBoost)
    {
        arwingMovementSpeed += speedMovementBoost;
        if(arwingMovementSpeed >= speedMovementBoostSpeedLimit)
        {
            speedMovementBoostSpwanSpeedBoost = false;
        }
    }
    
}

function deActivatePowerUps()
{
    var now = Date.now();
    if(speedUpStatus)
    {
        if(now-speedUpStartTime>speedUpDuration)
        {
            speedBoostStop();
            updatePowerupScore("speedboost", 0);            
        }
        else if(speedUpLastTimePrinted == null || now-speedUpLastTimePrinted>timeLeftPrintRate)
        {
            console.log(speedUpSecondsLeft);
            
            var percentage_speedboost = Math.floor((speedUpSecondsLeft * 100) / 5);
            updatePowerupScore("speedboost", percentage_speedboost);
            
            speedUpSecondsLeft -= 1;
            speedUpLastTimePrinted = Date.now();
        }
    }

    if(immunityStatus)
    {
        if(now-immunityStartTime>immunityDuration)
        {
            immunityStop();
            updatePowerupScore("immunity", 0);
        }
        else if(immunityLastTimePrinted == null || now-immunityLastTimePrinted>timeLeftPrintRate)
        {
            console.log(immunitySecondsLeft);

            var percentage_immunity = Math.floor((immunitySecondsLeft * 100) / 5);
            updatePowerupScore("immunity", percentage_immunity);

            immunitySecondsLeft -= 1;
            immunityLastTimePrinted = Date.now();
        }
    }

}

function updatePowerupScore(powerup, score)
{
    if (powerup == "speedboost") { document.getElementById("speedboost-score").style.width = score + '%'; }
    if (powerup == "immunity") { document.getElementById("immunity-score").style.width = score + '%'; }
}