import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedUsersComponent } from './unverified-users.component';

describe('UnverifiedUsersComponent', () => {
  let component: UnverifiedUsersComponent;
  let fixture: ComponentFixture<UnverifiedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnverifiedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnverifiedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
