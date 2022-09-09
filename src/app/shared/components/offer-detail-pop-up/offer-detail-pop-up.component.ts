import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-offer-detail-pop-up',
  templateUrl: './offer-detail-pop-up.component.html',
  styleUrls: ['./offer-detail-pop-up.component.css'],
})
export class OfferDetailPopUpComponent implements OnInit {
  displayBasic: boolean = true;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  onConfirm() {
    this.messageService.clear();
  }
}
