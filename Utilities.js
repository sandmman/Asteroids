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
//Purpose: rotates a two dimensional point by theta
function rotate(theta,pts){
    var t_pts = []
    for(var i = 0;i < pts.length; i++){
        pt = pts[i];
        t_pts.push([Math.cos(theta) * pt[0] - Math.sin(theta), Math.sin(theta) + Math.cos(theta)])
    }
    return t_pts
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
  ctx.beginPath();
  ctx.moveTo(x-4,y-4);
  ctx.lineTo(x,y+2);
  ctx.lineTo(x+4,y-4);
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
    asteroids[i][1] += asteroids[i][3];
    asteroids[i][0] += asteroids[i][2];
    // Wrap around page
    var Cx = asteroids[i][0];
    var Cy = asteroids[i][1];
    if(Cx > canvas.width ){
      asteroids[i][0] = Cx % canvas.width;
      asteroids[i][1] = Cy;
    } else if ( Cx < 0 ){
      asteroids[i][0] = Cx + canvas.width;
      asteroids[i][1] = Cy;
    }
    if(Cy > canvas.height){
      asteroids[i][0] = Cx;
      asteroids[i][1] = Cy % canvas.height;
    } else if (Cy < 0) {
      asteroids[i][0] = Cx;
      asteroids[i][1]= Cy + canvas.height;
    }
    var scale = asteroids[i][4];
    ctx.beginPath();
    ctx.moveTo(asteroids[i][0]+10*scale, asteroids[i][1]+10*scale);
    ctx.lineTo(asteroids[i][0]+8*scale, asteroids[i][1]+5*scale);
    ctx.lineTo(asteroids[i][0]+10*scale, asteroids[i][1]-10*scale);
    ctx.lineTo(asteroids[i][0], asteroids[i][1]-5*scale);
    ctx.lineTo(asteroids[i][0]-10*scale, asteroids[i][1]-10*scale);
    ctx.lineTo(asteroids[i][0]-3*scale, asteroids[i][1]+2*scale);
    ctx.lineTo(asteroids[i][0]-10*scale, asteroids[i][1]+10*scale);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'White';
    ctx.stroke();
  }
}
