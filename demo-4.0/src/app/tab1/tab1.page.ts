import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState} from 'ionic-pullup';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  footerState: IonPullUpFooterState;

  constructor() {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  toggleFooter() {

    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;

  }

}
