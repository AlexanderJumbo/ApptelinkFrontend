import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-request.component.html',
  styleUrl: './reset-password-request.component.css'
})
export class ResetPasswordRequestComponent {

  private _router = inject(Router)
  private _apiService = inject(ApiService)
  public formBuilder = inject(FormBuilder)
  toastSvc = inject(ToastrService)

  public loading?: boolean = false;
  public titlePostPassRequest = "Correo enviado éxitosamente"
  public subtitlePostPassRequest = "Se ha enviado al correo electrónico que proporcionastes un token de validación. El mismo te llevará a un formulario para que ingreses una nueva contraseña"
  public redirectTo = ""

  public formResetPasswordRequest: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  })

  sendToken() {
    if (this.formResetPasswordRequest.invalid) return
    this.loading = !this.loading
    const email = this.formResetPasswordRequest.value.email
    console.log("🚀 ~ ResetPasswordRequestComponent ~ sendToken ~ email:", email)

    this._apiService.sendTokenResetPassword(email).subscribe({
      next: (response: string) => {
        this.loading = !this.loading
        this.toastSvc.success("Token de verificación enviado al correo ingresado")
        console.log("response", response)
        this._router.navigate(["request-completed"], { state: { title: this.titlePostPassRequest, subtitle: this.subtitlePostPassRequest, redirect: this.redirectTo } })
      },
      error: (err) => {
        this.loading = !this.loading
        this.toastSvc.error("Hubo un error al momento de enviar el correo, intente de nuevo más luego")
        console.log("Error", err)
      },
    })

  }

  hasError(field: string, typeError: string) {
    return this.formResetPasswordRequest.get(field)?.hasError(typeError) && this.formResetPasswordRequest.get(field)?.touched
  }

  goLoginForm() {
    this._router.navigate([""])
  }
}
