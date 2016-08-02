
class Goal {

  size = [16, 16]

  color = 'black'

  constructor(ctx) {
    this.ctx = ctx;
  }

  render(ctx, {width, x}) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, width, 20);
  }
}

export default Goal; 
