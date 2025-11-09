import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLedgerComponent } from './transaction-ledger.component';

describe('TransactionLedgerComponent', () => {
  let component: TransactionLedgerComponent;
  let fixture: ComponentFixture<TransactionLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionLedgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
