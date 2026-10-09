// ===== SCREEN 1: HEART ANIMATION =====

const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Heart shape parameters
const heartScale = 15;
const heartOffsetX = canvas.width / 2;
const heartOffsetY = canvas.height / 2;

// Mathematical heart equation
function getHeartPoint(t) {
    const x = 15 * Math.pow(Math.sin(t), 3);
    const y = 12 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return {
        x: heartOffsetX + x * heartScale,
        y: heartOffsetY - y * heartScale
    };
}

// Generate heart points
function generateHeartPoints(resolution = 200) {
    const points = [];
    for (let i = 0; i < resolution; i++) {
        const t = (i / resolution) * Math.PI * 2;
        points.push(getHeartPoint(t));
    }
    return points;
}

const heartPoints = generateHeartPoints(300);
let currentPointIndex = 0;
const animationSpeed = 2; // points per frame

function drawHeartAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw lines from center to each point
    const centerX = heartOffsetX;
    const centerY = heartOffsetY;
    
    for (let i = 0; i < currentPointIndex; i++) {
        const point = heartPoints[i];
        
        // Create gradient for glow effect
        const gradient = ctx.createLinearGradient(centerX, centerY, point.x, point.y);
        gradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.3)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
        ctx.shadowBlur = 10;
    }
    
    // Add center point glow
    ctx.fillStyle = '#ff6666';
    ctx.shadowColor = 'rgba(255, 0, 0, 1)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Animate point drawing
    if (currentPointIndex < heartPoints.length) {
        currentPointIndex += animationSpeed;
    }
    
    if (currentPointIndex < heartPoints.length) {
        requestAnimationFrame(drawHeartAnimation);
    }
}

drawHeartAnimation();

// ===== SCREEN NAVIGATION =====

const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');

const screen1Btn = document.getElementById('screen1-btn');
const screen2Btn = document.getElementById('screen2-btn');

// Screen 1 to Screen 2 transition with ash particles
screen1Btn.addEventListener('click', () => {
    createAshTransition();
    setTimeout(() => {
        screen1.classList.remove('active');
        screen2.classList.add('active');
        showFinalContinueButton();
    }, 2000); // Wait for ash animation to complete
});

function createAshTransition() {
    const ashContainer = document.getElementById('ashParticles');
    ashContainer.innerHTML = ''; // Clear previous particles
    
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
        const ash = document.createElement('div');
        ash.className = 'ash';
        
        // Random starting position
        ash.style.left = Math.random() * 100 + '%';
        ash.style.top = Math.random() * 100 + '%';
        
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 200;
        ash.style.setProperty('--tx', drift + 'px');
        
        // Random animation delay
        ash.style.animationDelay = Math.random() * 1 + 's';
        
        ashContainer.appendChild(ash);
    }
}

// ===== SCREEN 2: ENVELOPE LOGIC =====

const envelope1 = document.getElementById('envelope1');
const envelope2 = document.getElementById('envelope2');
const envelopePopup = document.getElementById('envelopePopup');
const popupTitle = document.getElementById('popupTitle');
const popupBtn = document.getElementById('popupBtn');
const letterView = document.getElementById('letterView');
const reasonsView = document.getElementById('reasonsView');
const backBtns = document.querySelectorAll('.back-btn');

let currentOpenedEnvelope = null;

// Envelope click handlers
envelope1.addEventListener('click', () => openEnvelope(1));
envelope2.addEventListener('click', () => openEnvelope(2));

function openEnvelope(envelopeNum) {
    const envelope = envelopeNum === 1 ? envelope1 : envelope2;
    
    // Bounce animation
    envelope.style.animation = 'none';
    setTimeout(() => {
        envelope.style.animation = 'bounce 0.5s ease';
    }, 10);
    
    // Add bounce animation
    const style = document.createElement('style');
    if (!document.querySelector('style[data-bounce]')) {
        style.setAttribute('data-bounce', 'true');
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show popup
    currentOpenedEnvelope = envelopeNum;
    setTimeout(() => {
        envelope.classList.add('open');
        showEnvelopePopup(envelopeNum);
    }, 250);
}

function showEnvelopePopup(envelopeNum) {
    envelopePopup.classList.remove('hidden');
    
    if (envelopeNum === 1) {
        popupTitle.textContent = 'hi, thea';
        popupBtn.textContent = 'HI';
        popupBtn.onclick = () => {
            envelopePopup.classList.add('hidden');
            letterView.classList.add('active');
        };
    } else {
        popupTitle.textContent = '100 REASONS WHY I LOVE YOU';
        popupBtn.textContent = 'CONTINUE';
        popupBtn.onclick = () => {
            envelopePopup.classList.add('hidden');
            reasonsView.classList.add('active');
        };
    }
}

// Back buttons
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        letterView.classList.remove('active');
        reasonsView.classList.remove('active');
    });
});

function showFinalContinueButton() {
    const finalBtn = document.getElementById('screen2-btn');
    finalBtn.classList.remove('hidden');
}

// Screen 2 to Screen 3 transition
screen2Btn.addEventListener('click', () => {
    screen2.classList.remove('active');
    screen3.classList.add('active');
    startScreen3Animation();
});

// ===== SCREEN 3: FINAL ANIMATION =====

function startScreen3Animation() {
    const glowingContainer = document.getElementById('glowingContainer');
    glowingContainer.innerHTML = '';
    
    const messageCount = 120; // 100+ glowing texts
    
    for (let i = 0; i < messageCount; i++) {
        setTimeout(() => {
            const glowText = document.createElement('div');
            glowText.className = 'glowing-text';
            glowText.textContent = 'I LOVE YOU';
            
            // Random position across entire screen
            const x = Math.random() * (window.innerWidth - 200);
            const y = Math.random() * (window.innerHeight - 100);
            
            glowText.style.left = x + 'px';
            glowText.style.top = y + 'px';
            glowText.style.animationDelay = '0s';
            
            glowingContainer.appendChild(glowText);
        }, i * 50); // Stagger appearance for cinematic effect
    }
}

// Make envelopes swipeable on mobile
let touchStartX = 0;
let touchEndX = 0;

const envelopesContainer = document.querySelector('.envelopes-container');

envelopesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

envelopesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left - scroll right in container
        envelopesContainer.scrollLeft += 200;
    }
    if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right - scroll left in container
        envelopesContainer.scrollLeft -= 200;
    }
}

console.log('✨ Monthsary website loaded! All screens ready.');
