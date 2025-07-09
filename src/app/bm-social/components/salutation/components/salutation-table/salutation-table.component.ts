import { Component, computed, inject, SimpleChanges, ViewChild } from '@angular/core';
import { SalutationUtils } from '../../utils/salutation.utils';
import { SalutationService } from '../../../../services/salutation.service';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { _, TranslateService } from '@ngx-translate/core';
import { SalutationStateService } from '../../utils/salutation-state.service';
import { Salutation } from '../../../../interfaces/salutation';

@Component({
  selector: 'app-salutation-table',
  templateUrl: './salutation-table.component.html',
  styleUrl: './salutation-table.component.scss'
})
export class SalutationTableComponent {
  private readonly salutationUtils = new SalutationUtils();
  private readonly salutationService = inject(SalutationService);
  visibleModal: boolean = false;
  modalType: 'create' | 'delete' = 'create';
  selectedSalutation: number | null = null;
  salutationName: string = '';
  @ViewChild('salutationModal') salutationModalComponent!: any;
  
  handleTableEvents(event: { type: 'create' | 'delete', data?: any }): void {
    this.modalType = event.type;
    if (event.type === 'delete' && event.data) {
      this.selectedSalutation = event.data;

      this.salutationUtils.getSalutationById(this.selectedSalutation!).subscribe({
        next: (salutation) => {
          this.salutationName = salutation?.salutationText ?? '';
        },
        error: (err) => {
          console.error('No se pudo obtener el saludo:', err);
          this.salutationName = '';
        }
      });
    }
    this.visibleModal = true;
  }

  readonly salutations = computed(() => {
    return this.salutationService.salutations().map(salutation => ({
      id: salutation.salutationId,
      title: salutation.salutationText,
    }));
  });

  salutationColumns: any[] = [];
  salutationDisplayedColumns: any[] = [];
  isChipsVisible = false;
  tableKey: string = 'Salutation'
  dataKeys = ['title'];

  @ViewChild('dt2') dt2!: Table;

  private langSalutationSubscription!: Subscription;

  constructor(
    private readonly translate: TranslateService, 
    private readonly salutationStateService: SalutationStateService) { }

  ngOnInit() {
    this.loadSalutationHeadersAndColumns();
    this.langSalutationSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadSalutationHeadersAndColumns();
    });
    
    // Log para ver si los datos están cargando
    console.log('Salutations loading:', this.salutationService.loading());
    console.log('Salutations data:', this.salutationService.salutations());
    console.log('Salutations error:', this.salutationService.error());
  }

  onUserSalutationPreferencesChanges(userSalutationPreferences: any) {
    localStorage.setItem('userPreferences', JSON.stringify(userSalutationPreferences));
  }

  loadSalutationHeadersAndColumns() {
    this.loadSalutationHeaders();
    this.salutationDisplayedColumns = [...this.salutationColumns]; // Mostrar todas las columnas
  }

  loadSalutationHeaders(): void {
    this.salutationColumns = [
      {
        field: 'title',
        minWidth: 200,
        header: this.translate.instant(_('SALUTATION.TABLE_SALUTATION.SALUTATION'))
      }
    ];
  }

  ngOnDestroy(): void {
    if (this.langSalutationSubscription) {
      this.langSalutationSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['salutations']) {
      this.prepareTableData();
    }
  }

  private prepareTableData() {
    if (this.salutations().length > 0) {
      this.salutationDisplayedColumns = [
        { field: 'title', header: 'Salutation' }
      ];
    }
  }

  applySalutationFilter(event: any, field: string) {
    const inputSalutationFilterElement = event.target as HTMLInputElement;
    if (inputSalutationFilterElement) {
      this.dt2.filter(inputSalutationFilterElement.value, field, 'contains');
    }
  }

  editSalutation(salutation: any) {
    const salutationToEdit = {
      salutationId: salutation.id,
      salutationText: salutation.title
    };

    this.salutationUtils.getSalutationById(salutationToEdit.salutationId).subscribe({
      next: (fullSalutation) => {
        if (fullSalutation) {
          this.salutationStateService.setSalutationToEdit(fullSalutation);
        }
      },
      error: (err) => {
        console.error('Error al cargar saludo:', err);
      }
    });
  }

  onVisibleModal(visible: boolean) {
    this.visibleModal = visible;
  }

  onModalVisibilityChange(visible: boolean): void {
    this.visibleModal = visible;
    if (!visible) {
      this.selectedSalutation = null;
    }
  }
  
  onDialogShow() {
    if (this.modalType === 'create' && this.salutationModalComponent) {
      this.salutationModalComponent.focusInputIfNeeded();
    }
  }
}
