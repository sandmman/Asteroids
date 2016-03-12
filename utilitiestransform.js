//Purpose: rotates a two dimensional point by theta
function rotate(theta,pts,dir){
    var t_pts = [];
    radians = theta / 360 * 2 * Math.PI;

    sin = Math.sin(radians);
    cos = Math.cos(radians);

    for(var i = 0;i < pts.length; i++){
        pt = pts[i];
        t_pts.push([cos * pt[0] - sin * pt[1],
                    sin * pt[0] + cos * pt[1]]);
    }
    dir = [cos * dir[0] - sin *  dir[1], sin *  dir[0] + cos *  dir[1]];
    return {t_pts:t_pts,dir,dir};
}
/*Generic Sprite creation
Inputs: x,y starting coordinates and a list of getVeticesPosations for sprites points
The first [x,y] transformation should be the front of the obj. i.e.
The point that will shoot

*/
function Sprite(x,y,coor){
    this.x = x
    this.y = y
    this.scale = 1,
    this.coor = coor,
    this.dir  = [0,1]
    this.vel  = 0
    this.theta = 0,

    this.shape = "./images/shapeship.png"

    this.getVerticesPos = function(){
        var pts = [];
        for(var i = 0; i < this.coor.length;i++){
            pts.push([this.x + (this.coor[i][0] * this.scale), this.y + (this.coor[i][1] * this.scale)]);
        }
        return pts;
    }
    this.rotate = function(theta){
        var tmp = this.getVerticesPos();
        var r = rotate(theta,this.coor,this.dir);
        this.coor = r.t_pts;
        this.dir  = r.dir;
    }
    this.update = function(){
        if(this.vel != 0){
            var dirVX = this.vel * this.dir[0];
            var dirVY = this.vel * this.dir[1];
            this.x = this.x + dirVX;
            this.y = this.y + dirVY;
            var tmp = [];
            for(var i = 0; i < this.coor.length;i++){
                this.coor[i] = [this.coor[i][0] + dirVX, this.coor[i][1] + dirVY];
            }
        }
    }

}
function SafeSprite(){
    this.x = 250
    this.y = 250
    this.front = [250,256]
    this.left  = [246,246]
    this.right = [254,246]
    this.dir   = [0,1]
    this.vel  = 0
    this.theta = 0,
    this.shape = "./images/shapeship.png"
    this.rotate = function(theta){
        pts = rotate(theta,[this.front,this.left,this.right],this.dir);
        this.front = pts.t_pts[0];
        this.left  = pts.t_pts[1];
        this.right = pts.t_pts[2];
        this.dir   = pts.dir;
    }
    this.update = function(theta){
        if(this.vel != 0){
            var dirVX = this.vel * this.dir[0];
            var dirVY = this.vel * this.dir[1];
            this.x = this.x + dirVX;
            this.y = this.y + dirVY;
            this.front = [this.front[0] + dirVX,this.front[1] + dirVY];
            this.left  = [this.left[0]  + dirVX,this.left[1]  + dirVY];
            this.right = [this.right[0] + dirVX,this.right[1] + dirVY];
        }
    }
    this.boundsCheck = function(){
        if (this.x >= canvas.width) {
            this.x = this.x % canvas.width;
            this.front = [this.front[0] % canvas.width,this.front[1]];
            this.left  = [this.left[0]  % canvas.width,this.left[1] ];
            this.right = [this.right[0] % canvas.width,this.right[1]];
        } else if (this.x <= 0) {
            this.x = this.x + canvas.width;
            this.front = [this.front[0] + canvas.width,this.front[1]];
            this.left  = [this.left[0]  + canvas.width,this.left[1] ];
            this.right = [this.right[0] + canvas.width,this.right[1]];
        }
        if (this.y >= canvas.height) {
            this.y = this.y % canvas.height;
            this.front = [this.front[0],this.front[1] % canvas.height];
            this.left  = [this.left[0] ,this.left[1]  % canvas.height ];
            this.right = [this.right[0],this.right[1] % canvas.height];
        } else if (this.y <= 0) {
            this.y = this.y + canvas.height;
            this.front = [this.front[0],this.front[1] + canvas.height];
            this.left  = [this.left[0] ,this.left[1]  + canvas.height ];
            this.right = [this.right[0],this.right[1] + canvas.height];
        }

    }
}
//////////////////////////////////////////////
///********    Geometry Functions   *******///
//////////////////////////////////////////////

//Purpose: Computes whether a point is in a polgon using the # of edges intercepted by a horizonal line through the pt
//Inputs: points: coordinates of the polygon corners, pt: the testing point
function point_in_polygon(points,pt){
  var m = 0;
  var r = points.length-1;
  var oddNodes = false;
  for (m=0; m<points.length; m++) {
    if ((points[m][1]< pt[1] && points[r][1]>=pt[1]
    ||   points[r][1]< pt[1] && points[m][1]>=pt[1])
    &&  (points[m][0]<=pt[0] || points[r][0]<=pt[0])) {
      if (points[m][0]+(pt[1]-points[m][1])/(points[r][1]-points[m][1])*(points[r][0]-points[m][0])<pt[0]) {
        if(oddNodes == false){  oddNodes = true; } else{oddNodes = false;}
      }
    }
    r=m;
  }
  return oddNodes;
}

