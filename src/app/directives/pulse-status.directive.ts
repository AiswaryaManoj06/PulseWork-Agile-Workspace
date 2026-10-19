import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appPulseStatus]',
  standalone: true
})
export class PulseStatusDirective implements OnChanges {
  @Input('appPulseStatus') priority: string = '';

  private dotElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priority']) {
      this.applyPulseEffect();
    }
  }

  private applyPulseEffect(): void {
    // Remove existing dot if any
    if (this.dotElement) {
      this.renderer.removeChild(this.el.nativeElement, this.dotElement);
      this.dotElement = null;
    }

    if (this.priority === 'Critical' || this.priority === 'High') {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

      this.dotElement = this.renderer.createElement('span');
      this.renderer.setStyle(this.dotElement, 'position', 'absolute');
      this.renderer.setStyle(this.dotElement, 'top', '10px');
      this.renderer.setStyle(this.dotElement, 'right', '10px');
      this.renderer.setStyle(this.dotElement, 'width', '8px');
      this.renderer.setStyle(this.dotElement, 'height', '8px');
      this.renderer.setStyle(this.dotElement, 'borderRadius', '50%');

      const color = this.priority === 'Critical' ? '#ef4444' : '#f59e0b';
      this.renderer.setStyle(this.dotElement, 'backgroundColor', color);
      this.renderer.setStyle(this.dotElement, 'boxShadow', `0 0 10px ${color}`);
      this.renderer.setStyle(this.dotElement, 'animation', 'pulseGlow 1.5s infinite ease-in-out');

      this.renderer.appendChild(this.el.nativeElement, this.dotElement);
    }
  }
}
