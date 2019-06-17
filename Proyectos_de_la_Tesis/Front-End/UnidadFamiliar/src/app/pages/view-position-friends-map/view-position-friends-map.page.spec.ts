import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPositionFriendsMapPage } from './view-position-friends-map.page';

describe('ViewPositionFriendsMapPage', () => {
  let component: ViewPositionFriendsMapPage;
  let fixture: ComponentFixture<ViewPositionFriendsMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPositionFriendsMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPositionFriendsMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
