
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