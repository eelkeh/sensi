class Vector {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add({x, y}) {
    return new Vector(this.x + x, this.y + y)
  }

  reverse() {
    return new Vector(-this.x, -this.y);
  }

  multiply(f) {
    return new Vector(f * this.x, f * this.y);
  }

  has() {
    return this.x || this.y;
  }
}

export default Vector;
