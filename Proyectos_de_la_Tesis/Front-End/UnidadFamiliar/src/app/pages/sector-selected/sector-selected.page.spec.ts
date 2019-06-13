import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorSelectedPage } from './sector-selected.page';

describe('SectorSelectedPage', () => {
  let component: SectorSelectedPage;
  let fixture: ComponentFixture<SectorSelectedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorSelectedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorSelectedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
