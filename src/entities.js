import { createEntity, getImg } from './lib';
import { collisionBetween } from './physics';
import { controls, keyCodes } from './controls';
import { playSound } from './audio';
import { uuidv4 } from './utils';

const globals = {
    tileWidth: 32,
    tileHeight: 32,
};

const entities = [];

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

function handleMovement(self, step, type) {
    self.facing = type;
    if (type === 'up') {
        self.y -= self.velocity * step;
        if (self.fps < 5) {
            self.ix = 0;
            self.iy = 0;
        } else if (self.fps >= 5 && self.fps < 10) {
            self.ix = 65;
            self.iy = 49;
        } else {
            self.ix = 97;
            self.iy = 49;
        }
    } else if (type === 'right') {
        self.x += self.velocity * step;
        if (self.fps < 5) {
            self.ix = 65;
            self.iy = 0;
        } else if (self.fps >= 5 && self.fps < 10) {
            self.ix = 0;
            self.iy = 97;
        } else {
            self.ix = 65;
            self.iy = 0;
        }
    } else if (type === 'down') {
        self.y += self.velocity * step;
        if (self.fps < 5) {
            self.ix = 33;
            self.iy = 0;
        } else if (self.fps >= 5 && self.fps < 10) {
            self.ix = 0;
            self.iy = 49;
        } else {
            self.ix = 33;
            self.iy = 49;
        }
    } else {
        self.x -= self.velocity * step;
        if (self.fps < 5) {
            self.ix = 97;
            self.iy = 0;
        } else if (self.fps >= 5 && self.fps < 10) {
            self.ix = 33;
            self.iy = 97;
        } else {
            self.ix = 97;
            self.iy = 0;
        }
    }
}

function handleShooting(self) {
    if (!self.isShooting) {
        self.isShooting = true;
        let vx = 0;
        let vy = 0;
        if (self.facing === 'up') {
            vy = -600;
        } else if (self.facing === 'right') {
            vx = 600;
        } else if (self.facing === 'down') {
            vy = 600;
        } else {
            vx = -600;
        }
        playSound('sawtooth', 20, 50);
        entities.push(bullet(self.x + 30, self.y + 26, vx, vy));
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
            width: 4,
            height: 4,
        },
        (self, step) => {
            self.x += self.velocityX * step;
            self.y += self.velocityY * step;
        },
        (self, assets, ctx, canvasWidth, canvasHeight) => {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.fillRect(self.x, self.y, self.width, self.height);
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
        velocity: 200,
        image: 'c.png',
        ix: 0, // image/sprite sub rect x
        iy: 0, // image/sprite sub rect y,
        fps: 0,
    },
    (self, step, entities) => {
        self.fps += 1;
        if (self.fps > 15) {
            self.fps = 0;
        }
        if (controls.keyDown(keyCodes.LEFT)) {
            handleMovement(self, step, 'left');
        }
        if (controls.keyDown(keyCodes.RIGHT)) {
            handleMovement(self, step, 'right');
        }
        if (controls.keyDown(keyCodes.UP)) {
            handleMovement(self, step, 'up');
        }
        if (controls.keyUp(keyCodes.UP) && self.facing === 'UP') {
            self.ix = 0;
            self.iy = 0;
        }
        if (controls.keyDown(keyCodes.DOWN)) {
            handleMovement(self, step, 'down');
        }
        if (controls.keyUp(keyCodes.DOWN) && self.facing === 'down') {
            self.ix = 33;
            self.iy = 0;
        }
        if (controls.keyDown(keyCodes.SPACE)) {
            handleShooting(self);
        }
        if (controls.keyUp(keyCodes.SPACE)) {
            self.isShooting = false;
        }
    },
    (self, assets, ctx, canvasWidth, canvasHeight) => {
        ctx.drawImage(
            getImg(self.image, assets),
            self.ix,
            self.iy,
            self.width,
            self.height,
            self.x,
            self.y,
            self.width,
            self.height
        );
    }
);

const wall = createEntity(
    {
        id: uuidv4(),
        x: globals.tileWidth * 2,
        y: globals.tileWidth * 4,
        width: globals.tileWidth,
        height: globals.tileHeight,
    },
    self => {
        entities
            .filter(entity => entity.state.id !== self.id)
            .forEach(entity => {
                let { state: other } = entity;
                if (collisionBetween(self, other)) {
                    if (other.type === 'bullet') {
                        self.x = -9999;
                        self.y = -9999;
                        other.x = -9999;
                        other.y = -9999;
                    }
                }
            });
    },
    (self, assets, ctx, canvasWidth, canvasHeight) => {
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.fillRect(self.x, self.y, self.width, self.height);
        ctx.closePath();
    }
);

entities.push(grid);
entities.push(player);
entities.push(wall);

export default entities;
