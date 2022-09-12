import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { Address } from '../../models/address';
import { City } from '../../models/city';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './add-customer-address.component.html',
  styleUrls: ['./add-customer-address.component.css'],
})
export class AddCustomerAddressComponent implements OnInit {
  addressForm!: FormGroup;
  selectedCustomerId!: number;
  selectedAddressId!: number;
  customer!: Customer;
  addressToUpdate!: Address;
  cityList!: City[];
  isShown: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getCityList();

    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.messageService.clear();
        this.router.navigateByUrl(
          '/dashboard/customers/customer-address/' + this.selectedCustomerId
        );
      }
    });
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = Number(params['id']);
      if (params['addressId'])
        this.selectedAddressId = Number(params['addressId']);

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

          if (
            this.customer.addresses?.find(
              (address) => address.id == this.selectedAddressId
            ) !== undefined
          )
            this.addressToUpdate = this.customer.addresses?.find(
              (address) => address.id == this.selectedAddressId
            ) as Address; // Address | undefined,  as Address -> Address

          this.createAddressForm();
        });
    }
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      city: [this.addressToUpdate?.city.id || '', Validators.required],
      street: [this.addressToUpdate?.street || '', Validators.required],
      flatNumber: [this.addressToUpdate?.flatNumber || '', Validators.required],
      description: [
        this.addressToUpdate?.description || '',
        Validators.required,
      ],
    });
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  add() {
    if (this.addressForm.invalid) {
      this.isShown = true;
    } else {
      this.isShown = false;
      const addressToAdd: Address = {
        ...this.addressForm.value,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city
        ),
      };
      this.customerService.addAddress(addressToAdd, this.customer).subscribe({
        next: (data) => {
          this.messageService.add({
            detail: 'Sucsessfully added',
            severity: 'success',
            summary: 'Add',
            key: 'etiya-custom',
          });
          this.router.navigateByUrl(
            `/dashboard/customers/customer-address/${data.id}`
          );
        },
        error: (err) => {
          this.messageService.add({
            detail: 'Error created',
            severity: 'danger',
            summary: 'Error',
            key: 'etiya-custom',
          });
        },
      });
    }
  }

  save() {
    if (this.addressToUpdate === undefined) this.add();
    else this.update();
  }

  update() {
    if (this.addressForm.valid) {
      this.isShown = false;
      const addressToUpdate: Address = {
        ...this.addressForm.value,
        id: this.selectedAddressId,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city
        ),
      };
      this.customerService
        .updateAddress(addressToUpdate, this.customer)
        .subscribe({
          next: (data) => {
            this.messageService.add({
              detail: 'Sucsessfully added',
              severity: 'success',
              summary: 'Update',
              key: 'etiya-custom',
            });
            this.router.navigateByUrl(
              `/dashboard/customers/customer-address/${data.id}`
            );
          },
          error: (err) => {
            this.messageService.add({
              detail: 'Error created',
              severity: 'danger',
              summary: 'Error',
              key: 'etiya-custom',
            });
          },
        });
    } else {
      this.isShown = true;
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
}
