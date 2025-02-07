import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { OrderResponse } from '../../models/OrderResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  private _apiService = inject(ApiService)
  toastSvc = inject(ToastrService)

  ordersList?: OrderResponse

  totalPages: number = 0;
  pageNumber: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.getOrdersList()
  }

  getOrdersList(page: number = 0) {
    this._apiService.getOrders(page).subscribe((data: OrderResponse) => {
      this.ordersList = data;
      this.totalPages = data.totalPages
      this.pageNumber = data.number
      this.pageNumber = data.number,
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i)
    });
  }

  dowloadOrder(orderId: number) {
    this._apiService.viewOrder(orderId).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);

      this.toastSvc.success("Orden descargada correctamente")

      // Crea un elemento de enlace y simula el clic para descargar o abrir el archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura_${orderId}.pdf`;
      link.click();

      // Remover el obj URL después de usarlo
      window.URL.revokeObjectURL(url);
    });
  }

  viewOrder(orderId: number) {
    this._apiService.viewOrder(orderId).subscribe((data: Blob) => {
      this.toastSvc.success("Orden cargada correctamente")
      const url = window.URL.createObjectURL(data);

      window.open(url, '_blank')
      window.URL.revokeObjectURL(url)

    });
  }

  deleteOrder(orderId: number) {
    this._apiService.deleteOrder(orderId).subscribe((response: Boolean) => {
      this.getOrdersList()
      this.toastSvc.success("Orden eliminada correctamente")
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.getOrdersList(page);
    }
  }
}
