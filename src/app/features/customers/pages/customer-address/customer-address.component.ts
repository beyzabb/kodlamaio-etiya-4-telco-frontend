import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Address } from '../../models/address';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css'],
})
export class CustomerAddressComponent implements OnInit {
  selectedCustomerId!: number;
  customerAddress: Address[] = [];
  addressToDelete!: Address;
  customer!: Customer;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.messageService.clear();
        this.remove();
      }
    });
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
          this.customer = data;
          this.customerAddress = [];
          data.addresses?.forEach((adress) => {
            this.customerAddress.push(adress);
          });
        });
    }
  }

  addAddressBySelectedId() {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.selectedCustomerId}/address/add`
    );
  }

  selectAddressId(addressId: number) {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.selectedCustomerId}/address/update/${addressId}`
    );
  }

  removePopup(address: Address) {
    if (this.customer.addresses && this.customer.addresses?.length <= 1) {
      this.messageService.add({
        detail:
          'The address that you want to delete is a default address. Please, change default address then try again.',
        key: 'etiya-warn',
      });
      return;
    }
    this.addressToDelete = address;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Your changes could not be saved. Are you sure?',
    });
  }

  remove() {
    this.customerService
      .removeAddress(this.addressToDelete, this.customer)
      .subscribe((data) => {
        this.getCustomerById();
      });
  }

  handleConfigInput(event: any) {
    this.customer.addresses = this.customer.addresses?.map((adr) => {
      const newAddress = { ...adr, isPrimary: false };
      return newAddress;
    });
    let findAddress = this.customer.addresses?.find((adr) => {
      return adr.id == event.target.value;
    });
    findAddress!.isPrimary = true;
    this.customerService.update(this.customer).subscribe((data) => {
      this.getCustomerById();
    });
  }
}
