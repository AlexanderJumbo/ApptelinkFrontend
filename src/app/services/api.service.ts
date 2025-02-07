import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { Product, ProductResponse } from '../models/ProductResponse';
import { OrderResponse } from '../models/OrderResponse';
import { UserListResponse } from '../models/UserResponse';
import { RegisterRequest } from '../models/RegisterRequest';
import { RegisterResponse } from '../models/RegisterResponse';
import { PasswordResponse } from '../models/PasswordRequest';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _http = inject(HttpClient)
  private urlBase = 'http://localhost:9191/api'

  public _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _isAdmin = new BehaviorSubject<boolean>(false)

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        this._isAuthenticated.next(true);
      }
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  get isAuthenticated$() {
    return this._isAuthenticated.asObservable();
  }
  get isAdmin$() {
    return this._isAdmin.asObservable();
  }

  isValidateToken(token: string): boolean {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = payload.exp * 1000;
    return Date.now() < expirationDate
  }

  validateToken(): Observable<Boolean> {
    const token = this.getToken();
    return this._http.get<Boolean>(`${this.urlBase}/auth/validate-token?jwt=${token}`)
  }

  isAdmin(): boolean {
    console.log("entró")
    const jwt = this.getToken();
    const payload = JSON.parse(atob(jwt!.split(".")[1]));
    const admin = payload.role
    console.log("🚀 ~ ApiService ~ isAdmin ~ admin:", admin)
    if (admin === "ADMINISTRATOR") {
      this._isAdmin.next(true)
      return true
    }
    this._isAdmin.next(false)
    return false
  }

  authenticate(user: LoginRequest): Observable<LoginResponse> {
    const { username, password } = user
    const data = {
      username,
      password
    }
    this._isAuthenticated.next(true);
    return this._http.post<LoginResponse>(`${this.urlBase}/auth/authenticate`, data)
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this._http.post<RegisterResponse>(`${this.urlBase}/auth/register`, registerData)
  }

  logout(): Observable<any> {
    this._isAuthenticated.next(false)
    return this._http.post(`${this.urlBase}/auth/logout`, {}, { responseType: 'text' as 'json' })
  }

  createProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(`${this.urlBase}/products`, product)
  }

  getProducts(page: number = 0): Observable<ProductResponse> {
    return this._http.get<ProductResponse>(`${this.urlBase}/products/all?f=id&d=asc&n=5&p=${page}`);
  }

  updateProduct(product: Product): Observable<Product> {
    return this._http.put<Product>(`${this.urlBase}/products/update`, product)
  }

  deleteProduct(productId: number): Observable<Boolean> {
    return this._http.put<Boolean>(`${this.urlBase}/products/delete/${productId}`, {})
  }

  getOrders(page: number = 0): Observable<OrderResponse> {
    return this._http.get<OrderResponse>(`${this.urlBase}/orders/all?f=id&d=asc&n=5&p=${page}`);
  }

  viewOrder(orderId: number): Observable<any> {
    return this._http.get(`${this.urlBase}/reports/generate-invoice/${orderId}`, { responseType: 'blob' });
  }

  deleteOrder(orderId: number): Observable<Boolean> {
    return this._http.put<Boolean>(`${this.urlBase}/orders/change-status/${orderId}`, {});
  }

  getClients(): Observable<UserListResponse> {
    return this._http.get<UserListResponse>(`${this.urlBase}/users/type-clients`);
  }

  generateOrder(clientId: number, order: any): Observable<any> {
    const headers = new HttpHeaders({
      //'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json"
    })
    const orderDetails = order.map((product: any) => ({
      product: { id: product.id },
      quantity: product.cantidad
    }));

    const requestPayload = {
      clientId,
      orderDetails: orderDetails
    };

    console.log(JSON.stringify(requestPayload, null, 2));
    const orderRequest = JSON.stringify(requestPayload, null, 2);

    return this._http.post<any>(`${this.urlBase}/orders`, orderRequest, { headers });
  }

  viewInventoryReport(): Observable<any> {
    return this._http.get(`${this.urlBase}/reports/generate-inventory-report`, { responseType: 'blob' });
  }

  sendTokenResetPassword(email: string): Observable<string> {
    return this._http.post<string>(`${this.urlBase}/password/reset-request`, email, { responseType: 'text' as 'json' });
  }
  resetPassword(parameters: PasswordResponse): Observable<string> {
    return this._http.post<string>(`${this.urlBase}/password/update-password`, parameters, {
      responseType: 'text' as 'json'
    });
  }

}
