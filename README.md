# RePlay Games — Marketplace web y móvil para la compra y venta de videojuegos físicos de segunda mano

# Presentado por:

- *Francisco Javier Reyes Villalón* (Documentación del proyecto y elaboración del README)
- *Tomás Ignacio Moraga Gálvez* (Desarrollo del frontend en Ionic + React)
- *Cristóbal Jesús Pinto Quiroga* (Diseño UI/UX y elaboración del prototipo en Figma)
- *Marco Antonio Fernandoy Rojas* (Gestión del repositorio en GitHub, ramas y commits)

Las siguientes actividades fueron desarrolladas de manera conjunta por todos los integrantes del equipo:
- Definición de requerimientos funcionales y no funcionales.
- Definición de roles y caracterización de usuarios.
- Arquitectura de navegación y flujos de tareas.
- Configuración de rutas públicas, protegidas y acceso por roles.
- Pruebas de navegación y funcionamiento general.
- Revisión final de la documentación y coherencia entre Figma, README y frontend.
  

|Tipo |Link |
| :--- | :--- |
| Repositorio | *https://github.com/cristobalpinto2600-cyber/RePlay-Games* |
| Prototipo en Figma | *https://www.figma.com/design/HjfX9dFW7dpfEzYFaPNR0Z/Figma-Web?node-id=0-1&t=1ShxU2N3ZS4MXlIQ-1* |

## Índice

