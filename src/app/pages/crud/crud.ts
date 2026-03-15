import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Api } from '../../core/services/api';

export interface Personal {
    id?: string | number;
    cedula?: string;
    nombres?: string;
    apellidos?: string;
    categoria?: string;
    cargo?: string;
    brigada?: string;
    tipo_operador?: string;
    departamento?: string;
    provincia?: string;
    municipio?: string;
    localidad?: string;
    recinto?: string;
    coordinador?: string;
    estado?: string;
    foto_url?: string;
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule, TableModule, FormsModule, ButtonModule, RippleModule,
        ToastModule, ToolbarModule, RatingModule, InputTextModule, TextareaModule,
        SelectModule, RadioButtonModule, InputNumberModule, DialogModule, TagModule,
        InputIconModule, IconFieldModule, ConfirmDialogModule, ProgressSpinnerModule,
        TooltipModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nuevo Registro" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Eliminar" icon="pi pi-trash" outlined (onClick)="deleteSelectedPersonales()" [disabled]="!selectedPersonales || !selectedPersonales.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Exportar" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                <p-button icon="pi pi-refresh" severity="secondary" outlined class="ml-2" (onClick)="loadDemoData()" [loading]="loading()" pTooltip="Recargar datos" />
            </ng-template>
        </p-toolbar>

        <p-table #dt [value]="personales()" [rows]="10" [columns]="cols" [paginator]="true"
            [globalFilterFields]="['cedula', 'nombres', 'apellidos', 'cargo', 'departamento']"
            [tableStyle]="{ 'min-width': '75rem' }" [(selection)]="selectedPersonales"
            [rowHover]="true" dataKey="cedula" [loading]="loading()"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
            [showCurrentPageReport]="true" [rowsPerPageOptions]="[10, 20, 50]">
            
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gestión de Personal</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                    <th pSortableColumn="cedula" style="min-width: 9rem">Cédula <p-sortIcon field="cedula" /></th>
                    <th pSortableColumn="nombres" style="min-width: 12rem">Nombres <p-sortIcon field="nombres" /></th>
                    <th pSortableColumn="apellidos" style="min-width: 12rem">Apellidos <p-sortIcon field="apellidos" /></th>
                    <th>Foto</th>
                    <th pSortableColumn="cargo" style="min-width: 10rem">Cargo <p-sortIcon field="cargo" /></th>
                    <th pSortableColumn="departamento" style="min-width: 10rem">Dpto. <p-sortIcon field="departamento" /></th>
                    <th pSortableColumn="estado" style="min-width: 8rem">Estado <p-sortIcon field="estado" /></th>
                    <th style="min-width: 14rem">Acciones</th>
                </tr>
            </ng-template>
            <ng-template #body let-persona>
                <tr>
                    <td style="width: 3rem"><p-tableCheckbox [value]="persona" /></td>
                    <td class="font-bold">{{ persona.cedula }}</td>
                    <td>{{ persona.nombres }}</td>
                    <td>{{ persona.apellidos }}</td>
                    <td>
                        <img *ngIf="persona.foto_url" [src]="persona.foto_url" alt="Foto" class="w-12 h-12 rounded-full object-cover border-2 border-surface-200" />
                        <div *ngIf="!persona.foto_url" class="w-12 h-12 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center">
                            <i class="pi pi-user text-surface-400 text-xl"></i>
                        </div>
                    </td>
                    <td>{{ persona.cargo || persona.categoria }}</td>
                    <td>{{ persona.departamento }}</td>
                    <td>
                        <p-tag [value]="persona.estado" [severity]="getSeverity(persona.estado)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-camera" class="mr-2" pTooltip="Subir Foto" tooltipPosition="top" [rounded]="true" [outlined]="true" severity="info" (click)="openFotoDialog(persona)" />
                        <p-button icon="pi pi-pencil" class="mr-2" pTooltip="Editar" tooltipPosition="top" [rounded]="true" [outlined]="true" severity="success" (click)="editPersonal(persona)" />
                        <p-button icon="pi pi-trash" pTooltip="Eliminar" tooltipPosition="top" severity="danger" [rounded]="true" [outlined]="true" (click)="deletePersonal(persona)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- DIÁLOGO DE FORMULARIO -->
        <p-dialog [(visible)]="personalDialog" [style]="{ width: '700px' }" header="Detalles del Personal" [modal]="true" class="p-fluid">
            <ng-template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div class="field col-span-1 md:col-span-2">
                        <label for="cedula" class="font-bold mb-2 block">Cédula</label>
                        <input type="text" pInputText id="cedula" [(ngModel)]="personal.cedula" required autofocus [disabled]="!!personal.foto_url" />
                        <small class="text-red-500" *ngIf="submitted && !personal.cedula">Cédula es requerida.</small>
                    </div>

