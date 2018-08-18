const fs = require('fs');
const { execFile } = require('child_process');
const zopflipng = require('zopflipng-bin');

const PATH = './dist/img/';

fs.readdir(PATH, (err, images) => {
    if (err) throw err;
    images.map(image => PATH + image).forEach(image => {
        execFile(
            zopflipng,
            ['-y', '-m', '--lossy_8bit', image, image],
            (_, output) => {
                console.log(output);
            }
        );
    });
});
