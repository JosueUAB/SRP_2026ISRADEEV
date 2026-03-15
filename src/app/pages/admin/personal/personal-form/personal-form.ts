import { Component, EventEmitter, Input, OnInit, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { Api } from '../../../../core/services/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, SelectModule, FileUploadModule],
  templateUrl: './personal-form.html',
  styleUrl: './personal-form.scss',
})
export class PersonalForm implements OnInit {
  @Input() personal: any = {};
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  private api = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  loading: boolean = false;

  // Opciones de los menús desplegables
  estados = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Inactivo', value: 'Inactivo' }
  ];

  categorias = [
    { label: 'Urbano', value: 'URBANO' },
    { label: 'Móvil', value: 'MOVIL' },
    { label: 'Rural', value: 'Rural' }
  ];

  tiposOperador = [
    { label: 'Urbano', value: 'Urbano' },
    { label: 'Urbano - Rural', value: 'Urbano - Rural' },
    { label: 'Móvil', value: 'Móvil' }
  ];

  selectedFile: File | null = null;
  imagenPreview: string | null = null;

  ngOnInit() {
    // Valores por defecto si es un registro nuevo
    if (!this.personal.estado) {
      this.personal.estado = 'Pendiente';
    }
    if (!this.personal.departamento) {
      this.personal.departamento = 'Oruro'; // Asumiendo Oruro por defecto según tus datos
    }

    // Cargar foto si ya existe
    if (this.personal.foto_url) {
      this.imagenPreview = this.personal.foto_url;
    }
  }

  onFileSelected(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    // Validaciones obligatorias
    if (!this.personal.cedula || !this.personal.nombres || !this.personal.apellidos) {
      Swal.fire('Atención', 'La cédula, nombres y apellidos son obligatorios', 'warning');
      return;
    }

    this.loading = true;

    // Si hay una foto nueva seleccionada, la subimos primero
    if (this.selectedFile && this.imagenPreview && this.imagenPreview.includes('data:image')) {
      const base64Data = this.imagenPreview.split(',')[1];

      this.api.subirFoto(base64Data, this.personal.cedula).subscribe({
        next: (fotoResText) => {
          let fotoRes: any = {};
          try { fotoRes = typeof fotoResText === 'string' ? JSON.parse(fotoResText) : fotoResText; } catch(e) {}

          if (fotoRes && fotoRes.status === 'success') {
            this.personal.foto_url = fotoRes.url;
            this.ejecutarGuardado();
          } else {
            this.loading = false;
            Swal.fire('Error', 'No se pudo subir la foto a Google Drive.', 'error');
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Error', 'Ocurrió un problema de conexión al subir la foto.', 'error');
          this.cdr.markForCheck();
        }
      });
    } else {
      // Si no hay foto nueva, guardamos los datos directamente
      this.ejecutarGuardado();
    }
  }

  private ejecutarGuardado() {
    // Si tiene un ID, significa que estamos editando. Si no, estamos creando.
    const httpRequest = this.personal.id
      ? this.api.actualizarPersonal(this.personal)
      : this.api.crearPersonal(this.personal);

    httpRequest.subscribe({
      next: (resText) => {
        this.loading = false;
        let res: any = {};
        try { res = typeof resText === 'string' ? JSON.parse(resText) : resText; } catch(e) {}

        if (res && res.status === 'success') {
          Swal.fire('Éxito', res.mensaje || 'Registro guardado correctamente', 'success');
          this.onSave.emit(this.personal);
        } else {
          Swal.fire('Error', res.mensaje || 'Error al guardar el registro en la base de datos', 'error');
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Problema de conexión con el servidor al guardar.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  cancelar() {
    this.onCancel.emit();
  }
}
