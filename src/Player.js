
const SPRITES = {
  player: {
    resting: [0, 360, 16, 16],
    runUp: [0, 378, 16, 16],
    runUpLeft: [0, 378, 16, 16],
    runDown: [0, 432, 16, 16],
    runRight: [18, 18, 16, 16],
    runLeft: [18, 90, 16, 16],
    cheering: [18, 380, 16, 16]
  },
  keeper: {
    resting: [162, 36, 16, 18],
  }
}


class Player {

  constructor(ctx) {
    this.ctx = ctx;
    this.spriteImg = new Image();
    this.spriteImg.src = "sprites/sens_players.png";
  }

  render(ctx, player) {
    const {velocity} = player;

    let sprites = SPRITES[player.sprites];
    let sprite = sprites.resting;

    if (player.hasScored) {
      sprite = sprites.cheering;
    } else if (velocity.y < 0) {
      sprite = sprites.runUp;
    } else if (velocity.y > 0) {
      sprite = sprites.runDown;
    } else if (velocity.x < 0) {
      sprite = sprites.runLeft;
    } else if (velocity.x > 0) {
      sprite = sprites.runRight;
    }

    ctx.drawImage(
      this.spriteImg,
      ...sprite,
      player.pos.x,
      player.pos.y,
      player.size * 2,
      player.size * 2
    );

    this.prevState = player;
  }
}

export default Player; 
