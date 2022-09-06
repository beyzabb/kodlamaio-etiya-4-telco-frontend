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
    this.profileForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [
        this.customer.birthDate,
        [Validators.required],

        { validator: this.ageCheck('birthDate') },
      ],
      gender: [this.customer.gender, Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        Validators.required,
        Validators.minLength(11),
      ],
    });
  }

  nextPage() {
    if (this.profileForm.valid) {
      this.customerService.setDemographicInfoToStore(this.profileForm.value);
      this.router.navigateByUrl('/dashboard/customers/list-address-info');
    }
  }

  goNextPage() {}

  IsPropertyInvalid(name: string) {
    return (
      this.profileForm.get(name)?.touched &&
      this.profileForm.get(name)?.hasError('required') &&
      this.profileForm.get(name)?.dirty
    );
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
