import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { ResultsComponent } from './results/results.component';

const appRoutes: Routes = [
  { path: 'start', component: StartComponent},
  { path: '', redirectTo: '/start', pathMatch: 'full'},
  { path: 'results', component: ResultsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
