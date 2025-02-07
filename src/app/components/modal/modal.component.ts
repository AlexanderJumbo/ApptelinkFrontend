import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() isModalOpen = false;
  @Output() closeModalEvent = new EventEmitter<void>()

  @Input() product: any = {}
  @Input() isEdit: boolean = false;
  @Output() save = new EventEmitter<any>()


  public formBuilder = inject(FormBuilder);
  public formProduct: FormGroup = this.formBuilder.group({
    idProduct: [''],
    nameProduct: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    stock: ['', [Validators.required, Validators.min(1)]],
  })

  ngOnInit(): void {
    console.log(this.product)
    this.updateForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['product']?.currentValue)
    if (changes['product']) {
      this.updateForm()
    }
  }

  private updateForm(): void {

    if (!this.isEdit) {
      this.formProduct.reset({
        idProduct: 0,
        nameProduct: '',
        description: '',
        price: 0,
        stock: 0,
      });
    } else {
      this.formProduct.setValue({
        idProduct: this.product.productId,
        nameProduct: this.product.productName || '',
        description: this.product.productDesc || '',
        price: this.product.productPrice || 0,
        stock: this.product.quantity || 0,
      });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  onSubmit() {
    const product = {
      productId: this.formProduct.value.idProduct,
      nameProduct: this.formProduct.value.nameProduct,
      description: this.formProduct.value.description,
      price: this.formProduct.value.price,
      stock: this.formProduct.value.stock,
      status: true
    }

    this.save.emit(product)
    this.closeModal();
  }

  hasError(field: string, typeError: string) {
    return this.formProduct.get(field)?.hasError(typeError) && this.formProduct.get(field)?.touched
  }

}
