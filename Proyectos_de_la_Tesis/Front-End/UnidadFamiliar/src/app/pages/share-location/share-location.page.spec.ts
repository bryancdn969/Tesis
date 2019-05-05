import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLocationPage } from './share-location.page';

describe('ShareLocationPage', () => {
  let component: ShareLocationPage;
  let fixture: ComponentFixture<ShareLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
