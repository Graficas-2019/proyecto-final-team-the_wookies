function onKeyDown(event){
    if(event.keyCode == 68) 
    {
        controlXR(arwingMovementSpeed);
    }
    if(event.keyCode == 65) 
    {
        controlXL(-arwingMovementSpeed);
    }
    if(event.keyCode == 87) 
    {
        controlYR(arwingMovementSpeed);
    }
    if(event.keyCode == 83) 
    {
        controlYL(-arwingMovementSpeed);
    }
}

function onKeyUp(event)
{
    if(event.keyCode == 32) 
    {
        if(game)
        {
            var position = arwing.position;
            cloneLaser(position);
        }
    }

    if(event.keyCode == 68) 
    {
        xRRelease();
    }
    if(event.keyCode == 65) 
    {
        xLRelease();
    }
    if(event.keyCode == 87) 
    {
        yRRelease();
    }
    if(event.keyCode == 83) 
    {
        yLRelease();
    }

    if(event.keyCode == 16) 
    {
        //speedBoostStart();
        lifeBoostStart();
    }
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