//Purpose: Consolidates checking multiple points (space ship)
function pts_in_polygon(points,pts){
    ret = false;
    for (a=0; a<pts.length; a++) {
      if(point_in_polygon(points,pts[a])){
        ret = true;
      };
    }
    return ret;
}

//////////////////////////////////////////////
///********    Random Functions   *******///
//////////////////////////////////////////////

// Purpose: Output Random Coordinates based on the canvas
function getRandomCoordinates() {
  return [Math.floor(Math.random() * (canvas.height - 1)),Math.floor(Math.random() * (canvas.height - 1))];
}

// Purpose: Output Random (x,y) velocities
function getRandomVelocity() {
  var plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
  var plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
  return [plusOrMinusX*Math.random(),plusOrMinusY*Math.random()];
}

//////////////////////////////////////////////
///********    Drawing Functions   *******///
//////////////////////////////////////////////

//Repaint functions: redraw the ship, shots, and asteroids at their new locations
function repaint() {
  repaintShip();
  repaintShots();
  repaintAliens();
  repaintAsteroids();
}
// Purpose: Redraw Ship
function repaintShip(){
    checkShipCollision();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ship.rotate(ship.theta);
    ctx.beginPath();
    var verts = ship.getVerticesPos();
    //console.log(verts);
    ctx.moveTo(verts[0][0],verts[0][1]);
    for(var i = 1; i < verts.length;i++){
        ctx.lineTo(verts[i][0],verts[i][1]);
    }
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'White';
    ctx.stroke();
}
// Purpose: Redraw Shots
function repaintShots(){
  for (l=0;l<shots.length;l++){
    // adjust coordinates
    shots[l][1] += shots[l][3];
    shots[l][0] += shots[l][2];
    shots[l][4] += 1;
    if(shots[l][4] > 500){
      shots.splice(l,1);
    }
    else {
      //wrap around page
      var Cx = shots[l][0];
      var Cy = shots[l][1];
      if(Cx > canvas.width ){
        shots[l][0] = Cx % canvas.width;
        shots[l][1] = Cy;
      } else if ( Cx < 0 ){
        shots[l][0] = Cx + canvas.width;
        shots[l][1] = Cy;
      }
      if(Cy > canvas.height){
        shots[l][0] = Cx;
        shots[l][1] = Cy % canvas.height;
      } else if (Cy < 0) {
        shots[l][0] = Cx;
        shots[l][1] = Cy + canvas.height;
      }
      ctx.beginPath();
      ctx.arc(shots[l][0],shots[l][1], 2, 0, Math.PI * 2);
      ctx.fillStyle = shots[l][5];
      ctx.fill();
      if(!checkAsteroidCollision(shots[l],l)){
        checkAlienShipCollision(shots[l],l);
      }
    }
  }
}
function repaintAliens(){
  for (t=0;t<aliens.length;t++){
    // adjust coordinates
    aliens[t][1] += aliens[t][3];
    aliens[t][0] += aliens[t][2];
    var Cx = aliens[t][0];
    var Cy = aliens[t][1];
    if(Cx > canvas.width ){
      aliens[t][0] = Cx % canvas.width;
      aliens[t][1] = Cy;
    } else if ( Cx < 0 ){
      aliens[t][0] = Cx + canvas.width;
      aliens[t][1] = Cy;
    }
    if(Cy > canvas.height){
      aliens[t][0] = Cx;
      aliens[t][1] = Cy % canvas.height;
    } else if (Cy < 0) {
      aliens[t][0] = Cx;
      aliens[t][1]= Cy + canvas.height;
    }
    ctx.beginPath();
    ctx.moveTo(aliens[t][0]-10, aliens[t][1]);
    ctx.lineTo(aliens[t][0]-5, aliens[t][1]+5);
    ctx.lineTo(aliens[t][0]+5, aliens[t][1]+5);
    ctx.lineTo(aliens[t][0]+10, aliens[t][1]);
    ctx.lineTo(aliens[t][0]+5, aliens[t][1]-5);

    ctx.lineTo(aliens[t][0]-5, aliens[t][1]-5);
    ctx.lineTo(aliens[t][0]+5, aliens[t][1]-5);

    ctx.lineTo(aliens[t][0]+4, aliens[t][1]-5);
    ctx.lineTo(aliens[t][0]+2, aliens[t][1]-8);
    ctx.lineTo(aliens[t][0]-2, aliens[t][1]-8);
    ctx.lineTo(aliens[t][0]-4, aliens[t][1]-5);
    ctx.lineTo(aliens[t][0]-5, aliens[t][1]-5);
    ctx.lineTo(aliens[t][0]-10, aliens[t][1]);
    ctx.lineTo(aliens[t][0]+10, aliens[t][1]);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'Red';
    ctx.stroke();
  }
}
// Purpose: Redraw Asteroids
function repaintAsteroids(){
  for (i=0;i<asteroids.length;i++){
    // adjust coordinates
    var sprite = asteroids[i];
    sprite.x += sprite.dir[0];
    sprite.y += sprite.dir[1];
    sprite.update();
    //sprite.boundsCheck();

    ctx.beginPath();
    var coor = sprite.coor;
    ctx.moveTo(coor[0][0],coor[0][1]);
    for(var i = 1; i < coor.length;i++){
        ctx.lineTo(coor[i][0] * sprite.scale,coor[i][1] * sprite.scale);
    }
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'White';
    ctx.stroke();
  }
}
