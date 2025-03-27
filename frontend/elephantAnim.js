let elephant = document.getElementById('elephant');
let posX = 0, posY = 0; 
let targetX = posX, targetY = posY;

document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function animate() {
    let deltaX = targetX - posX;
    let deltaY = targetY - posY;

    posX += deltaX * 0.01;
    posY += deltaY * 0.01;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); 

    let offsetX = elephant.offsetWidth;
    let offsetY = elephant.offsetHeight / 2;

    elephant.style.transform = `translate(${posX - offsetX}px, ${posY - offsetY}px) rotate(${angle}deg)`;
    requestAnimationFrame(animate);
}

animate();
