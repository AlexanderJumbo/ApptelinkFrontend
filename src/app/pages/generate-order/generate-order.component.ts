import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Product, ProductResponse } from '../../models/ProductResponse';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserListResponse } from '../../models/UserResponse';
import { Router } from '@angular/router';
import { AfterRequestComponent } from "../../components/after-request/after-request.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generate-order',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, AfterRequestComponent],
  templateUrl: './generate-order.component.html',
  styleUrl: './generate-order.component.css'
})
export class GenerateOrderComponent implements OnInit {
  private _apiService = inject(ApiService)
  private _router = inject(Router)

  toastSvc = inject(ToastrService)

  public titlePostOrder = "Pedido Generado Exitosamente"
  public subtitlePostOrder = "Gracias por realizar tu pedido. El equipo ya está trabajando en ello. Puedes volver al inicio para seguir explorando nuestros productos"
  public redirectTo = "orders"

  public carProducts: Array<{ id: number, name: string, cantidad: number, precio: number }> = []
  public totalToPay: number = 0

  productsList?: ProductResponse
  clientsList?: UserListResponse
  blockButton: boolean = false
  blockButtonIndex: number = -1
  disableDateField: boolean = true

  totalPages: number = 0;
  pageNumber: number = 0;
  pages: number[] = [];


  public formBuilder = inject(FormBuilder);
  public formGenerateOrder: FormGroup = this.formBuilder.group({
    orderDate: [new Date().toLocaleDateString()], //.slice(0, 10) 
    cliente: ['', [Validators.required]],
  })


  ngOnInit(): void {
    this.getProductsList();
    this.getClientsList()
    if (this.disableDateField) this.formGenerateOrder.get('orderDate')?.disable()
  }

  getProductsList(page: number = 0) {
    this._apiService.getProducts(page).subscribe((data: ProductResponse) => {
      this.productsList = data;
      this.totalPages = data.totalPages
      this.pageNumber = data.number
      this.pageNumber = data.number,
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i)
      console.log(data)
    });
  }

  getClientsList() {
    this._apiService.getClients().subscribe((data: UserListResponse) => {
      this.clientsList = data;
      console.log(data)
    });
  }

  addProduct(product: Product, index: number) {
    if (product.quantity < 1) {
      this.blockButton = !this.blockButton
      this.blockButtonIndex = index
    } else {
      console.log(product)
      const existProduct = this.carProducts.find(item => item.id === product.productId);
      if (existProduct) {
        existProduct.cantidad += 1
        existProduct.precio += product.productPrice
        product.quantity -= 1
        this.toastSvc.success("Producto agregado correctamente")
      }
      else {
        product.quantity -= 1
        this.carProducts.push({ id: product.productId, name: product.productName, cantidad: 1, precio: product.productPrice })
        this.toastSvc.success("Producto agregado correctamente")
      }
      this.totalToPay = this.carProducts.reduce((total, item) => total + item.precio, 0)
    }
  }

  removeProduct(productId: number, item: any) {

    const product = this.carProducts.find(item => item.id === productId);
    if (product) {
      if (product.cantidad > 1) {
        product.precio -= product.precio / product.cantidad;
        product.cantidad -= 1;
      } else {
        this.carProducts.splice(this.carProducts.findIndex(item => item.id === productId), 1);
      }

      // Devuelve en una cantidad el producto removido del detalle
      const originalProduct = this.productsList!.content.find(item => item.productId === productId);
      if (originalProduct) {
        originalProduct.quantity += 1;
      }

      this.toastSvc.info("Producto removido correctamente")

      // total a pagar
      this.totalToPay = this.carProducts.reduce((total, item) => total + item.precio, 0);
    }
  }


  generateOrder() {
    this._apiService.generateOrder(this.formGenerateOrder.value.cliente, this.carProducts).subscribe((response: any) => {
      console.log(response)
      this.toastSvc.success("Orden creada con éxito")
      //this._router.navigate(["request-completed"])
      this._router.navigate(["request-completed"], { state: { title: this.titlePostOrder, subtitle: this.subtitlePostOrder, redirect: this.redirectTo } })
    })

  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.getProductsList(page);
    }
  }

}
