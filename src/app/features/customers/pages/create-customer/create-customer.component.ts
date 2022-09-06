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

@Component({
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  profileForm!: FormGroup;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private router: Router
  ) {
    this.createCustomerModel$ = this.customerService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.createFormUpdateCustomer();
    });
  }

  createFormUpdateCustomer() {
    this.profileForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        birthDate: ['', [Validators.required]],
        gender: ['', Validators.required],
        fatherName: [''],
        motherName: [''],
        nationalityId: ['', Validators.required],
      },

      { validator: this.ageCheck('birthDate') }
    );
  }
  goNextPage() {
    this.customerService.setDemographicInfoToStore(this.profileForm.value);
    this.router.navigateByUrl('/dashboard/customers/list-address-info');
  }
  getAge(date: string): number {
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
      console.log(age, 'birthdate', birthDate);
    }
    return age;
  }
  ageCheck(controlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);

      if (control?.errors && !control.errors['under18']) {
        return null;
      }
      if (this.getAge(control?.value) <= 18) {
        return { under18: true };
      } else {
        return null;
      }
    };
  }
}
