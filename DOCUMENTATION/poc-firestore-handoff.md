# POC AndroGustine Live - Reprise Technique

## Objectif Du POC

Ce POC valide l'application Web spectateur `androgustine-live`.

L'objectif prioritaire de cette étape était de connecter l'application Angular à Firestore et de lire correctement les données publiées par les applications Android pilote/copilote.

## Statut De Validation

La liaison Firestore est validée.

Important pour la suite : la couche Firestore ne doit plus être modifiée par les prochains agents Codex, sauf demande explicite de l'utilisateur. Les prochains travaux doivent se concentrer sur l'expérience utilisateur, l'affichage, la mise en page, la lisibilité, la carte/circuit et la qualité visuelle.

La validation a été effectuée à partir du panneau debug Firestore de l'application Web. L'application récupère correctement :

- la session courante ;
- la télémétrie temps réel ;
- le circuit courant ;
- la stratégie courante ;
- les instructions copilote courantes.

## Architecture Firestore Validée

L'application cherche d'abord la dernière session :

```text
raceSessions
orderBy(createdAtIso, desc)
limit(1)
```

Puis elle écoute les documents suivants :

```text
raceSessions/{sessionId}
raceSessions/{sessionId}/telemetry/latest
raceSessions/{sessionId}/track/current
raceSessions/{sessionId}/strategy/current
raceSessions/{sessionId}/instructions/current
```

Cette architecture remplace l'ancien chemin racine `telemetry/latest`, qui ne doit plus être utilisé.

## Données Validées

Exemple réel validé :

```text
sessionId: androgustine-session-20260621-055453
connectionState: Connected
session.totalLaps: 11
session.trackName: sem_2025_eu.csv
session.trackPointCount: 661
telemetry.currentLap: 0
telemetry.gpsSpeedKmh: disponible
telemetry.weatherTemperatureC: disponible
telemetry.weatherWindKmh: disponible
telemetry.weatherRainProbability: disponible
track.points: 661 points
track.totalDistanceM: 1319.627
strategy.startSegments: disponible
strategy.raceSegments: disponible
instructions.pilotPaceInstruction: MAINTAIN
instructions.raceStatusInstruction: STOP
instructions.pitStopRequest: false
```

Certains champs peuvent être absents ou `null` selon l'état de la session :

- `heartRateBpm` peut être `null` ;
- les données énergie/joulemeter ne sont pas encore présentes dans le flux validé ;
- `snappedDistanceM`, `ghostDistanceM` et `deltaDistanceM` peuvent être `null` avant départ ;
- `activeStrategy` peut valoir `WAITING` quand `raceStarted` vaut `false`.

## Mapping Métier Actuel

Le dashboard agrège les documents Firestore en un ViewModel unique.

Mapping principal :

```text
Tour courant       telemetry.currentLap
Total tours        session.totalLaps
Chrono             telemetry.elapsedSessionS
Vitesse GPS        telemetry.gpsSpeedKmh
Température        telemetry.weatherTemperatureC
Vent               telemetry.weatherWindKmh
Pluie              telemetry.weatherRainProbability
BPM                telemetry.heartRateBpm
Stratégie active   telemetry.activeStrategy
Cadence            instructions.pilotPaceInstruction
Etat course        instructions.raceStatusInstruction
Stands             instructions.pitStopRequest
Tracé circuit      track.points
Position véhicule  telemetry.gpsLat/gpsLon
Fallback position  telemetry.snappedDistanceM + interpolation sur track.points
```

Normalisations déjà prévues :

```text
ACCELERATE -> Accélérer
MAINTAIN   -> Maintenir
SLOW_DOWN  -> Ralentir

RACE          -> Course
NO_OVERTAKING -> Ne pas doubler
STOP          -> Stop

START / DEPART -> Départ
RACE / COURSE  -> Course
```

## Piles Technologiques

Application :

- Angular 20 ;
- Angular standalone components ;
- AngularFire `@angular/fire` ;
- Firebase Web SDK ;
- RxJS ;
- Bootstrap 5 ;
- SCSS ;
- police Oxanium chargée depuis Google Fonts.

Scripts utiles :

```bash
npm install
npm start
npm run build
```

Le build de validation a été exécuté avec succès :

```bash
npm run build
```

## Structure Du Projet

Chemin racine :

```text
androgustine-live/
```

Fichiers principaux :

```text
src/app/app.ts
src/app/app.config.ts
src/app/models/telemetry.model.ts
src/app/services/telemetry.service.ts
src/app/pages/live-dashboard/live-dashboard.component.ts
src/app/pages/live-dashboard/live-dashboard.component.html
src/app/pages/live-dashboard/live-dashboard.component.scss
src/environments/environment.ts
src/environments/environment.prod.ts
```

Responsabilités :

```text
telemetry.model.ts
  Types Firestore et types du flux agrégé.

telemetry.service.ts
  Couche Firestore validée.
  Découverte de la dernière session.
  Ecoute temps réel des sous-documents.
  Agrégation des données dans latest$.
  Ne pas modifier sans demande explicite.

live-dashboard.component.ts
  Mapping ViewModel pour l'interface.
  Normalisation des valeurs métier.
  Projection simple du circuit.
  Interpolation de position depuis snappedDistanceM.

live-dashboard.component.html/scss
  Interface actuelle du POC.
  Zone à privilégier pour la prochaine phase UX.
```

## Configuration Firebase

La configuration Firebase Web est dans :

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Ces fichiers contiennent l'objet `firebase` utilisé par AngularFire. Aucun `google-services.json` n'est nécessaire pour l'application Web.

## Etat Debug

Le composant `LiveDashboardComponent` contient :

```ts
readonly debug = true;
```

Le panneau debug affiche l'agrégat complet :

```text
sessionId
connectionState
session
telemetry
track
strategy
instructions
```

Ce panneau est utile pendant la reprise. Il pourra être masqué plus tard en passant `debug` à `false`, ou remplacé par un mode développeur propre.

## Points D'attention Pour La Suite UX

La suite du développement doit prioritairement porter sur :

- améliorer le rendu visuel général ;
- rendre le dashboard plus lisible en mode spectateur ;
- mieux gérer les états `WAITING`, `RUNNING`, session absente, télémétrie absente ;
- afficher proprement les valeurs `null` ;
- améliorer le tracé circuit ;
- afficher les segments de stratégie sur le circuit ;
- gérer le cas où la position GPS réelle est éloignée du circuit ;
- éventuellement afficher la ghost car si `ghostDistanceM` devient disponible ;
- conserver une interface responsive desktop/mobile.

Ne pas modifier la couche Firestore validée pendant cette phase UX.
