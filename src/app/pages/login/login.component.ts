import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginRequest } from '../../models/LoginRequest';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private _router = inject(Router);
  public _formBuilder = inject(FormBuilder);
  private _apiService = inject(ApiService)

  toastSvc = inject(ToastrService)

  public loading?: boolean = false;

  public formLogin: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  })

  ngOnInit(): void {
  }


  authenticate() {
    if (this.formLogin.invalid) return
    this.loading = !this.loading
    const user: LoginRequest = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password
    }

    this._apiService.authenticate(user).subscribe({
      next: (data) => {
        const { jwt, userId } = data
        this.loading = false
        if (jwt != null) {
          this.toastSvc.success("Inicio éxitoso")
          localStorage.setItem('token', jwt)
          localStorage.setItem('user', userId.toString())
          this._router.navigate(['products'])
        }
      },
      error: (err) => {
        this.loading = false
        err.error.code == 400 ? this.toastSvc.error("Cuenta bloqueada o credenciales incorrectas") : this.toastSvc.error(err.error)
        console.log(err.error)
      },
    })

  }

  hasErrors(field: string, typeError: string) {
    return this.formLogin.get(field)?.hasError(typeError) && this.formLogin.get(field)?.touched
  }

  goRegisterForm() {
    this._router.navigate(["register"]);
  }

  goResetPasswordForm() {
    this._router.navigate(["reset-password-request"])
  }

}
