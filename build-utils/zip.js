const fs = require('fs');
const archiver = require('archiver');
const zipConfig = require('./zip.config');

const output = fs.createWriteStream(`${zipConfig.filename}.zip`);
var archive = archiver('zip', {
    zlib: { level: 9 },
});

output.on('close', function() {
    const size = archive.pointer();
    if (size <= zipConfig.maxSize) {
        console.log('Zipped:', size, 'bytes.');
    } else {
        throw new Error(`File too big: ${size} bytes.`);
    }
});

output.on('end', function() {
    console.log('Data has been drained');
});

archive.on('warning', function(err) {
    throw err;
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

zipConfig.data.files.forEach(file => {
    archive.file(file, { name: file });
});

zipConfig.data.dirs.forEach(dir => {
    archive.directory(dir, dir);
});

archive.finalize();
