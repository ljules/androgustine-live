import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { TelemetryService } from './services/telemetry.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: TelemetryService,
          useValue: {
            latest$: of({
              data: null,
              telemetry: null,
              session: null,
              track: null,
              strategy: null,
              instructions: null,
              sessionId: null,
              connected: true,
              connectionState: 'NoSession',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the live dashboard', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-live-dashboard')).not.toBeNull();
    expect(compiled.querySelector('.live-shell')).not.toBeNull();
  });
});
