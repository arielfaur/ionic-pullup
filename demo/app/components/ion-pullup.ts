import {Component, Directive, DoCheck, SimpleChange, OnChanges, EventEmitter, ElementRef, Renderer, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
import {SlideGesture} from 'ionic-angular/gestures/slide-gesture';

class FooterMetadata {
  height: number = 0;
  posY: number = 0;
  lastPosY: number = 0;
  defaultHeight: number;
  handleHeight: number = 0;
}

class ViewMetadata {
  tabs: Element;
  tabsHeight: number;
  hasBottomTabs: boolean;
  
  header: Element;
  headerHeight: number;
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
export class IonPullUpDirective implements OnChanges { 
  @Input() state: IonPullUpFooterState;
  @Input() initialState: IonPullUpFooterState;
  @Input() defaultBehavior: IonPullUpFooterBehavior;
  @Input() allowMidRange: boolean;
  @Input() maxHeight: number;
  @Output() onExpand = new EventEmitter<any>();
  @Output() onCollapse = new EventEmitter<any>();
  @Output() onMinimize = new EventEmitter<any>();

  protected _footerMeta: FooterMetadata;
  protected _currentViewMeta: ViewMetadata;
  protected _dragGesture: Gesture;
  protected _tapGesture: Gesture;
  
  protected _oldState: IonPullUpFooterState;
  
  constructor(private el: ElementRef, private renderer: Renderer) {
    this._footerMeta = new FooterMetadata();
    this._currentViewMeta = new ViewMetadata();  
    
    // sets initial state
    this.initialState = this.initialState || IonPullUpFooterState.Collapsed;
    this.defaultBehavior = this.defaultBehavior || IonPullUpFooterBehavior.Expand;
    this.maxHeight = this.maxHeight || 0;
  }
  
  ngOnInit() {
    console.log('onInit');
    
    
    
    
    this._tapGesture = new Gesture(this.el.nativeElement);
    this._tapGesture.listen();
    this._tapGesture.on('tap', e => {
      console.log('pressed!!');
      this.onTap(e);
    });

    this._dragGesture = new Gesture(this.el.nativeElement);
    this._dragGesture.listen();
    this._dragGesture.on('pan panstart panend', e => {
      this.onDrag(e);
    });
    
    setTimeout(() => {  
      this._footerMeta.defaultHeight =  this.el.nativeElement.offsetHeight;
      
      this.computeDefaults();
      //this.renderer.setElementStyle(this.el.nativeElement, 'transition', '300ms ease-in-out');
      //this.renderer.setElementStyle(this.el.nativeElement, 'position', 'absolute');
      
      if (this._currentViewMeta.tabs && this._currentViewMeta.hasBottomTabs) {
        this.renderer.setElementStyle(this.el.nativeElement, 'bottom', this._currentViewMeta.tabsHeight + 'px');
      }
      
      this.updateUI();
    }, 500)
  }
  
  ngOnChanges() {
    console.log('onChanges');
  }
  
  public get height() : number {
    return this.el.nativeElement.offsetHeight;
  }
  
  public get expandedHeight() : number {
    return window.innerHeight - this._currentViewMeta.headerHeight - this._footerMeta.handleHeight - this._currentViewMeta.tabsHeight; 
  }
  
  public set handleHeight(v : number) {
    this._footerMeta.handleHeight = v;
  }
  
  public get handleHeight() : number {
    return this._footerMeta.handleHeight;
  }
  
  
  public get background() : string {
    return window.getComputedStyle(this.el.nativeElement).background;
  }
  
 
  
  
  
  computeDefaults() {
    this._currentViewMeta.tabs = this.el.nativeElement.closest('ion-tabs');
    this._currentViewMeta.hasBottomTabs = this._currentViewMeta.tabs && this._currentViewMeta.tabs.classList.contains('tabs-bottom');
    this._currentViewMeta.tabsHeight = this._currentViewMeta.tabs ? (<HTMLElement> this._currentViewMeta.tabs.querySelector('ion-tabbar-section')).offsetHeight : 0;
    this._currentViewMeta.header = document.querySelector('ion-navbar-section .toolbar');
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
    this.renderer.setElementStyle(this.el.nativeElement, 'min-height', this._footerMeta.height + 'px');
    this.state = IonPullUpFooterState.Collapsed; 
  }
  
  updateUI() {
    setTimeout(() => {  
      this.computeHeights();
    }, 300);
    this.renderer.setElementStyle(this.el.nativeElement, 'transition', 'none');  
  }
  
  expand() {
    this._footerMeta.lastPosY = 0;
    this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, 0, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, 0, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transition', '300ms ease-in-out');
    
    this.onExpand.emit(null);
    this.state = IonPullUpFooterState.Expanded;  
  }
  
  collapse() {
    this._footerMeta.lastPosY = this._footerMeta.height - this._footerMeta.defaultHeight;
    this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    
    this.onCollapse.emit(null);
    this.state = IonPullUpFooterState.Collapsed;     
  }
  
  minimize() {
    this._footerMeta.lastPosY = this._footerMeta.height;
    this.renderer.setElementStyle(this.el.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    this.renderer.setElementStyle(this.el.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
    
    this.onMinimize.emit(null);
    this.state = IonPullUpFooterState.Minimized;        
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
        if (this.allowMidRange) {
          if (this._footerMeta.lastPosY > this._footerMeta.posY) {
              this.state = IonPullUpFooterState.Expanded;
          }
          else if (this._footerMeta.lastPosY < this._footerMeta.posY) {
              this.state = (this.initialState == IonPullUpFooterState.Minimized) ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
          }  
        } else {
          this._footerMeta.lastPosY = this._footerMeta.posY;  
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