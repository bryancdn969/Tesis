import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsDetailPage } from './friends-detail.page';

describe('FriendsDetailPage', () => {
  let component: FriendsDetailPage;
  let fixture: ComponentFixture<FriendsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
