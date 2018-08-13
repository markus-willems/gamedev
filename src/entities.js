import { createEntity, getImg } from './lib';
import { collisionBetween } from './physics';
import { controls, keyCodes } from './controls';
import { uuidv4 } from './utils';

const globals = {
    gravity: 10,
};

const entities = [];

const water = createEntity(
    {
        id: uuidv4(),
        name: 'water',
        image: 'water.png',
        x: 0,
        y: 0,
        width: 32,
        height: 32,
    },
    () => {},
    (self, assets, ctx, canvasWidth, canvasHeight) => {
        for (let i = 0; i < Math.ceil(canvasWidth / self.width); i++) {
            for (let j = 0; j < Math.ceil(canvasHeight / self.height); j++) {
                ctx.drawImage(
                    getImg(self.image, assets),
                    self.x + self.width * i,
                    self.y + self.height * j,
                    self.width,
                    self.height
                );
            }
        }
    }
);

const player = createEntity(
    {
        id: uuidv4(),
        name: 'player',
        image: 'caravel.png',
        x: 100,
        y: 100,
        width: 50,
        height: 50,
    },
    (self, step, entities) => {
        entities
            .filter(entity => entity.state.id !== self.id)
            .forEach(entity => {
                let { state: other } = entity;
                if (collisionBetween(self, other)) {
                }
            });
        if (controls.keyDown(keyCodes.RIGHT)) {
            self.x += 3;
        }
        if (controls.keyDown(keyCodes.LEFT)) {
            self.x -= 3;
        }
        if (controls.keyDown(keyCodes.UP)) {
            self.y -= 3;
        }
        if (controls.keyDown(keyCodes.DOWN)) {
            self.y += 3;
        }
    },
    (self, assets, ctx) => {
        ctx.drawImage(
            getImg(self.image, assets),
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
        name: 'wall',
        x: 300,
        y: 500,
        width: 20,
        height: 20,
        velocityX: 1,
        velocityY: 1,
        isJumping: false,
    },
    (self, step, entities) => {
        self.x += self.velocityX * 0.1;
        self.y += self.velocityY * 0.1;
        self.velocityY += globals.gravity * 0.1;

        if (controls.keyDown(keyCodes.SPACE)) {
            if (!self.isJumping) {
                self.velocityY = -20;
                //self.isJumping = true;
            }
        }
    },
    (self, assets, ctx) => {
        ctx.beginPath();
        ctx.rect(self.x, self.y, self.width, self.height);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();
    }
);

entities.push(water);
entities.push(wall);
entities.push(player);

export default entities;
