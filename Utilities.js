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
    //delete it if its out of the page
    var Cx = shots[l][0];
    var Cy = shots[l][1];
    if(Cx > canvas.width || Cx < 0 || Cy > canvas.height || Cy < 0){
      shots.splice(l,1);
    }
    else {
      ctx.beginPath();
      ctx.arc(shots[l][0],shots[l][1], 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      checkAsteroidCollision(shots[l],l);
    }
  }
}
// Purpose: Redraw Asteroids
function repaintAsteroids(){
  for (i=0;i<asteroids.length;i++){
    // adjust coordinates
    asteroids[i][1] += asteroids[i][3];
    asteroids[i][0] += asteroids[i][2];
    //delete it if its out of the page
    var Cx = asteroids[i][0];
    var Cy = asteroids[i][1];
    if(Cx > canvas.width || Cx < 0 || Cy > canvas.height || Cy < 0){
      asteroids.splice(i,1);
    }
    else{
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
}
