function onKeyDown(event){
	// Spacebar
    if( event.keyCode == 32)
    {
	    var position = arwing.position;
	    cloneLaser(position);
    }

	// Top (W or arrow up)
    if ( event.keyCode == 87 || event.keyCode == 38 )
    {
		//console.log("Arriba");
        if(arwing.position.y <= 15)
        {
        	arwing.position.y += 1.75;
    	}
    }
    
    // Button (S or arrow down)
    if ( event.keyCode == 83 || event.keyCode == 40 )
    {
    	//console.log("Abajo");
        if(arwing.position.y >= 0){
       		arwing.position.y -= 1.75;
   		}
    }
    
    // Right (D or arrow right)
    if ( event.keyCode == 68 || event.keyCode == 39 ) {
    	//console.log("Derecha");
        if(arwing.position.x <= 30){
        	arwing.position.x += 1.75;
    	}

	}

	// Left (A or arrow left)
    if ( event.keyCode == 65 || event.keyCode == 37 ) 
    {
    	//console.log("Izquierda");
        if(arwing.position.x >= -30){
        	arwing.position.x -= 1.75;
    	}
    }
}