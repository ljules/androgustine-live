import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { Telemetry, TelemetrySnapshot } from '../models/telemetry.model';

@Injectable({
  providedIn: 'root',
})
export class TelemetryService {
  private readonly firestore = inject(Firestore);

  readonly latest$: Observable<TelemetrySnapshot> = docData(
    doc(this.firestore, 'telemetry/latest'),
  ).pipe(
    map((data) => ({
      data: (data as Telemetry | undefined) ?? null,
      connected: true,
    })),
    startWith({ data: null, connected: false }),
    catchError((error: unknown) =>
      of({
        data: null,
        connected: false,
        error: error instanceof Error ? error.message : 'Lecture Firestore impossible',
      }),
    ),
  );
}
