import { createEntity, getImg } from './lib';
import { collisionBetween } from './physics';
import { controls, keyCodes } from './controls';
import { uuidv4 } from './utils';

const globals = {
    gravity: 0.8,
    tileWidth: 32,
    tileHeight: 32,
};

const entities = [];
/* 
const player = createEntity(
    {
        id: uuidv4(),
        name: 'player',
        x: 100,
        y: 100,
        width: 30,
        height: 60,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
    },
    (self, step, entities) => {
        self.x = Math.round(self.x + self.velocityX);
        self.y = Math.round(self.y + self.velocityY);
        self.velocityY = Math.round(globals.gravity + self.velocityY);

        if (controls.keyDown(keyCodes.SPACE)) {
            if (!self.isJumping) {
                self.velocityY = -20;
                self.isJumping = true;
            }
        }

        if (controls.keyDown(keyCodes.LEFT)) {
            if (!self.isJumping) {
                if (!self.isJumping) {
                    self.x -= 4;
                    self.velocityX = -5;
                }
            }
        }

        if (controls.keyDown(keyCodes.RIGHT)) {
            if (!self.isJumping) {
                self.x += 4;
                self.velocityX = 5;
            }
        }

        entities
            .filter(entity => entity.state.id !== self.id)
            .forEach(entity => {
                let { state: other } = entity;
                if (collisionBetween(self, other)) {
                    if (other.wall) {
                        self.y = other.y - self.height;
                        self.velocityY = 0;
                        self.velocityX = 0;
                        self.isJumping = false;
                    }
                }
            });
    },
    (self, assets, ctx) => {
        ctx.beginPath();
        ctx.rect(self.x, self.y, self.width, self.height);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    }
);

const ground = createEntity(
    {
        id: uuidv4(),
        height: 30,
        wall: true,
    },
    () => {},
    (self, assets, ctx, canvasWidth, canvasHeight) => {
        self.x = 0;
        self.y = canvasHeight - 200;
        self.width = canvasWidth;
        ctx.beginPath();
        ctx.rect(self.x, self.y, self.width, self.height);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
    }
);
 */

function drawGrid(ctx, width, height, tileWidth, tileHeight) {
    for (let i = 0; i < width / tileWidth; i++) {
        for (let j = 0; j < height / tileHeight; j++) {
            let v = i + j;
            if (v % 2 === 0) {
                ctx.fillStyle = '#ddd';
            } else {
                ctx.fillStyle = '#ffffff';
            }
            ctx.fillRect(tileWidth * i, tileHeight * j, tileWidth, tileHeight);
        }
    }
}

function handleMovement(self, type) {
    if (self.fps % 10 === 0) {
        if (type === 'up') {
            self.y -= globals.tileHeight;
        } else if (type === 'right') {
            self.x += globals.tileWidth;
        } else if (type === 'down') {
            self.y += globals.tileHeight;
        } else {
            self.x -= globals.tileWidth;
        }
    }
}

function handleShooting(self) {
    if (self.fps % 10 === 0) {
        let vx = 0;
        let vy = 0;
        if (self.facing === 'up') {
            vy = -10;
        } else if (self.facing === 'right') {
            vx = 10;
        } else if (self.facing === 'down') {
            vy = 10;
        } else {
            vx = -10;
        }
        entities.push(bullet(self.x, self.y, vx, vy));
    }
}

const grid = createEntity(
    {
        id: uuidv4(),
        width: 32,
        height: 32,
    },
    () => {},
    (self, assets, ctx, canvasWidth, canvasHeight) => {
        drawGrid(
            ctx,
            canvasWidth,
            canvasHeight,
            globals.tileWidth,
            globals.tileHeight
        );
    }
);

const bullet = (x, y, vx, vy) =>
    createEntity(
        {
            id: uuidv4(),
            type: 'bullet',
            velocityX: vx,
            velocityY: vy,
            x,
            y,
        },
        self => {
            self.x = Math.round(self.x + self.velocityX);
            self.y = Math.round(self.y + self.velocityY);
        },
        (self, assets, ctx, canvasWidth, canvasHeight) => {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.fillRect(self.x, self.y, 8, 8);
            ctx.closePath();
        }
    );

const player = createEntity(
    {
        id: uuidv4(),
        width: 32,
        height: 48,
        x: globals.tileWidth,
        y: globals.tileHeight,
        isMoving: false,
        isShooting: false,
        facing: 'up',
        fps: 0,
    },
    (self, step, entities) => {
        if (self.fps < 60) {
            self.fps += 1;
        } else {
            self.fps = 1;
        }
        if (controls.keyDown(keyCodes.LEFT)) {
            self.facing = 'left';
            handleMovement(self, 'left');
        }
        if (controls.keyDown(keyCodes.RIGHT)) {
            self.facing = 'right';
            handleMovement(self, 'right');
        }
        if (controls.keyDown(keyCodes.UP)) {
            self.facing = 'up';
            handleMovement(self, 'up');
        }
        if (controls.keyDown(keyCodes.DOWN)) {
            self.facing = 'down';
            handleMovement(self, 'down');
        }
        if (controls.keyDown(keyCodes.SPACE)) {
            handleShooting(self);
        }
    },
    (self, assets, ctx, canvasWidth, canvasHeight) => {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.fillRect(
            self.x,
            self.y + (self.height - globals.tileHeight),
            self.width,
            self.height
        );
        ctx.closePath();
    }
);

entities.push(grid);
entities.push(player);

export default entities;
