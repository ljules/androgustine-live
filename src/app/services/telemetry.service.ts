import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable, catchError, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
import {
  InstructionsDocument,
  RaceSessionDocument,
  StrategyDocument,
  Telemetry,
  TelemetrySnapshot,
  TrackDocument,
} from '../models/telemetry.model';

@Injectable({
  providedIn: 'root',
})
export class TelemetryService {
  private readonly firestore = inject(Firestore);

  readonly latest$: Observable<TelemetrySnapshot> = collectionData(
    query(collection(this.firestore, 'raceSessions'), orderBy('createdAtIso', 'desc'), limit(1)),
    { idField: 'id' },
  ).pipe(
    tap((sessions) => console.log('[Firestore raceSessions latest]', sessions)),
    switchMap((sessions) => {
      const session = (sessions[0] as RaceSessionDocument | undefined) ?? null;
      if (!session) {
        return of({
          data: null,
          telemetry: null,
          session: null,
          track: null,
          strategy: null,
          instructions: null,
          sessionId: null,
          connected: true,
          connectionState: 'NoSession' as const,
        });
      }

      const sessionId = session.sessionId ?? session.id;
      if (!sessionId) {
        return of({
          data: null,
          telemetry: null,
          session,
          track: null,
          strategy: null,
          instructions: null,
          sessionId: null,
          connected: false,
          connectionState: 'Error' as const,
          error: 'Session courante trouvée, mais aucun identifiant de session exploitable.',
        });
      }

      const basePath = `raceSessions/${sessionId}`;
      return combineLatest({
        telemetry: this.readDocument<Telemetry>(`${basePath}/telemetry/latest`),
        track: this.readDocument<TrackDocument>(`${basePath}/track/current`),
        strategy: this.readDocument<StrategyDocument>(`${basePath}/strategy/current`),
        instructions: this.readDocument<InstructionsDocument>(`${basePath}/instructions/current`),
      }).pipe(
        map(({ telemetry, track, strategy, instructions }) => ({
          data: telemetry,
          telemetry,
          session,
          track,
          strategy,
          instructions,
          sessionId,
          connected: true,
          connectionState: telemetry ? ('Connected' as const) : ('WaitingForTelemetry' as const),
        })),
      );
    }),
    startWith({
      data: null,
      telemetry: null,
      session: null,
      track: null,
      strategy: null,
      instructions: null,
      sessionId: null,
      connected: false,
      connectionState: 'Initializing' as const,
    }),
    catchError((error: unknown) =>
      of({
        data: null,
        telemetry: null,
        session: null,
        track: null,
        strategy: null,
        instructions: null,
        sessionId: null,
        connected: false,
        connectionState: 'Error' as const,
        error: error instanceof Error ? error.message : 'Lecture Firestore impossible',
      }),
    ),
  );

  private readDocument<T>(path: string): Observable<T | null> {
    return docData(doc(this.firestore, path)).pipe(
      tap((data) => console.log(`[Firestore ${path}]`, data)),
      map((data) => (data as T | undefined) ?? null),
      startWith(null),
    );
  }
}
