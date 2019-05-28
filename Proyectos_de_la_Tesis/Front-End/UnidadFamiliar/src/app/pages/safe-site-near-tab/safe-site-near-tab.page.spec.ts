import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSiteNearTabPage } from './safe-site-near-tab.page';

describe('SafeSiteNearTabPage', () => {
  let component: SafeSiteNearTabPage;
  let fixture: ComponentFixture<SafeSiteNearTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeSiteNearTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSiteNearTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
