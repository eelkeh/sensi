import Grid from './Grid';
import Player from './Player';
import Ball from './Ball';
import Goal from './Goal';
import Vector from './Vector';
import set from 'lodash-es/set';
import throttle from 'lodash-es/throttle';
import {distance} from './utils';

// key codes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SPACEBAR = 32;

// actions
const MOVE_LEFT = 'MOVE_LEFT';
const MOVE_RIGHT = 'MOVE_RIGHT';
const MOVE_UP = 'MOVE_UP';
const STOP_MOVING = 'STOP_MOVING';
const MOVE_DOWN = 'MOVE_DOWN';
const KICK_BALL = 'KICK_BALL';

// constants
const SPEED = 3;
const KICK_VELOCITY = 12;
const PITCH_SIZE = [640, 480];
const GOAL_WIDTH = 128;
const PITCH_COLOR = "rgb(119, 152, 1)";

const updates = {

  [MOVE_UP]: state => {
    const {player} = state;
    const velocity = new Vector(
      player.velocity.x, 
      -SPEED
    );
    return set(state, ['player', 'velocity'], velocity);
  },

  [MOVE_DOWN]: state => {
    const {player} = state;
    const velocity = new Vector(
      player.velocity.x, 
      SPEED
    );
    return set(state, ['player', 'velocity'], velocity);
  },

  [MOVE_RIGHT]: state => {
    const {player} = state;
    const velocity = new Vector(
      SPEED,
      player.velocity.y
    );
    return set(state, ['player', 'velocity'], velocity);
  },

  [MOVE_LEFT]: state => {
    const {player, ball} = state;
    const velocity = new Vector(
      -SPEED,
      player.velocity.y
    );

    set(state, ['player', 'velocity'], velocity);

    if (!player.hasBall) {
      // ball spin 
      const {velocity} = ball;
      // only when the ball is still moving
      if (velocity.y) {
        velocity.x = velocity.x + (0.2 * velocity.y);
        set(state, ['ball', 'velocity'], velocity);
      }
    }
    return state;
  },

  [STOP_MOVING]: (state, direction) => {
    switch (direction) {
      case UP:
      case DOWN:
        return set(state, ['player', 'velocity'], new Vector(
          state.player.velocity.x,
          0
        ));
      case RIGHT:
      case LEFT:
        return set(state, ['player', 'velocity'], new Vector(
          0,
          state.player.velocity.y
        ));
    }
    return state;
  },

  [KICK_BALL]: state => {
    const {player} = state;
    if (!player.hasBall) {
      return state;
    }
    player.hasBall = false;
    // base the direction of the ball on the players current velocity
    let factor = [
      player.velocity.x === 0 ? 0 : player.velocity.x > 1 ? 1 : -1, 
      player.velocity.y === 0 ? 0 : player.velocity.y > 1 ? 1 : -1, 
    ];
    // kick the ball forwards when standing still
    if (factor[0] === 0 && factor[1] === 0) factor = [0, -1];
    const velocity = new Vector(...factor.map(f => f * KICK_VELOCITY));
    return set(state, ['ball', 'velocity'], velocity);
  }
}

class Game {

  constructor() {

    // game world state
    this.state = {
      stepSize: 5,
      size: PITCH_SIZE,
      goal: {
        width: GOAL_WIDTH,
        x: Math.floor((PITCH_SIZE[0] / 2) - (GOAL_WIDTH / 2)),
      },
      player: {
        pos: new Vector(320, 460),
        velocity: new Vector(0, 0),
        size: 16,
        hasBall: false,
        hasScored: false,
        sprites: 'player'
      },
      team: [
        {
          pos: new Vector(360, 300),
          velocity: new Vector(0, 0),
          size: 16,
          hasBall: false,
          sprites: 'player'
        },
        {
          pos: new Vector(100, 300),
          velocity: new Vector(0, 0),
          size: 16,
          hasBall: false,
          sprites: 'player'
        },
      ],
      keeper: {
        pos: new Vector(304, 25),
        velocity: new Vector(0, 0),
        size: 16,
        hasBall: false,
        sprites: 'keeper'
      },
      ball: {
        pos: new Vector(320, 400),
        velocity: new Vector(0, 0),
        spin: new Vector(0, 0),
        acceleration: 0,
        size: 16,
      },
    };

    // canvas 2d context
    this.ctx = this.getCanvas();

    this.addToRenderQueue(
      [new Grid(this.ctx), state => state],
      [new Goal(this.ctx), state => state.goal],
      [new Player(this.ctx), state => state.player],
      [new Player(this.ctx), state => state.team[0]],
      [new Player(this.ctx), state => state.team[1]],
      [new Player(this.ctx), state => state.keeper],
      [new Ball(this.ctx), state => state]
    );

    // [new Defender(this.ctx), state => state]
    this.setupControls();

    // throttle flushing updates, prevents spamming events when holding 
    // down a direction key.
    this.flush = throttle(this.flush, 10, {leading: true});
    //  start the main loop
    this.loop();
  }

