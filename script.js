class AudioClass {
  constructor() {
    this.bgMusic = new Audio("Assets/Audio/creepy.mp3");
    this.flipSound = new Audio("Assets/Audio/flip.wav");
    this.matchSound = new Audio("Assets/Audio/match.wav");
    this.victorySound = new Audio("Assets/Audio/victory.wav");
    this.gameOverSound = new Audio("Assets/Audio/gameOver.wav");
    this.bgMusic.volume = 0.2;
    this.flipSound.volume = 0.5;
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
    this.score = 0;
    this.highScore = 0;
    
    this.timer = document.getElementById("time-left");
    this.flipsCount = document.getElementById("flips");
    this.addScore = document.getElementById("score");
    this.addHighScore = document.getElementById("highScore")
    this.audioMusic = new AudioClass();
  }

  startGame() {
    this.cardsToCheck = null;
    this.totalClicks = 0;
    this.score = 0;
    this.addScore.innerText = this.score;
    this.addHighScore.innerText = this.highScore;
    this.timeRemaining = this.totalTime;
    this.matchedCardsArray = [];
    this.busy = true;
    this.audioMusic.startMusic();

     setTimeout(() =>{
        this.shuffleCards(this.cardsArray);
        this.countDown = this.startCountDown();
        this.busy = false; 
     },500);
     this.hideCards();
     this.timer.innerText = this.timeRemaining;
     this.flipsCount.innerText = this.totalClicks;
  } 

  hideCards(){
    this.cardsArray.forEach(card => {
        card.classList.remove("visible");
        card.classList.remove("matched");
        card.classList.remove("disable");
    });
  }

  flipCard(card){
        if(this.flipCardRules(card))
        {
            this.audioMusic.flip();
            this.totalClicks++;
            this.flipsCount.innerText = this.totalClicks;
            card.classList.add("visible");
            if (!card.classList.contains("disable")) {
                card.addEventListener("click", () => {
                card.classList.add('disable');
            });
        }
        if(this.cardsToCheck){
            this.checkForCardMatch(card);
        }
        else{
            this.cardsToCheck = card;
        }
    }
  }

  checkForCardMatch(card){
    if(this.getCardType(card) === this.getCardType(this.cardsToCheck)){
        this.cardMatch(card, this.cardsToCheck);
    }
    else{
        this.cardMisMatch(card, this.cardsToCheck);
    }
    this.cardsToCheck = null;
  }

  cardMatch(card1, card2){
    this.matchedCardsArray.push(card1);
    this.matchedCardsArray.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.classList.add("disable");
    card2.classList.add("disable");

    this.audioMusic.match();
    if(card1.classList.contains("matched.disable") === card2.classList.contains("matched.disable")){
      this.score = this.score + 10;
      this.addScore.innerText = this.score;
      if(this.score > this.highScore){
        this.highScore = this.score;
        this.addHighScore.innerText = this.highScore;
      }
   }
    if(this.matchedCardsArray.length === this.cardsArray.length){
        this.victory();
    }
 }

  cardMisMatch(card1, card2){
    this.busy = true;

    setTimeout(() => {
        card1.classList.remove('visible');
        card1.classList.remove('disable');
        
        card2.classList.remove('visible');
        card2.classList.remove('disable');
        this.busy = false;
    }, 1000);
 }

  getCardType(card){
    const hiddenImage = card.querySelector(".user-hidden-image");
    return(hiddenImage.getAttribute("data-value"));
  }

  flipCardRules(card){
    return (
      !this.busy &&
      !this.matchedCardsArray.includes(card) &&
      card != this.cardsToCheck
    );
  }

  shuffleCards(){
    for(let i = this.cardsArray.length-1; i > 0; i--){
        let shufflingIndex = Math.floor(Math.random() * (i +1));
        this.cardsArray[shufflingIndex].style.order = i;
        this.cardsArray[i].style.order = shufflingIndex;
    }
  }

  startCountDown(){
    return setInterval(() =>{
        this.timeRemaining--;
        this.timer.innerText = this.timeRemaining;
        if(this.timeRemaining === 0){
            this.gameOver();
        }
    },1000)  // => 1000 milisec = 1 sec;
  }

  gameOver(){
    clearInterval(this.countDown);
    document.getElementById("game-over").classList.add("visible");
    this.audioMusic.gameOver();
  }

  victory(){
    clearInterval(this.countDown);
    this.audioMusic.victory();
    document.getElementById("victory-screen").classList.add("visible");
    this.hideCards();
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
    let game = new MixMatch(80, cards);
  
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
