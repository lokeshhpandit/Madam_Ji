let currentAudio = null;

export const playMusic = (src, { loop = true, volume = 1 } = {}) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);
  currentAudio.loop = loop;
  currentAudio.volume = volume;

  currentAudio.play().catch((err) => {
    console.error("Music failed:", err);
  });
};

export const stopMusic = () => {
  if (!currentAudio) return;

  currentAudio.pause();
  currentAudio.currentTime = 0;
};

export const playSoundEffect = (src, volume = 1) => {
  const sound = new Audio(src);
  sound.volume = volume;

  sound.play().catch(console.error);
};