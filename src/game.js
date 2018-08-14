import { init, gameLoop } from './lib';
import entities from './entities';

/* Game */
window.onload = init(
    {
        images: ['caravel.png', 'water.png'],
    },
    assets => {
        const canvas = document.getElementById('app');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ctx = canvas.getContext('2d');
        gameLoop(
            // Update
            step => {
                entities.forEach(entity => {
                    entity.update(step, entities);
                });
            },
            // Render
            () => {
                // Clear canvas each frame
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                entities.forEach(entity => {
                    entity.render(assets, ctx, canvasWidth, canvasHeight);
                });
            }
        );
    }
);
