import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSitePage } from './safe-site.page';

describe('SafeSitePage', () => {
  let component: SafeSitePage;
  let fixture: ComponentFixture<SafeSitePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeSitePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
