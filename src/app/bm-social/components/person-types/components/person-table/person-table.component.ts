import { Component, computed, effect, inject, SimpleChanges, ViewChild } from '@angular/core';
import { PersonTypeUtils } from '../../utils/person-type.utils';
import { PersonTypeService } from '../../../../services/person-type.service';
import { PersonModalComponent } from '../person-modal/person-modal.component';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { _, TranslateService } from '@ngx-translate/core';
import { PersonTypeStateService } from '../../utils/person-type-state.service';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrl: './person-table.component.scss'
})
export class PersonTableComponent {
  private readonly personUtils = new PersonTypeUtils();
  private readonly personService = inject(PersonTypeService);
  visibleModal: boolean = false;
  modalType: 'create' | 'delete' = 'create';
  selectedPerson: number | null = null;
  personName: string = '';
  @ViewChild('personModal') personModalComponent!: PersonModalComponent;
  handleTableEvents(event: { type: 'create' | 'delete', data?: any }): void {
    this.modalType = event.type;
    if (event.type === 'delete' && event.data) {
      this.selectedPerson = event.data;

      this.personUtils.getPersonById(this.selectedPerson!).subscribe({
        next: (person) => {
          this.personName = person?.personTypeName ?? '';
        },
        error: (err) => {
          console.error('No se pudo obtener la persona:', err);
          this.personName = '';
        }
      });
    }
    this.visibleModal = true;
  }

  readonly persons = computed(() => {
    const rawPersons = this.personService.personTypes();
    console.log('Raw persons from service:', rawPersons);
    
    // Usar los datos del servicio directamente
    const mappedPersons = rawPersons.map(person => ({
      id: person.personTypeId,
      name: person.personTypeName,
    }));
    
    console.log('Mapped person for table:', mappedPersons);
    return mappedPersons;
  });

  personColumns: any[] = [];
  personDisplayedColumns: any[] = [];
  isChipsVisible = false;
  tableKey: string = 'Person'
  dataKeys = ['person'];

  @ViewChild('dt2') dt2!: Table;

  private langPersonSubscription!: Subscription;

  constructor(
    private readonly translate: TranslateService, 
    private readonly personStateService: PersonTypeStateService
  ) {
    effect(() => {
      console.log('=== PERSON TABLE EFFECT ===');
      console.log('Persons from service:', this.personService.personTypes());
      console.log('Mapped persons:', this.persons());
      console.log('Display columns:', this.personDisplayedColumns);
      console.log('Data keys:', this.dataKeys);
    });
  }

  ngOnInit() {
    this.loadPersonHeadersAndColumns();
    this.langPersonSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadPersonHeadersAndColumns();
    });
    
    // Log para ver si los datos están cargando
    console.log('Persons loading:', this.personService.loading());
    console.log('Persons data:', this.personService.personTypes());
    console.log('Persons error:', this.personService.error());
  }

  onUserTitlePreferencesChanges(userTitlePreferences: any) {
    localStorage.setItem('userPreferences', JSON.stringify(userTitlePreferences));
  }

  loadPersonHeadersAndColumns() {
    this.loadPersonHeaders();
    this.personDisplayedColumns = [...this.personColumns]; // Mostrar todas las columnas
  }

  loadPersonHeaders(): void {
    this.personColumns = [
      {
        field: 'name',
        minWidth: 200,
        header: this.translate.instant(_('PERSON.TABLE_PERSON.PERSON'))
      }
    ];
  }

  ngOnDestroy(): void {
    if (this.langPersonSubscription) {
      this.langPersonSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['persons']) {
      this.prepareTableData();
    }
  }

  private prepareTableData() {
    if (this.persons().length > 0) {
      this.personDisplayedColumns = [
        { field: 'name', header: 'Name' }
      ];
    }
  }

  applyPersonFilter(event: any, field: string) {
    const inputPersonFilterElement = event.target as HTMLInputElement;
    if (inputPersonFilterElement) {
      this.dt2.filter(inputPersonFilterElement.value, field, 'contains');
    }
  }

  editPerson(person: any) {
    const personToEdit = {
      personTypeId: person.id,
      personTypeName: person.name
    };

    this.personUtils.getPersonById(personToEdit.personTypeId).subscribe({
      next: (fullPerson) => {
        if (fullPerson) {
          this.personStateService.setPersonTypeToEdit(fullPerson);
        }
      },
      error: (err) => {
        console.error('Error al cargar persona:', err);
      }
    });
  }

  onVisibleModal(visible: boolean) {
    this.visibleModal = visible;
  }

  onModalVisibilityChange(visible: boolean): void {
    this.visibleModal = visible;
    if (!visible) {
      this.selectedPerson = null;
    }
  }
  onDialogShow() {
    if (this.modalType === 'create' && this.personModalComponent) {
      this.personModalComponent.focusInputIfNeeded();
    }
  }
}
