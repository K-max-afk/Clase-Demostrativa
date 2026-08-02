// CONTROL DE ESTADO GLOBAL
let currentScreen = 1;
const totalScreens = 14;
let soundEnabled = true;
let revealedDots = new Set();

document.addEventListener("DOMContentLoaded", () => {
    const savedScreen = localStorage.getItem("lastScreen");
    const savedSound = localStorage.getItem("soundEnabled");

    if (savedSound !== null) {
        soundEnabled = JSON.parse(savedSound);
        updateSoundButton();
    }

    if (savedScreen) {
        goToScreen(parseInt(savedScreen));
    } else {
        goToScreen(1);
    }
});

function updateSoundButton() {
    const btn = document.getElementById("sound-toggle");
    if (btn) btn.textContent = soundEnabled ? "🔊 Sonido: ON" : "🔇 Sonido: OFF";
}

document.getElementById("sound-toggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    updateSoundButton();
});

// NAVEGACIÓN
function goToScreen(index) {
    if (index < 1 || index > totalScreens) return;

    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    
    const target = document.getElementById(`screen-${index}`);
    if (target) target.classList.add("active");

    currentScreen = index;
    localStorage.setItem("lastScreen", currentScreen);

    const footer = document.getElementById("nav-footer");
    if (currentScreen === 1) {
        footer.classList.add("hidden");
    } else {
        footer.classList.remove("hidden");
        document.getElementById("screen-indicator").textContent = `Pantalla ${currentScreen} / ${totalScreens}`;
        document.getElementById("btn-prev").disabled = (currentScreen === 2 && revealedDots.size < 3);
        document.getElementById("btn-next").disabled = (currentScreen === 2 && revealedDots.size < 3) || currentScreen === totalScreens;
    }
}

function nextScreen() { goToScreen(currentScreen + 1); }
function prevScreen() { goToScreen(currentScreen - 1); }

// INTERACCIONES
function revealDot(dotElement, id) {
    dotElement.classList.add("revealed");
    revealedDots.add(id);

    if (revealedDots.size === 3) {
        document.getElementById("btn-next").disabled = false;
        document.getElementById("btn-prev").disabled = false;
    }
}

function toggleClapper() {
    const info = document.getElementById("clapper-info");
    if (info) info.classList.toggle("hidden");
}

function highlightText(type) {
    const el = document.querySelector(`.hl-${type}`);
    if (el) {
        el.classList.toggle("highlight-active");
    }
}

let reelIndex = 0;
function rotateReel() {
    const items = document.querySelectorAll(".reel-item");
    if (items.length === 0) return;
    items[reelIndex].classList.remove("active-reel");
    reelIndex = (reelIndex + 1) % items.length;
    items[reelIndex].classList.add("active-reel");
}

let puzzleCount = 0;
function solvePuzzle(piece) {
    piece.style.borderColor = "#e5a93c";
    piece.style.background = "#b31217";
    puzzleCount++;
    if (puzzleCount >= 2) {
        const btn = document.getElementById("btn-restart");
        if (btn) btn.classList.remove("hidden");
    }
}
