import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordResponse } from '../../models/PasswordRequest';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  private _router = inject(Router)
  private _route = inject(ActivatedRoute)
  private _apiService = inject(ApiService)
  public formBuilder = inject(FormBuilder)
  toastSvc = inject(ToastrService)

  public token: string | null = ''

  public titlePostPassReset = "Actualización de contraseña éxitoso"
  public subtitlePostPassReset = "Es hora de que inicies sesión con tu nueva contraseñ"
  public redirectTo = ""

  public formResetPassword: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  resetPassword() {
    if (this.formResetPassword.invalid) return
    const password = this.formResetPassword.value.password
    console.log("🚀 ~ ResetPasswordRequestComponent ~ sendToken ~ email:", password)
    this.token = this._route.snapshot.queryParamMap.get('token');
    console.log(this.token)
    const parameters: PasswordResponse = {
      token: this.token,
      newPassword: this.formResetPassword.value.password
    }
    this._apiService.resetPassword(parameters).subscribe({
      next: (response: string) => {
        console.log("response", response)
        this.toastSvc.success("Contraseña actualizada correctamente")
        //alert(response)
        this._router.navigate(["request-completed"], { state: { title: this.titlePostPassReset, subtitle: this.subtitlePostPassReset, redirect: this.redirectTo } })
      },
      error: (err) => {
        this.toastSvc.error("Ocurrió un error. Intente de nuevo más tarde")
        console.log("Error", err)
      },
    })

  }

  hasError(field: string, typeError: string) {
    return this.formResetPassword.get(field)?.hasError(typeError) && this.formResetPassword.get(field)?.touched
  }
}
