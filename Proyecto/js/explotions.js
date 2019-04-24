function ExplodeAnimation(x,y,z)
{
  var geometry = new THREE.Geometry();
  var geometry2 = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++)  
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }

  for (i = 0; i < totalObjects; i ++)  
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    geometry2.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }

  var texture_explotion1 = new THREE.TextureLoader().load( './images/exp1.png' );
  var texture_explotion2 = new THREE.TextureLoader().load( './images/exp2.png' );
  var material = new THREE.MeshBasicMaterial( { map: texture_explotion1 } );
  var material2 = new THREE.MeshBasicMaterial( { map: texture_explotion2 } );

  //material = new THREE.PointsMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  particles = new THREE.Points( geometry, material );
  particles2 = new THREE.Points( geometry2, material2 );

  this.object = particles;
  this.object2 = particles2;
  
  this.status = true;
  this.createdAt = Date.now();
  this.exist = true;

  scene.add( this.object  ); 
  scene.add( this.object2  ); 
  
  this.delete = function()
  {
    scene.remove( this.object  ); 
    scene.remove( this.object2  ); 
  }

  this.update = function()
  {
    if (this.status == true)
    {
      var pCount = totalObjects;
      while(pCount--) 
      {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
  
}