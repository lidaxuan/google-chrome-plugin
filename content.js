(function () {
    if (window.__MouseTrailInjected) return;
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
            this.vx = (Math.random() - 0.5) * 1.5; // 降低速度
            this.vy = (Math.random() - 0.5) * 1.5;
            this.life = 25; // 缩短生命周期
            this.size = Math.random() * 4 + 1.5; // 减小粒子尺寸
            this.color = `hsl(${Math.random() * 360},100%,60%)`;
            this.shape = ['circle', 'square'][Math.floor(Math.random() * 2)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
        }
        draw(ctx) {
            ctx.globalAlpha = this.life / 25;
            ctx.fillStyle = this.color;
            if (this.shape === 'square') {
                ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    const particles = [];
    const MAX_PARTICLES = 200; // 限制最大粒子数
    let lastTime = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastTime < 30) return; // 节流，每 30ms 生成一次
        lastTime = now;

        for (let i = 0; i < 5; i++) { // 一次生成少量
            if (particles.length < MAX_PARTICLES) {
                particles.push(new Particle(e.clientX, e.clientY + 8));
            }
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
