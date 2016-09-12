import {Attribute, Component, Directive, DoCheck, SimpleChange, OnChanges, EventEmitter, ElementRef, Renderer, ContentChild, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
import {Toolbar} from 'ionic-angular/components/toolbar/toolbar';

interface FooterMetadata {
  height: number;
  posY: number;
  lastPosY: number;
  defaultHeight?: number;
  tabHeight: number;
}

interface ViewMetadata {
  tabs?: Element;
  tabsHeight?: number;
  hasBottomTabs?: boolean;  
  header?: Element;
  headerHeight?: number;
}

interface FooterTab {
  x?: number;
  y?: number;
  upperLeftRadius?: number;
  upperRightRadius?: number;
  backgroundColor?: string;
  color?: string;
  content?: string;
}

export enum IonPullUpFooterState {
  Collapsed,
  Minimized,
  Expanded
}

export enum IonPullUpFooterBehavior {
  Hide, 
  Expand
}

@Directive({
    selector: '[ion-pullup]',
    providers: []
})
export class IonPullUpDirective  { 
  @Input() state: IonPullUpFooterState;
  @Input() initialState: IonPullUpFooterState;
  @Input() defaultBehavior: IonPullUpFooterBehavior;
  //@Input() allowMidRange: boolean;
  @Input() maxHeight: number;
  @Input() tab: boolean;

  @Output() onExpand = new EventEmitter<any>();
  @Output() onCollapse = new EventEmitter<any>();
  @Output() onMinimize = new EventEmitter<any>();

  @ContentChild(Toolbar) contentChild;

  protected _footerMeta: FooterMetadata;
  protected _currentViewMeta: ViewMetadata;
  
  protected _oldState: IonPullUpFooterState;

  protected _tabElement: HTMLElement;
  
  constructor(private el: ElementRef, private renderer: Renderer) {
    this._footerMeta = {
      height: 0,
      posY:  0,
      lastPosY: 0,
      tabHeight: 0
    }
    this._currentViewMeta = {};  
    
    // sets initial state
    this.initialState = this.initialState || IonPullUpFooterState.Collapsed;
    this.defaultBehavior = this.defaultBehavior || IonPullUpFooterBehavior.Expand;
    this.maxHeight = this.maxHeight || 0;
  }
  
  ngOnInit() {
    console.log('Initializing footer...');

    

    window.addEventListener("orientationchange", () => {
        this.updateUI();
    });

    this._footerMeta.defaultHeight =  this.el.nativeElement.offsetHeight;
    this.state = IonPullUpFooterState.Collapsed;
    
    this.computeDefaults();

        // add a tab ?
    if (this.tab!==undefined) {
      this._tabElement = this.renderer.createElement(this.el.nativeElement, 'div');
      this.renderer.setElementClass(this._tabElement, 'footer-tab', true);
      this._footerMeta.tabHeight = (<HTMLElement>this._tabElement).offsetHeight;
      this.renderer.setElementStyle(this._tabElement, 'margin-top', -this._currentViewMeta.headerHeight-this._footerMeta.tabHeight + 'px');
    }
    
    /*if (this._currentViewMeta.tabs && this._currentViewMeta.hasBottomTabs) {
      this.renderer.setElementStyle(this.el.nativeElement, 'bottom', this._currentViewMeta.tabsHeight + 'px');
    }*/
    
    this.updateUI();
    
  }

   ngAfterContentInit() {
      let barGesture = new Gesture(this.contentChild.elementRef.nativeElement);
      barGesture.listen();
      barGesture.on('tap', e => {
        this.onTap(e);
      });
      barGesture.on('pan panstart panend', e => {
        this.onDrag(e);
      });

      let tabGesture = new Gesture(this._tabElement);
      tabGesture.listen();
      tabGesture.on('tap', e => {
        this.onTap(e);
      });
      tabGesture.on('pan panstart panend', e => {
        this.onDrag(e);
      });
   }

  
  public get height() : number {
    return this.el.nativeElement.offsetHeight;
  }
  
  public get expandedHeight() : number {
    return window.innerHeight - this._currentViewMeta.headerHeight - this._footerMeta.tabHeight; // - this._currentViewMeta.tabsHeight; 
  }
  
  public get background() : string {
    return window.getComputedStyle(this.el.nativeElement).background;
  }
  
  computeDefaults() {
    //this._currentViewMeta.tabs = this.el.nativeElement.closest('ion-tabs');
    //this._currentViewMeta.hasBottomTabs = this._currentViewMeta.tabs && this._currentViewMeta.tabs.classList.contains('tabs-bottom');
    //this._currentViewMeta.tabsHeight = this._currentViewMeta.tabs ? (<HTMLElement> this._currentViewMeta.tabs.querySelector('ion-tabbar-section')).offsetHeight : 0;
    this._currentViewMeta.header = document.querySelector('ion-navbar.toolbar');
    this._currentViewMeta.headerHeight = this._currentViewMeta.header ? (<HTMLElement>this._currentViewMeta.header).offsetHeight : 0;
  }
  
  computeHeights() {
    this._footerMeta.height = this.maxHeight > 0 ? this.maxHeight : this.expandedHeight; 
    /*
    this.renderer.setElementStyle(this.el.nativeElement, 'min-height', this._footerMeta.height + 'px'); 
    if (this.initialState == IonPullUpFooterState.Minimized) {
      this.minimize()  
    } else {
      this.collapse() 
    }
    */
    this.renderer.setElementStyle(this.el.nativeElement, 'height', this._footerMeta.height + 'px');
    this.collapse(); 
  }
  
  updateUI() {
    setTimeout(() => {  
      this.computeHeights();
    }, 300);
    this.renderer.setElementStyle(this.el.nativeElement, 'transition', 'none');  // avoids flickering when changing orientation
  }
  
  expand() {
    this._footerMeta.lastPosY = 0;
    this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, 0, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, 0, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transition', '300ms ease-in-out');
    
    this.onExpand.emit(null);
  }
  
  collapse() {
    this._footerMeta.lastPosY = this._footerMeta.height - this._footerMeta.defaultHeight;
    this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    
    this.onCollapse.emit(null);
  }
  
  minimize() {
    this._footerMeta.lastPosY = this._footerMeta.height;
    this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    
    this.onMinimize.emit(null);
  }
  
  
  onTap(e: any) {
    e.preventDefault();
    
    if (this.state == IonPullUpFooterState.Collapsed) {
        if (this.defaultBehavior == IonPullUpFooterBehavior.Hide) 
            this.state = IonPullUpFooterState.Minimized;
        else
            this.state = IonPullUpFooterState.Expanded;
    } else {
        if (this.state == IonPullUpFooterState.Minimized) {
            if (this.defaultBehavior == IonPullUpFooterBehavior.Hide)
                this.state = IonPullUpFooterState.Collapsed;
            else
                this.state = IonPullUpFooterState.Expanded;
        } else {
            // footer is expanded
            this.state = this.initialState == IonPullUpFooterState.Minimized ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
        }
    }
  }
  
  
  onDrag(e: any) {
    e.preventDefault();
    
    switch(e.type) {
      case 'panstart':
        this.renderer.setElementStyle(this.el.nativeElement, 'transition', 'none');
        break;
      case 'pan':
        this._footerMeta.posY = Math.round(e.deltaY) + this._footerMeta.lastPosY;
        if (this._footerMeta.posY < 0 || this._footerMeta.posY > this._footerMeta.height) return;
        this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.posY + 'px, 0)');
        this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.posY + 'px, 0)');
        break;
      case 'panend':
        this.renderer.setElementStyle(this.el.nativeElement, 'transition', '300ms ease-in-out');
        
          if (this._footerMeta.lastPosY > this._footerMeta.posY) {
              this.state = IonPullUpFooterState.Expanded;
          }
          else if (this._footerMeta.lastPosY < this._footerMeta.posY) {
              this.state = (this.initialState == IonPullUpFooterState.Minimized) ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
          }  

        break;
    }
  }
  
  ngDoCheck() {
    if (!Object.is(this.state, this._oldState)) {
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
      this._oldState = this.state;
    }  
  }
   
}