                    <div class="field">
                        <label for="nombres" class="font-bold mb-2 block">Nombres</label>
                        <input type="text" pInputText id="nombres" [(ngModel)]="personal.nombres" required />
                    </div>
                    <div class="field">
                        <label for="apellidos" class="font-bold mb-2 block">Apellidos</label>
                        <input type="text" pInputText id="apellidos" [(ngModel)]="personal.apellidos" required />
                    </div>

                    <div class="field">
                        <label for="cargo" class="font-bold mb-2 block">Cargo</label>
                        <input type="text" pInputText id="cargo" [(ngModel)]="personal.cargo" />
                    </div>
                    <div class="field">
                        <label for="estado" class="font-bold mb-2 block">Estado</label>
                        <p-select [(ngModel)]="personal.estado" inputId="estado" [options]="statuses" placeholder="Selecciona Estado" appendTo="body" class="w-full" />
                    </div>

                    <div class="field">
                        <label for="departamento" class="font-bold mb-2 block">Departamento</label>
                        <input type="text" pInputText id="departamento" [(ngModel)]="personal.departamento" />
                    </div>
                    <div class="field">
                        <label for="municipio" class="font-bold mb-2 block">Municipio</label>
                        <input type="text" pInputText id="municipio" [(ngModel)]="personal.municipio" />
                    </div>
                    <div class="field md:col-span-2">
                        <label for="recinto" class="font-bold mb-2 block">Recinto / Asignación</label>
                        <input type="text" pInputText id="recinto" [(ngModel)]="personal.recinto" />
                    </div>
                </div>
            </ng-template>
            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Guardar" icon="pi pi-check" (click)="savePersonal()" [loading]="saving" />
            </ng-template>
        </p-dialog>

        <!-- DIÁLOGO PARA SUBIR SOLO FOTO -->
        <p-dialog [(visible)]="fotoDialog" [style]="{ width: '450px' }" header="Subir Foto Oficial" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-4 items-center p-4">
                    <p class="text-center font-bold text-xl uppercase">{{personal?.nombres}} {{personal?.apellidos}}</p>
                    <p class="text-sm font-bold text-yellow-600 mb-2">C.I.: {{personal?.cedula}}</p>
                    
                    <div class="w-56 h-56 border-4 border-dashed border-surface-300 dark:border-surface-600 rounded-[2rem] flex items-center justify-center overflow-hidden mb-4 relative hover:border-yellow-400 transition-colors bg-surface-50 dark:bg-surface-900 shadow-inner">
                        <img *ngIf="fotoPreview" [src]="fotoPreview" class="w-full h-full object-cover" />
                        <i *ngIf="!fotoPreview" class="pi pi-camera text-6xl text-surface-300 dark:text-surface-600"></i>
                    </div>

                    <div class="w-full">
                        <input type="file" id="foto-input" accept="image/jpeg, image/png, image/webp" class="hidden" (change)="onFileSelected($event)" />
                        <label for="foto-input" class="w-full cursor-pointer bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-surface-200 dark:border-surface-700 text-sm">
                            <i class="pi pi-image text-lg"></i> Seleccionar Imagen desde dispositivo
                        </label>
                        <p class="text-[10px] text-center text-surface-500 mt-2">Solo JPG o PNG. Tamaño máximo recomendado: 2MB.</p>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="w-full flex gap-2">
                    <p-button label="Descartar" icon="pi pi-times" text (click)="fotoDialog = false" class="w-full" styleClass="w-full" />
                    <p-button label="Subir a Drive" icon="pi pi-cloud-upload" [loading]="subiendoFoto" (click)="guardarFoto()" class="w-full" styleClass="w-full" />
                </div>
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService]
})
export class Crud implements OnInit {
    private api = inject(Api);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    personalDialog: boolean = false;
    fotoDialog: boolean = false;
    
    personales = signal<Personal[]>([]);
    selectedPersonales!: Personal[] | null;
    
    personal!: Personal;
    submitted: boolean = false;
    loading = signal(false);
    saving = false;
    subiendoFoto = false;

    statuses: string[] = ['Activo', 'Inactivo', 'Pendiente'];
    fotoPreview: string | ArrayBuffer | null = null;
    fotoFile: File | null = null;

    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor() {}

