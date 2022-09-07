import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomersService } from 'src/app/features/customers/services/customer/customers.service';

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.css'],
})
export class SideFilterComponent implements OnInit {
  @Input() filterTitle!: string;
  searchForm!: FormGroup;
  isShow: Boolean = false;
  @Output() filteredData: any = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.createSearchForm();
  }

  createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      nationalityId: [''],
      customerId: [''],
      accountNumber: [
        '',
        [Validators.pattern('[0-9]{}'), Validators.minLength(10)],
      ],
      gsmNumber: [
        '',
        [Validators.pattern('[0-9]{}'), Validators.minLength(11)],
      ],
      firstName: [''],
      lastName: [''],
      orderNumber: [''],
    });
  }

  search() {
    if (this.searchForm.valid) {
      this.isShow = false;
      let nationalityId = parseInt(this.searchForm.value.nationalityId);
      const newSearchForm = {
        ...this.searchForm.value,
        nationalityId: nationalityId,
      };
      this.customersService.getListByFilter(newSearchForm).subscribe((data) => {
        this.filteredData.emit(data);
      });
    } else {
      this.isShow = true;
    }
  }

  clear() {
    this.createSearchForm();
  }
  isNumber(event: any): boolean {
    console.log(event);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }
}
