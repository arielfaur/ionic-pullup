/*
ionic-pullup v4 for Ionic 4 and Angular 8

Copyright 2020 Ariel Faur (https://github.com/arielfaur)
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

import { ChangeDetectionStrategy, Component, EventEmitter, ElementRef, Renderer2, ViewChild, Output, Input, OnInit, AfterContentInit, OnChanges, SimpleChanges, ContentChildren, QueryList, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

export interface FooterMetadata {
  height: number;
  posY: number;
  lastPosY: number;
  toolbarDefaultHeight?: number;
}

export interface ViewMetadata {
  tabs?: Element;
  tabsHeight?: number;
  hasBottomTabs?: boolean;
  header?: Element;
  headerHeight?: number;
  bottomSpace?: number;
}

export interface FooterTab {
  x?: number;
  y?: number;
  upperLeftRadius?: number;
  upperRightRadius?: number;
  backgroundColor?: string;
  color?: string;
  content?: string;
}

export enum IonPullUpFooterState {
  Collapsed = 0,
  Expanded = 1,
  Minimized = 2
}

export enum IonPullUpFooterBehavior {
  Hide,
  Expand
}

@Component({
  selector: 'lib-ionic-pullup',
  templateUrl: './ionic-pullup.component.html',
  styleUrls: ['./ionic-pullup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IonicPullupComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() state: IonPullUpFooterState;
  @Output() stateChange: EventEmitter<IonPullUpFooterState> = new EventEmitter<IonPullUpFooterState>();

  @Input() initialState: IonPullUpFooterState;          // TODO implemment
  @Input() defaultBehavior: IonPullUpFooterBehavior;    // TODO implemment
  @Input() maxHeight: number;

  @Output() expanded = new EventEmitter<any>();
  @Output() collapsed = new EventEmitter<any>();
  @Output() minimized = new EventEmitter<any>();

  @ViewChild('footer', { static: true }) childFooter;
  @ContentChildren('dragFooter') dragElements !: QueryList<any>;

  protected footerMeta: FooterMetadata;
  protected currentViewMeta: ViewMetadata;
  protected oldState: IonPullUpFooterState;

  constructor(
    private platform: Platform,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(HAMMER_GESTURE_CONFIG) private hammerConfig: HammerGestureConfig) {
    this.footerMeta = {
      height: 0,
      posY: 0,
      lastPosY: 0
    };
    this.currentViewMeta = { bottomSpace: screen.height - window.innerHeight };

    // sets initial state
    this.initialState = this.initialState || IonPullUpFooterState.Collapsed;
    this.defaultBehavior = this.defaultBehavior || IonPullUpFooterBehavior.Expand;
    this.maxHeight = this.maxHeight || 0;
  }

  ngOnInit() {
    console.log('ionic-pullup => Initializing footer...');

    window.addEventListener('orientationchange', () => {
      console.log('ionic-pullup => Changed orientation => updating');
      this.updateUI();
    });
    this.platform.resume.subscribe(() => {
      console.log('ionic-pullup => Resumed from background => updating');
      this.updateUI();
    });
  }

  ngAfterContentInit() {
    this.computeDefaults();

    this.state = IonPullUpFooterState.Collapsed;

    this.updateUI(true);  // need to indicate whether it's first run to avoid emitting events twice due to change detection

    console.log('Drag elements', this.dragElements);
  }

  public get expandedHeight(): number {
    return window.innerHeight - this.currentViewMeta.headerHeight - this.currentViewMeta.tabsHeight;
  }

  computeDefaults() {

    setTimeout(() => {
      this.footerMeta.toolbarDefaultHeight = this.childFooter.nativeElement.offsetHeight;
      this.currentViewMeta.tabs = document.querySelector('ion-tab-bar');
      this.currentViewMeta.tabsHeight = this.currentViewMeta.tabs ? (this.currentViewMeta.tabs as HTMLElement).offsetHeight : 0;
      console.log(this.currentViewMeta.tabsHeight ? 'ionic-pullup => Tabs detected' : 'ionic.pullup => View has no tabs');

      this.currentViewMeta.header = document.querySelector('ion-toolbar');
      this.currentViewMeta.headerHeight = this.currentViewMeta.header.clientHeight;
    }, 300);
  }

  computeHeights(isInit: boolean = false) {
    this.footerMeta.height = this.maxHeight > 0 ? this.maxHeight : this.expandedHeight;

    this.renderer.setStyle(this.childFooter.nativeElement, 'height', this.footerMeta.height + 'px');
    this.renderer.setStyle(this.childFooter.nativeElement, 'top', window.innerHeight  - this.footerMeta.toolbarDefaultHeight -  this.currentViewMeta.tabsHeight + 'px');

    // TODO check if this is needed for native platform iOS/Android
    // this.renderer.setStyle(this.childFooter.nativeElement, 'bottom', this.currentViewMeta.tabsHeight + 'px');

    //this.collapse(isInit);
  }

  updateUI(isInit: boolean = false) {
    if (!this.childFooter) { return; }

    setTimeout(() => {
      this.computeHeights(isInit);
    }, 300);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transition', 'none');  // avoids flickering when changing orientation
  }

  expand() {
    console.log('Expand', this.childFooter);
    this.footerMeta.lastPosY = -this.footerMeta.height + this.footerMeta.toolbarDefaultHeight;
    this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');

    this.expanded.emit(null);
  }

  collapse(isInit: boolean = false) {
    console.log('Collapse', this.childFooter);

    if (!this.childFooter) { return; }
    this.footerMeta.lastPosY = 0;
    this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);

    if (!isInit) { this.collapsed.emit(null); }
  }

  /**
   * TODO
   */
  minimize() {
    this.footerMeta.lastPosY = this.footerMeta.height;
    this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this.footerMeta.lastPosY + 'px, 0)');
    this.renderer.setStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this.footerMeta.lastPosY + 'px, 0)');

    this.minimized.emit(null);
  }


  onTap(e: any) {
    e.preventDefault();

    if (this.state === IonPullUpFooterState.Collapsed) {
      if (this.defaultBehavior === IonPullUpFooterBehavior.Hide) {
        this.state = IonPullUpFooterState.Minimized;
      } else {
        this.state = IonPullUpFooterState.Expanded;
      }
    } else {
      if (this.state === IonPullUpFooterState.Minimized) {
        if (this.defaultBehavior === IonPullUpFooterBehavior.Hide) {
          this.state = IonPullUpFooterState.Collapsed;
        } else {
          this.state = IonPullUpFooterState.Expanded;
        }
      } else {
        // footer is expanded
        this.state = this.initialState === IonPullUpFooterState.Minimized ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
      }
    }
  }


  onPan(e: HammerInput) {
    this.renderer.setStyle(this.childFooter.nativeElement, 'transition', 'none');

    e.preventDefault();

    switch (e.type) {
      case 'pan':
        this.footerMeta.posY = e.deltaY + this.footerMeta.lastPosY;

        // check for min and max boundaries overflow with sliding gesture
        if (this.footerMeta.posY > 0) {
          this.footerMeta.posY = 0;
          return;
        } else if (Math.abs(this.footerMeta.posY) > (this.footerMeta.height - this.footerMeta.toolbarDefaultHeight)) {
          this.footerMeta.posY = -this.footerMeta.height + this.footerMeta.toolbarDefaultHeight;
        }

        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this.footerMeta.posY + 'px, 0)');
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this.footerMeta.posY + 'px, 0)');
        break;
      case 'panend':
        this.renderer.setStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
        this.footerMeta.lastPosY = this.footerMeta.posY;

        // TODO auto dock
        // if (this.footerMeta.lastPosY > this.footerMeta.height - this.footerMeta.defaultHeight) {
        //   this.state =  IonPullUpFooterState.Collapsed;
        // }

        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    if (changes.state.isFirstChange() || changes.state.currentValue === changes.state.previousValue) { return; }

    switch (this.state) {
      case IonPullUpFooterState.Collapsed:
        this.collapse();
        break;
      case IonPullUpFooterState.Expanded:
        this.expand();
        break;
      case IonPullUpFooterState.Minimized:
        this.minimize();
        break;
    }
    // this.oldState = this.state;

    // TODO: fix hack due to BUG (https://github.com/angular/angular/issues/6005)
    window.setTimeout(() => {
      this.stateChange.emit(this.state);
    });
  }

  // ngDoCheck() {
  //   if (!Object.is(this.state, this.oldState)) {
  //     switch (this.state) {
  //       case IonPullUpFooterState.Collapsed:
  //         this.collapse();
  //         break;
  //       case IonPullUpFooterState.Expanded:
  //         this.expand();
  //         break;
  //       case IonPullUpFooterState.Minimized:
  //         this.minimize();
  //         break;
  //     }
  //     this.oldState = this.state;

  //     // TODO: fix hack due to BUG (https://github.com/angular/angular/issues/6005)
  //     window.setTimeout(() => {
  //       this.stateChange.emit(this.state);
  //     });
  //   }
  // }


}


