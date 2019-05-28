import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSiteSearchTabPage } from './safe-site-search-tab.page';

describe('SafeSiteSearchTabPage', () => {
  let component: SafeSiteSearchTabPage;
  let fixture: ComponentFixture<SafeSiteSearchTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeSiteSearchTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSiteSearchTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
