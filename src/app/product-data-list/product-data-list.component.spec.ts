import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDataListComponent } from './product-data-list.component';

describe('ProductDataListComponent', () => {
  let component: ProductDataListComponent;
  let fixture: ComponentFixture<ProductDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDataListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
