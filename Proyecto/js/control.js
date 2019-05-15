function onKeyDown(event){
    // Right D
    if(event.keyCode == 68) 
    {
        controlXR(arwingMovementSpeed);
        playArwingAnimations(0.65);
    }
    // Left A
    if(event.keyCode == 65) 
    {
        controlXL(-arwingMovementSpeed);
        playArwingAnimations(-0.65);
    }
    // Up W
    if(event.keyCode == 87) 
    {
        controlYR(arwingMovementSpeed);
        playArwingAnimations(0.5);
    }

    // Down S
    if(event.keyCode == 83) 
    {
        controlYL(-arwingMovementSpeed);
        playArwingAnimations(-0.5);
    }

    if(event.keyCode == 32) 
    {
        if(game)
        {
            var position = arwing.position;
            cloneLaser(position);

            playSound("./music/shot.wav", 0.1);

        }
    }


}

function onKeyUp(event)
{

    // Right D
    if(event.keyCode == 68) 
    {
        xRRelease();
    }
    // Left A
    if(event.keyCode == 65) 
    {
        xLRelease();
    }
    // Up W
    if(event.keyCode == 87) 
    {
        yRRelease();
    }
    // Down S
    if(event.keyCode == 83) 
    {
        yLRelease();
    }

    /*
    if(event.keyCode == 16) 
    {
        speedBoostStart();
        //speedBoostStart();
        //lifeBoostStart();
    }
    */
}




function controlXR(location)
{
    if(game)
    {
        xRClicked = true;
        xRMove = location;
    }
    
}

function controlXL(location)
{
    if(game)
    {
        xLClicked = true;
        xLMove = location;
    }
    
}

function controlYR(location)
{
    if(game)
    {
        yRClicked = true;
        yRMove = location;
    }
    
}
function controlYL(location)
{
    if(game)
    {
        yLClicked = true;
        yLMove = location;
    }
    
}
function xRRelease()
{
    xRClicked = false;
}
function xLRelease()
{
    xLClicked = false;
}
function yRRelease()
{
    yRClicked = false;
}
function yLRelease()
{
    yLClicked = false;
}

function move()
{
    if (xRClicked)
    {
        
        var c = Math.tan(22.5)*40;
        var aspect = window.innerWidth / window.innerHeight;
        co = aspect*c;
        
        if(arwing.position.x <= co-(arwingSize.x/2) && arwing.position.x >= (co-(arwingSize.x/2))*-1)
        {
            arwing.position.x += xRMove*deltat;
            if(arwing.position.x < (co-(arwingSize.x/2))*-1)
            {
                arwing.position.x = (co-(arwingSize.x/2))*-1;
            }
            else if(arwing.position.x > co-(arwingSize.x/2))
            {
                arwing.position.x = co-(arwingSize.x/2);
            }
        }
    }

    if (xLClicked)
    {
        var c = Math.tan(22.5)*40;
        var aspect = window.innerWidth / window.innerHeight;
        co = aspect*c;
        
        if(arwing.position.x <= co-(arwingSize.x/2) && arwing.position.x >= (co-(arwingSize.x/2))*-1)
        {
            arwing.position.x += xLMove*deltat;
            if(arwing.position.x < (co-(arwingSize.x/2))*-1)
            {
                arwing.position.x = (co-(arwingSize.x/2))*-1;
            }
            else if(arwing.position.x > co-(arwingSize.x/2))
            {
                arwing.position.x = co-(arwingSize.x/2);
            }
        }
    }

    if (yRClicked)
    {
        if(arwing.position.y <= 15 && arwing.position.y >= 0)
        {

                arwing.position.y += yRMove*deltat;
                if(arwing.position.y < 0)
                {
                    arwing.position.y = 0;
                }
                else if(arwing.position.y > 15)
                {
                    arwing.position.y = 15;
                }

        }
    }

    if (yLClicked)
    {
        if(arwing.position.y <= 15 && arwing.position.y >= 0)
        {

                arwing.position.y += yLMove*deltat;
                if(arwing.position.y < 0)
                {
                    arwing.position.y = 0;
                }
                else if(arwing.position.y > 15)
                {
                    arwing.position.y = 15;
                }

        }
    }
}