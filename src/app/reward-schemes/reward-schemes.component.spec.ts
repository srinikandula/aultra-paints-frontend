import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardSchemesComponent } from './reward-schemes.component';

describe('RewardSchemesComponent', () => {
  let component: RewardSchemesComponent;
  let fixture: ComponentFixture<RewardSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardSchemesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
