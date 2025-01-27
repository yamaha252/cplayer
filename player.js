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
    playAction.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M86 47.268C87.3333 48.0378 87.3333 49.9623 86 50.7321L32 81.909C30.6667 82.6788 29 81.7165 29 80.1769L29 17.8231C29 16.2835 30.6667 15.3212 32 16.091L86 47.268Z"/>
        </svg>`;
    this.#wrapper.appendChild(playAction);

    const pauseAction = document.createElement('button');
    pauseAction.classList.add('cplayer__action', 'cplayer__action--pause');
    pauseAction.addEventListener('click', () => this.audio.pause());
    pauseAction.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M42 23C42 21.8954 41.1046 21 40 21L24 21C22.8954 21 22 21.8954 22 23L22 77C22 78.1046 22.8954 79 24 79H40C41.1046 79 42 78.1046 42 77L42 23ZM78 23C78 21.8954 77.1046 21 76 21L60 21C58.8954 21 58 21.8954 58 23L58 77C58 78.1046 58.8954 79 60 79H76C77.1046 79 78 78.1046 78 77V23Z"/>
        </svg>`;
    this.#wrapper.appendChild(pauseAction);
  }
}
