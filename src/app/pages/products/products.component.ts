import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../components/modal/modal.component";
import { ApiService } from '../../services/api.service';
import { Product, ProductResponse } from '../../models/ProductResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ModalComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  public username: string = 'Geossephy Jumbo'
  private _apiService = inject(ApiService)
  toastSvc = inject(ToastrService)

  isModalOpen = false;
  product: any = { nameProduct: '', description: '', price: 0, stock: 0 }// { nameProduct: 'mm', description: 'aa', price: 10, stock: 10 };
  isEdit: boolean = false

  productsList?: ProductResponse

  totalPages: number = 0;
  pageNumber: number = 0;
  pages: number[] = [];

  menuVisible: number = -1;

  ngOnInit(): void {
    this.getProductsList()
  }

  getProductsList(page: number = 0) {
    this._apiService.getProducts(page).subscribe((data: ProductResponse) => {
      this.productsList = data;
      this.totalPages = data.totalPages
      this.pageNumber = data.number
      this.pageNumber = data.number,
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i)
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.getProductsList(page);
    }
  }


  toggleMenu(row: number): void {
    if (this.menuVisible === row) {
      this.menuVisible = -1;  // Si el menú ya está abierto, lo cerramos
    } else {
      this.menuVisible = row;  // Mostramos el menú en la fila seleccionada
    }

  }

  deleteItem(productId: number) {
    this._apiService.deleteProduct(productId).subscribe((data: Boolean) => {
      this.getProductsList()
      this.toastSvc.success("Producto eliminado")
    });
    this.menuVisible = -1

  }

  openModal(id: number = 0, product: any = { nameProduct: '', description: '', price: 0, stock: 0 }) {
    if (id != 0) {
      this.isModalOpen = true;
      this.isEdit = true;

      this.product = product;
    } else {
      this.isModalOpen = true;
      this.isEdit = false;
      this.product = product
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveProduct(product: any) {
    if (this.isEdit) {
      this._apiService.updateProduct(product).subscribe((response: Product) => {
        console.log("RESPONSE: ", response)
        this.menuVisible = -1
        this.toastSvc.success("Producto actualizado correctamente")
      })
      //this.getProductsList()
    } else {
      console.log("🚀 ~ ProductsComponent ~ saveProduct ~ product:", product)
      this._apiService.createProduct(product).subscribe((response: Product) => {
        console.log("RESPONSE: ", response)
        this.menuVisible = -1
        this.toastSvc.success("Producto agregado correctamente")
      })
    }
    this.getProductsList()
  }

  getInventoryReport() {
    this._apiService.viewInventoryReport().subscribe(response => {
      const url = URL.createObjectURL(response)
      window.open(url, '_blank')
      window.URL.revokeObjectURL(url)

    })
  }

}
