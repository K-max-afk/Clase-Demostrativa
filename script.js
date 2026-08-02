// CONTROL DE ESTADO GLOBAL Y LOCALSTORAGE
let currentScreen = 1;
const totalScreens = 14;
let soundEnabled = true;
let revealedDots = new Set();

document.addEventListener("DOMContentLoaded", () => {
    // Cargar última pantalla y volumen guardados
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
    btn.textContent = soundEnabled ? "🔊 Sonido: ON" : "🔇 Sonido: OFF";
}

document.getElementById("sound-toggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    updateSoundButton();
});

// NAVEGACIÓN ENTRE PANTALLAS
function goToScreen(index) {
    if (index < 1 || index > totalScreens) return;
    
    // Ocultar pantallas
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    
    // Mostrar pantalla actual
    const target = document.getElementById(`screen-${index}`);
    if (target) target.classList.add("active");

    currentScreen = index;
    localStorage.setItem("lastScreen", currentScreen);

    // Ajustes de Footer
    const footer = document.getElementById("nav-footer");
    if (currentScreen === 1) {
        footer.classList.add("hidden");
    } else {
        footer.classList.remove("hidden");
        document.getElementById("screen-indicator").textContent = `Pantalla ${currentScreen} / ${totalScreens}`;
        document.getElementById("btn-prev").disabled = currentScreen === 2 && revealedDots.size < 3; // Bloqueo P2
        document.getElementById("btn-next").disabled = (currentScreen === 2 && revealedDots.size < 3) || currentScreen === totalScreens;
    }
}

function nextScreen() { goToScreen(currentScreen + 1); }
function prevScreen() { goToScreen(currentScreen - 1); }

// INTERACCIONES ESPECÍFICAS DE PANTALLAS

// Pantalla 2: Descubrir puntos
function revealDot(dotElement, id) {
    const img = dotElement.querySelector("img");
    const num = dotElement.querySelector(".dot-num");
    
    if (img && num) {
        num.style.display = "none";
        img.classList.remove("img-hidden");
        revealedDots.add(id);

        if (revealedDots.size === 3) {
            document.getElementById("btn-next").disabled = false;
        }
    }
}

// Pantalla 6: Claqueta
function toggleClapper() {
    const info = document.getElementById("clapper-info");
    info.classList.toggle("hidden");
}

// Pantalla 10: Resaltado
function highlightText(type) {
    const el = document.querySelector(`.hl-${type}`);
    if (el) {
        el.classList.toggle("highlight-t");
    }
}

// Pantalla 12: Carrete
let reelIndex = 0;
function rotateReel() {
    const items = document.querySelectorAll(".reel-item");
    items[reelIndex].classList.remove("active-reel");
    reelIndex = (reelIndex + 1) % items.length;
    items[reelIndex].classList.add("active-reel");
}

// Pantalla 14: Rompecabezas
let puzzleCount = 0;
function solvePuzzle(piece) {
    piece.style.borderColor = "#e5a93c";
    piece.style.background = "#b31217";
    puzzleCount++;
    if (puzzleCount >= 2) {
        document.getElementById("btn-restart").classList.remove("hidden");
    }
}
