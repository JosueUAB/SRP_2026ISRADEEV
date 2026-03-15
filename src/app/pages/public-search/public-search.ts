import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast'; // <-- NUEVO
import { ProgressBarModule } from 'primeng/progressbar'; // <-- NUEVO
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // <-- NUEVO
import { TooltipModule } from 'primeng/tooltip'; // <-- NUEVO
import { MessageService } from 'primeng/api'; // <-- NUEVO
import { RouterModule } from '@angular/router';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { Api } from '../../core/services/api';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-public-search',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, 
    ToastModule, ProgressBarModule, ProgressSpinnerModule, TooltipModule, // <-- AGREGADOS
    RouterModule, AppFloatingConfigurator, SafeUrlPipe
  ],
  providers: [MessageService], // <-- PROVEEDOR PARA EL TOAST
  templateUrl: './public-search.html',
  styleUrl: './public-search.scss',
})
export class PublicSearch {
  private api = inject(Api);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService); // <-- INYECTAR SERVICIO

  searchQuery: string = '';
  loading: boolean = false;
  buscando: boolean = false; // <-- Para la Progress Bar de arriba
  resultado: any = null;
  vistaActual: 'buscador' | 'credencial' = 'buscador';

  buscar(query: string) {
    if (!query || query.trim().length === 0) {
      // Usamos TOAST en lugar de SweetAlert
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Por favor, ingrese un número de cédula válido.', life: 3000 });
      return;
    }

    this.loading = true;
    this.buscando = true; // Activa Progress Bar infinita

    this.api.buscarPorCedula(query.trim()).subscribe({
      next: (response) => {
        // Parse if GAS returned text instead of application/json
        let res = response;
        if (typeof response === 'string') {
          try { res = JSON.parse(response); } catch(e) {}
        }

        if (res && res.status === 'success' && res.data && res.data.length > 0) {
          this.resultado = res.data[0];
          this.vistaActual = 'credencial'; 
        } else {
          // Toast de "No encontrado"
          this.messageService.add({ severity: 'info', summary: 'No encontrado', detail: `No hay registros activos para la cédula ${query}`, life: 4000 });
        }
        this.finalizarBusqueda();
      },
      error: (err) => {
        // Toast de Error
        this.messageService.add({ severity: 'error', summary: 'Error de Conexión', detail: 'Problema al conectar con el servidor. Inténtelo más tarde.', life: 5000 });
        this.finalizarBusqueda();
      }
    });
  }

  private finalizarBusqueda() {
    this.loading = false;
    this.buscando = false; // Desactiva Progress Bar
    this.cdr.markForCheck();
  }

  nuevaConsulta() {
    this.resultado = null;
    this.searchQuery = '';
    this.vistaActual = 'buscador';
  }
}