import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPullupComponent } from './ionic-pullup.component';
import { IonicPullupComponentTabComponent } from './ionic-pullup-tab.component';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: { direction: Hammer.DIRECTION_VERTICAL },
  };
}

@NgModule({
  declarations: [ IonicPullupComponent, IonicPullupComponentTabComponent ],
  imports: [
  ],
  exports: [ IonicPullupComponent, IonicPullupComponentTabComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ]
})
export class IonicPullupModule { }
