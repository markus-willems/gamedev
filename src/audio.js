export function playSound(type, hz, length) {
    const audioCtx = new window.AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(hz, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    try {
        oscillator.start();
        setTimeout(() => oscillator.stop(), length);
    } catch (error) {
        oscillator.stop();
    }
}
