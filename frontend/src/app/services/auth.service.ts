
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ✅ include HttpHeaders too
import { tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(this.getUser()); // 🔥 BehaviorSubject
  public user$ = this.userSubject.asObservable(); // 🔥 Exposed observable for components
  constructor(private router: Router, private http: HttpClient) {}

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('token', await res.user.getIdToken());
    this.fetchAndStoreUser();
  }

  async signup(email: string, password: string) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem('token', await res.user.getIdToken());
    this.fetchAndStoreUser();
  }

  async fetchAndStoreUser() {
    const token = this.getToken();
    if (!token) return;

    try {
      const user: any = await firstValueFrom(
        this.http.get(`${environment.apiBase}/me`, {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`
          })
        })
      );
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);  // 🔥 broadcast new user to app
    } catch (err) {
      console.error("❌ Failed to fetch user profile:", err);
    }
  }
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  refreshUser() {
    this.http.get(`${environment.apiBase}/me`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    }).subscribe({
      next: (user: any) => {
        localStorage.setItem('user', JSON.stringify(user)); // 🔥 Save user object
        this.userSubject.next(user); 
      },
      error: (err) => {
        console.error('Failed to refresh user', err);
      }
    });
  }
  
  logout() {
    signOut(auth).then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
