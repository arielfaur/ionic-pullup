import {Attribute, Component, Directive, DoCheck, SimpleChange, OnChanges, EventEmitter, ElementRef, Renderer, ContentChild, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
import {Toolbar} from 'ionic-angular/components/toolbar/toolbar';
import {IonPullUpComponent, IonPullUpFooterState} from './ion-pullup';

@Component({
    selector: 'ion-pullup-tab',
    template: '<ng-content></ng-content>'
})
export class IonPullUpTabComponent  { 
  @Input() footer: IonPullUpComponent;

  constructor(private el: ElementRef, private renderer: Renderer) {
      
  }

  public get IsExpanded(): boolean {
    return this.footer.state == IonPullUpFooterState.Expanded;
  }

  public get IsCollapsed(): boolean {
    return this.footer.state == IonPullUpFooterState.Collapsed;
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