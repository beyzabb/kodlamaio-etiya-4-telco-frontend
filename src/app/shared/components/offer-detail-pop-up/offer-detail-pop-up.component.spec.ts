import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailPopUpComponent } from './offer-detail-pop-up.component';

describe('OfferDetailPopUpComponent', () => {
  let component: OfferDetailPopUpComponent;
  let fixture: ComponentFixture<OfferDetailPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferDetailPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferDetailPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
