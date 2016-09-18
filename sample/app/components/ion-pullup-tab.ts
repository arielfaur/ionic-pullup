/*
ionic-pullup v2 for Ionic/Angular 2
 
Copyright 2016 Ariel Faur (https://github.com/arielfaur)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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