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
import { ChangeDetectionStrategy, Component, EventEmitter, Renderer2, ViewChild, Output, Input, OnInit, AfterContentInit, OnChanges, SimpleChanges, ContentChildren, QueryList, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import 'hammerjs';

export interface FooterMetadata {
  height: number;
  posY: number;
  lastPosY: number;
  toolbarDefaultHeight?: number;
  toolbarDefaultExpandedPosition?: number;
  toolbarUpperBoundary?: number;
  ionContentRef?: any;
}

export interface ViewMetadata {
  tabsRef?: Element;
  tabsHeight?: number;
  hasBottomTabs?: boolean;
  toolbarRef?: Element;
  toolbarHeight?: number;
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
  


  /**
   *  Maximum expanded position - useful if there are top headers
   *  If not provided by default computes available screen minus tabs and headers
   */
  @Input() toolbarTopMargin = 0;

  /**
   *  Minimum position - useful to keep a part of the footer always visible at the bottom
   */
  @Input() minBottomVisible = 0;


  @Output() expanded = new EventEmitter<any>();
  @Output() collapsed = new EventEmitter<any>();
  @Output() minimized = new EventEmitter<any>();

  @ViewChild('footer', { static: true }) childFooter;
  @ContentChildren('ionDragFooter') dragElements !: QueryList<any>;

  protected footerMeta: FooterMetadata;
  protected currentViewMeta: ViewMetadata;

  constructor(
    private platform: Platform,
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

    this.updateUI();
  }

  public get expandedHeight(): number {
    return window.innerHeight - this.currentViewMeta.toolbarHeight - this.currentViewMeta.tabsHeight;
  }

  computeDefaults() {

    setTimeout(() => {
      this.footerMeta.toolbarDefaultHeight = this.childFooter.nativeElement.offsetHeight;

      this.findIonicComponentsInPage();

      this.dragElements.forEach(elem => {
        const hammer = this.hammerConfig.buildHammer(elem.el);
        hammer.on('pan panstart panend', (ev) => {
          this.onPan(ev);
        });
      });
    }, 300);
  }

  computeHeights() {
    this.footerMeta.height = this.expandedHeight;
    this.footerMeta.toolbarDefaultExpandedPosition = -this.footerMeta.height + this.footerMeta.toolbarDefaultHeight + this.minBottomVisible;
    this.footerMeta.toolbarUpperBoundary = this.footerMeta.height - this.footerMeta.toolbarDefaultHeight - this.minBottomVisible;
    
    this.renderer.setStyle(this.childFooter.nativeElement, 'height', this.footerMeta.height + 'px');
    this.renderer.setStyle(this.childFooter.nativeElement, 'top',
      `${window.innerHeight - this.footerMeta.toolbarDefaultHeight - this.currentViewMeta.tabsHeight - this.minBottomVisible}px`
    );

    // this.renderer.setStyle(this.footerMeta.ionContentRef, 'max-height', `${this.minBottomVisible / this.footerMeta.height * 100}%`);

    // TODO check if this is needed for native platform iOS/Android
    // this.renderer.setStyle(this.childFooter.nativeElement, 'bottom', this.currentViewMeta.tabsHeight + 'px');
  }

  updateUI(isInit: boolean = false) {
    if (!this.childFooter) { return; }

    setTimeout(() => {
      this.computeHeights();
    }, 300);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transition', 'none');  // avoids flickering when changing orientation
  }

  expand() {
    this.footerMeta.lastPosY = this.footerMeta.toolbarDefaultExpandedPosition;

    // reset ionContent scaling
    this.renderer.setStyle(this.footerMeta.ionContentRef, 'max-height', '100%');

    this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
    this.renderer.setStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');

    this.expanded.emit(null);
  }

  collapse(isInit: boolean = false) {
    if (!this.childFooter) { return; }
    this.footerMeta.lastPosY = 0;

    // reset ionContent scaling
    this.renderer.setStyle(this.footerMeta.ionContentRef, 'max-height', '100%');

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
          // return;
        } else if (Math.abs(this.footerMeta.posY) > this.footerMeta.toolbarUpperBoundary) {
          this.footerMeta.posY = this.footerMeta.toolbarDefaultExpandedPosition;
        }

        // ionContent scaling - FIX scrolling bug
        // if (this.footerMeta.ionContentRef) {
        //   const scaleFactor = Math.abs(this.footerMeta.posY) / this.footerMeta.toolbarUpperBoundary;
        //   this.renderer.setStyle(this.footerMeta.ionContentRef, 'max-height', `${scaleFactor * 100}%`);
        // }

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

    // TODO: fix hack due to BUG (https://github.com/angular/angular/issues/6005)
    window.setTimeout(() => {
      this.stateChange.emit(this.state);
    });
  }

  /**
   * Detect ionic components in page
   */
  private findIonicComponentsInPage() {
    this.footerMeta.ionContentRef = this.childFooter.nativeElement.querySelector('ion-content');

    this.currentViewMeta.tabsRef = document.querySelector('ion-tab-bar');
    this.currentViewMeta.tabsHeight = this.currentViewMeta.tabsRef ? (this.currentViewMeta.tabsRef as HTMLElement).offsetHeight : 0;
    console.debug(this.currentViewMeta.tabsRef ? 'ionic-pullup => Tabs detected' : 'ionic.pullup => View has no tabs');

    if (!this.toolbarTopMargin) {
      const outletRef = document.querySelector('ion-router-outlet');
      if (outletRef) {
        const headerRef = outletRef.querySelector('ion-header');
        if (headerRef) {
          this.currentViewMeta.toolbarRef = headerRef.querySelector('ion-toolbar');
          this.currentViewMeta.toolbarHeight = this.currentViewMeta.toolbarRef.clientHeight;
          console.debug(this.currentViewMeta.toolbarRef ? `ionic-pullup => Toolbar detected` : 'ionic.pullup => View has no tabs');
        } else {
          this.currentViewMeta.toolbarHeight = 0;
        }
      }
    } else {
      this.currentViewMeta.toolbarHeight = this.toolbarTopMargin;
    }
  }

}


