import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartdashboardComponent } from './piechartdashboard.component';

describe('PiechartdashboardComponent', () => {
  let component: PiechartdashboardComponent;
  let fixture: ComponentFixture<PiechartdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiechartdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiechartdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
