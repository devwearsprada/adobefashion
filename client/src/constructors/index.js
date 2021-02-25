function Point(x, y) {
  if (x<-1) x = -1;
  if (y<-1) y = -1;
  if (x>1) x = 1;
  if (y>1) y = 1;

  this.x = x;
  this.y = y;
}

// A new mouse manipulation.
function Move(point) {
  this.point1 = new Point(point.x, point.y);
  this.point2 = new Point(point.x, point.y);

  this.move = function (point) {
      this.point2.x = point.x;
      this.point2.y = point.y;
  }
}

module.exports = { Point, Move }