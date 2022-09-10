import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  profileForm!: FormGroup;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  isShow: Boolean = false;
  nationalityId: Boolean = false;
  under18: Boolean = false;
  over120: Boolean = false;
  futureDate: Boolean = false;
  today: Date = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.createCustomerModel$ = this.customerService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.createFormUpdateCustomer();
    });
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.messageService.clear();
        this.router.navigateByUrl('/dashboard/customers/customer-dashboard');
      }
    });
  }

  createFormUpdateCustomer() {
    console.log(this.customer.birthDate);
    let bDate = new Date();
    if (this.customer.birthDate) {
      bDate = new Date(this.customer.birthDate);
    }
    this.profileForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [this.customer.birthDate, [Validators.required]],
      gender: [this.customer.gender || '', Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }

  getCustomers(id: number) {
    this.customerService.getList().subscribe((response) => {
      let matchCustomer = response.find((item) => {
        return item.nationalityId == id;
      });
      if (matchCustomer) {
        this.nationalityId = true;
      } else {
        this.nationalityId = false;
        this.customerService.setDemographicInfoToStore(this.profileForm.value);
        this.router.navigateByUrl('/dashboard/customers/list-address-info');
      }
    });
  }

  goNextPage() {
    if (this.profileForm.valid) {
      this.isShow = false;
      let date = new Date(this.profileForm.get('birthDate')?.value);
      let age = this.today.getFullYear() - date.getFullYear();
      console.log(age);
      if (age > 120) {
        this.over120 = true;
        this.under18 = false;
        this.futureDate = false;
        return;
      } else {
        this.over120 = false;
      }
      if (age < 18) {
        this.under18 = true;
        this.futureDate = false;
        this.over120 = false;
        return;
      } else {
        this.under18 = false;
      }

      this.getCustomers(this.profileForm.value.nationalityId);
    } else {
      this.isShow = true;
      let date = new Date(this.profileForm.get('birthDate')?.value);
      let age = this.today.getFullYear() - date.getFullYear();
      console.log(age);
      if (age > 120) {
        this.over120 = true;
        return;
      } else {
        this.over120 = false;
      }
      if (age < 18) {
        this.under18 = true;
        return;
      } else {
        this.under18 = false;
      }
    }
  }

  onDateChange(event: any) {
    let date = new Date(event.target.value);
    if (date.getFullYear() > this.today.getFullYear()) {
      this.profileForm.get('birthDate')?.setValue('');
      this.futureDate = true;
      this.isShow = true;
    } else {
      this.futureDate = false;
      this.isShow = false;
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
