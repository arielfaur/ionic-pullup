import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonicPullupComponent } from './ionic-pullup.component';

describe('IonicPullupComponent', () => {
  let component: IonicPullupComponent;
  let fixture: ComponentFixture<IonicPullupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonicPullupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonicPullupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
