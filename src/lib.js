import { IMG_ASSET_PATH } from './config';

export function init(assets, cb) {
	let response = {};
	let promises = Object.keys(assets)
		.map(key => {
			response[key] = [];
			if (key === 'images') {
				return createImages(assets[key], IMG_ASSET_PATH);
			}
			if (key === 'entities') {
				return processEntities(assets[key]);
			}
		})
		.reduce((acc, curr) => {
			return acc.concat(...curr);
		}, []);
	Promise.all(promises)
		.then(res => {
			res.forEach(asset => {
				response[asset.type].push(asset);
			});
			cb(response);
		})
		.catch(error => console.error(error));
}

function processEntities(entities) {
	return entities.map(entity => {
		return new Promise((resolve, reject) => {
			if (entity.state.id) {
				resolve({
					entity,
					name: entity.name,
					type: 'entities',
				});
			} else {
				reject(new Error('Entity must have valid `id` prop.'));
			}
		});
	});
}

function createImages(images, path) {
	return images.map(image => {
		let img = new Image();
		img.src = require('../img/' + image);
		return new Promise((resolve, reject) => {
			img.onload = () =>
				resolve({
					dom: img,
					name: image,
					type: 'images',
				});
			img.onerror = reject;
		});
	});
}

export function gameLoop(update, render) {
	let now = 0;
	let dt = 0;
	let last = window.performance.now();
	let step = 1 / 60;

	function frame() {
		now = window.performance.now();
		dt = dt + Math.min(1, (now - last) / 1000);
		while (dt > step) {
			dt = dt - step;
			update(step);
		}
		render(dt);
		last = now;
		window.requestAnimationFrame(frame);
	}

	window.requestAnimationFrame(frame);
}

export function getImg(name, { images }) {
	return images.filter(img => img.name === name)[0].dom;
}

export function createEntity(initialState, updater, renderer) {
	return {
		state: Object.assign({}, initialState),
		update(step, entities) {
			updater(this.state, step, entities);
		},
		render(assets, ctx, canvasWidth, canvasHeight) {
			renderer(this.state, assets, ctx, canvasWidth, canvasHeight);
		},
	};
}