    ngOnInit() {
        this.cols = [
            { field: 'cedula', header: 'Cédula', customExportHeader: 'CI' },
            { field: 'nombres', header: 'Nombres' },
            { field: 'apellidos', header: 'Apellidos' },
            { field: 'cargo', header: 'Cargo' },
            { field: 'departamento', header: 'Departamento' },
            { field: 'estado', header: 'Estado' }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
        this.loadDemoData();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    loadDemoData() {
        this.loading.set(true);
        this.api.obtenerTodos().subscribe({
            next: (response) => {
                let res = response;
                if (typeof response === 'string') {
                    try { res = JSON.parse(response); } catch(e) {}
                }
                
                if (res && res.status === 'success') {
                    this.personales.set(res.data);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontraron datos.' });
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error de Red', detail: 'No se pudo conectar al servidor.' });
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.personal = {};
        this.submitted = false;
        this.personalDialog = true;
    }

    editPersonal(persona: Personal) {
        this.personal = { ...persona };
        this.personalDialog = true;
    }

    deleteSelectedPersonales() {
        this.confirmationService.confirm({
            message: '¿Estás seguro que deseas eliminar el personal seleccionado?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.personales.set(this.personales().filter((val) => !this.selectedPersonales?.includes(val)));
                this.selectedPersonales = null;
                this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registros eliminados (Solo vista)', life: 3000 });
            }
        });
    }

    deletePersonal(persona: Personal) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar a ' + persona.nombres + ' ' + persona.apellidos + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.api.eliminarPersonal(persona.cedula || '').subscribe({
                    next: () => {
                        this.personales.set(this.personales().filter((val) => val.cedula !== persona.cedula));
                        this.personal = {};
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro Eliminado', life: 3000 });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.personalDialog = false;
        this.submitted = false;
    }

    savePersonal() {
        this.submitted = true;
        
        if (this.personal.cedula?.trim()) {
            this.saving = true;
            
            // Si ya existe (tiene foto_url o existe en la lista), actualizamos
            const existe = this.personales().some(p => p.cedula === this.personal.cedula);

            if (existe) {
                this.api.actualizarPersonal(this.personal).subscribe({
                    next: (res) => {
                        let tempPersonales = [...this.personales()];
                        const index = tempPersonales.findIndex(p => p.cedula === this.personal.cedula);
                        if (index !== -1) {
                            tempPersonales[index] = this.personal;
                            this.personales.set(tempPersonales);
                        }
                        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Registro guardado' });
                        this.personalDialog = false;
                        this.personal = {};
                        this.saving = false;
                    },
                    error: () => this.saving = false
                });
            } else {
                this.api.crearPersonal(this.personal).subscribe({
                    next: (res) => {
                        this.personales.set([this.personal, ...this.personales()]);
                        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Registro Creado' });
                        this.personalDialog = false;
                        this.personal = {};
                        this.saving = false;
                    },
                    error: () => this.saving = false
                });
            }
        }
    }

    // --- MANEJO DE FOTO ---
    openFotoDialog(persona: Personal) {
        this.personal = { ...persona };
        this.fotoPreview = persona.foto_url || null;
        this.fotoFile = null;
        this.fotoDialog = true;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.fotoFile = file;
            const reader = new FileReader();
            reader.onload = e => this.fotoPreview = reader.result;
            reader.readAsDataURL(file);
        }
    }

    guardarFoto() {
        if (!this.fotoFile || !this.fotoPreview) {
            this.messageService.add({severity:'warn', summary:'Atención', detail:'Seleccione una foto primero.'});
            return;
        }

        this.subiendoFoto = true;
        const base64String = this.fotoPreview as string;

        this.api.subirFoto(base64String, this.personal.cedula!).subscribe({
            next: (response) => {
                let res = response;
                if (typeof response === 'string') {
                    try { res = JSON.parse(response); } catch(e) {}
                }

                if (res && res.status === 'success') {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Foto subida correctamente' });
                    this.fotoDialog = false;
                    this.loadDemoData(); 
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la foto' });
                }
                this.subiendoFoto = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Problema al subir la foto' });
                this.subiendoFoto = false;
            }
        });
    }

    getSeverity(status: string) {
        if (!status) return 'info';
        switch (status.toUpperCase()) {
            case 'ACTIVO': return 'success';
            case 'INACTIVO': return 'danger';
            case 'PENDIENTE': return 'warn';
            default: return 'info';
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }
}
