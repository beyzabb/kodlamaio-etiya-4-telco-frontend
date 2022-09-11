import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { City } from '../../../models/city';
import { CustomersService } from '../../../services/customer/customers.service';
import { Address } from '../../../models/address';
import { Customer } from '../../../models/customer';
import { BillingAccount } from '../../../models/billingAccount';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './customer-billing-account.component.html',
  styleUrls: ['./customer-billing-account.component.css'],
})
export class CustomerBillingAccountComponent implements OnInit {
  accountForm!: FormGroup;
  addressForm!: FormGroup;
  isShown: boolean = false;
  isValid: boolean = false;
  isEmpty: boolean = false;
  cityList!: City[];
  selectedCustomerId!: number;
  selectedAddressId!: number;
  addressToUpdate!: any;
  addressToDelete!: Address;
  customer!: Customer;
  billingAccount!: BillingAccount;
  billingAdress: Address[] = [];
  newAddress!: Address[];

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private customerService: CustomersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getCityList();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.messageService.clear();
        if (this.isShown == true) {
          this.isShown = false;
        } else {
          this.router.navigateByUrl(
            '/dashboard/customers/customer-billing-account-detail/' +
              this.selectedCustomerId
          );
        }
      }
    });
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = Number(params['id']);
      this.getCustomerById();
    });
  }

  getCustomerById() {
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
          this.createAddressForm();
          this.createAccountForm();
        });
    }
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      accountName: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      id: [Math.floor(Math.random() * 1000)],
      city: [
        this.addressToUpdate?.city?.id || 0,
        [Validators.required, Validators.min(1)],
      ],
      street: [this.addressToUpdate?.street || '', Validators.required],
      flatNumber: [this.addressToUpdate?.flatNumber || '', Validators.required],
      description: [
        this.addressToUpdate?.description || '',
        Validators.required,
      ],
    });
  }

  addNewAddressBtn() {
    this.isShown = true;
    this.addressForm.value.clear();
    this.createAddressForm();
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  addAddress() {
    if (this.addressForm.valid) {
      this.isValid = false;
      const addressToAdd: Address = {
        ...this.addressForm.value,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city
        ),
      };
      this.billingAdress.push(addressToAdd);
      console.log(this.billingAdress);

      this.isShown = false;
    } else {
      this.isValid = true;
      this.isEmpty = false;
    }
  }

  add() {
    if (this.accountForm.valid) {
      this.isEmpty = false;
      this.billingAccount = this.accountForm.value;
      this.billingAccount.addresses = this.billingAdress;
      this.billingAccount.status = 'active';
      this.billingAccount.accountNumber = String(
        Math.floor(Math.random() * 1000000000)
      );
      console.log(this.billingAccount);
      this.customerService
        .addBillingAccount(this.billingAccount, this.customer)
        .subscribe();
      this.router.navigateByUrl(
        '/dashboard/customers/customer-billing-account-detail/' +
          this.selectedCustomerId
      );
    } else {
      this.isEmpty = true;
      this.isValid = false;
    }
  }

  cancelChanges() {
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Your changes could not be saved. Are you sure?',
    });
  }
  goToPreviousPage() {
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Your changes could not be saved. Are you sure?',
    });
  }
  selectAddressId(addressId: number) {
    this.isShown = true;
    this.selectedAddressId = addressId;
    this.addressToUpdate = this.billingAdress.find(
      (bill) => bill.id == addressId
    );
    console.warn(this.addressToUpdate);
    this.createAddressForm();
  }

  saveAddress() {
    if (this.selectedAddressId) {
      this.updateAddress();
    } else {
      this.addAddress();
    }
  }

  updateAddress() {
    const addressIndex = this.billingAdress.findIndex((b) => {
      return b.id == this.addressToUpdate.id;
    });

    const addressToUpdate: Address = {
      ...this.addressForm.value,
      id: this.selectedAddressId,
      city: this.cityList.find(
        (city) => city.id == this.addressForm.value.city
      ),
    };

    console.warn(this.addressForm.value);
    this.billingAdress![addressIndex] = addressToUpdate;
    this.isShown = false;
  }

  removePopup(address: Address) {
    // if (this.billingAdress && this.billingAdress?.length <= 1) {
    //   this.displayBasic = true;
    //   return;
    // }
    this.addressToDelete = this.newAddress.find((adr) => {
      return adr.id == address.id;
    }) as Address;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure to delete this address?',
    });
  }
  remove() {
    this.billingAdress = this.billingAdress.filter(
      (b) => b.id != this.addressToDelete.id
    );
    this.messageService.clear('c');
  }
}
