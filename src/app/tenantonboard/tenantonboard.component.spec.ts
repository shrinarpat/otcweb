import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantonboardComponent } from './tenantonboard.component';

describe('TenantonboardComponent', () => {
  let component: TenantonboardComponent;
  let fixture: ComponentFixture<TenantonboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantonboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantonboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
