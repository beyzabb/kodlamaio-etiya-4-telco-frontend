import { Product } from './../../models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillingAccount } from '../../models/billingAccount';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './customer-billing-account-detail.component.html',
  styleUrls: ['./customer-billing-account-detail.component.css'],
})
export class CustomerBillingAccountDetailComponent implements OnInit {
  selectedCustomerId!: number;
  billingAccountList!: BillingAccount[];
  currentPage: number = 0;
  pageSize: number = 5;
  pageNumber!: number;
  productsInPage!: number[];
  constructor(
    private customerService: CustomersService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
  }
  getCustomerById() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = params['id'];
    });
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.billingAccountList = data.billingAccounts || [];
          this.page();
          this.getProductsInPage();
        });
    }
  }

  back() {
    this.currentPage = this.currentPage - 1;
    console.log(this.currentPage);
  }

  next() {
    this.currentPage = this.currentPage + 1;
    console.log(this.currentPage);
  }

  page() {
    this.pageNumber = Math.ceil(this.billingAccountList.length / 5);
  }

  //slice: yeni array oluşturur
  //splice: eski arrayi değiştirir

  getProductsInPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    const productsInPage = this.billingAccountList.slice(start, end);

    console.log(productsInPage);
  }
}
