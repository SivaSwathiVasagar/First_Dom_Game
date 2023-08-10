class AudioClass {
  constructor() {
    this.bgMusic = new Audio("Assets/Audio/creepy.mp3");
    this.flipSound = new Audio("Assets/Audio/flip.wav");
    this.matchSound = new Audio("Assets/Audio/match.wav");
    this.victorySound = new Audio("Assets/Audio/victory.wav");
    this.gameOverSound = new Audio("Assets/Audio/gameOver.wav");
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}





class MixMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime
    this.timeRemaining = totalTime;
    this.timer = document.getElementById("time-left");
    this.ticker = document.getElementById("flips");
    this.audioMusic = new AudioClass();
  }

  startGame() {
    this.cardsToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCardsArray = [];
    this.busy = true;
  }
  flipCard(card) {
        if(this.flipCardRules(card))
        {
            this.audioMusic.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
        }
  }

  flipCardRules() {
    return true;
    // (
    //   !this.busy &&
    //   !this.matchedCardsArray.includes(card) &&
    //   card != this.cardToCheck
    // );
  }
}

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

function ready() {
    let overlayScreen = Array.from(document.getElementsByClassName("overlay-text"));
    let cards = Array.from(document.getElementsByClassName("card"));
    let game = new MixMatch(100, cards);
  
    overlayScreen.forEach((overlay) => {
      overlay.addEventListener("click", () => {
        overlay.classList.remove("visible");
        game.startGame();
      });
    });
  
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        game.flipCard(card);
      });
    });
  }