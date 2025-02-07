import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RegisterRequest } from '../../models/RegisterRequest';
import { RegisterResponse } from '../../models/RegisterResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private _router = inject(Router)
  private _apiService = inject(ApiService)
  public _formBuilder = inject(FormBuilder)

  toastSvc = inject(ToastrService)

  public titlePostRegister = "Cuenta creadada éxitosamente"
  public subtitlePostRegister = "Gracias por completar el proceso de registro. Es momento de que inicies sesión"
  public redirectTo = ""


  public loading?: boolean = false;

  public formRegister: FormGroup = this._formBuilder.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    dni: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    address: ['', [Validators.required]],
  })


  register() {
    if (this.formRegister.invalid) return

    this.loading = !this.loading

    const newUser: RegisterRequest = {
      firstname: this.formRegister.value.firstname,
      lastname: this.formRegister.value.lastname,
      username: this.formRegister.value.username,
      email: this.formRegister.value.email,
      dni: this.formRegister.value.dni,
      address: this.formRegister.value.address,
      numberPhone: this.formRegister.value.phone,
      password: this.formRegister.value.password
    }

    this._apiService.register(newUser).subscribe({
      next: (response: RegisterResponse) => {
        this.loading = !this.loading
        console.log(response)
        this._router.navigate(["request-completed"], { state: { title: this.titlePostRegister, subtitle: this.subtitlePostRegister, redirect: this.redirectTo } })
      },
      error: (err) => {
        this.loading = !this.loading
        console.log(err.status)
        if (err.status == 400) this.toastSvc.info("Correo ya existe")
        if (err.status == 500) this.toastSvc.info("Contraseña no cumple con lo mínimo requerido")

      },
    })
  }

  hasErrors(field: string, typeError: string) {
    return this.formRegister.get(field)?.hasError(typeError) && this.formRegister.get(field)?.touched
  }

  goLoginForm() {
    this._router.navigate([""])
  }
}