  addToRenderQueue(...args) {
    args.forEach(item => {
      this.renderQueue = this.renderQueue || [];
      this.renderQueue.push(item);
    }) 
  }

  update() {
    // move objects on the grid
    const {ball, player, team, keeper, size, goal} = this.state;

    if (player.hasScored) {
      // console.log('HOORAY');
    }

    if (player.hasBall) {
      ball.pos.x = player.pos.x + Math.floor(ball.size / 2);
      ball.pos.y = player.pos.y - Math.floor(player.size / 2);
    }

    if (player.velocity.has()) {
      player.pos = player.pos.add(player.velocity);
    }
    team.forEach(teamMate => {
      if (teamMate.velocity.has()) {
        teamMate.pos = teamMate.pos.add(teamMate.velocity);
      }
    });

    if (ball.velocity.has()) {
      const newPos = ball.pos.add(ball.velocity);
      // damping
      ball.velocity.y = 0.97 * ball.velocity.y;
      if (Math.abs(ball.velocity.y) < 0.1) {
        ball.velocity.y = 0;
      }
      ball.velocity.x = 0.97 * ball.velocity.x;
      if (Math.abs(ball.velocity.x) < 0.1) {
        ball.velocity.x = 0;
      }
      set(this.state, 'ball', {pos: newPos, velocity: ball.velocity});
    }

    // move goalie!
    if (player.hasBall) {
      // relative x pos of player (to pitch with)
      const factorPlayerX = player.pos.x / size[0];
      keeper.pos = new Vector(
        goal.x + (factorPlayerX * goal.width) - keeper.size,
        keeper.pos.y
      );
    }

    // flock teammates, keep distance from player with ball
    const distRangeOffense = [150, 200];
    const distRangeScored = [20, 80];
    team.forEach(teamMate => {
        if ((player.hasBall || player.hasScored) && 
          Math.floor(Math.random() * 10) === 0) {

        // distance to ball
        const distRange = player.hasScored ? distRangeScored: distRangeOffense;
        const dist = distance(teamMate.pos, player.pos);

        if (dist >= distRange[0] && dist < distRange[1]) {
          // stop moving
          teamMate.velocity = new Vector(0, 0);
        } else {
          // direction vector
          let dir = new Vector(
            player.pos.x - teamMate.pos.x,
            player.pos.y - teamMate.pos.y
          );
          // normalize!
          const hyp = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
          dir.x /= hyp;
          dir.y /= hyp;
          dir = dir.multiply(SPEED - 1);
          teamMate.velocity = dir;
          if (dist < distRange[0]) {
            teamMate.velocity = dir.reverse();
          }
        }
      }
    });

    this.collisionDetect();
  }
  
  flush(actionType, ...args) {
    // flush update
    if (typeof updates[actionType] === 'function') {
      const newState = updates[actionType](this.state, ...args);
      this.state = newState;
      // detect collissions
    } else throw Error();
  }


  collisionDetect() {
    const {player, ball, goal} = this.state;
    if (player.pos.x < ball.pos.x + ball.size &&
        player.pos.x + player.size > ball.pos.x &&
        (player.pos.y + 3) < ball.pos.y + ball.size &&
        (player.pos.y + 3) + player.size > ball.pos.y) {
      // collision detected!
      this.state.player.hasBall = true;
    }

    if (ball.pos.x > goal.x &&
        ball.pos.x < (goal.x + goal.width) &&
        ball.pos.y < 20) {
      this.state.player.hasScored = true;
    }
  }

  loop = () => {
    requestAnimationFrame(this.loop)
    this.update();
    this.render();
  }

  setupControls() {
    addEventListener('keydown', e => {
      const direction = e.keyCode;
      switch (direction) {
        case LEFT:
          this.flush(MOVE_LEFT);
          break;
        case UP:
          this.flush(MOVE_UP);
          break;
        case RIGHT:
          this.flush(MOVE_RIGHT);
          break;
        case DOWN:
          this.flush(MOVE_DOWN);
          break;
        case SPACEBAR:
          this.flush(KICK_BALL);
          break;
      }
    });
    addEventListener('keyup', e => {
      const direction = e.keyCode;
      this.flush(STOP_MOVING, direction);
    });
  }

  getCanvas() {
    const node = document.createElement('canvas');
    node.width = this.state.size[0];
    node.height = this.state.size[1];
    const root = document.getElementById('game');
    node.style.backgroundColor = PITCH_COLOR;
    root.appendChild(node);
    const ctx = node.getContext('2d');
    // we need the 8bit look, no anti aliasing please! :)
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  render() {
    const {ctx, state} = this;
    this.renderQueue.forEach(item => {
      const [obj, lens] = item;
      obj.render(ctx, lens(state));
    });
  }

}

export default Game;
