import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordDetailsComponent } from './forget-password-details.component';

describe('ForgetPasswordDetailsComponent', () => {
  let component: ForgetPasswordDetailsComponent;
  let fixture: ComponentFixture<ForgetPasswordDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetPasswordDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPasswordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
