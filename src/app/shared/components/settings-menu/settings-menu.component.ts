import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth/auth.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css'],
})
export class SettingsMenuComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
  logOut() {
    this.authService.logOut();
  }
}
