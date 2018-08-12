import { init, gameLoop } from './lib';
import entities from './entities';

/* Game */
window.onload = init(
    {
        images: ['caravel.png', 'water.png'],
        entities,
    },
    assets => {
        const canvas = document.getElementById('app');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ctx = canvas.getContext('2d');
        gameLoop(
            // Update
            step => {
                assets.entities.forEach(({ entity }) =>
                    entity.update(step, entities)
                );
            },
            // Render
            () => {
                // Clear canvas each frame
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                assets.entities.forEach(({ entity }) =>
                    entity.render(assets, ctx, canvasWidth, canvasHeight)
                );
            }
        );
    }
);

const drawGrid = (ctx, width, height, tileWidth, tileHeight) => {
    for (let i = 0; i < width / tileWidth; i++) {
        for (let j = 0; j < height / tileHeight; j++) {
            ctx.fillStyle = hex();
            ctx.fillRect(tileWidth * i, tileHeight * j, tileWidth, tileHeight);
        }
    }
};
