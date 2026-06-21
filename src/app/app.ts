import { Component } from '@angular/core';
import { LiveDashboardComponent } from './pages/live-dashboard/live-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [LiveDashboardComponent],
  template: '<app-live-dashboard />',
})
export class App {}
