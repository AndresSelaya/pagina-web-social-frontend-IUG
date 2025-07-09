import { Component, computed, inject, SimpleChanges, ViewChild, effect } from '@angular/core';
import { TitleUtils } from '../../utils/title.utils';
import { TitleService } from '../../../../services/title.service';
import { TitleModalComponent } from '../title-modal/title-modal.component';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { _, TranslateService } from '@ngx-translate/core';
import { TitleStateService } from '../../utils/title-state.service';
import { Title } from '../../../../interfaces/title';

@Component({
  selector: 'app-title-table',
  templateUrl: './title-table.component.html',
  styleUrl: './title-table.component.scss'
})
export class TitleTableComponent {
  private readonly titleUtils = new TitleUtils();
  private readonly titleService = inject(TitleService);
  visibleModal: boolean = false;
  modalType: 'create' | 'delete' = 'create';
  selectedTitle: number | null = null;
  titleName: string = '';
  @ViewChild('titleModal') titleModalComponent!: TitleModalComponent;
  handleTableEvents(event: { type: 'create' | 'delete', data?: any }): void {
    this.modalType = event.type;
    if (event.type === 'delete' && event.data) {
      this.selectedTitle = event.data;

      this.titleUtils.getTitleById(this.selectedTitle!).subscribe({
        next: (title) => {
          this.titleName = title?.titleText ?? '';
        },
        error: (err) => {
          console.error('No se pudo obtener el título:', err);
          this.titleName = '';
        }
      });
    }
    this.visibleModal = true;
  }

  readonly titles = computed(() => {
    const rawTitles = this.titleService.titles();
    console.log('Raw titles from service:', rawTitles);
    
    // Datos de prueba temporales si no hay datos del servicio
    const testTitles = rawTitles.length === 0 ? [
      { titleId: 1, companyId: 1, titleText: 'Dr.', version: 1 },
      { titleId: 2, companyId: 1, titleText: 'Prof.', version: 1 },
      { titleId: 3, companyId: 1, titleText: 'Ing.', version: 1 }
    ] : rawTitles;
    
    const mappedTitles = testTitles.map(title => ({
      id: title.titleId,
      title: title.titleText,
    }));
    
    console.log('Mapped titles for table:', mappedTitles);
    return mappedTitles;
  });

  titleColumns: any[] = [];
  titleDisplayedColumns: any[] = [];
  isChipsVisible = false;
  tableKey: string = 'Title'
  dataKeys = ['title'];

  @ViewChild('dt2') dt2!: Table;

  private langTitleSubscription!: Subscription;

  constructor(
    private readonly translate: TranslateService, 
    private readonly titleStateService: TitleStateService
  ) {
    effect(() => {
      console.log('=== TITLE TABLE EFFECT ===');
      console.log('Titles from service:', this.titleService.titles());
      console.log('Mapped titles:', this.titles());
      console.log('Display columns:', this.titleDisplayedColumns);
      console.log('Data keys:', this.dataKeys);
    });
  }

  ngOnInit() {
    this.loadTitleHeadersAndColumns();
    this.langTitleSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadTitleHeadersAndColumns();
    });
    
    // Log para ver si los datos están cargando
    console.log('Titles loading:', this.titleService.loading());
    console.log('Titles data:', this.titleService.titles());
    console.log('Titles error:', this.titleService.error());
  }

  onUserTitlePreferencesChanges(userTitlePreferences: any) {
    localStorage.setItem('userPreferences', JSON.stringify(userTitlePreferences));
  }

  loadTitleHeadersAndColumns() {
    this.loadTitleHeaders();
    this.titleDisplayedColumns = [...this.titleColumns]; // Mostrar todas las columnas
  }

  loadTitleHeaders(): void {
    this.titleColumns = [
      {
        field: 'title',
        minWidth: 200,
        header: this.translate.instant(_('TITLE.TABLE_TITLE.TITLE'))
      }
    ];
  }

  ngOnDestroy(): void {
    if (this.langTitleSubscription) {
      this.langTitleSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['titles']) {
      this.prepareTableData();
    }
  }

  private prepareTableData() {
    if (this.titles().length > 0) {
      this.titleDisplayedColumns = [
        { field: 'title', header: 'Title' }
      ];
    }
  }

  applyTitleFilter(event: any, field: string) {
    const inputTitleFilterElement = event.target as HTMLInputElement;
    if (inputTitleFilterElement) {
      this.dt2.filter(inputTitleFilterElement.value, field, 'contains');
    }
  }

  editTitle(title: any) {
    const titleToEdit = {
      titleId: title.id,
      titleText: title.title
    };

    this.titleUtils.getTitleById(titleToEdit.titleId).subscribe({
      next: (fullTitle) => {
        if (fullTitle) {
          this.titleStateService.setTitleToEdit(fullTitle);
        }
      },
      error: (err) => {
        console.error('Error al cargar título:', err);
      }
    });
  }

  onVisibleModal(visible: boolean) {
    this.visibleModal = visible;
  }

  onModalVisibilityChange(visible: boolean): void {
    this.visibleModal = visible;
    if (!visible) {
      this.selectedTitle = null;
    }
  }
  onDialogShow() {
    if (this.modalType === 'create' && this.titleModalComponent) {
      this.titleModalComponent.focusInputIfNeeded();
    }
  }
}
