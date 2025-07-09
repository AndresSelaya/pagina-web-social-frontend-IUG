import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { Observable, catchError, filter, map, take, throwError, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Title, CreateTitleRequest, UpdateTitleRequest } from '../../../interfaces/title';
import { TitleService } from '../../../services/title.service';

/**
 * Utility class for title-related business logic and operations.
 * Works with TitleService's reactive signals while providing additional functionality.
 */
@Injectable({ providedIn: 'root' }) 
export class TitleUtils {
  private readonly titleService = inject(TitleService);
  private readonly injector = inject(EnvironmentInjector);

  /**
   * Gets a title by ID with proper error handling
   * @param id - ID of the title to retrieve
   * @returns Observable emitting the title or undefined if not found
   */
  getTitleById(id: number): Observable<Title | undefined> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid title ID'));
    }

    return this.titleService.getTitleById(id).pipe(
      catchError(err => {
        console.error('Error fetching title:', err);
        return throwError(() => new Error('Failed to load title'));
      })
    );
  }

  /**
   * Creates a new title with validation
   * @param titleText - Text for the new title
   * @param companyId - Company ID (defaults to 1)
   * @returns Observable that emits the created title
   */
  createNewTitle(titleText: string, companyId: number = 1): Observable<Title> {
    if (!titleText?.trim()) {
      return throwError(() => new Error('Title text cannot be empty'));
    }

    const newTitle: CreateTitleRequest = {
      companyId,
      titleText: titleText.trim(),
      version: 1
    };

    return this.titleService.addTitle(newTitle).pipe(
      catchError(err => {
        console.error('Error creating title:', err);
        return throwError(() => new Error('Failed to create title'));
      })
    );
  }

  /**
   * Checks if a title exists (case-insensitive comparison)
   * @param titleText - Title text to check
   * @returns Observable emitting boolean indicating existence
   */
  titleExists(titleText: string): Observable<boolean> {
    return this.titleService.getAllTitles().pipe(
      map(titles => titles.some(
        t => t.titleText.toLowerCase() === titleText.toLowerCase()
      )),
      catchError(err => {
        console.error('Error checking title existence:', err);
        return throwError(() => new Error('Failed to check title existence'));
      })
    );
  }

  /**
   * Gets all titles sorted alphabetically by titleText
   * @returns Observable emitting sorted array of titles
   */
  getTitlesSortedByName(): Observable<Title[]> {
    return this.titleService.getAllTitles().pipe(
      map(titles => [...titles].sort((a, b) => a.titleText.localeCompare(b.titleText))),
      catchError(err => {
        console.error('Error sorting titles:', err);
        return throwError(() => new Error('Failed to sort titles'));
      })
    );
  }

  /**
   * Refreshes titles data
   * @returns Observable that completes when refresh is done
   */
  refreshTitles(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.titleService.refreshTitles();
      subscriber.next();
      subscriber.complete();
    });
  }

  /**
   * Deletes a title by ID
   * @param id - ID of the title to delete
   * @returns Observable that completes when the deletion is done
   */
  deleteTitle(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid title ID'));
    }

    return this.titleService.deleteTitle(id).pipe(
      catchError(err => {
        console.error('Error deleting title:', err);
        return throwError(() => new Error('Failed to delete title'));
      })
    );
  }

  /**
   * Updates a title
   * @param title - Title data to update
   * @returns Observable that emits the updated title
   */
  updateTitle(title: Title): Observable<Title> {
    if (!title?.titleId) {
      return throwError(() => new Error('Invalid title data'));
    }

    return this.titleService.getTitleById(title.titleId).pipe(
      take(1),
      map((currentTitle) => {
        if (!currentTitle) {
          throw new Error('Title not found');
        }
        // Version conflict check can be added here if needed
        return title;
      }),
      switchMap((validatedTitle: Title) => {
        const updateRequest: UpdateTitleRequest = {
          titleId: validatedTitle.titleId,
          companyId: validatedTitle.companyId,
          titleText: validatedTitle.titleText,
          version: validatedTitle.version
        };
        return this.titleService.updateTitle(updateRequest);
      }),
      catchError((err) => {
        console.error('Error updating title:', err);
        return throwError(() => err);
      })
    );
  }

  private waitForUpdatedTitle(id: number, observer: any) {
    return toObservable(this.titleService.titles).pipe(
      map(titles => titles.find(t => t.titleId === id)),
      filter(updated => !!updated),
      take(1)
    ).subscribe({
      next: (updatedTitle) => {
        observer.next(updatedTitle);
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  }

  private listenForUpdateErrors(observer: any) {
    return toObservable(this.titleService.error).pipe(
      filter(error => !!error),
      take(1)
    ).subscribe({
      next: (err) => observer.error(err)
    });
  }
}