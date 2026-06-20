# AndroGustine Live

Application Web spectateur Angular + Bootstrap pour suivre en direct une session AndroGustine depuis Firestore.

## Fonctionnalités

- Lecture temps réel du document Firestore `telemetry/latest`.
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

Les règles Firestore doivent autoriser la lecture du document `telemetry/latest` pour les spectateurs concernés. L'application ne contient aucun appel d'écriture.

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
- Chrono : `chrono`, `elapsedSeconds` ou `elapsedMs`.
- Vitesse : `speedGps`, `gpsSpeed` ou `speed`.
- Météo : `temperature`, `windSpeed` ou `windKmh`, `rainProbability` ou `rainPercent`.
- Cardio : `heartRate` ou `bpm`.
- Energie : `energyConsumed` ou `energyJ`.
- Stratégie : `activeStrategy` ou `strategy`.
- Consigne : `copilotInstruction` ou `instruction`.
- Etat course : `raceState` ou `status`.
- Stands : `pitStop` ou `stands`.
- Circuit : `circuitPoints`, `circuit.points` ou `track.points`.
- Position : `vehiclePosition`, `position`, `latitude`/`longitude`, ou `progress` de 0 à 1.
