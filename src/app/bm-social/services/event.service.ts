

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../authentication/services/auth.service';

export interface EventCreator {
  uuid: string;
  name: string;
  lastName: string;
  email: string;
}
export interface EventRegistration {
  registrationUuid: string;
  registrationDate: string;
  status: string;
  userUuid: string;
  userName: string;
  userEmail: string;
  userLastname: string;
  photoProfilePath: string | null;
}

export interface Event {
  uuid: string;
  title: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  isPublic: boolean;
  requiresRegistration: boolean;
  status: string;
  coverImagePath: string;
  creator: EventCreator;
}

export interface PaginatedEvents {
  content: Event[];
  pageable: any;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  empty: boolean;
}

export interface ImageUploadResponse {
  uuid: string;
  name: string;
  urlResource: string;
  type: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {

  private readonly apiUrl = `${environment.BACK_END_HOST_DEV}/events`;
  private reqHeader: { headers: HttpHeaders };

  constructor(private http: HttpClient, private authService: AuthService) {
    const token = this.authService.getToken();
    this.reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
  }

  getEvents(page: number = 0, size: number = 12): Observable<PaginatedEvents> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedEvents>(`${this.apiUrl}`, { params });
  }

  getEvent(uuid: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${uuid}`);
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event, this.reqHeader);
  }

  updateEvent(uuid: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${uuid}`, event, this.reqHeader);
  }

  deleteEvent(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`, this.reqHeader);
  }

  /**
   * Obtiene los registros de un evento por su UUID (sin autenticación)
   */
  getEventRegistrations(uuid: string): Observable<EventRegistration[]> {
    const url = `${environment.BACK_END_HOST_DEV}/events/${uuid}/registrations`;
    return this.http.get<EventRegistration[]>(url);
  }

  /** Registra al usuario autenticado en un evento */
  registerForEvent(eventUuid: string): Observable<EventRegistration> {
    const url = `${environment.BACK_END_HOST_DEV}/events/${eventUuid}/registrations`;
    return this.http.post<EventRegistration>(url, {}, this.reqHeader);
  }

  /** Sube una imagen de portada para un evento */
  uploadCoverImage(file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    const url = `${environment.BACK_END_HOST_DEV}/images/events-cover`;
    return this.http.post<ImageUploadResponse>(url, formData, this.reqHeader);
  }
}
