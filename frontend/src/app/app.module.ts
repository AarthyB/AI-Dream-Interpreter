
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { DreamJournalComponent } from './components/dream-journal.component';
import { LifeStoryComponent } from './components/life-story.component';
import { DreamHistoryComponent } from './components/dream-history.component';
import { InsightsComponent } from './components/insights.component';
import { NavbarComponent } from './components/navbar.component';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { UserSettingsComponent } from './components/user-settings.component';
import { PageWrapperComponent } from './components/page-wrapper.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoaderComponent } from './components/loader.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DreamJournalComponent,
    LifeStoryComponent,
    DreamHistoryComponent,
    UserSettingsComponent,
    InsightsComponent,
    NavbarComponent,
    PageWrapperComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  
  providers: [
    ApiService,
    AuthService,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule {}
