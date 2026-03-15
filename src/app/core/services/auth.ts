import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly SESSION_KEY = 'auth_session';

  login(usuario: string, password: string): Observable<any> {
    // 1. Limpiamos espacios y forzamos a que sean TEXTO (String)
    const usr = String(usuario).trim();
    const pwd = String(password).trim();
    
    const payload = JSON.stringify({ action: 'login', usuario: usr, password: pwd });
    
    return this.http.post(this.baseUrl, payload, {
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      responseType: 'text'
    }).pipe(
      // 2. Usamos MAP para transformar el texto que manda Google a un JSON real
      map((resText: string) => {
        try {
          return JSON.parse(resText);
        } catch(e) {
          return { status: 'error', mensaje: 'Error al parsear la respuesta' };
        }
      }),
      // 3. Ahora TAP recibe el objeto JSON real y guarda la sesión si hay éxito
      tap((res: any) => {
        if (res && res.status === 'success') {
          this.setSession(res.token || { usuario: usr });
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  }

  getSession(): any {
    const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  }

  private setSession(data: any): void {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  }
}