import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  footerState: IonPullUpFooterState;

  constructor() {}

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

}
