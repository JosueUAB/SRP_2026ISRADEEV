import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
 
  /**
   * Endpoint GET /exec
   * Búsqueda pública de credenciales.
   * Parámetros aceptados: ?cedula=XYZ o ?departamento=XYZ
   */
  obtenerTodos(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  buscarPorCedula(cedula: string): Observable<any> {
    // CAMBIA EL & POR ?
    const url = `${this.baseUrl}?cedula=${cedula}`; 
    return this.http.get(url);
  }

  buscarPorDepartamento(departamento: string): Observable<any> {
    // CAMBIA EL & POR ?
    const url = `${this.baseUrl}?departamento=${departamento}`; 
    return this.http.get(url);
  }

  /**
   * Acción genérica POST para interactuar con la base de datos a través de GAS.
   * La acción la define 'action' en el payload.
   */
  private postAction(action: string, data: any): Observable<any> {
    const payload = JSON.stringify({ action, ...data });
    return this.http.post(this.baseUrl, payload, { 
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      responseType: 'text'
    });
  }

  crearPersonal(personalData: any): Observable<any> {
    return this.postAction('crear_personal', personalData);
  }

  actualizarPersonal(personalData: any): Observable<any> {
    return this.postAction('actualizar_personal', personalData);
  }

  eliminarPersonal(id: string | number): Observable<any> {
    return this.postAction('eliminar_personal', { id });
  }

  importarCSV(registros: any[]): Observable<any> {
    return this.postAction('importar_csv', { registros });
  }

  subirFoto(base64Image: string, cedulaOperador: string): Observable<any> {
    
    // Si la imagen trae la cabecera "data:image/jpeg;base64,", se la quitamos
    let base64Limpio = base64Image;
    if (base64Image.includes(',')) {
      base64Limpio = base64Image.split(',')[1];
    }

    return this.postAction('subir_foto', { 
      base64: base64Limpio, // Ahora sí coincide con Apps Script
      cedula: cedulaOperador, // Ahora sí coincide con Apps Script
      mimeType: 'image/jpeg' // Forzamos el tipo
    });
  }
}
