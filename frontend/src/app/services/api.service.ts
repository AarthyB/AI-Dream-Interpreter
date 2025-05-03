import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService, private loaderService: LoaderService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': this.auth.getToken()
    });
  }

  interpretDream(data: any): Observable<any> {
    return this.http.post(`${environment.apiBase}/interpret/`, data, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
  
  getSymbols(): Observable<any> {
    return this.http.get(`${environment.apiBase}/symbols/`, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  clarifyDream(dream: string) {
    return this.http.post<{ clarified: string, questions: string[] }>(`${environment.apiBase}/clarify/`, { dream });
  }

  sendRating(data: { dream: string, rating: number }) {
    return this.http.post(`${environment.apiBase}/feedback/`, data);
  }
  
  
  getEmotionSummary(): Observable<any> {
    return this.http.get(`${environment.apiBase}/emotions/`, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  getDreamHistory(): Observable<any> {
    return this.http.get(`${environment.apiBase}/history/`, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  getLifeStory(): Observable<any> {
    return this.http.get(`${environment.apiBase}/life-story/`, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  saveLifeStory(text: string): Observable<any> {
    return this.http.post(`${environment.apiBase}/life-story/`, { story: text }, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );;
  }

  submitFollowUps(data: any): Observable<any> {
    return this.http.post(`${environment.apiBase}/follow-up/`, { answers: data }, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  updateDream(id: number, body: { dream: string, interpretation: string }) {
    return this.http.patch(`${environment.apiBase}/history/${id}`, body, { headers: this.getHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
  
  
  deleteDream(id: number): Observable<any> {
    return this.http.delete(`${environment.apiBase}/history/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
  
  updateFollowup(id: number, answer: string) {
    return this.http.patch(`${environment.apiBase}/follow-up/${id}`, { answer }, { headers: this.getHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );;
  }
  
  deleteFollowup(id: number) {
    return this.http.delete(`${environment.apiBase}/follow-up/${id}`, { headers: this.getHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );;
  }
  
  updateUserSettings(data: any) {
    return this.http.patch(`${environment.apiBase}/user/`, data, {
      headers: this.getHeaders()
    }).pipe(
      finalize(() => this.loaderService.hide())
    );;
  }
  
}
