//Purpose: rotates a two dimensional point by theta
function rotate(theta,pts,dir){
    var t_pts = [];
    radians = theta / 360 * 2 * Math.PI;

    sin = Math.sin(radians);
    cos = Math.cos(radians);

    for(var i = 0;i < pts.length; i++){
        pt = pts[i];
        t_pts.push([ship.x + cos * (pt[0] - ship.x) - sin * (pt[1] - ship.y),
                    ship.y + sin * (pt[0] - ship.x) + cos * (pt[1] - ship.y)]);
    }
    dir = [cos * dir[0] - sin *  dir[1], sin *  dir[0] + cos *  dir[1]];
    return {t_pts:t_pts,dir,dir};
}
function boundsCheck(x,y){
    if (x >= canvas.width) {
        x = x % canvas.width;
    } else if (x <= 0) {
        x = x + canvas.width;
    }
    if (y >= canvas.height) {
        y = y % canvas.height;
    } else if (y <= 0) {
        y = y + canvas.height;
    }
    return {x:x,y:y}
}
//Purpose: Creates a new randomly located object with a random velocity
function object(transforms, size) {
    var coors = getRandomCoordinates();
    var velocity = getRandomVelocity();

    if (ship.x+50 >= coors[0] && ship.x-50 <= coors[0] && ship.y+50 >= coors[1] && ship.y-50 <= coors[1]){
      coors[0]+=100;
      coors[1]+=100;
    }

    var object = new Sprite(coors[0],coors[1],transforms);

    object.vDir = velocity;
    object.vel = 1;
    object.scale = 1;

    return object
}
/*Generic Sprite creation
Inputs: x,y starting coordinates and a list of transformations for sprites points
The first [x,y] transformation should be the front of the obj. i.e.
The point that will shoot

*/
function Sprite(x,y,transform){
    this.x = x,
    this.y = y,
    this.scale = 1,
    this.transform = transform,
    this.dir   = [0,1], // gun direction
    this.vDir  = [0,1],
    this.vel   = 0,
    this.rVel  = 0,
    this.theta = 0,

    this.shape = "./images/shapeship.png"
    this.rotate = function(theta,pts){
        return rotate(theta,pts,this.dir);
    }
    this.update = function(){ // Specific to the asteroids movement style
        // if the velocity vector is nonnegligible continue moving in the vDirection
        // otherwise change directions to the tip direction
        if(this.vel > 0.25){
            var dirVX = this.vel * this.vDir[0];
            var dirVY = this.vel * this.vDir[1];
            this.x = this.x + dirVX;
            this.y = this.y + dirVY;
        } else{
            this.vDir = this.dir;
        }
        if(this.rVel != 0){
            var r = rotate(ship.rVel,[[0,0]],this.dir);
            this.dir  = r.dir;
        }
    }
    this.genVertices = function(){
        var tra = [];
        for(var i=0;i<this.transform.length;i++){
            tra.push([this.x+this.transform[i][0] * this.scale,this.y+this.transform[i][1]* this.scale]);
        }

        return tra;
    }
    this.getVerticesPos = function(){
        var tmp = [];
        var pts = this.genVertices();
        var rPt = this.rotate(this.theta,pts);
        return rPt.t_pts
    }
    this.boundsCheck = function(){
        coor = boundsCheck(this.x,this.y);
        this.x = coor.x;
        this.y = coor.y;
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
                if(oddNodes == false){
                    oddNodes = true;
                }
                else{
                    oddNodes = false;
                }
            }
        }

        r = m;
    }
    return oddNodes;
}

//Purpose: Consolidates checking multiple points (space ship)
function pts_in_polygon(points,pts){
    for (a=0; a<pts.length; a++) {
        if(point_in_polygon(points,pts[a])){
            return true;
        };
    }
    return false;
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
  repaintSprites();
  repaintShots();
}
// Purpose: Redraw Shots
function repaintShots(){
    for (var l=0;l<shots.length;l++){
        // adjust coordinates

        shots[l][1] += shots[l][3];
        shots[l][0] += shots[l][2];
        shots[l][4] += 1;
        if(shots[l][4] > 500){
            shots.splice(l,1);
        }
        else {
            //wrap around page
            coor = boundsCheck(shots[l][0],shots[l][1]);
            shots[l][0] = coor.x;
            shots[l][1] = coor.y;

            ctx.beginPath();
            ctx.arc(shots[l][0],shots[l][1], 2, 0, Math.PI * 2);
            ctx.fillStyle = shots[l][5];
            ctx.fill();

            //Check bullet collisions
            if(!checkAsteroidCollision(shots[l],l)){
                checkAlienShipCollision(shots[l],l);
            }
            checkShipCollisionBullets();
        }
    }
}
function paint(sprite,color){
    sprite.boundsCheck();

    var coor = sprite.getVerticesPos();

    ctx.beginPath();
    ctx.moveTo(coor[0][0],coor[0][1]);
    for(var i = 1; i < coor.length;i++){
        ctx.lineTo(coor[i][0] * sprite.scale,coor[i][1] * sprite.scale);
    }
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();
}
function repaintSprites(){
    checkShipCollision();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.theta += ship.rVel;
    paint(ship,"yellow");

    for (var t=0;t<asteroids.length;t++){
        asteroids[t].update();
        paint(asteroids[t],'white');
    }
    for (var t=0;t<aliens.length;t++){
        aliens[t].update();
        paint(aliens[t],'red');
    }
}
