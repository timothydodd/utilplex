import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, AfterViewInit, PLATFORM_ID, ViewChild, signal } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="background-container">
      <canvas #canvas class="background-canvas"></canvas>
    </div>
  `,
  styleUrls: ['./animated-background.component.scss'],
})
export class AnimatedBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId = signal<number | null>(null);
  private isBrowser: boolean;

  private readonly PARTICLE_COUNT = 100;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Component initialized
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initCanvas();
      this.createParticles();
      this.startAnimation();
      this.addResizeListener();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      const id = this.animationId();
      if (id) {
        cancelAnimationFrame(id);
      }
      this.removeResizeListener();
    }
  }

  private initCanvas() {
    if (!this.isBrowser) return;
    if (!this.canvasRef) {
      return;
    }
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
  }

  private resizeCanvas() {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles() {
    if (!this.isBrowser) return;
    this.particles = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5, // Small star-like particles
        opacity: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 60 + 180, // Blue to cyan range
      });
    }
  }

  private updateParticles() {
    if (!this.isBrowser) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const time = Date.now() * 0.0001; // Much slower time factor (was 0.0005)
    
    this.particles.forEach((particle, index) => {
      // Gentle orbital movement with slight randomness
      const orbitSpeed = 0.1 + (index % 5) * 0.02; // Slower speeds (was 0.3 + 0.1)
      
      // Calculate smooth movement using sine waves
      particle.vx = Math.sin(time * orbitSpeed + index) * 0.05; // Reduced from 0.2
      particle.vy = Math.cos(time * orbitSpeed * 0.8 + index) * 0.04; // Reduced from 0.15
      
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Smooth edge wrapping instead of bouncing
      if (particle.x < -10) {
        particle.x = width + 10;
      } else if (particle.x > width + 10) {
        particle.x = -10;
      }
      
      if (particle.y < -10) {
        particle.y = height + 10;
      } else if (particle.y > height + 10) {
        particle.y = -10;
      }

      // Keep particle size constant - no breathing effect
      // particle.size remains unchanged
      
      // Gentle opacity pulsing
      const basePulse = Math.sin(time * 1.5 + index * 0.5) * 0.1;
      particle.opacity = Math.max(0.2, Math.min(0.8, (particle.opacity || 0.5) + basePulse));
    });
  }

  private drawParticles() {
    if (!this.isBrowser || !this.ctx) return;
    this.particles.forEach((particle) => {
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private animate = () => {
    if (!this.isBrowser || !this.ctx) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.updateParticles();
    this.drawParticles();

    this.animationId.set(requestAnimationFrame(this.animate));
  };

  private startAnimation() {
    if (!this.isBrowser) return;
    this.animate();
  }

  private addResizeListener() {
    if (!this.isBrowser) return;
    window.addEventListener('resize', this.handleResize);
  }

  private removeResizeListener() {
    if (!this.isBrowser) return;
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (!this.isBrowser) return;
    this.resizeCanvas();
    this.createParticles();
  };
}
