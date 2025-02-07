import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-after-request',
  standalone: true,
  imports: [],
  templateUrl: './after-request.component.html',
  styleUrl: './after-request.component.css'
})
export class AfterRequestComponent {
  private _router = inject(Router)
  title: string = ''
  subtitle: string = ''
  redirect: string = ''


  ngOnInit(): void {
    // Recibiendo los datos pasados a través del state
    const state = history.state;
    if (state) {
      this.title = state.title || 'Solicud Completada';
      this.subtitle = state.subtitle || 'Gracias por realizar esta solicitud.';
      this.redirect = state.redirect || '';
    }
  }

  goHome(redirect: string) {
    console.log("🚀 ~ AfterRequestComponent ~ goHome ~ redirect:", redirect)
    this._router.navigate([`${redirect}`])
  }
}
