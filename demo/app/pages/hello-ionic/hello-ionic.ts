import {Component} from '@angular/core';
import {IonPullUpDirective} from '../../components/ion-pullup';

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  directives: [IonPullUpDirective]
})
export class HelloIonicPage {
  constructor() {

  }

  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }
}
