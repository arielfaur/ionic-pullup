import {Attribute, Component, Directive, DoCheck, SimpleChange, OnChanges, EventEmitter, ElementRef, Renderer, ContentChild, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
import {Toolbar} from 'ionic-angular/components/toolbar/toolbar';
import {IonPullUpComponent} from './ion-pullup';

@Directive({
    selector: 'ion-pullup-tab'
})
export class IonPullUpTabComponent  { 
  @Input() footer: IonPullUpComponent;

  constructor(private el: ElementRef, private renderer: Renderer) {
      
  }

  ngOnInit() {
    let tabGesture = new Gesture(this.el.nativeElement);
    tabGesture.listen();
    tabGesture.on('tap', e => {
      this.footer && this.footer.onTap(e);
    });
    tabGesture.on('pan panstart panend', e => {
      this.footer && this.footer.onDrag(e);
    });
  }

}