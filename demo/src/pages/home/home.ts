import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { IonPullUpFooterState} from 'ionic-pullup';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  footerState: IonPullUpFooterState;

  constructor(public navCtrl: NavController) {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

}
