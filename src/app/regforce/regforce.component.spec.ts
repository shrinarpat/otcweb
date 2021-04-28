import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegforceComponent } from './regforce.component';

describe('RegforceComponent', () => {
  let component: RegforceComponent;
  let fixture: ComponentFixture<RegforceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegforceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
