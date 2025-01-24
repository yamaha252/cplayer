export class CircularPlayer {
  audio;

  #wrapper;
  #destroyCallbacks = [];

  constructor(el) {
    this.audio = el;
    this.audio.removeAttribute('controls');

    this.#wrap();
    this.#insertProgress();
    this.#insertActions();
  }

  destroy() {
    for (const c of this.#destroyCallbacks) {
      c();
    }
    this.#destroyCallbacks = [];
  }

  #onDestroy(fn) {
    this.#destroyCallbacks.push(fn);
  }

  #wrap() {
    this.#wrapper = document.createElement('div');
    this.#wrapper.classList.add('cplayer');
    this.audio.parentNode.insertBefore(this.#wrapper, this.audio);
    this.#wrapper.appendChild(this.audio);

    const playHandler = () => {
      this.#wrapper.classList.add('cplayer--playing');
    };
    this.audio.addEventListener('play', playHandler);
    this.#onDestroy(() => this.audio.removeEventListener('play', playHandler));

    const pauseHandler = () => {
      this.#wrapper.classList.remove('cplayer--playing');
    };
    this.audio.addEventListener('pause', pauseHandler);
    this.#onDestroy(() => this.audio.removeEventListener('pause', pauseHandler));

    const endedHandler = () => {
      this.#wrapper.classList.remove('cplayer--playing');
    };
    this.audio.addEventListener('ended', endedHandler);
    this.#onDestroy(() => this.audio.removeEventListener('ended', endedHandler));
  }

  #insertProgress() {
    const progress = document.createElement('div');
    progress.classList.add('cplayer__progress');

    const progressHandler = () => {
      const duration = this.audio.duration;
      const currentTime = this.audio.currentTime;
      const percent = (currentTime / duration) * 100;
      progress.style.setProperty('--percent', percent.toFixed(2) + '%');
    };
    this.audio.addEventListener('timeupdate', progressHandler);
    this.#onDestroy(() => this.audio.removeEventListener('timeupdate', progressHandler));

    this.#wrapper.appendChild(progress);
  }

  #insertActions() {
    const playAction = document.createElement('button');
    playAction.classList.add('cplayer__action', 'cplayer__action--play');
    playAction.addEventListener('click', () => this.audio.play());
    playAction.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z"/>
        </svg>`;
    this.#wrapper.appendChild(playAction);

    const pauseAction = document.createElement('button');
    pauseAction.classList.add('cplayer__action', 'cplayer__action--pause');
    pauseAction.addEventListener('click', () => this.audio.pause());
    pauseAction.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M640-200q-33 0-56.5-23.5T560-280v-400q0-33 23.5-56.5T640-760q33 0 56.5 23.5T720-680v400q0 33-23.5 56.5T640-200Zm-320 0q-33 0-56.5-23.5T240-280v-400q0-33 23.5-56.5T320-760q33 0 56.5 23.5T400-680v400q0 33-23.5 56.5T320-200Z"/>
        </svg>`;
    this.#wrapper.appendChild(pauseAction);
  }
}