1. [Descripción general del sistema](#descripción-general-del-sistema)
2. [Objetivo del proyecto](#objetivo-del-proyecto)
3. [Principales funcionalidades](#principales-funcionalidades)
4. [Justificación del problema](#justificación-del-problema)
5. [Entrega Final (EF1–EF6): funcionalidades completas, seguridad, optimización, RAWG y Docker](#entrega-final-ef1ef6)
    - [Alcance y estado de las funcionalidades](#alcance-y-estado-de-las-funcionalidades)
    - [EF1: Notificaciones persistentes y almacenamiento local](#ef1-notificaciones-persistentes-y-almacenamiento-local)
    - [EF2: Mejoras de UI/UX y optimización de rendimiento](#ef2-mejoras-de-uiux-y-optimización-de-rendimiento)
    - [EF3 y EF4: Seguridad avanzada y optimización de consultas](#ef3-y-ef4-seguridad-avanzada-y-optimización-de-consultas)
    - [EF5: Integración externa con RAWG API](#ef5-integración-externa-con-rawg-api)
    - [EF6: Despliegue local con Docker y docker-compose](#ef6-despliegue-local-con-docker-y-docker-compose)
    - [Ramas del repositorio](#ramas-del-repositorio)
    - [Trazabilidad con los requerimientos](#trazabilidad-con-los-requerimientos)
6. [Usuarios](#usuarios-objetivo-quién-usará-la-aplicación)
    - [Roles](#roles-del-sistema)
    - [Proto-personas](#proto-personas)
    - [Supuestos utilizados](#supuestos-utilizados)
7. [Requerimientos](#requerimientos)
8. [Arquitectura de la Información / UX](#arquitectura-de-navegación)
    - [Diferenciación por roles](#diferenciación-de-acceso-según-roles)
    - [Flujos principales de tareas](#flujos-de-tareas)
    - [Puntos críticos de interacción](#puntos-críticos-de-interacción)
    - [Justificación técnica](#justificación-técnica)
9. [Bocetos UI/UX](#bocetos-uiux)
10. [Frontend con Ionic-React](#frontend-con-ionic-react)
11. [Backend: API REST con Node.js y Express](#backend-api-rest-con-nodejs-y-express)
    - [Tecnologías por capa](#tecnologías-por-capa)
    - [Arquitectura](#arquitectura)
    - [Estructura de carpetas](#estructura-de-carpetas)
    - [Instalación y ejecución local](#instalación-y-ejecución)
    - [Documentación de la API](#documentación-de-la-api)
    - [Seguridad](#seguridad-1)
    - [Integración frontend + backend](#integración-frontend--backend)
    - [Pruebas con Postman](#pruebas-con-postman)
    - [Modelo relacional](#modelo-relacional)
    - [Matriz de cumplimiento Entrega Final](#matriz-de-cumplimiento-entrega-final)
12. [Librerías y tecnologías](#librerías-usadas-con-react-ionic)
13. [Fuentes](#fuentes)


## Descripción general del sistema

RePlay Games es una aplicación web y móvil orientada a la compra y venta de videojuegos físicos de segunda mano. La plataforma busca centralizar publicaciones especializadas y facilitar la búsqueda, comparación y gestión de operaciones entre usuarios, incorporando además funciones de favoritos, calificaciones, reportes y moderación.

## Objetivo del proyecto

Desarrollar una aplicación web y móvil que facilite la compra y venta de videojuegos físicos de segunda mano mediante una plataforma especializada, clara y adaptable a distintos dispositivos, permitiendo organizar la información de las publicaciones y entregar mayor trazabilidad durante las operaciones.

## Principales funcionalidades

Entre las principales funcionalidades de RePlay Games se encuentran la exploración y filtrado del catálogo, consulta del detalle de publicaciones, publicación y administración de videojuegos, gestión de favoritos, operaciones de compra y venta, calificaciones asociadas a operaciones completadas, reportes de publicaciones y moderación administrativa.

## Justificación del problema

El comercio electrónico constituye un canal relevante en Chile. La Cámara de Comercio de Santiago
informó que durante 2025 las ventas online bordearon los US$ 10 mil millones y crecieron 11,6 %
nominal [1]. En este contexto, los videojuegos físicos usados pueden encontrarse en plataformas
generales de compraventa, pero dichas plataformas deben organizar productos muy distintos entre sí.
Para una persona que busca un videojuego usado resulta útil disponer de información especializada y
comparable, como consola compatible, estado del disco o cartucho, condición de la caja, precio,
ubicación y modalidad de entrega.

SERNAC destaca, en el contexto del comercio electrónico, la importancia de informar de manera clara
el precio, las características relevantes, el stock y las condiciones de entrega [2]. Asimismo,
SERNAC señala que cuando una empresa vende productos usados debe informar expresamente esa
condición [3]. Estas referencias se utilizan como criterios de transparencia para el diseño
académico de la plataforma, sin asumir que todas las obligaciones citadas se aplican de la misma
forma a cada futura operación entre particulares.

También existe una necesidad de señales de confianza. Facebook Marketplace utiliza valoraciones
entre usuarios, pero Meta indica que no verifica necesariamente que la persona que califica haya
comprado el producto o utilizado el servicio [4]. Como decisión de diseño, RePlay Games propone
vincular las calificaciones únicamente con operaciones registradas como completadas dentro del
sistema.

La necesidad abordada es contar con una plataforma especializada que reduzca la dispersión de
información, facilite la comparación de publicaciones y entregue mayor trazabilidad a la compra y
venta de videojuegos físicos usados.

**Consecuencias asociadas al problema:**

- Mayor tiempo de búsqueda al revisar publicaciones poco pertinentes.
- Dificultad para comparar alternativas cuando cada vendedor describe el producto de forma distinta.
- Mayor incertidumbre respecto del estado del juego y de la confiabilidad del vendedor.
- Repetición de preguntas que podrían resolverse con campos estandarizados.
- Menor trazabilidad cuando publicación, acuerdo y seguimiento de la operación quedan dispersos.

## Entrega Final (EF1–EF6)

En la **Entrega Final**, RePlay Games completa el 100 % de los requerimientos funcionales y no
funcionales definidos en EP1, suma notificaciones persistentes y almacenamiento local extendido
(**EF1**), optimiza interfaz y rendimiento (**EF2**), incorpora seguridad avanzada (**EF3**), optimiza
consultas con índices y paginación (**EF4**), integra la API externa **RAWG** (**EF5**) y prepara el
despliegue completo en contenedores con **Docker y `docker-compose`** (**EF6**).

| Archivo / Carpeta | Contenido |
| :--- | :--- |
| `frontend/` | Aplicación Ionic + React con *code splitting*, portadas reales, RAWG y módulos EF1 completos. |
| `backend/` | API REST Express 5 con seguridad avanzada (XSS/CSP/CORS/rate-limit), RAWG proxy y EF1. |
| `database/` | Script SQL reproducible (`14` tablas, índices compuestos y `FULLTEXT`, datos de ejemplo). |
| `postman/` | Colección actualizada (`86` solicitudes en `13` carpetas), environment y generador de reporte. |
| `docker-compose.yml` | Orquestación de MySQL 8, API Express y frontend Nginx con `healthcheck` y red interna. |
| `.env.example` | Plantilla de variables de entorno para el despliegue con Docker (sin secretos reales). |
| `capturas/` | Capturas de EP1, EP2 y evidencias de la Entrega Final. |

### Alcance y estado de las funcionalidades

| Funcionalidad | Requerimiento | API | Frontend | Estado |
| :--- | :--- | :--- | :--- | :--- |
| Registro de usuarios | FT-01 | `POST /api/auth/registro` | `/registro` | Implementado |
| Inicio de sesión con JWT | FT-02 | `POST /api/auth/login` | `/login` | Implementado |
| Cierre de sesión | FT-03 | El cliente descarta el token | Menú lateral | Implementado |
| Restricción por rol | FT-04 | Middleware `permitirRoles` | `Protegida` + menú por rol | Implementado |
| Explorar, filtrar, ordenar y paginar catálogo | RF-01 | `GET /api/publicaciones` | `/catalogo` | Implementado |
| Detalle de publicación, vendedor y ficha RAWG | RF-02 | `GET /api/publicaciones/:id`, `GET /api/juegos-externos/ficha` | `/publicacion/:id` | Implementado |
| Publicar videojuego (con portada y RAWG) | RF-03 | `POST /api/publicaciones`, `GET /api/juegos-externos/buscar` | `/publicar` | Implementado |
| Editar, pausar, reactivar y eliminar publicaciones propias | RF-04 | `PUT`, `PATCH /estado`, `DELETE /api/publicaciones/:id` | `/mis-publicaciones`, `/publicaciones/:id/editar` | Implementado |
| Gestionar favoritos | RF-05 | `GET`, `POST`, `DELETE /api/favoritos` | `/favoritos`, detalle | Implementado |
| Solicitud de compra | RF-06 | `POST /api/operaciones` | Detalle → modal de compra | Implementado |
| Consultar y gestionar operaciones | RF-07 | `GET /api/operaciones`, `PATCH /api/operaciones/:id/estado` | `/operaciones` | Implementado |
| Calificar operación completada y ver reseñas | RF-08 | `POST /api/calificaciones`, `GET /api/calificaciones/usuario/:id` | `/calificar/:operacionId`, `/perfil`, detalle | Implementado |
| Reportar publicación | RF-09 | `POST /api/reportes` | Modal en `/publicacion/:id` | Implementado |
| Moderar publicaciones y resolver reportes | RF-10 | `GET /api/reportes`, `PATCH /api/reportes/:id/resolver`, `GET /api/publicaciones/admin`, `PATCH /api/publicaciones/:id/moderacion` | `/admin`, `/admin/reportes`, `/admin/publicaciones` | Implementado |
| Gestión administrativa de usuarios | FT-04 | `GET /api/usuarios`, `PATCH /api/usuarios/:id/estado` | `/admin/usuarios` | Implementado |
| Perfil editable del usuario | RNF-SEG-03 | `PATCH /api/usuarios/perfil` | `/perfil` | Implementado |
| Notificaciones persistentes | EF1 | `GET /api/notificaciones`, `PATCH /leer`, `PATCH /leer-todas` | Campana en encabezado + `/notificaciones` | Implementado |

### EF1: Notificaciones persistentes y almacenamiento local

- **Notificaciones (`notificaciones`):** cada solicitud de compra, cambio de estado de operación, calificación recibida o acción de moderación administrativa registra una notificación en MySQL para la cuenta afectada. El componente `BotonNotificaciones` muestra un contador de no leídas en el encabezado y la bandeja `/notificaciones` permite marcar lectura individual o masiva y navegar directo a la vista relacionada.
- **Almacenamiento local (`frontend/src/services/almacenamiento.ts`):** además de persistir la sesión JWT (`replay.sesion`), `localStorage` guarda de forma segura los filtros activos del catálogo (`replay.filtros`), las últimas 5 búsquedas recientes (`replay.busquedas`) y el borrador automático del formulario de publicación (`replay.borrador_publicar`).

### EF2: Mejoras de UI/UX y optimización de rendimiento

- **Code splitting por ruta (`AppRoutes.tsx`):** las 11 vistas secundarias y administrativas utilizan `React.lazy` y `Suspense` para reducir la carga inicial en el navegador (chunks separados generados por Vite).
- **Portadas reales con carga diferida (`PortadaJuego.tsx`):** renderizado de fotografías con `loading="lazy"` y *fallback* automático al degradado con iniciales si no hay URL o falla la descarga.
- **Memoización y actualización ágil:** tarjetas memoizadas con `React.memo` (`TarjetaPublicacion.tsx`), paginación progresiva de 8 publicaciones en catálogo, selector de ordenamiento (`recientes`, `precio_asc`, `precio_desc`), *pull-to-refresh* con `IonRefresher` y caché en memoria para `GET /api/catalogos`.

### EF3 y EF4: Seguridad avanzada y optimización de consultas

- **Seguridad avanzada (EF3):** middleware `sanitizar.js` contra XSS sobre `req.body` y validadores, CSP explícita y `Referrer-Policy` en `helmet`, CORS estricto con rechazo `403`, *rate limiting* global sobre `/api` (`API_MAX_PETICIONES`) además del límite específico de `/api/auth`, y uso de `matchedData` contra asignación masiva.
- **Optimización de consultas (EF4):** índices compuestos (`idx_publicaciones_filtros`, `idx_publicaciones_vendedor`, `idx_operaciones_en_curso`) e índice `FULLTEXT` (`ft_publicaciones_busqueda`), reemplazo de subconsultas correlacionadas por `LEFT JOIN + GROUP BY`, exclusión de `clave_hash` en consultas públicas/listados, datos del vendedor embebidos en `GET /api/publicaciones/:id`, caché de catálogos con `Cache-Control: public, max-age=300`, indexación con `Map` en `O(1)` en operaciones y paginación real con `LIMIT/OFFSET`.

### EF5: Integración externa con RAWG API

Se integró la **RAWG Video Games Database API** porque resuelve una necesidad directa del marketplace sin requerir infraestructura compleja:

1. **Autocompletado al publicar (`/publicar`):** mediante `GET /api/juegos-externos/buscar?q=...`, la persona vendedora busca el título oficial y completa automáticamente el nombre, género compatible y portada oficial.
2. **Ficha técnica en el detalle (`/publicacion/:id`):** mediante `GET /api/juegos-externos/ficha?titulo=...`, el detalle enriquece la publicación con fecha de lanzamiento, nota Metacritic, valoración y plataformas oficiales de forma asíncrona sin bloquear la vista.
3. **Arquitectura resiliente:** el backend actúa como *proxy* protegiendo `RAWG_API_KEY` en variables de entorno, aplicando caché en memoria de 10 minutos (máximo 100 entradas), timeout de 5 segundos (`AbortSignal.timeout`) y *fallback* controlado (`disponible: false`) para que la aplicación siga operando normalmente si falta la clave o falla el servicio externo.

### EF6: Despliegue local con Docker y docker-compose

El repositorio incluye `backend/Dockerfile`, `frontend/Dockerfile` (*multi-stage* con Vite + Nginx `nginx.conf`), `.dockerignore` en ambos servicios, `docker-compose.yml` y `.env.example` en la raíz:

```bash
# 1. Crear el archivo de entorno raíz (no se sube a GitHub)
cp .env.example .env       # en Windows: copy .env.example .env

# 2. Completar MYSQL_ROOT_PASSWORD, JWT_SECRET (mín. 32 chars) y opcionalmente RAWG_API_KEY

# 3. Construir y levantar la base de datos, la API y el frontend desde cero
docker compose down -v
docker compose up --build
```

- **Frontend (Nginx):** <http://localhost:8080>
- **Backend (Express API):** <http://localhost:3000/api/salud>
- **MySQL 8 (puerto externo):** `localhost:3307` (evita colisión con XAMPP en el puerto 3306).

### Ramas del repositorio

| Rama | Uso |
| :--- | :--- |
| `main` | Entrega final integrada: `frontend/`, `backend/`, `database/`, `postman/`, archivos Docker y `README.md`. |
| `frontend` | Código y documentación del frontend en Ionic + React (actualizado hasta la Entrega Final). |
| `backend` | Código de la API REST, seguridad, integración RAWG y archivo `database/replay_games.sql`. |
| `prototipo` | Versión inicial entregada en EP1. |

### Trazabilidad con los requerimientos

| Requerimiento | Dónde se cumple |
| :--- | :--- |
| RNF-SEG-01 — Autenticación de funciones protegidas | `backend/src/middlewares/autenticacion.js` exige JWT válido en cada petición; en el frontend, `routes/Protegida.tsx`. |
| RNF-SEG-02 — Autorización por roles | Tabla `roles` y `backend/src/middlewares/autorizacion.js`; menú, pestañas y rutas protegidas por rol en el frontend. |
| RNF-SEG-03 — Minimización de datos | El perfil público no expone el correo; el token solo contiene `sub` y `rol`; `SELECT_USUARIO` excluye `clave_hash`. |
| RNF-SEG-04 — Protección de secretos | Credenciales, `JWT_SECRET` y `RAWG_API_KEY` en `.env` (ignorado por git), documentadas en `.env.example`. |
| RNF-SEG-05 — Protección XSS y abuso | `backend/src/middlewares/sanitizar.js`, `helmet` con CSP, CORS estricto y `express-rate-limit` global. |
| RNF-UX-03 — Retroalimentación | Errores por campo, alertas confirmadas, estados vacíos, notificaciones persistentes y avisos de borrador. |
| RNF-REN-01 — Rendimiento | Índices compuestos/`FULLTEXT`, caché de catálogos y RAWG, paginación `LIMIT/OFFSET` y *code splitting* (`React.lazy`). |
| RNF-MAN-01 — Estructura modular | Backend separado por capas (`routes`, `controllers`, `models`, `middlewares`, `validators`, `services`, `config`) y frontend modular. |

## Usuarios objetivo (Quién usará la aplicación)

El grupo objetivo son personas usuarias de consolas con formato físico interesadas en comprar o
vender videojuegos de segunda mano. Una misma cuenta permite ambas acciones, por lo que los perfiles
descritos a continuación representan momentos de uso y no cuentas distintas.

| Aspecto | Caracterización preliminar |
| :--- | :--- |
| Grupo objetivo | Personas usuarias de consolas con formato físico interesadas en comprar o vender videojuegos de segunda mano. |
| Características generales | Usuarios con distintos niveles de experiencia en aplicaciones de compraventa; pueden comparar precios, publicar productos y revisar información desde móvil o computador. |
| Necesidades | Buscar títulos concretos, comparar precio/estado, publicar con rapidez, conocer modalidades de entrega y disponer de señales de confianza. |
| Posibles dificultades | Información incompleta, fotografías poco claras, publicaciones mal clasificadas, estados descritos de forma desigual y dudas sobre la contraparte. |
| Contexto de uso | Consultas rápidas desde smartphone y uso complementario de computador para revisar o administrar varias publicaciones. |
| Tareas | Explorar, filtrar, revisar detalle, publicar, administrar publicaciones, guardar favoritos, iniciar y seguir operaciones, calificar y reportar. |
| Experiencia tecnológica estimada | Básica a intermedia; se asume familiaridad con patrones habituales de aplicaciones móviles y comercio electrónico. |
| Accesibilidad | Interfaz legible, jerarquía clara, mensajes de error comprensibles, controles identificables y diseño responsivo. |
| Seguridad y privacidad | Solicitar pocos datos personales, proteger las funciones según sesión/rol y evitar exponer información privada innecesaria. |

### Personas compradoras

Corresponde a jugadores y jugadoras que buscan videojuegos específicos para su consola y que suelen comparar distintas publicaciones antes de tomar una decisión de compra. Acceden principalmente desde dispositivos móviles, generalmente en sesiones breves, por lo que necesitan identificar con rapidez aspectos relevantes como el precio, el estado de conservación, la ubicación y la modalidad de entrega.


#### Necesidades principales

- Encontrar juegos compatibles con su consola mediante búsqueda y filtros.
- Comparar precio, estado de conservación y modalidad de entrega con criterios equivalentes.
- Revisar fotografías y la reputación de quien vende antes de iniciar una compra.
- Guardar publicaciones de interés y hacer seguimiento de la operación iniciada.

### Personas vendedoras

Personas que conservan videojuegos que ya no utilizan y que publican de forma ocasional. Fotografían
y publican desde el teléfono, pero prefieren el computador cuando administran varias publicaciones
al mismo tiempo.

#### Necesidades principales

- Publicar en pocos pasos, con campos guiados que eviten descripciones incompletas.
- Describir correctamente el estado del producto para reducir preguntas repetidas.
- Administrar sus publicaciones: editar, pausar, reactivar o eliminar según corresponda.
- Recibir solicitudes y hacer seguimiento hasta completar la operación.

### Administración de la plataforma

Corresponde a las personas responsables de revisar reportes, moderar publicaciones y supervisar el cumplimiento de las reglas definidas para la plataforma. Su uso se concentra principalmente en computadores de escritorio o portátiles, ya que requieren visualizar suficiente información antes de tomar una decisión de moderación.

#### Necesidades principales

- Revisar los reportes recibidos junto con la publicación asociada.
- Mantener visible u ocultar una publicación mediante una acción confirmada.
- Registrar la decisión tomada para mantener trazabilidad.

## Roles del Sistema

| Rol | Descripción |
| :--- | :--- |
| Usuario | Puede comprar y vender con una misma cuenta: explorar, publicar, administrar publicaciones, guardar favoritos, iniciar operaciones, calificar y reportar. |
| Administrador | Revisa reportes y modera publicaciones y usuarios según las reglas de la plataforma. |

### Definición de conceptos

**Rol:** conjunto de permisos y funcionalidades que el sistema habilita para un tipo de cuenta. El
rol determina qué rutas puede abrir una persona y qué acciones puede ejecutar, con independencia de
sus características personales.

**Proto-persona:** perfil hipotético de usuario construido a partir de fuentes secundarias, análisis
de soluciones existentes y supuestos razonados, que se utiliza para orientar decisiones de diseño
cuando todavía no se dispone de investigación con usuarios reales.

> *Nota metodológica:* los siguientes perfiles son hipotéticos. No corresponden a entrevistas ni a
> resultados obtenidos de usuarios reales.

### Proto-personas

Se definen tres proto-personas que cubren los dos roles del sistema: dos usos del rol Usuario
(compra y venta) y el rol Administrador.

### Proto-persona 1: Sebastián — comprador frecuente

#### Características generales

Estudiante universitario de 23 años, jugador frecuente y usuario habitual de aplicaciones móviles.

#### Necesidades principales

Encontrar juegos físicos compatibles con su consola, comparar precio y estado, revisar fotografías y
señales de confianza antes de comprometerse con una compra.

#### Objetivos de uso

Localizar un título, revisar alternativas, guardar favoritos e iniciar una compra.

#### Dificultades o puntos de frustración

Publicaciones incompletas, fotografías deficientes, información confusa sobre el estado del producto
y vendedores sin referencias.

#### Funcionalidades de la aplicación que utilizaría

Catálogo, filtros, detalle de publicación, favoritos, operaciones, calificaciones y reportes.

#### Dispositivo y contexto probable de acceso

Principalmente smartphone, en consultas rápidas y en la revisión previa a una compra.

### Proto-persona 2: Camila — vendedora ocasional

#### Características generales

Jugadora ocasional de 29 años que conserva juegos físicos que ya no utiliza; usa indistintamente
smartphone y computador.

#### Necesidades principales

Publicar con pocos pasos, describir correctamente el estado del producto y gestionar sus ventas
desde un mismo lugar.

#### Objetivos de uso

Crear una publicación clara, recibir una solicitud y hacer seguimiento hasta completar la operación.

#### Dificultades o puntos de frustración

Formularios extensos, repetición de preguntas por parte de interesados y dificultad para organizar
varias publicaciones.

#### Funcionalidades de la aplicación que utilizaría

Publicar, editar y pausar publicaciones, mis publicaciones, operaciones, perfil y calificaciones.

#### Dispositivo y contexto probable de acceso

Teléfono para fotografiar y publicar; computador cuando administra varias publicaciones.

### Proto-persona 3: Daniel — administrador

#### Características generales

Adulto con experiencia básica o intermedia en herramientas administrativas web.

#### Necesidades principales

Revisar reportes con contexto suficiente y aplicar acciones de moderación de manera controlada.

#### Objetivos de uso

Identificar el motivo del reporte, revisar la publicación asociada y registrar una decisión.

#### Dificultades o puntos de frustración

Reportes ambiguos, falta de confirmación en acciones sensibles y poca trazabilidad de lo realizado.

#### Funcionalidades de la aplicación que utilizaría

Panel administrativo, reportes, moderación de publicaciones y gestión de usuarios.

#### Dispositivo y contexto probable de acceso

Principalmente computador de escritorio o portátil.

### Supuestos utilizados

Para construir la caracterización de los usuarios y las proto-personas se consideraron supuestos razonados a partir del problema identificado, las fuentes secundarias consultadas y el análisis de plataformas de compraventa existentes.

Los principales supuestos considerados son:

- Las personas usuarias accederán principalmente desde dispositivos móviles para realizar consultas rápidas, aunque también podrán utilizar computadores para administrar publicaciones o revisar información con mayor detalle.
- Una misma cuenta permitirá realizar acciones tanto de compra como de venta, por lo que comprador y vendedor representan contextos de uso y no roles independientes dentro del sistema.
- El precio, la consola compatible, el estado de conservación, las fotografías, la ubicación y la modalidad de entrega serán aspectos relevantes al momento de comparar publicaciones.
- Las personas compradoras valorarán disponer de información estructurada y señales de confianza antes de iniciar una operación.
- Las personas vendedoras preferirán un proceso de publicación sencillo, guiado y que facilite la descripción del estado del videojuego.
- Las calificaciones vinculadas a operaciones completadas pueden aportar información adicional sobre la experiencia previa entre usuarios.
- Las tareas de moderación y revisión de reportes serán realizadas principalmente desde computadores, debido a que requieren visualizar mayor cantidad de información antes de tomar una decisión.

> **Nota:** Estos supuestos corresponden a una caracterización preliminar elaborada mediante fuentes secundarias y análisis de soluciones existentes. No representan resultados obtenidos mediante entrevistas, encuestas u otras técnicas de investigación directa con usuarios reales.

## Requerimientos

Los requerimientos funcionales no contabilizan el registro ni el inicio de sesión, ya que esas
funciones se documentan como funcionalidades transversales.

## Requerimientos Funcionales por Rol

| ID | Nombre | Descripción | Rol |
| :--- | :--- | :--- | :--- |
| RF-01 | Explorar y filtrar catálogo | El sistema deberá permitir visualizar las publicaciones disponibles y buscar o filtrar videojuegos por título, consola, género, rango de precio, estado de conservación y ubicación. | Usuario |
| RF-02 | Consultar detalle de publicación | El sistema deberá permitir visualizar el detalle de una publicación, incluyendo fotografías, título, consola, género, precio, estado de conservación, descripción, ubicación, modalidad de entrega y datos públicos del vendedor. | Usuario |
| RF-03 | Publicar videojuego | El sistema deberá permitir al usuario crear una publicación de un videojuego físico, ingresando los datos obligatorios definidos por la plataforma y fotografías del producto. | Usuario |
| RF-04 | Gestionar publicaciones propias | El sistema deberá permitir al usuario editar, pausar, reactivar o eliminar sus propias publicaciones, siempre que el estado de la operación asociada lo permita. | Usuario |
| RF-05 | Gestionar favoritos | El sistema deberá permitir agregar y eliminar publicaciones de una lista personal de favoritos y consultar dicha lista posteriormente. | Usuario |
| RF-06 | Iniciar solicitud de compra | El sistema deberá permitir iniciar una solicitud de compra sobre una publicación disponible y seleccionar una modalidad de entrega definida por el vendedor. | Usuario |
| RF-07 | Consultar y gestionar operaciones | El sistema deberá permitir al comprador y al vendedor consultar sus operaciones y visualizar su estado: pendiente, confirmada, completada o cancelada. | Usuario |
| RF-08 | Calificar una operación completada | El sistema deberá permitir registrar una calificación y una reseña únicamente cuando exista una operación completada entre comprador y vendedor. | Usuario |
| RF-09 | Reportar publicación | El sistema deberá permitir reportar una publicación mediante un motivo predefinido y un comentario opcional. | Usuario |
| RF-10 | Moderar publicaciones y reportes | El sistema deberá permitir al administrador consultar reportes, revisar la publicación asociada, mantenerla visible u ocultarla y registrar la acción de moderación realizada. | Administrador |

## Funcionalidades Transversales

| ID | Funcionalidad | Descripción |
| :--- | :--- | :--- |
| FT-01 | Registro de usuarios | Crear una cuenta con los datos mínimos definidos. |
| FT-02 | Inicio de sesión | Ingresar mediante credenciales válidas. |
| FT-03 | Cierre de sesión | Finalizar una sesión activa. |
| FT-04 | Restricción por rol | Limitar funcionalidades según Usuario o Administrador. |

## Requerimientos No Funcionales

### UX y Usabilidad

#### RNF-UX-01 — Diseño adaptable

La interfaz deberá adaptarse a dispositivos móviles y de escritorio sin pérdida de funcionalidades
esenciales ni información crítica.

#### RNF-UX-02 — Navegación consistente

La aplicación deberá mantener nombres, ubicación y comportamiento coherentes para los controles
principales entre sus distintas vistas.

#### RNF-UX-03 — Retroalimentación al usuario

Las acciones relevantes deberán mostrar estados de carga, confirmación o mensajes de error
comprensibles.

### Accesibilidad

#### RNF-ACC-01 — Accesibilidad de la interfaz

Los formularios y controles deberán utilizar etiquetas comprensibles, jerarquía visual clara,
contraste adecuado y navegación mediante teclado cuando corresponda.

### Seguridad

#### RNF-SEG-01 — Autenticación de funciones protegidas

Las funciones de publicación, favoritos, operaciones, calificación, reportes y administración
deberán requerir una sesión válida.

#### RNF-SEG-02 — Autorización por roles

El sistema deberá verificar el rol del usuario antes de permitir el acceso a funciones
administrativas.

#### RNF-SEG-03 — Privacidad y minimización de datos

El registro inicial deberá solicitar únicamente los datos necesarios para crear y utilizar la
cuenta, evitando exponer información privada innecesaria.

#### RNF-SEG-04 — Protección de secretos

Credenciales, claves de API y secretos no deberán publicarse en el repositorio ni escribirse
directamente en el código fuente.

### Rendimiento
#### RNF-REN-01 — Rendimiento de consultas

Las vistas principales de catálogo, detalle y operaciones deberán mostrar su contenido principal en un tiempo máximo de 3 segundos bajo las condiciones normales definidas para las pruebas del sistema.

### Compatibilidad y mantenibilidad

#### RNF-COMP-01 — Compatibilidad

La versión web deberá funcionar correctamente en navegadores modernos y conservar su funcionalidad
en tamaños de pantalla móviles y de escritorio.

#### RNF-MAN-01 — Estructura modular

El frontend deberá organizarse modularmente en `pages`, `components`, `routes`, `services`, `models`
y `data`, evitando duplicación innecesaria.

## Arquitectura de Navegación

### 1. Rutas principales y secundarias

#### Rutas públicas

| Ruta | Vista | Descripción |
| :--- | :--- | :--- |
| `/` | Redirección inicial | Redirige al catálogo principal de la aplicación. |
| `/catalogo` | Catálogo | Permite explorar, buscar y filtrar las publicaciones disponibles. |
| `/publicacion/:id` | Detalle de publicación | Muestra la información completa de una publicación. |
| `/login` | Inicio de sesión | Permite ingresar con credenciales. |
| `/registro` | Registro | Permite crear una cuenta. |


> Implementadas en EP1: todas.

#### Rutas protegidas del Usuario

| Ruta | Vista | Descripción |
| :--- | :--- | :--- |
| `/favoritos` | Favoritos | Publicaciones guardadas por el usuario. |
| `/publicar` | Publicar videojuego | Formulario para crear una publicación. |
| `/mis-publicaciones` | Mis publicaciones | Permite administrar publicaciones propias. |
| `/publicaciones/:id/editar` | Editar publicación | Permite modificar una publicación propia. |
| `/operaciones` | Compras y ventas | Consulta del estado de las operaciones del usuario. |
| `/calificar/:operacionId` | Calificar operación | Permite calificar una operación completada. |
| `/perfil` | Perfil | Muestra información pública, reseñas y datos editables del usuario. |
| `/notificaciones` | Notificaciones | Bandeja compartida para revisar avisos del sistema con lectura individual o masiva. |

> Implementadas en Entrega Final: todas las rutas de usuario y notificaciones.

#### Rutas protegidas del Administrador

| Ruta | Vista | Descripción |
| :--- | :--- | :--- |
| `/admin` | Panel administrador | Resumen de moderación y accesos rápidos. |
| `/admin/reportes` | Reportes | Listado, filtros por estado y resolución de reportes. |
| `/admin/publicaciones` | Moderación de publicaciones | Permite mantener u ocultar publicaciones. |
| `/admin/usuarios` | Usuarios | Vista administrativa de usuarios. |

> Implementadas en Entrega Final: todas las rutas administrativas.

### 2. Relaciones jerárquicas entre vistas

```
Aplicación
├── Rutas públicas
│   ├── Inicio / Catálogo
│   ├── Detalle de publicación
│   ├── Login
│   └── Registro
└── Rutas protegidas
    ├── Usuario
    │   ├── Favoritos
    │   ├── Publicar
    │   ├── Mis publicaciones
    │   ├── Operaciones
    │   ├── Calificar
    │   └── Perfil
    └── Administrador
        ├── Panel
        ├── Reportes
        ├── Publicaciones
        └── Usuarios
```

## Diferenciación de acceso según roles

### Matriz de acceso por rol

| Funcionalidad | Visitante | Usuario | Administrador |
| :--- | :---: | :---: | :---: |
| Explorar catálogo y ver detalle | Sí | Sí | Sí |
| Registrar / iniciar sesión | Sí | — | — |
| Publicar y gestionar publicaciones propias | — | Sí | — |
| Favoritos | — | Sí | — |
| Iniciar y consultar operaciones | — | Sí | — |
| Calificar operación completada | — | Sí | — |
| Reportar publicación | — | Sí | — |
| Moderar reportes y publicaciones | — | — | Sí |
| Gestionar usuarios | — | — | Sí |

### Acceso del Visitante

Puede explorar el catálogo, aplicar filtros y abrir el detalle de cualquier publicación disponible.
Al intentar una acción protegida —comprar, publicar o revisar operaciones— la aplicación lo dirige
al inicio de sesión y lo devuelve a la pantalla solicitada una vez autenticado.

### Acceso del Usuario

Dispone de todas las funciones de compra y venta con una misma cuenta: publicar y administrar sus
publicaciones, guardar favoritos, iniciar operaciones, calificar operaciones completadas y reportar
publicaciones. No accede a las rutas administrativas.

### Acceso del Administrador

Accede al panel de moderación, a los reportes, a la moderación de publicaciones y a la vista
administrativa de usuarios. Las acciones sensibles requieren confirmación y quedan registradas.

### Control de acceso a rutas

El control está implementado en `frontend/src/routes/` y se repite en el backend, que verifica el
token y el rol en cada solicitud (ver [Seguridad](#seguridad-1)):

- `AppRoutes.tsx` declara cada ruta dentro del `IonRouterOutlet`; las protegidas envuelven su página
  en el componente `Protegida` con el rol que exigen.
- `Protegida.tsx` verifica la sesión y el rol antes de mostrar el contenido:

```tsx
rutaProtegida('publicar', RUTAS.publicar, PublicarPage, 'usuario'),
rutaProtegida('admin-usuarios', RUTAS.adminUsuarios, AdminUsuariosPage, 'administrador'),

// rutaProtegida genera:
<Route exact path={ruta} render={() => (
  <Protegida rol={rol}>
    <Pagina />
  </Protegida>
)} />
```

- Sin sesión iniciada, redirige a `/login` recordando la ruta pedida mediante un parámetro en la URL
  (`/login?volver=/publicar`) y vuelve a ella después de autenticarse.
- Con un rol distinto al exigido (`<Protegida rol="administrador">`), devuelve al catálogo con un
  aviso de permisos insuficientes.

## Flujos de Tareas

### Task Flow 1: Buscar e iniciar una compra

```
Inicio / Catálogo
      ↓
Buscar o aplicar filtros
      ↓
Seleccionar publicación
      ↓
Revisar detalle y vendedor
      ↓
Comprar
      ↓
¿Sesión iniciada?
  No → Login → regresar al detalle
  Sí
      ↓
Seleccionar modalidad de entrega
      ↓
Confirmar solicitud
      ↓
Operación creada → Mis operaciones → Completar → Calificar
```

### Task Flow 2: Publicar un videojuego

```
Login → Publicar → Ingresar datos → Agregar fotografías → Revisar
                         ↓
                    ¿Datos válidos?
                    No → mostrar errores
                    Sí → publicar → confirmación → Mis publicaciones
```

### Task Flow 3: Moderar un reporte

```
Login administrador → Panel → Reportes → Seleccionar reporte
      ↓
Revisar publicación → Mantener visible / Ocultar → Confirmar → Registrar resultado
```

### Puntos críticos de interacción

1. **Inicio de sesión y acceso por rol:** mensajes claros y bloqueo de rutas no autorizadas.
2. **Formulario de publicación:** validación de campos obligatorios, conservación de los datos ya
   escritos y confirmación antes de publicar.
3. **Disponibilidad:** una publicación vendida o pausada no debe permitir una nueva operación.
4. **Confirmación de compra:** mostrar el resumen del producto y la modalidad de entrega antes de
   crear la operación.
5. **Calificación:** habilitarla solo para operaciones completadas.
6. **Moderación:** solicitar confirmación y registrar las acciones sensibles.
7. **Cambio entre web y móvil:** mantener etiquetas, funciones y lógica aunque cambie la
   distribución visual.

### Justificación Técnica

En móvil se utiliza una barra inferior mediante `IonTabs`; en web, un `IonMenu` lateral fijo dentro
de un `IonSplitPane`. Las mismas funciones mantienen nombres y comportamientos coherentes, mientras
la grilla, los filtros y los formularios se reorganizan según el ancho disponible.

### Usabilidad

La navegación es predecible: las secciones principales están siempre visibles en la barra inferior o
en el menú lateral, con las mismas etiquetas en ambas versiones, y cada pantalla informa su estado
mediante cargas, confirmaciones y mensajes de error comprensibles.

### Eficiencia de interacción

Los recorridos son breves. Desde el catálogo se llega al detalle en un toque y a la solicitud de
compra en dos; los filtros se aplican sin salir de la vista de resultados y el formulario de
publicación agrupa los campos en un solo paso con validación inmediata.

### Claridad estructural

La separación entre rutas públicas, de Usuario y de Administrador hace explícito qué requiere sesión
y qué requiere un rol específico, tanto en la navegación como en el código.

### Escalabilidad

La estructura modular y el acceso a datos aislado en `services/` permiten incorporar la API REST de
EP2 sin reorganizar el frontend: solo cambia la implementación de esos servicios.

## Bocetos UI/UX

Prototipo construido manualmente por el equipo en Figma, sin utilizar asistentes de IA generativa
para crear automáticamente pantallas, componentes, estilos, navegación o prototipo.

**Enlace público de Figma:** *https://www.figma.com/design/HjfX9dFW7dpfEzYFaPNR0Z/Figma-Web?node-id=0-1&t=1ShxU2N3ZS4MXlIQ-1*

El prototipo incluye siete pantallas asociadas a las funcionalidades principales del sistema, además de las vistas de Inicio de sesión y Registro. Todas las interfaces fueron diseñadas en versiones móvil y web, manteniendo una navegación, jerarquía visual y distribución de contenidos coherentes entre ambos formatos.

| N° | Pantalla | RF / función | Contenido |
| :--- | :--- | :--- | :--- |
| 1 | Catálogo / inicio | RF-01 | Buscador, filtros, grilla o lista de juegos, precio, consola, estado y ubicación. |
| 2 | Detalle del videojuego | RF-02 | Fotografías, datos del producto, vendedor, reputación, entrega, favorito y acción de compra. |
| 3 | Publicar videojuego | RF-03 | Formulario con título, consola, género, estado, precio, descripción, ubicación, entrega e imágenes. |
| 4 | Mis publicaciones | RF-04 | Listado propio con edición, pausa, reactivación y eliminación según estado. |
| 5 | Favoritos | RF-05 | Listado de publicaciones guardadas y acceso al detalle. |
| 6 | Mis compras y ventas | RF-06 / RF-07 / RF-08 | Operaciones separadas por tipo y estado, confirmaciones y acceso a calificación cuando corresponda. |
| 7 | Administración de reportes | RF-09 / RF-10 | Listado de reportes, detalle de publicación y acciones de moderación. |
| 8 | Inicio de sesión | FT-02 | Correo o usuario, contraseña, mensajes de error y redirección posterior. |
| 9 | Registro | FT-01 | Usuario, correo, contraseña, confirmación, región o comuna opcional y aceptación de términos, con validaciones. |

### Adaptación web y móvil

- **Web:** mayor densidad de información, filtros visibles y navegación lateral o superior.
- **Móvil:** contenido priorizado, filtros desplegables y navegación inferior.
- Se mantiene la jerarquía visual, los nombres de las acciones y los estados de interacción en ambas
  versiones.

### Formulario de registro y justificación de datos

| Campo | Condición | Justificación |
| :--- | :--- | :--- |
| Nombre de usuario | Obligatorio | Identificación pública dentro de la plataforma. |
| Correo electrónico | Obligatorio | Identificación de cuenta y recuperación de acceso. |
| Contraseña | Obligatorio | Autenticación del usuario. |
| Confirmación de contraseña | Obligatorio | Disminuir errores al crear la cuenta. |
| Región o comuna | Opcional | Apoyar búsquedas y coordinación de entregas sin solicitar una dirección exacta. |
| Aceptación de términos | Obligatorio | Registrar aceptación de las reglas de uso. |

No se solicita RUT, dirección exacta, teléfono ni fecha de nacimiento durante el registro inicial,
porque no son necesarios para las funcionalidades definidas en EP1 (RNF-SEG-03).

### Validaciones consideradas en el registro
El formulario diferencia visualmente los campos obligatorios y opcionales e informa el formato esperado de los datos ingresados. También considera validaciones de entrada, mensajes de error comprensibles y retroalimentación al completar correctamente el registro.
La contraseña deberá cumplir las condiciones de seguridad definidas para la aplicación y coincidir con el campo de confirmación antes de permitir la creación de la cuenta.


## Frontend con Ionic-React

### Estado de esta entrega

En EP1 se construyó la estructura base en Ionic + React; en EP2 se integró la API REST y, en esta **Entrega Final**, se completan todas las pantallas comprometidas (`Favoritos`, `Calificar`, `Perfil`, `Notificaciones`, `Panel Administrador`, `Reportes` y `Moderación de publicaciones`), la integración con RAWG para portadas y fichas técnicas, almacenamiento local extendido y optimizaciones de rendimiento (*code splitting*, `React.memo`, carga diferida de imágenes, ordenamiento y paginación progresiva).

### Pantallas implementadas

| Pantalla | Ruta | RF / función | Estado |
| :--- | :--- | :--- | :--- |
| Catálogo | `/catalogo` | RF-01, EF1, EF2 | Búsqueda, filtros persistidos en `localStorage`, ordenamiento, paginación progresiva y `IonRefresher`. |
| Detalle de publicación | `/publicacion/:id` | RF-02, RF-05, RF-06, RF-09, EF5 | Portada real, ficha técnica RAWG, favorito real, compra, reseñas del vendedor y modal de reporte. |
| Favoritos | `/favoritos` | RF-05 | Grilla personal sincronizada con la API. |
| Publicar / Editar | `/publicar`, `/publicaciones/:id/editar` | RF-03, RF-04, EF1, EF5 | Autocompletado desde RAWG, vista previa de portada, catálogos dinámicos y borrador automático en `localStorage`. |
| Mis publicaciones | `/mis-publicaciones` | RF-04 | Editar, pausar, reactivar y eliminar (con confirmación). |
| Compras y ventas | `/operaciones` | RF-06, RF-07, RF-08 | Seguimiento por estado y acceso directo a calificación en operaciones completadas. |
| Calificar operación | `/calificar/:operacionId` | RF-08 | Selector interactivo de 1 a 5 estrellas y reseña opcional. |
| Perfil | `/perfil` | RNF-SEG-03, RF-08 | Edición de nombre de usuario y ubicación, reputación e historial de reseñas. |
| Notificaciones | `/notificaciones` | EF1 | Bandeja con marcado individual/masivo y contador en el encabezado. |
| Panel administrador | `/admin` | RF-10 | Métricas de reportes, publicaciones y cuentas con accesos directos. |
| Reportes | `/admin/reportes` | RF-09, RF-10 | Filtros por estado y resolución confirmada (`ocultar`, `mantener`, `descartar`). |
| Moderación de publicaciones | `/admin/publicaciones` | RF-10 | Listado completo con visibilidad y cantidad de reportes pendientes. |
| Administración de usuarios | `/admin/usuarios` | FT-04 | Activar o desactivar cuentas. |
| Inicio de sesión y Registro | `/login`, `/registro` | FT-01, FT-02 | Validaciones, errores por campo y regreso a ruta protegida. |

## Backend: API REST con Node.js y Express

### Tecnologías por capa

| Capa | Tecnologías |
| :--- | :--- |
| Frontend | Ionic 8, React 18, React Router 5, TypeScript 5.9, Vite 7 |
| Backend | Node.js (20.19+ o 22.12+), Express 5, express-validator, helmet, cors, express-rate-limit, morgan |
| Autenticación | JSON Web Tokens (`jsonwebtoken`, HS256) y `bcryptjs` para el hash de contraseñas |
| Base de datos | MySQL 8 o MariaDB 10.4+ (XAMPP o contenedor), driver `mysql2` con pool de conexiones |
| Servicio externo | RAWG Video Games Database API vía `fetch` nativo y caché en memoria (EF5) |
| Despliegue | Docker y `docker-compose` (MySQL 8, Node 20 Alpine, Nginx 1.27 Alpine) |
| Pruebas de API | Postman (colección v2.1 con 86 solicitudes) y newman para ejecutarla desde consola |

### Arquitectura

```mermaid
flowchart LR
  A["Frontend Ionic + React<br/>Nginx / Vite"] -- "HTTP + JSON<br/>Authorization: Bearer JWT" --> B["API Express<br/>/api"]
  B --> C["Middlewares<br/>helmet CSP, cors estricto, rate-limit,<br/>sanitizar XSS, JWT, roles, validación"]
  C --> D["Controladores y Servicios<br/>reglas de negocio + proxy RAWG"]
  D --> E["Modelos<br/>SQL parametrizado e índices"]
  E --> F[("MySQL 8 / MariaDB<br/>replay_games (14 tablas)")]
  D -. "HTTPS + caché + fallback" .-> G["API Externa<br/>RAWG Games"]
```

Cada solicitud pasa por las cabeceras CSP, CORS estricto, límite global de tasa y sanitización XSS, luego por la autenticación JWT y reglas de `express-validator`, y finalmente por el controlador y modelo SQL parametrizado.

### Estructura de carpetas

```
RePlay-Games/
├── README.md
├── .env.example                  # Variables de entorno para Docker Compose (sin secretos)
├── docker-compose.yml            # Orquestación de MySQL 8, backend y frontend Nginx
├── capturas/                     # Capturas de EP1, EP2 y evidencias finales
├── database/
│   └── replay_games.sql          # Modelo relacional (14 tablas, índices y datos semilla)
├── postman/
│   ├── RePlay-Games.postman_collection.json
│   ├── RePlay-Games.postman_environment.json
│   ├── generar-reporte.js
│   └── resultados/resultados.md
├── backend/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js                # Express: helmet CSP, cors estricto, rate-limit, XSS
│       ├── config/               # env.js y db.js (pool mysql2)
│       ├── middlewares/          # autenticacion, autorizacion, sanitizar, validar, errores
│       ├── validators/           # Reglas express-validator por recurso
│       ├── services/             # rawgService.js (API externa + caché + fallback)
│       ├── controllers/          # auth, usuarios, publicaciones, operaciones, favoritos, calificaciones, reportes, notificaciones, catalogos, juegosExternos
│       ├── models/               # Consultas SQL parametrizadas y mapeo a JSON
│       ├── routes/               # Definición de endpoints bajo /api
│       └── utils/                # ErrorHttp y emisión/verificación de JWT
└── frontend/
    ├── .dockerignore
    ├── .env.example
    ├── Dockerfile                # Multi-stage build (Vite + Nginx)
    ├── nginx.conf                # Try-files SPA, gzip y cabeceras de seguridad
    └── src/
        ├── App.tsx               # Split pane + menú + tabs según rol
        ├── components/           # PortadaJuego, TarjetaPublicacion, BotonNotificaciones, modales...
        ├── context/              # SesionContext
        ├── data/                 # Catálogos de respaldo y cuenta de demostración
        ├── models/               # Tipos TypeScript del dominio
        ├── pages/                # Páginas públicas, de usuario y administrativas (con lazy loading)
        ├── routes/               # AppRoutes (React.lazy), Protegida, navegacion, rutas
        ├── services/             # api.ts, almacenamiento.ts y servicios por recurso (incl. RAWG y catálogos)
        ├── theme/                # Estilos
        └── utils/                # Formato de precios y fechas
```

### Instalación y ejecución local

**Opción recomendada (Docker Compose):** ver sección [EF6: Despliegue local con Docker y docker-compose](#ef6-despliegue-local-con-docker-y-docker-compose) para levantar MySQL 8, la API y Nginx con `docker compose up --build`.

**Opción manual (sin Docker):** requisitos **Node.js 20.19+ o 22.12+**, npm y **MySQL 8** o **MariaDB 10.4+** (XAMPP sirve).

**1. Base de datos.** El script crea la base `replay_games` desde cero con sus datos de ejemplo:

```bash
mysql -u root -p < database/replay_games.sql
```

También se puede importar desde **phpMyAdmin** (pestaña *Importar*) o abrir y ejecutar el archivo en
**MySQL Workbench**. Volver a ejecutarlo deja la base en su estado inicial.

Opcionalmente, crear un usuario con permisos mínimos para la API en lugar de usar `root`:

```sql
CREATE USER 'replay_app'@'localhost' IDENTIFIED BY 'cambia-esta-clave';
GRANT SELECT, INSERT, UPDATE, DELETE ON replay_games.* TO 'replay_app'@'localhost';
```

**2. Backend** (queda en <http://localhost:3000/api>):

```bash
cd backend
npm install
cp .env.example .env        # en Windows: copy .env.example .env
```

Editar `backend/.env`: completar `DB_USER` y `DB_PASSWORD` y escribir en `JWT_SECRET` un texto aleatorio
de al menos 32 caracteres. Se puede generar con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

```bash
npm run dev                 # o npm start
```

Para comprobarlo, abrir <http://localhost:3000/api/salud>, que debe responder
`{"estado":"ok","baseDatos":"conectada"}`.

**3. Frontend** (queda en <http://localhost:5173>), en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend usa `http://localhost:3000/api` por defecto. Para otra dirección, copiar
`frontend/.env.example` como `frontend/.env` y cambiar `VITE_API_URL`.

| Comando | Carpeta | Descripción |
| :--- | :--- | :--- |
| `npm run dev` | `backend/` | API con recarga automática al guardar cambios. |
| `npm start` | `backend/` | API en modo normal. |
| `npm run test:api` | `backend/` | Ejecuta la colección de Postman con newman y genera `postman/resultados/resultados.md`. |
| `npm run dev` | `frontend/` | Servidor de desarrollo de Vite. |
| `npm run build` | `frontend/` | Verifica los tipos y genera la versión de producción. |

#### Cuentas de prueba

Todas las cuentas de ejemplo usan la contraseña `replay123`.

| Correo | Rol | Uso sugerido |
| :--- | :--- | :--- |
| `usuario@replay.cl` | usuario | Vendedor con publicaciones, compras y ventas. |
| `camila@replay.cl` | usuario | Segunda cuenta para comprar publicaciones de la primera. |
| `diego@replay.cl`, `fernanda@replay.cl` | usuario | Cuentas adicionales. |
| `admin@replay.cl` | administrador | Administración de usuarios y moderación. |

#### Problemas frecuentes

| Síntoma | Causa y solución |
| :--- | :--- |
| `Falta la variable de entorno JWT_SECRET` al iniciar el backend | No existe `backend/.env` o está incompleto. Copiar `.env.example` y completar los valores. |
| `No fue posible conectar con la base de datos` | MySQL no está iniciado, no se importó `database/replay_games.sql` o `DB_USER`/`DB_PASSWORD` no coinciden. |
| El frontend muestra "No fue posible conectar con el servidor" | El backend no está en ejecución o `VITE_API_URL` apunta a otra dirección. |
| Error de CORS en la consola del navegador | El origen del frontend no está en `CORS_ORIGIN` de `backend/.env` (`.env.example` incluye `http://localhost:5173` y `http://localhost:8100`). |
| `429 Demasiados intentos fallidos` | Se superó el límite de intentos fallidos de login/registro. Esperar 15 minutos, reiniciar el backend o subir `AUTH_MAX_INTENTOS` en `.env`. |
| Tildes o "ñ" con caracteres extraños | La base se importó con otra codificación. Volver a ejecutar el script completo, que fuerza `utf8mb4`. |

### Documentación de la API

- **URL base:** `http://localhost:3000/api`
- **Formato:** JSON en solicitudes y respuestas.
- **Autenticación:** encabezado `Authorization: Bearer <token>` con el token entregado por el login o el registro.
- **Errores:** siempre `{ "mensaje": "...", "errores": [{ "campo": "...", "mensaje": "..." }] }`; `errores` solo aparece cuando hay datos inválidos.

#### Endpoints

| Método | Ruta | Acceso | Descripción | Respuestas |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/salud` | Público | Estado de la API y de la base de datos | 200 |
| GET | `/catalogos` | Público | Consolas, géneros, estados, modalidades, regiones y comunas | 200 |
| POST | `/auth/registro` | Público | Crea una cuenta con rol usuario e inicia sesión | 201, 400, 409, 429 |
| POST | `/auth/login` | Público | Inicia sesión y entrega el JWT | 200, 400, 401, 403, 429 |
| GET | `/auth/perfil` | Sesión | Datos de la cuenta autenticada | 200, 401 |
| PATCH | `/usuarios/perfil` | Sesión | Actualiza nombre de usuario, región o comuna propios | 200, 400, 401, 409 |
| GET | `/usuarios/:id` | Público | Perfil público del vendedor (sin correo) | 200, 400, 404 |
| GET | `/usuarios` | Administrador | Lista de cuentas | 200, 401, 403 |
| PATCH | `/usuarios/:id/estado` | Administrador | Activa o desactiva una cuenta | 200, 400, 401, 403, 404 |
| GET | `/publicaciones` | Público | Catálogo con filtros, `orden` (`recientes`, `precio_asc`, `precio_desc`) y paginación (`page`, `limit`) | 200, 400 |
| GET | `/publicaciones/mias` | Usuario | Publicaciones propias en cualquier estado | 200, 401, 403 |
| GET | `/publicaciones/admin` | Administrador | Listado administrativo con cantidad de reportes pendientes | 200, 401, 403 |
| GET | `/publicaciones/:id` | Público | Detalle de publicación con datos públicos del vendedor embebidos | 200, 400, 404 |
| POST | `/publicaciones` | Usuario | Crea una publicación (con `imagenUrl` opcional) | 201, 400, 401, 403 |
| PUT | `/publicaciones/:id` | Dueño | Reemplaza los datos de una publicación propia | 200, 400, 401, 403, 404, 409 |
| PATCH | `/publicaciones/:id/estado` | Dueño | Pausa o reactiva (`activa` / `pausada`) | 200, 400, 401, 403, 404, 409 |
| DELETE | `/publicaciones/:id` | Dueño o administrador | Elimina una publicación sin operaciones | 204, 401, 403, 404, 409 |
| PATCH | `/publicaciones/:id/moderacion` | Administrador | Oculta o vuelve a mostrar una publicación y notifica al vendedor | 200, 400, 401, 403, 404 |
| GET | `/operaciones` | Usuario | Compras y ventas de la cuenta, con publicación y contraparte | 200, 401, 403 |
| POST | `/operaciones` | Usuario | Solicitud de compra; queda `pendiente` y notifica al vendedor | 201, 400, 401, 403, 404, 409 |
| PATCH | `/operaciones/:id/estado` | Comprador o vendedor | Cambia el estado y notifica a la contraparte | 200, 400, 401, 403, 404, 409 |
| GET | `/favoritos` | Usuario | Publicaciones guardadas en favoritos | 200, 401, 403 |
| GET | `/favoritos/ids` | Usuario | Lista de IDs de publicaciones favoritas | 200, 401, 403 |
| POST | `/favoritos/:id` | Usuario | Agrega una publicación a favoritos | 201, 400, 401, 403, 404 |
| DELETE | `/favoritos/:id` | Usuario | Quita una publicación de favoritos | 204, 400, 401, 403 |
| POST | `/calificaciones` | Usuario | Califica una operación completada y recalcula la reputación | 201, 400, 401, 403, 404, 409 |
| GET | `/calificaciones/usuario/:id` | Público | Historial público de reseñas recibidas por un usuario | 200, 400, 404 |
| POST | `/reportes` | Usuario | Envía un reporte sobre una publicación ajena | 201, 400, 401, 403, 404, 409 |
| GET | `/reportes/resumen` | Administrador | Contadores de reportes, publicaciones y cuentas | 200, 401, 403 |
| GET | `/reportes` | Administrador | Lista reportes con filtro opcional por `estado` | 200, 400, 401, 403 |
| PATCH | `/reportes/:id/resolver` | Administrador | Resuelve reporte (`mantener`, `ocultar`, `descartar`) y notifica | 200, 400, 401, 403, 404 |
| GET | `/notificaciones` | Sesión | Lista notificaciones y total de no leídas | 200, 401 |
| PATCH | `/notificaciones/:id/leer` | Sesión | Marca una notificación como leída | 200, 400, 401, 404 |
| PATCH | `/notificaciones/leer-todas` | Sesión | Marca todas las notificaciones del usuario como leídas | 200, 401 |
| GET | `/juegos-externos/buscar` | Sesión | Busca videojuegos en RAWG API (`?q=...`) con caché y *fallback* | 200, 400, 401 |
| GET | `/juegos-externos/ficha` | Público | Obtiene ficha técnica oficial en RAWG API (`?titulo=...`) | 200, 400 |

Significado de los códigos: **200** correcto, **201** creado (con encabezado `Location`), **204** eliminado
sin contenido, **400** datos inválidos, **401** sin sesión o token inválido/expirado, **403** sesión
válida sin permiso (rol o dueño), **404** no existe, **409** conflicto con el estado actual (correo
duplicado, publicación vendida, transición no permitida...), **429** demasiados intentos, **500** error
inesperado (sin detalles internos).

#### Reglas de las operaciones

| Quién | Desde | Puede pasar a |
| :--- | :--- | :--- |
| Vendedor | `pendiente` | `confirmada` o `cancelada` |
| Vendedor | `confirmada` | `completada` o `cancelada` |
| Comprador | `pendiente` | `cancelada` |

Al completar una operación, la publicación queda `vendida` y las demás solicitudes en curso sobre ella se
cancelan (en una transacción). No se puede comprar una publicación propia, pausada, vendida u oculta, ni
repetir una solicitud en curso. Una publicación con operaciones no se elimina: se puede pausar.

#### Ejemplos

Inicio de sesión:

```http
POST /api/auth/login
Content-Type: application/json

{ "correo": "usuario@replay.cl", "clave": "replay123" }
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiraEn": "2h",
  "usuario": {
    "id": 1,
    "nombreUsuario": "sebastian_r",
    "correo": "usuario@replay.cl",
    "rol": "usuario",
    "region": "Valparaíso",
    "comuna": "Valparaíso",
    "reputacion": 4.8,
    "totalCalificaciones": 12,
    "fechaRegistro": "2026-03-14",
    "activo": true
  }
}
```

Crear una publicación:

```http
POST /api/publicaciones
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "estadoConservacion": "Como nuevo",
  "precio": 15990,
  "descripcion": "Cartucho en perfecto estado, con caja original.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": ["Retiro en persona", "Envío por pagar"],
  "incluyeCaja": true,
  "incluyeManual": false
}
```

Respuesta `201 Created` con la publicación creada (`id`, `estadoPublicacion: "activa"`, `vendedorId`,
`fechaPublicacion`...). Si faltan datos, `400 Bad Request`:

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    { "campo": "titulo", "mensaje": "El título debe tener entre 3 y 120 caracteres." },
    { "campo": "entregas", "mensaje": "Elige al menos una modalidad de entrega." }
  ]
}
```

Solicitar una compra (`POST /api/operaciones`):

```json
{ "publicacionId": 13, "modalidadEntrega": "Envío por pagar" }
```

Cambiar el estado de una operación (`PATCH /api/operaciones/7/estado`):

```json
{ "estado": "confirmada" }
```

La colección de Postman contiene un ejemplo listo para cada endpoint, incluidos los casos de error.

### Seguridad

| Medida | Implementación |
| :--- | :--- |
| Contraseñas con bcrypt | `bcryptjs` con 10 rondas al registrar y `bcrypt.compare` al iniciar sesión. Solo se guarda el hash, que nunca se devuelve. Si el correo no existe se compara contra un hash de referencia, para no revelar por tiempo de respuesta qué correos están registrados. |
| JWT | Firmado con HS256 y `JWT_SECRET` (mínimo 32 caracteres; el servidor no arranca sin él). Contiene solo `sub` (id) y `rol`, y expira según `JWT_EXPIRES_IN` (2 horas por defecto). |
| Verificación en cada solicitud | El middleware de autenticación vuelve a leer el usuario en la base: una cuenta desactivada pierde el acceso de inmediato y el rol usado siempre es el vigente. |
| Roles | Tabla `roles` (usuario, administrador) y middleware `permitirRoles(...)`. 401 cuando falta sesión y 403 cuando el rol o el dueño no corresponden. El rol de administrador no compra ni publica, como indica la matriz de acceso. |
| Validación de entradas | `express-validator` en todos los endpoints (tipos, largos, formatos, listas permitidas) más reglas de negocio en los controladores (comuna de la región indicada, modalidad ofrecida por el vendedor, transiciones válidas). |
| SQL parametrizado | Todas las consultas usan `pool.execute(sql, parámetros)`; no hay SQL construido concatenando datos del usuario. En la búsqueda se escapan los comodines de `LIKE`. |
| Protección contra XSS | Middleware `sanitizar.js` (`limpiarTexto` + `sanitizarEntrada`) elimina `<script>`, `<style>`, etiquetas HTML, atributos `on*=` y esquemas `javascript:`/`vbscript:` en cuerpo y validadores; los textos renderizados en React quedan además escapados por JSX. |
| Secretos fuera del código | Credenciales de la base, `JWT_SECRET` y `RAWG_API_KEY` en `.env`, ignorado por git; `.env.example` documenta cada variable sin valores secretos. |
| CORS estricto | Solo los orígenes de `CORS_ORIGIN` pueden consumir la API desde el navegador; orígenes no autorizados se rechazan con `403`. Se exponen únicamente cabeceras de paginación (`X-Total-Count`, `X-Page`, `X-Limit`, `X-Total-Pages`). |
| Encabezados HTTP | `helmet` con `Content-Security-Policy` explícita (`defaultSrc: 'self'`, `imgSrc` HTTPS, `objectSrc: 'none'`, `frameAncestors: 'none'`), `Referrer-Policy: no-referrer` y límite de 100 kB por solicitud. |
| Fuerza bruta y abuso (Rate Limit) | `express-rate-limit` doble: límite específico `AUTH_MAX_INTENTOS` en `/api/auth` y límite global `API_MAX_PETICIONES` sobre `/api` cada 15 minutos (`429`). |
| Prevención de asignación masiva | Los controladores extraen únicamente los campos validados mediante `matchedData` de `express-validator`. |
| Minimización de datos | `SELECT_USUARIO` excluye `clave_hash` fuera del login; el perfil público no incluye correo y el registro pide únicamente los datos necesarios. |
| Integridad en la base | Claves foráneas, `UNIQUE`, `CHECK` (precios, largos, puntajes 1–5, comprador/evaluador distinto de contraparte) y transacciones al publicar, completar operaciones, calificar y moderar reportes. |

### Integración frontend + backend

- `frontend/src/services/api.ts` centraliza la conexión HTTP (`solicitar` y `solicitarConCabeceras`), inyecta `Authorization: Bearer <token>`, convierte errores de la API en `ErrorApi`, limpia la sesión ante `401` (`replay:sesion-expirada`) y sincroniza el contador de notificaciones (`replay:notificaciones-actualizadas`).
- `context/SesionContext.tsx` valida el token al iniciar y expone `actualizarUsuario` para reflejar cambios del perfil en tiempo real.
- `routes/Protegida.tsx` exige sesión y rol en cada ruta protegida, mientras `AppRoutes.tsx` aplica *code splitting* (`React.lazy` + `Suspense`) sobre las vistas secundarias y administrativas.

| Servicio del frontend | Endpoints |
| :--- | :--- |
| `autenticacionService` | `POST /auth/login`, `POST /auth/registro`, `GET /auth/perfil` |
| `catalogosService` | `GET /catalogos` (con caché en memoria y respaldo local) |
| `publicacionesService` | `GET /publicaciones` (paginado/ordenado), `GET /publicaciones/mias`, `GET /publicaciones/admin`, `GET /publicaciones/:id`, `POST`, `PUT`, `PATCH /estado`, `PATCH /moderacion`, `DELETE` |
| `usuariosService` | `GET /usuarios/:id`, `PATCH /usuarios/perfil`, `GET /usuarios`, `PATCH /usuarios/:id/estado` |
| `operacionesService` | `GET /operaciones`, `POST /operaciones`, `PATCH /operaciones/:id/estado` |
| `favoritosService` | `GET /favoritos`, `GET /favoritos/ids`, `POST /favoritos/:id`, `DELETE /favoritos/:id` |
| `calificacionesService` | `POST /calificaciones`, `GET /calificaciones/usuario/:id` |
| `reportesService` | `POST /reportes`, `GET /reportes/resumen`, `GET /reportes`, `PATCH /reportes/:id/resolver` |
| `notificacionesService` | `GET /notificaciones`, `PATCH /notificaciones/:id/leer`, `PATCH /notificaciones/leer-todas` |
| `juegosExternosService` | `GET /juegos-externos/buscar`, `GET /juegos-externos/ficha` |

#### Capturas del flujo integrado (EP2)

| | |
| :---: | :---: |
| ![Catálogo desde la API](capturas/ep2/01-catalogo-desde-api.png) Catálogo cargado desde la API | ![Error de la API en el login](capturas/ep2/02-login-error-api.png) Error de credenciales devuelto por la API (401) |
| ![Validación del formulario](capturas/ep2/03-publicar-validacion.png) Validación del formulario de publicación | ![Publicación creada](capturas/ep2/04-publicacion-creada.png) Publicación guardada en la base de datos |
| ![Mis publicaciones](capturas/ep2/05-mis-publicaciones.png) Mis publicaciones: pausar, editar y eliminar | ![Editar publicación](capturas/ep2/06-editar-publicacion.png) Edición de una publicación propia (PUT) |
| ![Detalle](capturas/ep2/07-detalle-publicacion.png) Detalle con datos del vendedor | ![Solicitud de compra](capturas/ep2/08-solicitud-compra.png) Solicitud de compra con modalidad de entrega |
| ![Solicitud registrada](capturas/ep2/09-solicitud-registrada.png) Operación creada (POST /operaciones) | ![Operaciones del vendedor](capturas/ep2/10-operaciones-vendedor.png) El vendedor confirma y completa |
| ![Administración de usuarios](capturas/ep2/11-admin-usuarios.png) Administrador desactiva una cuenta | ![Cuenta desactivada](capturas/ep2/12-cuenta-desactivada.png) La cuenta desactivada no puede entrar (403) |
| ![Vista móvil](capturas/ep2/13-movil-mis-publicaciones.png) Vista móvil con barra inferior | |

### Pruebas con Postman

La carpeta `postman/` contiene la colección `RePlay-Games.postman_collection.json` y el environment
`RePlay-Games.postman_environment.json`.

**Desde Postman:** *Import* → seleccionar ambos archivos → elegir el environment
**RePlay Games - local** → abrir la colección → **Run**. Las solicitudes deben ejecutarse en orden,
porque los logins guardan los tokens y la creación de recursos guarda sus identificadores en el
environment. Cada ejecución usa un correo nuevo y limpia sus pruebas temporales, por lo que puede repetirse sin reiniciar la base.

**Desde la consola** (con el backend en ejecución):

```bash
cd backend
npm run test:api
```

Ese comando ejecuta las **86 solicitudes** distribuidas en **13 carpetas** (carpetas `0` a `12`, cubriendo EP2 + favoritos, calificaciones, reportes/moderación, notificaciones, sanitización XSS, paginación/ordenamiento y ficha RAWG) y regenera el reporte en [`postman/resultados/resultados.md`](postman/resultados/resultados.md).

| Carpeta | Solicitudes | Cobertura |
| :--- | :---: | :--- |
| 0. Salud del servidor | 1 | Estado de API y BD |
| 1. Autenticación | 10 | Registro, login, perfil y casos 400/401/409 |
| 2. Catálogo y perfiles públicos | 9 | Catálogos, búsqueda, filtros y perfiles |
| 3. Publicaciones | 16 | CRUD de publicaciones, roles y moderación básica |
| 4. Operaciones | 13 | Flujo de compra, transiciones de estado y reglas |
| 5. Eliminar publicación | 4 | Eliminación autorizada y rechazos |
| 6. Administración y roles | 9 | Gestión de cuentas y perfil propio |
| 7. Errores generales | 2 | JSON inválido y ruta inexistente |
| 8. Favoritos (RF-05) | 5 | Alta, listado, IDs, eliminación y 401 |
| 9. Calificaciones (RF-08) | 4 | Calificación única, bloqueo de duplicados y reseñas |
| 10. Reportes y Moderación (RF-09, RF-10) | 7 | Creación, duplicados, resumen, listado, resolución y 403 |
| 11. Notificaciones (EF1) | 2 | Listado con contador y marcado de lectura |
| 12. Seguridad avanzada, Paginación y RAWG (EF3, EF4, EF5) | 4 | Sanitización XSS, paginación con ordenamiento y consulta RAWG |
| **Total** | **86** | **Colección completa Entrega Final** |

### Modelo relacional

```mermaid
erDiagram
  roles ||--o{ usuarios : "rol_id"
  regiones ||--o{ comunas : "region_id"
  regiones |o--o{ usuarios : "region_id"
  comunas |o--o{ usuarios : "comuna_id"
  usuarios ||--o{ publicaciones : "vendedor_id"
  consolas ||--o{ publicaciones : "consola_id"
  generos ||--o{ publicaciones : "genero_id"
  comunas ||--o{ publicaciones : "comuna_id"
  publicaciones ||--o{ publicacion_entregas : "publicacion_id"
  modalidades_entrega ||--o{ publicacion_entregas : "modalidad_id"
  publicaciones ||--o{ operaciones : "publicacion_id"
  usuarios ||--o{ operaciones : "comprador_id / vendedor_id"
  modalidades_entrega ||--o{ operaciones : "modalidad_id"
  usuarios ||--o{ favoritos : "usuario_id"
  publicaciones ||--o{ favoritos : "publicacion_id"
  operaciones ||--o| calificaciones : "operacion_id"
  usuarios ||--o{ calificaciones : "evaluador_id / evaluado_id"
  publicaciones ||--o{ reportes : "publicacion_id"
  usuarios ||--o{ reportes : "reportante_id / moderador_id"
  usuarios ||--o{ notificaciones : "usuario_id"

  roles {
    INT id PK
    VARCHAR nombre UK
  }
  regiones {
    INT id PK
    VARCHAR nombre UK
  }
  comunas {
    INT id PK
    INT region_id FK
    VARCHAR nombre
  }
  consolas {
    INT id PK
    VARCHAR nombre UK
  }
  generos {
    INT id PK
    VARCHAR nombre UK
  }
  modalidades_entrega {
    INT id PK
    VARCHAR nombre UK
  }
  usuarios {
    INT id PK
    VARCHAR nombre_usuario UK
    VARCHAR correo UK
    CHAR clave_hash
    INT rol_id FK
    INT region_id FK
    INT comuna_id FK
    TINYINT activo
    DECIMAL reputacion
    INT total_calificaciones
    DATETIME creado_en
  }
  publicaciones {
    INT id PK
    INT vendedor_id FK
    VARCHAR titulo
    INT consola_id FK
    INT genero_id FK
    INT precio
    ENUM estado_conservacion
    ENUM estado_publicacion
    TINYINT oculta
    VARCHAR descripcion
    VARCHAR imagen_url
    INT comuna_id FK
    TINYINT incluye_caja
    TINYINT incluye_manual
    DATETIME creado_en
  }
  publicacion_entregas {
    INT publicacion_id PK, FK
    INT modalidad_id PK, FK
  }
  operaciones {
    INT id PK
    INT publicacion_id FK
    INT comprador_id FK
    INT vendedor_id FK
    INT modalidad_id FK
    ENUM estado
    TINYINT calificada
    DATETIME creado_en
  }
  favoritos {
    INT usuario_id PK, FK
    INT publicacion_id PK, FK
    DATETIME creado_en
  }
  calificaciones {
    INT id PK
    INT operacion_id UK, FK
    INT evaluador_id FK
    INT evaluado_id FK
    TINYINT puntaje
    VARCHAR comentario
    DATETIME creado_en
  }
  reportes {
    INT id PK
    INT publicacion_id FK
    INT reportante_id FK
    ENUM motivo
    VARCHAR comentario
    ENUM estado
    ENUM accion_tomada
    INT moderador_id FK
    VARCHAR nota_moderacion
    DATETIME creado_en
    DATETIME resuelto_en
  }
  notificaciones {
    INT id PK
    INT usuario_id FK
    ENUM tipo
    VARCHAR titulo
    VARCHAR mensaje
    VARCHAR ruta
    TINYINT leida
    DATETIME creado_en
  }
```

| Tabla | Propósito | Restricciones principales |
| :--- | :--- | :--- |
| `roles` | Roles del sistema (usuario, administrador). | `UNIQUE(nombre)` |
| `regiones`, `comunas` | Ubicaciones normalizadas; cada comuna pertenece a una región. | FK `comunas.region_id`, `UNIQUE(region_id, nombre)` |
| `consolas`, `generos`, `modalidades_entrega` | Catálogos estandarizados de los formularios y filtros. | `UNIQUE(nombre)` |
| `usuarios` | Cuentas, rol, ubicación opcional, estado y reputación. | `UNIQUE(correo)`, `UNIQUE(nombre_usuario)`, FK a `roles`, `regiones`, `comunas`, `CHECK` reputación 0–5 |
| `publicaciones` | Videojuegos publicados, portada opcional, estado y moderación. | Índices compuestos + `FULLTEXT(titulo, descripcion)`; `CHECK` precio 1–500.000, título ≥ 3 y descripción ≥ 20 |
| `publicacion_entregas` | Modalidades de entrega de cada publicación (muchos a muchos). | PK compuesta; `ON DELETE CASCADE` |
| `operaciones` | Solicitudes de compra y su estado. | Índices por comprador/vendedor/estado; `CHECK` comprador distinto del vendedor |
| `favoritos` | Publicaciones guardadas por cada usuario (RF-05). | PK compuesta `(usuario_id, publicacion_id)`; `ON DELETE CASCADE` |
| `calificaciones` | Valoraciones 1–5 y reseñas de operaciones completadas (RF-08). | `UNIQUE(operacion_id)`, `CHECK` puntaje 1–5 y partes distintas |
| `reportes` | Reportes de publicaciones y decisiones de moderación (RF-09, RF-10). | FKs a `publicaciones` (`ON DELETE CASCADE`) y `usuarios` |
| `notificaciones` | Avisos persistentes por eventos de negocio (EF1). | Índice `(usuario_id, leida, creado_en)`; `ON DELETE CASCADE` |

### Matriz de cumplimiento Entrega Final

| Criterio | Evidencia en el repositorio |
| :--- | :--- |
| **EF1.** Funcionalidades completas, notificaciones y almacenamiento local | CRUD completo, favoritos (`/favoritos`), calificaciones (`/calificar/:operacionId`), reportes/moderación (`/admin`, `/admin/reportes`, `/admin/publicaciones`), perfil (`/perfil`), notificaciones (`/notificaciones`, `BotonNotificaciones`) y `localStorage` en sesión, filtros, búsquedas recientes y borradores. |
| **EF2.** Mejoras UI/UX y optimización de rendimiento | *Code splitting* (`React.lazy` + `Suspense`), portadas con `loading="lazy"` y fallback, `React.memo`, caché de catálogos, paginación progresiva, ordenamiento e `IonRefresher`. |
| **EF3.** Seguridad avanzada en API | `sanitizar.js` contra XSS, SQL parametrizado (`mysql2`), `helmet` con CSP, CORS estricto `403`, rate limit global + `/auth`, `bcryptjs`, JWT con verificación en BD y `matchedData`. |
| **EF4.** Optimización de consultas | 14 tablas con índices compuestos y `FULLTEXT`, `LEFT JOIN + GROUP BY`, exclusión de `clave_hash`, vendedor embebido en detalle, caché de catálogos, `Map` en `O(1)` y `LIMIT/OFFSET`. |
| **EF5.** Integración con servicio externo | `rawgService.js` + `/api/juegos-externos/*` + autocompletado al publicar y ficha técnica en detalle con caché, timeout y fallback controlado. |
| **EF6.** Despliegue local con Docker | `backend/Dockerfile`, `frontend/Dockerfile` + `nginx.conf`, `.dockerignore`, `docker-compose.yml` (MySQL 8 + API + Nginx) y `.env.example`. |
| **EF7.** Documentación y pruebas | Este `README.md` integrado, colección Postman de 86 solicitudes y ramas `main`, `backend` y `frontend` sincronizadas. |

#### Lista de verificación antes de la defensa

- [ ] Confirmar que el repositorio en GitHub y el enlace de Figma tengan visibilidad **pública**.
- [ ] Crear `.env` desde `.env.example` en la raíz y levantar todo el sistema con `docker compose down -v && docker compose up --build`.
- [ ] Guardar capturas del despliegue Docker (`docker compose ps` y app en `http://localhost:8080`) en `capturas/final/`.
- [ ] Ejecutar `cd backend && npm run test:api` contra la API corriendo para actualizar `postman/resultados/resultados.md` con las 86 solicitudes.
- [ ] Verificar que las ramas `main`, `backend` (incluyendo `database/replay_games.sql`) y `frontend` estén actualizadas en GitHub.

### Capturas de pantalla de EP1

Catálogo de juegos

![Catálogo](capturas/Screenshot%202026-09-21%20211449.png)

------------------------------------------------------------

Inicio de sesión

![Inicio de sesión](capturas/Screenshot%202026-09-21%20211809.png)

------------------------------------------------------------

Crear cuenta

![Crear cuenta](capturas/Screenshot%202026-09-21%20211816.png)

------------------------------------------------------------

Detalle de juego

![Detalle de juego](capturas/Screenshot%202026-09-21%20211826.png)

------------------------------------------------------------

Filtros

![Filtros](capturas/Screenshot%202026-09-21%20211835.png)

------------------------------------------------------------

Publicar videojuego

![Publicar videojuego](capturas/Screenshot%202026-09-21%20211940.png)

------------------------------------------------------------

Compras y ventas

![Compras y ventas](capturas/Screenshot%202026-09-21%20211953.png)

------------------------------------------------------------

## Librerías usadas con React (Ionic)

### Librerías principales

| Librería | Propósito |
| :--- | :--- |
| `@ionic/react` | Componentes de interfaz de Ionic adaptados a React: páginas, listas, formularios, modales y barra de pestañas. |
| `@ionic/react-router` | Integración de Ionic con React Router: contenedor de rutas, animaciones de transición y pila de navegación. |
| `react-router-dom` | Enrutamiento del lado del cliente: definición de rutas, parámetros y redirecciones. |
| `ionicons` | Conjunto de iconos oficial de Ionic, usado en el menú, las pestañas y las acciones. |
| `vite` | Servidor de desarrollo con recarga en caliente y empaquetado para producción. |
| `typescript` | Tipado estático del dominio y verificación previa a la construcción. |

No se utilizan librerías de estilos externas: el diseño se construye sobre las variables CSS de
Ionic y una hoja de estilos propia (`src/theme/`), lo que permite el modo claro y oscuro automático.

## Tecnologías

- **Ionic Framework** (`@ionic/react` 8.8.x, `@ionic/react-router` 8.8.x)
- **React** 18.3.x y **React DOM** 18.3.x
- **React Router** 5.3.x (`react-router`, `react-router-dom`)
- **TypeScript** 5.9.x
- **Vite** 7.x como herramienta de construcción
- **Ionicons** 8.x
- **CSS de Ionic** con variables propias de tema
- **Figma** para el prototipo
- **Git y GitHub** para el control de versiones

> Se utiliza la línea 8 de Ionic porque la versión 9, publicada durante el desarrollo de esta
> entrega, migra a React Router 6 y modifica la forma de declarar las rutas.

**Incorporadas en EP2 y Entrega Final:** Node.js con Express 5, MySQL 8 / MariaDB con `mysql2`, autenticación con JWT (`jsonwebtoken`) y `bcryptjs`, validación con `express-validator`, seguridad avanzada (sanitización XSS, `helmet` con CSP, `cors` estricto y `express-rate-limit`), integración externa con **RAWG API**, pruebas con Postman y newman, y despliegue en contenedores con **Docker y `docker-compose`** (ver [Tecnologías por capa](#tecnologías-por-capa)).

## Fuentes

[1] Cámara de Comercio de Santiago (CCS). *Comercio electrónico bordeó los US$ 10 mil millones en
2025.* <https://www.ccs.cl/area-publicacion/comercio-electronico-y-economia-digital/>

[2] SERNAC. *Tus derechos en el Comercio Electrónico.*
<https://www.sernac.cl/portal/618/w3-propertyvalue-20982.html>

[3] SERNAC. *Derechos y deberes en el consumo.* Referencia sobre información de productos usados.
<https://www.sernac.cl/portal/617/w3-propertyvalue-8321.html>

[4] Meta — Facebook Help Center. *How ratings work on Facebook Marketplace.*
<https://www.facebook.com/help/915385548593204/>

[5] Sandra Cano — PUCV. *README de ejemplo para EP1.*
<https://github.com/SandraCano-PUCV/IngenieriaWebMovil/blob/main/EP/EP1/Readme.md>

[6] Sandra Cano — PUCV. *Ejemplo EP2 con JWT y rúbrica de evaluación.*
<https://github.com/SandraCano-PUCV/IngenieriaWebMovil/tree/main/EP/EP2%2BJWT>

[7] Express. *Documentación de Express 5.* <https://expressjs.com/>

[8] OWASP. *Password Storage Cheat Sheet* y *SQL Injection Prevention Cheat Sheet.*
<https://cheatsheetseries.owasp.org/>

[9] IETF. *RFC 7519: JSON Web Token (JWT).* <https://www.rfc-editor.org/rfc/rfc7519>
