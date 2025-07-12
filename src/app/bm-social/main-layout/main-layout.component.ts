import { Component, inject, ViewChild } from '@angular/core';
import { SidebarStateService } from '../services/sidebar-state.service';
import { MenuItem } from 'primeng/api';
import { Sidebar } from 'primeng/sidebar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  standalone: false
})
export class MainLayoutComponent {
  sidebarState = inject(SidebarStateService);
  sidebarCollapsed$ = this.sidebarState.sidebarCollapsed$;
  isStateLoaded = false;
  mainMenuVisible: boolean = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  currentSidebarItems: MenuItem[] = [];
  mainMenuItems: any[] = [];
  
  private langSubscription!: Subscription;
  public currentMenuKey: string = 'dashboard';
  
  private readonly menuConfigs:  
  {label: string, icon: string, command: string, absoluteRoute: string}[] = [
    { label: 'SIDEBAR.TITLE', icon: 'bi bi-person-vcard', command: 'dashboard', absoluteRoute: 'title' },
    { label: 'SIDEBAR.SALUTATION', icon: 'bi bi-person-raised-hand', command: 'customers', absoluteRoute: 'salutation' },
    { label: 'SIDEBAR.COUNTRIES', icon: 'bi bi-flag-fill', command: 'customers', absoluteRoute: 'countries' },
    { label: 'SIDEBAR.PERSON', icon: 'bi bi-person-fill', command: 'customers', absoluteRoute: 'person-types' },
  ];
  
  private readonly sidebarItemsConfig: Record<
    string,
    { labelKey: string; route: string }[]
  > = {
    customers: [
    ],
    projects: [
    ],
    invoicing: [
    ],
    controlling: [
    ],
    masterdata: [
    ],
  };

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
  ) {
    this.sidebarState.sidebarCollapsed$.subscribe(() => {
      this.isStateLoaded = true;
    });
  }

  ngOnInit(): void {
    this.loadMainMenuItems();
    this.determineMainRoute();

    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadMainMenuItems();
      this.determineMainRoute();
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  loadMainMenuItems(): void {
    this.mainMenuItems = this.menuConfigs.map((menu)=> ({
      label: menu.label,//this.translate.instant(menu.label),
      icon: menu.icon,
      command: menu.command,
      absoluteRoute: menu.absoluteRoute
    }))
  }

  toggleMainMenu(): void {
    this.mainMenuVisible = !this.mainMenuVisible;
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  loadSidebarItems(menu: string): void {
    this.currentMenuKey = menu;

    if (menu === 'masterdata') {
      this.currentSidebarItems = [];
    } else {
      const config = this.sidebarItemsConfig[menu];

      if (Array.isArray(config)) {
        this.currentSidebarItems = config.map((item) => ({
          label: this.translate.instant(item.labelKey),
          routerLink: [item.route],
        }));
      } else {
        this.currentSidebarItems = [];
      }
    }

    this.mainMenuVisible = false;
  }

  private determineMainRoute() {
    const fullUrl = this.router.url;
    
    const mainRoute = fullUrl.split('/')[1] ?? 'dashboard';
    
    this.loadSidebarItems(mainRoute);
  }

  onMainMenuSelect(menu: string): void {
    this.loadSidebarItems(menu);
  }
}
