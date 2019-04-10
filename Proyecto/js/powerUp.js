
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
    document.getElementById("life").innerHTML = life;
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
            speedBoostStop()
        }
        else if(speedUpLastTimePrinted == null || now-speedUpLastTimePrinted>timeLeftPrintRate)
        {
            console.log(speedUpSecondsLeft);
            speedUpSecondsLeft -= 1;
            speedUpLastTimePrinted = Date.now();
        }
    }

    if(immunityStatus)
    {
        if(now-immunityStartTime>immunityDuration)
        {
            immunityStop()
        }
        else if(immunityLastTimePrinted == null || now-immunityLastTimePrinted>timeLeftPrintRate)
        {
            console.log(immunitySecondsLeft);
            immunitySecondsLeft -= 1;
            immunityLastTimePrinted = Date.now();
        }
    }

}