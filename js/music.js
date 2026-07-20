/* ============================================================================
   MUSIQUE D'AMBIANCE
   ============================================================================
   Le morceau doit être placé ici : audio/theme.mp3
   (voir audio/README.md pour le détail et les formats acceptés)

   Principe : la position de lecture est mémorisée en continu. En arrivant sur
   l'autre page, si la musique était en train de jouer, elle reprend
   automatiquement à l'endroit où elle en était. Certains navigateurs bloquent
   la reprise automatique du son sans nouveau geste de la personne : dans ce
   cas, un petit bouton apparaît en bas à droite pour reprendre en un clic.
   ============================================================================ */

const MUSIC_KEY = "bgn_music_state_v1";

function initMusic() {
  const audio = document.getElementById("bgMusic");
  const resumeBtn = document.getElementById("musicResume");
  if (!audio || !resumeBtn) return;

  const state = JSON.parse(localStorage.getItem(MUSIC_KEY) || "null");

  if (state && state.playing) {
    audio.currentTime = state.time || 0;
    const playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => { resumeBtn.hidden = false; });
    }
  }

  audio.addEventListener("timeupdate", () => {
    localStorage.setItem(MUSIC_KEY, JSON.stringify({ playing: !audio.paused, time: audio.currentTime }));
  });
  audio.addEventListener("pause", () => {
    localStorage.setItem(MUSIC_KEY, JSON.stringify({ playing: false, time: audio.currentTime }));
  });
  audio.addEventListener("play", () => {
    resumeBtn.hidden = true;
  });

  resumeBtn.addEventListener("click", () => {
    audio.play().catch(() => {});
  });
}

/* Appelée au clic sur "Tirer la soirée" : un geste utilisateur explicite,
   donc le navigateur autorise toujours la lecture à ce moment-là. */
function startMusic() {
  const audio = document.getElementById("bgMusic");
  const resumeBtn = document.getElementById("musicResume");
  if (!audio) return;
  if (audio.paused) {
    audio.play().catch(() => {});
  }
  if (resumeBtn) resumeBtn.hidden = true;
}

document.addEventListener("DOMContentLoaded", initMusic);
