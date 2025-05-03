import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private particles: any[] = [];
  private width!: number;
  private height!: number;
  private animationId: number | null = null;
  private loadSubscription: Subscription;
  private userSubscription: Subscription;
  isLoading = false;

  constructor(private auth: AuthService, private api: ApiService, private loader: LoaderService) {}

  ngOnInit() {
    this.loadSubscription = this.loader._isLoading.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d')!;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        const theme = user.theme || 'deepnight';
        const overlay = user.overlay || 'particles';

        this.applyTheme(theme);
        this.startOverlay(overlay);
      }
    });

    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  startOverlay(overlay: string) {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  
    if (overlay === 'particles') {
      this.createParticles();
    } else if (overlay === 'starfield') {
      this.createStarfield();
    } else if (overlay === 'rain') {
      this.createRain();
    } else if (overlay === 'bubbles') {
      this.createBubbles();
    }
  }

  applyTheme(theme: string) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }
  
  resizeCanvas() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1 + 0.5
    }));

    const animate = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (const p of this.particles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        p.y += p.speed;

        if (p.y > this.height) {
          p.y = 0;
          p.x = Math.random() * this.width;
        }
      }

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  // 🫧 Colorful soap bubbles
  createBubbles() {
    this.particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 20 + 20, 
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      scaleDirection: Math.random() < 0.5 ? 1 : -1,
      scale: 1
    }));
  
    const animate = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
  
      for (const p of this.particles) {
        p.x += p.dx;
        p.y += p.dy;
  
        p.scale += 0.0015 * p.scaleDirection;
        if (p.scale > 1.05 || p.scale < 0.95) {
          p.scaleDirection *= -1;
        }
  
        if (p.x < -p.radius) p.x = this.width + p.radius;
        if (p.x > this.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = this.height + p.radius;
        if (p.y > this.height + p.radius) p.y = -p.radius;
  
        const r = p.radius * p.scale;
  
        // Draw bubble
        this.ctx.save();
        const gradient = this.ctx.createRadialGradient(p.x, p.y, r * 0.2, p.x, p.y, r);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
        gradient.addColorStop(0.5, 'rgba(255, 192, 203, 0.2)'); // soft pink
        gradient.addColorStop(0.7, 'rgba(173, 216, 230, 0.3)'); // soft blue
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
  
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
  
        // Draw white sparkle
        this.ctx.beginPath();
        this.ctx.arc(p.x - r * 0.3, p.y - r * 0.3, r * 0.1, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fill();
        this.ctx.closePath();
  
        this.ctx.restore();
      }
  
      this.animationId = requestAnimationFrame(animate);
    };
  
    animate();
  }
  
  

  // 🌧️ Rain
  createRain() {
    this.particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 4 + 2
    }));

    const animate = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.93)';
      this.ctx.lineWidth = 1;

      for (const p of this.particles) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x, p.y + p.length);
        this.ctx.stroke();
        p.y += p.speed;

        if (p.y > this.height) {
          p.y = 0;
          p.x = Math.random() * this.width;
        }
      }

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  // 🌟 Five-pointed silver stars
  createStarfield() {
    this.particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 12 + 0.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.5,
      flickerSpeed: (Math.random() * 0.5) + 0.01,
      rotation: Math.random() * Math.PI,
      scale: Math.random() * 0.7 + 0.8
    }));
  
    const animate = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
  
      for (const star of this.particles) {
        // Twinkling
        star.opacity += (Math.random() - 0.5) * star.flickerSpeed;
        star.opacity = Math.min(1, Math.max(0.5, star.opacity)); // Brighter minimum
  
        // Movement
        star.x += star.dx;
        star.y += star.dy;
  
        if (star.x < 0) star.x = this.width;
        if (star.x > this.width) star.x = 0;
        if (star.y < 0) star.y = this.height;
        if (star.y > this.height) star.y = 0;
  
        // Draw silver star
        this.ctx.save();
        this.ctx.translate(star.x, star.y);
        this.ctx.rotate(star.rotation);
        this.ctx.scale(star.scale, star.scale);
  
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, star.radius * 2);
        gradient.addColorStop(0, "#FFFFFF"); // White bright center
        gradient.addColorStop(0.3, "#E0E0E0"); // Soft outer silver
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)"); // Gentle fade
        this.ctx.beginPath();

        for (let i = 0; i < 5; i++) {
          this.ctx.lineTo(0, -star.radius);
          this.ctx.translate(0, -star.radius);
          this.ctx.rotate((Math.PI * 2) / 10);
          this.ctx.lineTo(0, star.radius);
          this.ctx.translate(0, star.radius);
          this.ctx.rotate(-(Math.PI * 6) / 10);
        }
        this.ctx.closePath();
  
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = star.opacity;
        this.ctx.fill();
        this.ctx.restore();
      }
  
      this.animationId = requestAnimationFrame(animate);
    };
  
    animate();
  }
  
  ngOnDestroy(): void {
    this.loadSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}