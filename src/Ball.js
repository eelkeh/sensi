class Ball {

  size = [16, 16]

  color = 'black'

  constructor(ctx) {
    this.ctx = ctx;
  }

  render(ctx, {ball}) {
    const spot = 3;

    for (let i=1; i < 2; i++) {
      ctx.fillStyle = getColor(i);
      ctx.fillRect(ball.pos.x + i*spot, ball.pos.y, spot, spot);
    }
    for (let i=0; i < 3; i++) {
      ctx.fillStyle = getColor(i + 1);
      ctx.fillRect(ball.pos.x + i*spot, ball.pos.y + spot, spot, spot);
    }
    for (let i=0; i < 3; i++) {
      ctx.fillStyle = getColor(i);
      ctx.fillRect(ball.pos.x + i*spot, ball.pos.y + 2*spot, spot, spot);
    }
    for (let i=1; i < 2; i++) {
      ctx.fillStyle = getColor(i + 1);
      ctx.fillRect(ball.pos.x + i*spot, ball.pos.y + 3*spot, spot, spot);
    }
  }
}

function getColor(i) {
  return i % 2 === 0 ? 'white' : 'black';
}

export default Ball; 
