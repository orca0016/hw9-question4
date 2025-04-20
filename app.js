let minutesTimer = 0;
let isAllowToClickStart = true;
let isPlayed = false;
let isPaused = false;
let getCurrentTime = 0;
let countdownInterval;
let startCountDown = false;
const startBtn = document.getElementById("start-timer");
document.getElementById("select-time").addEventListener("input", (e) => {
  if (e.target.value === "") {
    startBtn.setAttribute("disabled", "true");
  } else {
    startBtn.removeAttribute("disabled");
  }
  if (!startCountDown) {
    if (e.target.value === "custom") {
      if (!document.getElementById("custom-min").value)
        startBtn.setAttribute("disabled", "true");

      document.getElementById("custom-minutes").classList.remove("hidden");
      document.getElementById("custom-minutes").classList.add("block");
    } else {
      document.getElementById("custom-minutes").classList.remove("block");
      document.getElementById("custom-minutes").classList.add("hidden");
      minutesTimer= Number(e.target.value)
      setShowTime();
    }
  }
});
startBtn.setAttribute("isPaused", "true");
startBtn.addEventListener("click", (e) => {
  if (!isPaused) {
    if (e.target.getAttribute("isPaused") === "false") {
      minutesTimer = getCurrentTime;
    }

    startTimer();
    e.target.innerHTML = "stop";
    e.target.setAttribute("isPaused", "true");
    e.target.classList.add("bg-red-500");
    isPaused = true;
  } else {
    clearInterval(countdownInterval);
    isPaused = false;
    e.target.innerHTML = "start";
    e.target.classList.remove("bg-red-500");
    e.target.setAttribute("isPaused", "false");

    const timeLeft = getCurrentTime * 60000;
    document.getElementById("countdown").innerHTML = patternTime(timeLeft);
  }
});
document.getElementById("cancel-timer").addEventListener("click", () => {
  clearInterval(countdownInterval);
  document.getElementById("select-time").value = "";
  document.getElementById("countdown").innerHTML = "00:00:00";
  isAllowToClickStart = true;
  startCountDown = false;
  resetButtonPlay();
});

document.getElementById("form-custom-min").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!startCountDown) {
    startBtn.removeAttribute("disabled");
    
    minutesTimer = Number(e.target.customMin.value);
    setShowTime();
  }
});

document.getElementById("control-audio").addEventListener("click", (e) => {
  const icon = document.getElementById("icon-volume");
  if (icon.classList.contains("fa-volume-off")) {
    icon.classList.add("fa-volume-up");
    icon.classList.remove("fa-volume-off");
    e.currentTarget.classList.add("bg-red-500");
    e.currentTarget.classList.add("w-[82px]");

    isPlayed = true;
  } else if (icon.classList.contains("fa-volume-up")) {
    icon.classList.add("fa-volume-off");
    icon.classList.remove("fa-volume-up");
    e.currentTarget.classList.remove("bg-red-500");
    e.currentTarget.classList.remove("w-[82px]");
    isPlayed = false;
    playAudio("stop");
  }
});

const startTimer = () => {
  if (minutesTimer <= 0) return;
  const targetDate = new Date(new Date().getTime() + minutesTimer * 60000);
  startCountDown = true;
  if (isAllowToClickStart) {
    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = targetDate - now;
      getCurrentTime = timeLeft / 60000;
      document.getElementById("countdown").innerHTML = patternTime(timeLeft);

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        document.getElementById("select-time").value = "";
        document.getElementById("countdown").innerHTML = "00:00:00";
        startBtn.setAttribute("disabled", "true");
        isAllowToClickStart = true;
        startCountDown = false;
        resetButtonPlay();
        if (isPlayed) playAudio("play");
      }
    }, 1000);
  }
};
const setShowTime = () => {
  const targetDate = new Date(new Date().getTime() + minutesTimer * 60000);
  const now = new Date().getTime();
  const timeLeft = targetDate - now;
  document.getElementById("countdown").innerHTML = patternTime(timeLeft);
};
const resetButtonPlay = () => {
  startBtn.classList.remove("bg-red-500");
  startBtn.innerHTML = "start";
};
const playAudio = (operation) => {
  if (operation === "play") {
    document.getElementById("myAudio").play();
  } else if (operation === "stop") {
    document.getElementById("myAudio").pause();
  }
};

const patternTime = (timeLeft) => {
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};
