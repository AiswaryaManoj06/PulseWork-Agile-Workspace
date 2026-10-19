import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverElevate]',
  standalone: true
})
export class HoverElevateDirective {
  @Input() elevateDistance = '-4px';
  @Input() elevateGlow = 'rgba(99, 102, 241, 0.25)';

  private originalTransform = '';
  private originalShadow = '';
  private originalBorder = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, border-color 0.22s ease');
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.originalTransform = this.el.nativeElement.style.transform || 'none';
    this.originalShadow = this.el.nativeElement.style.boxShadow || '';
    this.originalBorder = this.el.nativeElement.style.borderColor || '';

    this.renderer.setStyle(this.el.nativeElement, 'transform', `translateY(${this.elevateDistance})`);
    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', `0 12px 28px ${this.elevateGlow}`);
    this.renderer.setStyle(this.el.nativeElement, 'borderColor', 'rgba(99, 102, 241, 0.45)');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transform', this.originalTransform === 'none' ? '' : this.originalTransform);
    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', this.originalShadow);
    this.renderer.setStyle(this.el.nativeElement, 'borderColor', this.originalBorder);
  }
}
