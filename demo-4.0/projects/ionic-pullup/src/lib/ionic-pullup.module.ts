import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPullupComponent } from './ionic-pullup.component';
import { IonicPullupComponentTabComponent } from './ionic-pullup-tab.component';



@NgModule({
  declarations: [ IonicPullupComponent, IonicPullupComponentTabComponent ],
  imports: [
  ],
  exports: [ IonicPullupComponent, IonicPullupComponentTabComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IonicPullupModule { }
