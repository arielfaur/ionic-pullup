import {Component} from '@angular/core';
import {IonPullUpComponent, IonPullUpFooterState} from '../../components/ion-pullup';
import {IonPullUpTabComponent} from '../../components/ion-pullup-tab';

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  directives: [IonPullUpComponent, IonPullUpTabComponent]
})
export class HelloIonicPage {
  footerState: IonPullUpFooterState;

  constructor() {
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
