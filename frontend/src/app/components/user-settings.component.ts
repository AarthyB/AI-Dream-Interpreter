import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  name = '';
  selectedTheme = '';
  selectedOverlay = '';
  
  availableThemes = ['peacock', 'deepnight', 'greymist', 'plasma'];
  availableOverlays = ['particles', 'starfield', 'rain', 'bubbles'];

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.name = user.displayName || '';
      this.selectedTheme = user.theme || 'deepnight';
      this.selectedOverlay = user.overlay || 'particles';
    }
  }

  saveSettings() {
    const payload = {
      displayName: this.name.trim(),
      theme: this.selectedTheme,
      overlay: this.selectedOverlay
    };

    this.api.updateUserSettings(payload).subscribe({
      next: () => {
        this.auth.refreshUser(); 
        alert('✅ Settings updated successfully!');
        this.router.navigate(['/journal']);
      },
      error: () => {
        alert('❌ Failed to update settings.');
      }
    });
  }
}
