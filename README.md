# AndroGustine Live

Application Web spectateur Angular + Bootstrap pour suivre en direct une session AndroGustine depuis Firestore.

## Fonctionnalités

- Découverte de la dernière session Firestore depuis la collection `raceSessions`.
- Lecture temps réel des documents de session : télémétrie, circuit, stratégie et instructions copilote.
- Affichage connexion, tours, chrono, vitesse GPS, météo, fréquence cardiaque, énergie, stratégie, consigne copilote, état course et stands.
- Rendu du tracé circuit et de la position véhicule lorsque les points sont disponibles.
- Valeurs de repli propres quand une donnée n'est pas encore publiée.
- Aucune écriture Firestore côté application Web.

## Installation

```bash
npm install
```

## Configuration Firebase

Renseigner les clés Firebase dans :

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Exemple :

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  },
};
```

Les règles Firestore doivent autoriser la lecture des sessions et sous-documents utiles aux spectateurs. L'application ne contient aucun appel d'écriture.

## Architecture Firestore

L'application cherche la dernière session :

```text
raceSessions
orderBy(createdAtIso, desc)
limit(1)
```

Puis elle écoute les documents associés à cette session :

```text
raceSessions/{sessionId}/telemetry/latest
raceSessions/{sessionId}/track/current
raceSessions/{sessionId}/strategy/current
raceSessions/{sessionId}/instructions/current
```

L'ancien chemin racine `telemetry/latest` n'est plus utilisé par l'application.

## Lancement local

```bash
npm start
```

Puis ouvrir `http://localhost:4200`.

## Build

```bash
npm run build
```

## Champs Firestore reconnus

Le dashboard accepte plusieurs variantes de noms pour rester compatible avec les données Android :

- Tours : `currentLap` ou `lap`, puis `totalLaps` ou `lapTotal`.
- Chrono : `chrono`, `elapsedSessionS`, `elapsedSeconds` ou `elapsedMs`.
- Vitesse : `gpsSpeedKmh`, `speedGps`, `gpsSpeed` ou `speed`.
- Météo : `weatherTemperatureC`, `temperature`, `weatherWindKmh`, `windSpeed` ou `windKmh`, `weatherRainProbability`, `rainProbability` ou `rainPercent`.
- Cardio : `heartRateBpm`, `heartRate` ou `bpm`.
- Energie : `energyConsumed`, `energyJ`, `energy` ou `joules`.
- Stratégie : `activeStrategy` ou `strategy`.
- Consigne : `pilotPaceInstruction`, `copilotInstruction` ou `instruction`.
- Etat course : `raceStatusInstruction`, `raceState` ou `status`.
- Stands : `pitStopRequest`, `pitStop` ou `stands`.
- Circuit : `track.points`, `circuitPoints`, `circuit.points` ou `track.path`.
- Position : `gpsLat`/`gpsLon`, `snappedDistanceM`, `vehiclePosition`, `position`, `latitude`/`longitude`, ou `progress` de 0 à 1.

## Structure principale

```text
src/app/app.ts
src/app/app.config.ts
src/app/models/telemetry.model.ts
src/app/services/telemetry.service.ts
src/app/pages/live-dashboard/live-dashboard.component.ts
src/app/pages/live-dashboard/live-dashboard.component.html
src/app/pages/live-dashboard/live-dashboard.component.scss
```

`TelemetryService` porte la liaison Firestore validée. Les évolutions UX doivent prioritairement se concentrer sur le composant `LiveDashboardComponent` et ses fichiers de template/style.
