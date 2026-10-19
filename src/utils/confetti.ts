import confetti from 'canvas-confetti';

export function triggerTaskConfetti() {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#38bdf8'],
      disableForReducedMotion: true,
      ticks: 120,
      scalar: 0.8,
    });
  } catch (err) {
    // Graceful fallback if canvas is not supported
  }
}

export function triggerGoalCelebration() {
  try {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#10b981', '#f59e0b'],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#ec4899', '#8b5cf6'],
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (err) {
    // Graceful fallback
  }
}
