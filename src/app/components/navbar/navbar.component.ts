import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private _router = inject(Router)
  private _apiService = inject(ApiService)

  public openDropMenu: boolean = false

  changeDrop() {
    this.openDropMenu = !this.openDropMenu;
  }

  goToOrderForm() {
    this._router.navigate(["generate-order"])
  }

  logout() {
    console.log("logout")
    this._apiService.logout().subscribe({
      next: (value) => {
        console.log(value)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        this._router.navigate([""])
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
}
