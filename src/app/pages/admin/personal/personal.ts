import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import Swal from 'sweetalert2';
import { Api } from '../../../core/services/api';
import { PersonalForm } from './personal-form/personal-form';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, DialogModule, ButtonModule,
    InputTextModule, ToolbarModule, TagModule, SelectModule, IconFieldModule,
    InputIconModule, FileUploadModule, TooltipModule, PersonalForm, SafeUrlPipe
  ],
  templateUrl: './personal.html',
  styleUrl: './personal.scss',
})
export class Personal implements OnInit {
  private api = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  personalList: any[] = [];
  loading: boolean = true;

  // ¡El campo mágico "nombreCompleto" ahora es el principal motor de búsqueda!
  globalFilterFields: string[] = ['nombreCompleto', 'cedula', 'departamento', 'municipio', 'cargo', 'brigada', 'coordinador'];

  personalDialog: boolean = false;
  detailsDialog: boolean = false;
  photoDialog: boolean = false;

  selectedPersonal: any = null;

  selectedPhotoFile: File | null = null;
  photoPreview: string | null = null;
  uploadingPhoto: boolean = false;
  importando: boolean = false;

  // Filtros dinámicos
  coordinadoresOpciones: any[] = [];
  brigadasOpciones: any[] = [];

  ngOnInit() {
    this.fetchPersonal();
  }

  fetchPersonal() {
    this.loading = true;
    this.api.obtenerTodos().subscribe({
      next: (resText) => {
        this.loading = false;
        let res: any = {};
        try { res = typeof resText === 'string' ? JSON.parse(resText) : resText; } catch(e) {}

        if (res && res.status === 'success') {
          // Fusionamos Nombres y Apellidos aquí para el buscador y la tabla
          this.personalList = (res.data || []).map((p: any) => ({
            ...p,
            nombreCompleto: `${p.nombres || ''} ${p.apellidos || ''}`.trim()
          }));

          // Llenar opciones de filtros
          const coords = [...new Set(this.personalList.map(p => p.coordinador).filter(c => c))];
          this.coordinadoresOpciones = coords.map(c => ({ label: c, value: c }));

          const brigadas = [...new Set(this.personalList.map(p => p.brigada).filter(b => b))];
          this.brigadasOpciones = brigadas.map(b => ({ label: b, value: b }));

        } else if (Array.isArray(res)) {
          this.personalList = res.map((p: any) => ({
            ...p,
            nombreCompleto: `${p.nombres || ''} ${p.apellidos || ''}`.trim()
          }));
        } else {
          this.personalList = [];
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar la lista de personal.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  // --- LÓGICA DE IMPORTACIÓN CSV ---
  triggerImport() {
    document.getElementById('fileImport')?.click();
  }

  onFileImport(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.importando = true;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      const data = this.csvToJson(text);

      if (data.length > 0) {
        this.api.importarCSV(data).subscribe({
          next: (resText) => {
           this.importando = false;
           let response: any = {};
           try { response = typeof resText === 'string' ? JSON.parse(resText) : resText; } catch(err) {}
           if(response.status === 'success'){
             Swal.fire('Éxito', response.mensaje, 'success');
             this.fetchPersonal();
           } else {
             Swal.fire('Error', response.mensaje || 'Error desconocido', 'error');
           }
           this.cdr.markForCheck();
          },
          error: (err) => {
           this.importando = false;
           Swal.fire('Error', 'Error de conexión al importar', 'error');
           this.cdr.markForCheck();
          }
        });
      } else {
        this.importando = false;
        Swal.fire('Advertencia', 'El archivo CSV está vacío o mal formateado', 'warning');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  csvToJson(csv: string) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        if(headers[j]) {
          let val = currentline[j] ? currentline[j].trim() : '';
          val = val.replace(/^"|"$/g, '');
          obj[headers[j]] = val;
        }
      }
      result.push(obj);
    }
    return result;
  }

  getSeverity(estado: string) {
      if (!estado) return 'info';
      switch (estado.toLowerCase()) {
          case 'activo': return 'success';
          case 'pendiente': return 'warn';
          case 'inactivo': return 'danger';
          default: return 'info';
      }
  }



  openNew() {
    this.selectedPersonal = {};
    this.personalDialog = true;
  }

  editPersonal(personal: any) {
    this.selectedPersonal = { ...personal };
    this.personalDialog = true;
  }

  viewDetails(personal: any) {
    this.selectedPersonal = { ...personal };
    this.detailsDialog = true;
  }

  quickUploadPhoto(personal: any) {
    this.selectedPersonal = { ...personal };
    this.selectedPhotoFile = null;
    this.photoPreview = null;
    this.photoDialog = true;
  }

  onQuickPhotoSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadQuickPhoto() {
    if (!this.selectedPhotoFile || !this.photoPreview) {
      Swal.fire('Atención', 'Seleccione una foto primero', 'warning');
      return;
    }
    if (!this.selectedPersonal.cedula) {
      Swal.fire('Error', 'El operador no tiene cédula asignada', 'error');
      return;
    }

    this.uploadingPhoto = true;
    const base64Data = this.photoPreview.split(',')[1];

    this.api.subirFoto(base64Data, this.selectedPersonal.cedula).subscribe({
      next: (resText) => {
        this.uploadingPhoto = false;
        let res: any = {};
        try { res = typeof resText === 'string' ? JSON.parse(resText) : resText; } catch(e) {}

        if (res && res.status === 'success') {
          Swal.fire('Éxito', 'Foto subida y actualizada correctamente', 'success');
          this.photoDialog = false;
          this.fetchPersonal();
        } else {
          Swal.fire('Error', 'No se pudo subir la foto', 'error');
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.uploadingPhoto = false;
        Swal.fire('Error', 'Ocurrió un problema al subir la foto', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  hideDialog() {
    this.personalDialog = false;
    this.detailsDialog = false;
    this.photoDialog = false;
    this.selectedPersonal = null;
  }

  onSave(personalData: any) {
    this.personalDialog = false;
    this.fetchPersonal();
  }
// Método Bonus para colorear el Cargo dependiendo si es Urbano o Móvil
  getCargoSeverity(cargo: string) {
      if (!cargo) return 'secondary';
      const c = cargo.toLowerCase();
      if (c.includes('movil') || c.includes('móvil')) return 'warn'; // <--- Corregido a 'warn'
      if (c.includes('urbano')) return 'info';
      return 'secondary';
  }
}
