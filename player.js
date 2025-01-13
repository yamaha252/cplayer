export class CircularPlayer {
  #audio;
  #wrapper;
  #progress;
  #action;

  constructor(el) {
    this.#audio = el;
    this.#audio.removeAttribute('controls');

    this.#wrap();
    this.#insertProgress();
    this.#insertAction();
  }

  #wrap() {
    this.#wrapper = document.createElement('div');
    this.#wrapper.classList.add('cplayer');
    this.#audio.parentNode.insertBefore(this.#wrapper, this.#audio);
    this.#wrapper.appendChild(this.#audio);
    this.#audio.addEventListener('play', () => {
      this.#wrapper.classList.add('cplayer--playing');
    });
    this.#audio.addEventListener('pause', () => {
      this.#wrapper.classList.remove('cplayer--playing');
    });
    this.#audio.addEventListener('ended', () => {
      this.#wrapper.classList.remove('cplayer--playing');
    });
  }

  #insertProgress() {
    this.#progress = document.createElement('div');
    this.#progress.classList.add('cplayer__progress');
    this.#progress.style.setProperty('--percent', '0%');
    this.#wrapper.appendChild(this.#progress);
    this.#audio.addEventListener('timeupdate', () => {
      const duration = this.#audio.duration;
      const currentTime = this.#audio.currentTime;
      const progress = Math.ceil((currentTime / duration) * 100);
      this.#progress.style.setProperty('--percent', progress + '%');
    });
  }

  #insertAction() {
    this.#action = document.createElement('button');
    this.#action.classList.add('cplayer__action');
    this.#wrapper.appendChild(this.#action);
    this.#action.addEventListener('click', () => this.toggle());
  }

  toggle() {
    if (this.#audio.paused) {
      this.#audio.play();
    } else {
      this.#audio.pause();
    }
  }
}
