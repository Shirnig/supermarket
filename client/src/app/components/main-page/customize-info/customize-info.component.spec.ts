import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeInfoComponent } from './customize-info.component';

describe('CustomizeInfoComponent', () => {
  let component: CustomizeInfoComponent;
  let fixture: ComponentFixture<CustomizeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
