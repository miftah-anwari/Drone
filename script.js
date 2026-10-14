
const scene = document.getElementById("droneScene");
const drone = document.getElementById("droneObject");

if (scene && drone) {
    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let targetRotateX = 0;
    let targetRotateY = 0;

    let currentRotateX = 0;
    let currentRotateY = 0;

    // Deteksi gerakan mouse
    scene.addEventListener("pointermove", (event) => {
        const rect = scene.getBoundingClientRect();

        const mouseX =
            (event.clientX - rect.left) / rect.width;

        const mouseY =
            (event.clientY - rect.top) / rect.height;

        // Posisi drone
        targetX = (mouseX - 0.5) * 35;
        targetY = (mouseY - 0.5) * 25;

        // Rotasi drone
        targetRotateY = (mouseX - 0.5) * 14;
        targetRotateX = (0.5 - mouseY) * 10;
    });

    // Kembalikan drone ke posisi normal
    scene.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
        targetRotateX = 0;
        targetRotateY = 0;
    });

    // Animasi smooth
    function animateDrone() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        currentRotateX +=
            (targetRotateX - currentRotateX) * 0.06;

        currentRotateY +=
            (targetRotateY - currentRotateY) * 0.06;

        drone.style.transform = `
            translate3d(
                ${currentX}px,
                ${currentY}px,
                0
            )
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY}deg)
        `;

        requestAnimationFrame(animateDrone);
    }

    animateDrone();
}


const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});


const canvas = document.getElementById("fireCanvas");
const ctx = canvas.getContext("2d", { alpha: true });

let width = window.innerWidth;
let height = window.innerHeight;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

const mouse = { x: -100, y: -100 };
const smoothMouse = { x: -100, y: -100 };
let cursorActive = false;

let particles = [];
let lastParticleX = -100;
let lastParticleY = -100;
let lastTime = 0;

// Pengaturan efek
const FOLLOW_SPEED = 0.22;
const PARTICLE_SPACING = 5;
const MAX_PARTICLES = 400;

function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Ambil posisi cursor
document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    cursorActive = true;
});

document.addEventListener("mouseleave", () => {
    cursorActive = false;
    particles = [];
});

// Membuat partikel api dan bara
function createParticle(x, y, type = "fire") {
    const isSpark = type === "spark";

    particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,

        vx: (Math.random() - 0.5) * (isSpark ? 4 : 1.5),
        vy: isSpark
            ? -Math.random() * 4 - 1
            : -Math.random() * 2.5 - 0.5,

        size: isSpark
            ? Math.random() * 2 + 1
            : Math.random() * 10 + 6,

        life: 1,

        decay: isSpark
            ? Math.random() * 0.8 + 1.0
            : Math.random()  * 0.5 + 0.8,

        type,
        hue: Math.random() * 30 + 15,
        flicker: Math.random() * Math.PI * 2
    });
}

// Menggambar satu partikel
function drawParticle(p) {
    const alpha = Math.max(0, p.life);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (p.type === "spark") {
        // Bara kecil yang menyala
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "#0799fa";
        ctx.shadowColor = "#chatff4500";
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Api dengan pusat terang dan tepi merah
        const flicker =
            0.8 + Math.sin(p.flicker) * 0.2;

        const radius = Math.max(0.1, p.size * flicker);

        const gradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, radius
        );

       
    gradient.addColorStop(0, "rgba(220,255,255,0.95)");
    gradient.addColorStop(0.2, "rgba(0,200,255,0.85)");
    gradient.addColorStop(0.5, "rgba(0,80,255,0.65)");
    gradient.addColorStop(1, "rgba(0,20,255,0)");


        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Menggambar cahaya bola api utama
function drawFireball(x, y, time) {
    const pulse = 1 + Math.sin(time * 0.012) * 0.08;
    const radius = 34 * pulse;

    const glow = ctx.createRadialGradient(
        x, y, 0,
        x, y, radius
    );

    glow.addColorStop(
        0, "rgba(1, 196, 255, 0.95)"
    );
    glow.addColorStop(
        0.2, "rgba(80,230,255,0.85)"
    );
    glow.addColorStop(
         0.5, "rgba(0,100,255,0.65)"
    );
    glow.addColorStop(
         1, "rgba(0,20,255,0)"
    );

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = glow;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


function animate(time = 0) {
  
    const delta = lastTime
        ? Math.min((time - lastTime) / 16.67, 2)
        : 1;

    lastTime = time;

 
    ctx.clearRect(0, 0, width, height);

    if (cursorActive && mouse.x >= 0) {
      
        const follow = 1 - Math.pow(
            1 - FOLLOW_SPEED,
            delta
        );

        smoothMouse.x +=
            (mouse.x - smoothMouse.x) * follow;

        smoothMouse.y +=
            (mouse.y - smoothMouse.y) * follow;

        const dx = smoothMouse.x - lastParticleX;
        const dy = smoothMouse.y - lastParticleY;
        const distance = Math.hypot(dx, dy);

      
        if (distance >= PARTICLE_SPACING) {
            const count = Math.min(
                12,
                Math.floor(distance / PARTICLE_SPACING)
            );

            for (let i = 1; i <= count; i++) {
                const t = i / count;

                const x = lastParticleX + dx * t;
                const y = lastParticleY + dy * t;

                createParticle(
                    x,
                    y,
                    Math.random() < 0.10
                        ? "spark"
                        : "fire"
                );
            }

            lastParticleX = smoothMouse.x;
            lastParticleY = smoothMouse.y;
        }

       
        if (Math.random() < 0.08 * delta) {
            createParticle(
                smoothMouse.x,
                smoothMouse.y,
                "fire"
            );
        }

     
        if (Math.random() < 0.25 * delta) {
            createParticle(
                smoothMouse.x,
                smoothMouse.y,
                "spark"
            );
        }

        drawFireball(
            smoothMouse.x,
            smoothMouse.y,
            time
        );
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx * delta;
        p.y += p.vy * delta;

        p.vx *= Math.pow(0.985, delta);
        p.vy += (
            p.type === "spark" ? 0.045 : -0.012
        ) * delta;

        p.size *= Math.pow(
            p.type === "spark" ? 0.99 : 0.98,
            delta
        );

        p.life -= p.decay * delta / 60;
        p.flicker += 0.2 * delta;

        drawParticle(p);

        if (p.life <= 0 || p.size < 0.5) {
            particles.splice(i, 1);
        }
    }

    // Batas partikel untuk menjaga performa
    if (particles.length > MAX_PARTICLES) {
        particles.splice(
            0,
            particles.length - MAX_PARTICLES
        );
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
