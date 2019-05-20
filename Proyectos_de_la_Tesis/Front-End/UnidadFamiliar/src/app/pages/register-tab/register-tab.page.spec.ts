import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTabPage } from './register-tab.page';

describe('RegisterTabPage', () => {
  let component: RegisterTabPage;
  let fixture: ComponentFixture<RegisterTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
