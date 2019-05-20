import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFriendsPage } from './all-friends.page';

describe('AllFriendsPage', () => {
  let component: AllFriendsPage;
  let fixture: ComponentFixture<AllFriendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFriendsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
