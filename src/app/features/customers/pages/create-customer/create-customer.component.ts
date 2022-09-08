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
    this.profileForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [
        this.customer.birthDate,
        [Validators.required],

        // { validator: this.ageCheck('birthDate') },
      ],
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
      this.getCustomers(this.profileForm.value.nationalityId);
    } else {
      this.isShow = true;
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

  // getAge(date: string): number {
  //   let today = new Date();
  //   let birthDate = new Date(date);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   let month = today.getMonth() - birthDate.getMonth();
  //   if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //     console.log(age, 'birthdate', birthDate);
  //   }
  //   return age;
  // }
  // ageCheck(controlName: string): ValidatorFn {
  //   return (controls: AbstractControl) => {
  //     const control = controls.get(controlName);

  //     if (control?.errors && !control.errors['under18']) {
  //       return null;
  //     }
  //     if (this.getAge(control?.value) <= 18) {
  //       return { under18: true };
  //     } else {
  //       return null;
  //     }
  //   };
  // }
}
