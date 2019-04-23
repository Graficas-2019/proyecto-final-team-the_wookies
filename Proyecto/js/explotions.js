function ExplodeAnimation(x,y,z)
{
  var geometry = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++)  
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }

  //var texture_explotion = new THREE.TextureLoader().load( 'textures/land_ocean_ice_cloud_2048.jpg' );
  //var material = new THREE.MeshBasicMaterial( { map: texture_explotion } );

  material = new THREE.PointsMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  particles = new THREE.Points( geometry, material );

  this.object = particles;
  this.object2 = particles;
  
  this.status = true;
  this.createdAt = Date.now();
  this.exist = true;

  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.object  ); 
  
  this.delete = function()
  {
    scene.remove( this.object  ); 
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