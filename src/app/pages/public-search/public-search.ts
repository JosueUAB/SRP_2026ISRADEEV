import { Component, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { Api } from '../../core/services/api';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-public-search',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule,
    ToastModule, ProgressBarModule, ProgressSpinnerModule, TooltipModule,
    RouterModule, AppFloatingConfigurator, SafeUrlPipe
  ],
  providers: [MessageService],
  templateUrl: './public-search.html',
  styleUrl: './public-search.scss',
})
export class PublicSearch {
  private api = inject(Api);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  searchQuery: string = '';
  loading: boolean = false;
  buscando: boolean = false;
  resultado: any = null;
  vistaActual: 'buscador' | 'credencial' = 'buscador';

  // ==========================================
  // MEDIDAS ANTI-FRAUDE (Dificulta la edición)
  // ==========================================

  // 1. Bloquear Clic Derecho
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  // 2. Bloquear F12, Ctrl+Shift+I, Ctrl+U (Ver código fuente)
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && event.key === 'I') ||
      (event.ctrlKey && event.shiftKey && event.key === 'J') ||
      (event.ctrlKey && event.key === 'U') ||
      (event.ctrlKey && event.key === 'S')
    ) {
      event.preventDefault();
      this.messageService.add({ severity: 'warn', summary: 'Acción no permitida', detail: 'Por motivos de seguridad, esta acción está deshabilitada.', life: 3000 });
    }
  }

  // ==========================================

  buscar(query: string) {
    if (!query || query.trim().length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Por favor, ingrese un número de cédula válido.', life: 3000 });
      return;
    }

    this.loading = true;
    this.buscando = true;

    this.api.buscarPorCedula(query.trim()).subscribe({
      next: (response) => {
        let res = response;
        if (typeof response === 'string') {
          try { res = JSON.parse(response); } catch(e) {}
        }

        if (res && res.status === 'success' && res.data && res.data.length > 0) {
          this.resultado = res.data[0];
          this.vistaActual = 'credencial';
        } else {
          this.messageService.add({ severity: 'info', summary: 'No encontrado', detail: `No hay registros activos para la cédula ${query}`, life: 4000 });
        }
        this.finalizarBusqueda();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error de Conexión', detail: 'Problema al conectar con el servidor. Inténtelo más tarde.', life: 5000 });
        this.finalizarBusqueda();
      }
    });
  }

  private finalizarBusqueda() {
    this.loading = false;
    this.buscando = false;
    this.cdr.markForCheck();
  }

  nuevaConsulta() {
    this.resultado = null;
    this.searchQuery = '';
    this.vistaActual = 'buscador';
  }
}
