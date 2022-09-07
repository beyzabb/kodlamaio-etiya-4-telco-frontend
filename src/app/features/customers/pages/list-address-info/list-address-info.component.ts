import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Address } from '../../models/address';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  selector: 'app-list-address-info',
  templateUrl: './list-address-info.component.html',
  styleUrls: ['./list-address-info.component.css'],
})
export class ListAddressInfoComponent implements OnInit {
  customer!: Customer;
  addressToDelete!: Address;
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.customersService.customerToAddModel$.subscribe((state) => {
      this.customer = state;
    });
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.remove();
      }
    });
  }
  selectAddressId(id: number) {
    let address = this.customer.addresses?.find((c) => c.id == id);
    this.router.navigateByUrl(`update-address-info/${address?.id}`);
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
    this.customersService.removeAdress(this.addressToDelete);
  }
}
