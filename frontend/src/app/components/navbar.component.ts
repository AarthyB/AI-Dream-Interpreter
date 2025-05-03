
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isCollapsed = false;
  dreamCount = 0;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkScreenWidth();
    this.loadDreamCount();
  }

  applyTheme(theme: string) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); 
    this.auth.logout();
  }
  
  checkScreenWidth() {
    const width = window.innerWidth;
    this.isCollapsed = width < 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenWidth();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  loadDreamCount() {
    const dreams = JSON.parse(localStorage.getItem('dreams') || '[]');
    this.dreamCount = dreams.length || 0;
  }
  
}
