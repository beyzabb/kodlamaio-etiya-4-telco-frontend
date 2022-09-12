import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from 'src/app/features/campaigns/models/campaign';
import { CampaignsService } from 'src/app/features/campaigns/services/campaigns/campaigns.service';
import { Catalog } from 'src/app/features/catalogs/models/catalog';
import { CatalogsService } from 'src/app/features/catalogs/services/catalogs/catalogs.service';
import { Offer } from 'src/app/features/offers/models/offer';
import { OfferService } from 'src/app/features/offers/services/offer/offer.service';

@Component({
  selector: 'app-offer-selection',
  templateUrl: './offer-selection.component.html',
  styleUrls: ['./offer-selection.component.css'],
})
export class OfferSelectionComponent implements OnInit {
  catalogOffersList!: Offer[];
  campaignOffersList!: Offer[];
  offerList!: Offer[];
  campaignList!: Campaign[];
  catalogList!: Catalog[];
  searchCampaignForm!: FormGroup;
  searchCatalogForm!: FormGroup;
  selectedCustomerId!: number;
  billingAccountId!: number;
  isEmpty: Boolean = true;
  itemsInBasket: boolean = false;

  constructor(
    private offerService: OfferService,
    private catalogService: CatalogsService,
    private campaignService: CampaignsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.offerService.basket$.subscribe((data) => {
      this.itemsInBasket = data.length > 0;
    });
    this.getParams();
    this.getOfferList();
    this.listenBasket();
    this.getCampaignList();
    this.getCatalogList();
    this.createSearchCatalogForm();
    this.createSearchCampaignsForm();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = params['id'];
      if (params['billingAccountId'])
        this.billingAccountId = params['billingAccountId'];
    });
  }

  getOfferList() {
    this.offerService.getList().subscribe((data) => {
      this.catalogOffersList = data.filter(
        (offer) => offer.type.typeName === 'catalog'
      );
      this.campaignOffersList = data.filter(
        (offer) => offer.type.typeName === 'campaign'
      );
    });
  }
  addBasket(offer: Offer) {
    if (this.offerList === undefined) this.offerList = [];
    this.offerList.push(offer);
  }
  saveBasket() {
    this.isEmpty = false;
    this.offerList.forEach((offer) => {
      this.offerService.addOfferToBasketStore(offer);
    });
  }
  isSelected(offer: Offer): boolean {
    if (this.offerList === undefined) return false;
    return Boolean(
      this.offerList.find((offerInList) => offerInList.id === offer.id)
    );
  }
  getOfferCount(offer: Offer): number {
    let count: number = 0;
    this.offerList.forEach((offerInList) => {
      if (offerInList.id === offer.id) count++;
    });
    return count;
  }
  listenBasket() {
    this.offerService.basket$.subscribe((basket) => {
      if (basket === undefined) return;
      this.offerList = [...basket];
      console.log(basket);
    });
  }

  getCampaignList() {
    this.campaignService.getList().subscribe((data) => {
      this.campaignList = data;
    });
  }

  getCatalogList() {
    this.catalogService.getList().subscribe((data) => {
      this.catalogList = data;
    });
  }

  createSearchCampaignsForm() {
    this.searchCampaignForm = this.formBuilder.group({
      selectedId: [''],
      campaignName: [''],
      campaignId: [''],
    });
  }

  searchCampaign() {
    this.campaignService
      .getListByFilter(this.searchCampaignForm.value)
      .subscribe((data) => {
        this.campaignOffersList = data;
      });
  }

  createSearchCatalogForm() {
    this.searchCatalogForm = this.formBuilder.group({
      selectedId: [''],
      prodOfferName: [''],
      prodOfferId: [''],
    });
  }

  searchCatalog() {
    this.catalogService
      .getListByFilter(this.searchCatalogForm.value)
      .subscribe((data) => {
        this.catalogOffersList = data;
      });
  }

  isNumber(event: any): boolean {
    console.log(event.target.value);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }
}
