# FrontendApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

# Estructura del proyecto

Este documento resume la estructura carpeta por carpeta y las clases/componentes principales detectados en el proyecto.

**Backend Api**
- `package.json`: dependencias y scripts del backend.
- `server.js`: punto de entrada del servidor Express.
- `test_env.js`: configuración de entorno para tests/local.
- `config/`
	- `db.js`: conexión a la base de datos.
- `controllers/`
	- `authController.js`: control de autenticación (registro/login, JWT).
	- `climateController.js`: lógica relacionada con datos climáticos.
	- `predictionController.js`: endpoints para predicción de enfermedades.
- `jobs/`
	- `recomendacionJob.js`: tarea programada para recomendaciones.
- `middleware/`
	- `authMiddleware.js`: verificación de tokens/roles.
	- `uploadMiddleware.js`: manejo de uploads (imágenes).
- `models/`
	- `Cultivo.js`: modelo `Cultivo` (esquema Mongoose / clase del dominio).
	- `Prediction.js`: modelo `Prediction`.
	- `User.js`: modelo `User` (usuarios, roles, credenciales).
- `routes/`
	- `auth.js`: rutas de autenticación.
	- `climate.js`: rutas para datos climáticos.
	- `predict.js`: rutas de predicción.
- `scripts/`
	- `seedCultivos.js`: script para poblar colecciones iniciales.
- `services/`
	- `matchingEngine.js`: motor de reglas para recomendaciones.
- `uploads/`: carpeta para archivos subidos (imágenes).

**Frontend App**
- Archivos raíz: `angular.json`, `package.json`, `tsconfig*.json`.
- `src/`
	- `index.html`: plantilla principal.
	- `main.ts`, `main.server.ts`, `server.ts`: puntos de entrada (cliente/SSR/servidor).
	- `styles.scss`, `custom-theme.scss`: estilos globales.
	- `app/`: lógica principal de la aplicación.
		- `app.ts`, `app.config.ts`, `app.routes.ts`: bootstrap y rutas.
		- `app.config.server.ts`, `app.routes.server.ts`: configuración para SSR/servidor.
		- `components/` (cada carpeta representa un componente Angular)
			- `biblioteca/` → `biblioteca.ts` (BibliotecaComponent), `biblioteca.html`, `biblioteca.css`.
			- `dashboard/` → `dashboard.ts` (DashboardComponent), `dashboard.html`, `dashboard.css`.
			- `detection/` → `detection.ts` (DetectionComponent), vistas y estilos.
			- `finca/` → `finca.ts` (FincaComponent).
			- `login/` → `login.ts` (LoginComponent).
			- `lunar-calendar/` → `lunar-calendar.ts` (LunarCalendarComponent).
			- `main-layout/` → `main-layout.ts` (MainLayoutComponent).
			- `map-selector/` → `map-selector.ts` (MapSelectorComponent).
			- `recomendacion/`, `register/`, `result/`, `tareas/`: componentes relacionados (archivos TS/HTML/CSS presentes).
		- `guards/`
			- `auth-guard.ts`: `AuthGuard` para rutas protegidas.
		- `services/`
			- `auth.ts`: `AuthService` (login, token, perfil).
			- `climate.ts`: `ClimateService` (API clima).
			- `predict.ts`: `PredictService` (subida de imagen y petición de predicción).
			- `theme.ts`, `toast.ts`, `websocket.ts`: utilidades y comunicación en tiempo real.
		- `animations/`: animaciones relacionadas con autenticación.
		- `environments/`
			- `environment.development.ts`: configuración de entornos.
		- Tests/spec: muchos componentes y servicios tienen archivos `.spec.ts` para unit tests.

**IA Service (Python)**
- `requirements.txt`: dependencias (Flask, TensorFlow/Keras, etc.).
- `app.py`: servicio de inferencia (endpoints para predicción de imagen).
- `models/`
	- `banana_leaf_disease_model.h5`: modelo entrenado Keras.
	- `coffee_leaf_disease_model.h5`: otro modelo entrenado.

Notas y recomendaciones rápidas:
- Los nombres de las clases/servicios se infieren de los nombres de archivo (`X.ts` → `XComponent` o `XService`, `Y.js` → controlador/servicio). Revisar cada archivo si necesita nombres exactos o métodos públicos.
- Archivos de tests `.spec.ts` indican la intención de pruebas unitarias; mantenerlos actualizados tras refactors.
- Para más detalle (métodos públicos, firmas, propiedades), puedo extraer y listar las clases y sus métodos de archivos específicos si indicas cuáles prefieres primero.

---

Actualizado automáticamente: estructura y mapeo de clases/componentes principales.
