const keys = {};

export const keyCodes = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

export const controls = {
    keyDown(code) {
        return keys[code];
    },
    onKeydown(e) {
        keys[e.keyCode] = true;
    },
    onKeyup(e) {
        keys[e.keyCode] = null;
    },
};

window.addEventListener(
    'keydown',
    function(e) {
        controls.onKeydown(e);
    },
    false
);

window.addEventListener(
    'keyup',
    function(e) {
        controls.onKeyup(e);
    },
    false
);
