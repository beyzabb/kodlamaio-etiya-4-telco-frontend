import { Product } from './../../../features/customers/models/product';
import { Component, Input, OnInit } from '@angular/core';
import { BillingAccount } from 'src/app/features/customers/models/billingAccount';
import { Offer } from 'src/app/features/offers/models/offer';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-table-accordion',
  templateUrl: './table-accordion.component.html',
  styleUrls: ['./table-accordion.component.css'],
})
export class TableAccordionComponent implements OnInit {
  @Input() billingAccount!: BillingAccount;
  @Input() customerId!: number;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  productDetail(billingAccount: BillingAccount, offer: Offer) {
    if (offer.type.typeName == 'campaign') {
      let prodCampaignOfferId = offer.id.toString();
      let prodCampaignOfferName = offer.name;
      let prodCampaignId = offer.type.id.toString();
      this.messageService.add({
        key: 'product-detail',
        sticky: true,
        detail: prodCampaignOfferId + prodCampaignOfferName + prodCampaignId,
      });
      let custCampaignBillAddress = billingAccount.addresses;
    } else if (offer.type.typeName == 'catalog') {
      let prodCatalogOfferId = offer.id.toString();
      let prodCatalogOfferName = offer.name;
      let custCatalogBillAddress = billingAccount.addresses;
      this.messageService.add({
        key: 'product-detail',
        sticky: true,
        severity: 'warn',
        detail: prodCatalogOfferId + prodCatalogOfferName,
      });
    }
  }
}
