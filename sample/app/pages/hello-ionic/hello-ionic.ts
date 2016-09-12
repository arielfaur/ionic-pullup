import {Component} from '@angular/core';
import {IonPullUpDirective, IonPullUpFooterState} from '../../components/ion-pullup';

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  directives: [IonPullUpDirective]
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
