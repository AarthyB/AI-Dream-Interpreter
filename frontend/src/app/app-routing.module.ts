
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { DreamJournalComponent } from './components/dream-journal.component';
import { LifeStoryComponent } from './components/life-story.component';
import { DreamHistoryComponent } from './components/dream-history.component';
import { InsightsComponent } from './components/insights.component';
import { UserSettingsComponent } from './components/user-settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'dream-journal', pathMatch: 'full' },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'journal', component: DreamJournalComponent },
  { path: 'life-story', component: LifeStoryComponent },
  { path: 'history', component: DreamHistoryComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'settings', component: UserSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
