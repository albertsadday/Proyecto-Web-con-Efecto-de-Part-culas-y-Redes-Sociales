class Particle {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.dx = (Math.random() - 0.5) * 0.2;
        this.dy = (Math.random() - 0.5) * 0.2;
        this.alpha = 0;
        this.targetAlpha = Math.random() * 0.6 + 0.1;
        this.magnetism = 0.1 + Math.random() * 4;
        this.ease = options.ease || 50;
        this.staticity = options.staticity || 50;
        this.mouse = { x: 0, y: 0 };
        this.canvasSize = { w: canvas.width, h: canvas.height };
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        this.ctx.fill();
    }

    update() {
        // Calcular distancia a los bordes
        const edge = [
            this.x - this.size,
            this.canvasSize.w - this.x - this.size,
            this.y - this.size,
            this.canvasSize.h - this.y - this.size
        ];
        const closestEdge = Math.min(...edge);
        const remappedEdge = this.remapValue(closestEdge, 0, 20, 0, 1);

        // Actualizar transparencia
        if (remappedEdge > 1) {
            this.alpha += 0.02;
            if (this.alpha > this.targetAlpha) this.alpha = this.targetAlpha;
        } else {
            this.alpha = this.targetAlpha * remappedEdge;
        }

        // Mover partícula
        this.x += this.dx;
        this.y += this.dy;

        // Aplicar magnetismo hacia el mouse
        this.x += (this.mouse.x / (this.staticity / this.magnetism) - this.x) / this.ease;
        this.y += (this.mouse.y / (this.staticity / this.magnetism) - this.y) / this.ease;

        // Revisar si la partícula salió del canvas
        if (this.x < -this.size || this.x > this.canvasSize.w + this.size || 
            this.y < -this.size || this.y > this.canvasSize.h + this.size) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * this.canvasSize.w;
        this.y = Math.random() * this.canvasSize.h;
        this.alpha = 0;
    }

    remapValue(value, start1, end1, start2, end2) {
        const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    }
}

class Particles {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        this.options = {
            quantity: options.quantity || 30,
            staticity: options.staticity || 50,
            ease: options.ease || 50,
            ...options
        };

        this.initCanvas();
        this.initParticles();
        this.initMouse();
        this.animate();
        this.initResize();
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.canvasSize = { w: this.canvas.width, h: this.canvas.height };
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.quantity; i++) {
            this.particles.push(new Particle(this.canvas, this.options));
        }
    }

    initMouse() {
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - this.canvasSize.w / 2;
            const y = e.clientY - rect.top - this.canvasSize.h / 2;
            const inside = x < this.canvasSize.w / 2 && x > -this.canvasSize.w / 2 && 
                          y < this.canvasSize.h / 2 && y > -this.canvasSize.h / 2;
            
            if (inside) {
                this.particles.forEach(p => {
                    p.mouse.x = x;
                    p.mouse.y = y;
                });
            }
        });
    }

    initResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles.forEach(p => {
                p.canvasSize = this.canvasSize;
            });
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar partículas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Particles('.particles-container', {
        quantity: 50,
        staticity: 50,
        ease: 50
    });
});
