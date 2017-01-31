/*
ionic-pullup v2 for Ionic/Angular 2
 
Copyright 2016 Ariel Faur (https://github.com/arielfaur)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Renderer, Input } from '@angular/core';
import { Gesture } from 'ionic-angular/gestures/gesture';
import { IonPullUpComponent, IonPullUpFooterState } from './ion-pullup';
var IonPullUpTabComponent = (function () {
    function IonPullUpTabComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    Object.defineProperty(IonPullUpTabComponent.prototype, "IsExpanded", {
        get: function () {
            return this.footer.state == IonPullUpFooterState.Expanded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonPullUpTabComponent.prototype, "IsCollapsed", {
        get: function () {
            return this.footer.state == IonPullUpFooterState.Collapsed;
        },
        enumerable: true,
        configurable: true
    });
    IonPullUpTabComponent.prototype.ngOnInit = function () {
        var _this = this;
        var tabGesture = new Gesture(this.el.nativeElement);
        tabGesture.listen();
        tabGesture.on('tap', function (e) {
            _this.footer && _this.footer.onTap(e);
        });
        tabGesture.on('pan panstart panend', function (e) {
            _this.footer && _this.footer.onDrag(e);
        });
    };
    return IonPullUpTabComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", IonPullUpComponent)
], IonPullUpTabComponent.prototype, "footer", void 0);
IonPullUpTabComponent = __decorate([
    Component({
        selector: 'ion-pullup-tab',
        template: '<ng-content></ng-content>'
    }),
    __metadata("design:paramtypes", [ElementRef, Renderer])
], IonPullUpTabComponent);
export { IonPullUpTabComponent };
//# sourceMappingURL=ion-pullup-tab.js.map