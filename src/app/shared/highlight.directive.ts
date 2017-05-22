import {Directive, ElementRef, Renderer2, HostBinding, HostListener, OnInit} from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})

export class HighlightDirective implements OnInit {

  color: string;
  constructor(private elfRef: ElementRef, private renderer: Renderer2) {
  }
  ngOnInit() {
    this.color = this.elfRef.nativeElement.style.backgroundColor;
// this.renderer.setStyle(this.elfRef.nativeElement, 'background-color', 'yellow');
  }
  @HostListener('mouseenter') mouseover(enventData: Event) {
    console.log(this.color);
  this.renderer.setStyle(this.elfRef.nativeElement, 'background-color', 'yellow');
}
  @HostListener('mouseleave') mouseleave (enventData: Event) {
    console.log(this.color);
    this.renderer.setStyle(this.elfRef.nativeElement, 'background-color', this.color);
  }

}
