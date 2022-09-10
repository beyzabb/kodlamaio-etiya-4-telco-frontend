import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBillingAccountUpdateComponent } from './customer-billing-account-update.component';

describe('CustomerBillingAccountUpdateComponent', () => {
  let component: CustomerBillingAccountUpdateComponent;
  let fixture: ComponentFixture<CustomerBillingAccountUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBillingAccountUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBillingAccountUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
