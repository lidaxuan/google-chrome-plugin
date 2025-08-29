(function () {
    console.log(111111);

    if (window.__MouseTrailInjected) return;
    console.log(222222);

    window.__MouseTrailInjected = true;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.life = 40;
            this.size = Math.random() * 6 + 2;
            this.color = `hsl(${Math.random() * 360},100%,60%)`;
            this.shape = ['circle', 'square', 'star'][Math.floor(Math.random() * 3)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
        }
        draw(ctx) {
            ctx.globalAlpha = this.life / 60;

            // 三种形状随机选择
            const shape = this.shape || ['square', 'star', 'line'][Math.floor(Math.random() * 3)];

            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;

            switch (shape) {
                case 'square': // 方块
                    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                    break;
                case 'star': // 五角星
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        ctx.lineTo(this.x + this.size * Math.cos((18 + i * 72) * Math.PI / 180),
                            this.y - this.size * Math.sin((18 + i * 72) * Math.PI / 180));
                    }
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'line': // 光束
                    ctx.beginPath();
                    ctx.moveTo(this.x - this.vx * 5, this.y - this.vy * 5);
                    ctx.lineTo(this.x, this.y);
                    ctx.stroke();
                    break;
            }

            ctx.globalAlpha = 1;
        }

    }

    const particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const offsetY = 10; // 像素，向下偏移
    window.addEventListener('mousemove', e => {
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(e.clientX, e.clientY+offsetY));
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.life <= 0) {
                particles.splice(i, 1);
            } else {
                p.draw(ctx);
            }
        }
    }
    animate();
})();
