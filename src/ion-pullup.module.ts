import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from 'ionic-angular';

import {IonPullUpComponent} from './ion-pullup';
import {IonPullUpTabComponent} from './ion-pullup-tab';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        IonPullUpComponent,
        IonPullUpTabComponent
    ],
    exports: [
        IonPullUpComponent,
        IonPullUpTabComponent
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IonPullUpModule {
}