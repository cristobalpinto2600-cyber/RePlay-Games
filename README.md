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
| Repositorio | *https://github.com/cristobalpinto2600-cyber/Web-Proyecto* |
| Prototipo en Figma | *https://www.figma.com/design/HjfX9dFW7dpfEzYFaPNR0Z/Figma-Web?node-id=0-1&t=1ShxU2N3ZS4MXlIQ-1* |

## Índice

1. [Descripción general del sistema](#descripción-general-del-sistema)
2. [Objetivo del proyecto](#objetivo-del-proyecto)
3. [Principales funcionalidades](#principales-funcionalidades)
4. [Justificación del problema](#justificación-del-problema)
5. [Usuarios](#usuarios-objetivo-quién-usará-la-aplicación)
    - [Roles](#roles-del-sistema)
    - [Proto-personas](#proto-personas)
    - [Supuestos utilizados](#supuestos-utilizados)
6. [Requerimientos](#requerimientos)
7. [Arquitectura de la Información / UX](#arquitectura-de-navegación)
    - [Diferenciación por roles](#diferenciación-de-acceso-según-roles)
    - [Flujos principales de tareas](#flujos-de-tareas)
    - [Puntos críticos de interacción](#puntos-críticos-de-interacción)
    - [Justificación técnica](#justificación-técnica)
8. [Bocetos UI/UX](#bocetos-uiux)
9. [Frontend con Ionic-React](#frontend-con-ionic-react)


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
| `/perfil` | Perfil | Muestra información pública y reputación del usuario. |

> Implementadas en EP1: `/publicar` y `/operaciones`.

#### Rutas protegidas del Administrador

| Ruta | Vista | Descripción |
| :--- | :--- | :--- |
| `/admin` | Panel administrador | Resumen de moderación. |
| `/admin/reportes` | Reportes | Listado y revisión de reportes. |
| `/admin/publicaciones` | Moderación de publicaciones | Permite mantener u ocultar publicaciones. |
| `/admin/usuarios` | Usuarios | Vista administrativa de usuarios. |

> Implementadas en EP1: ninguna. El control de acceso por rol ya está disponible en el código
> (`src/routes/Protegida.tsx` acepta el rol exigido por la ruta).

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

El control está implementado en `src/routes/`:

- `AppRoutes.tsx` declara cada ruta dentro del `IonRouterOutlet`; las protegidas envuelven su página
  en el componente `Protegida`.
- `Protegida.tsx` verifica la sesión antes de mostrar el contenido:

```tsx
<Route
  exact
  path={RUTAS.publicar}
  render={() => (
    <Protegida>
      <PublicarPage />
    </Protegida>
  )}
/>
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

EP1 corresponde a la etapa inicial del desarrollo. Para esta entrega se implementaron seis pantallas en Ionic + React, con navegación funcional, rutas protegidas y diseño adaptable a dispositivos móviles y de escritorio.

Los datos son **estáticos (mock)**: no hay backend, base de datos ni pagos. Los formularios validan,
confirman y muestran el flujo completo, pero no crean ni modifican registros. La única información
que se conserva entre recargas es la sesión iniciada, guardada en `localStorage` para poder
demostrar las rutas protegidas.

### Pantallas implementadas

| Pantalla | Ruta | RF / función | Estado |
| :--- | :--- | :--- | :--- |
| Catálogo | `/catalogo` | RF-01 | Buscador, filtros por consola, género, estado, comuna y precio; grilla responsiva con precio, consola, estado y ubicación. |
| Detalle de publicación | `/publicacion/:id` | RF-02, RF-06 | Datos completos del producto, reputación del vendedor, modalidades de entrega y solicitud de compra con resumen y confirmación. |
| Publicar videojuego | `/publicar` | RF-03 | Formulario con validación por campo, fotografías simuladas y confirmación. Requiere sesión. |
| Compras y ventas | `/operaciones` | RF-06, RF-07, RF-08 | Operaciones separadas en compras y ventas, con sus cuatro estados. Requiere sesión. |
| Inicio de sesión | `/login` | FT-02 | Validaciones, mensajes de error y regreso a la página solicitada. |
| Registro | `/registro` | FT-01 | Campos justificados en la sección anterior, con validaciones y aceptación de términos. |

Además, `/` redirige al catálogo y cualquier dirección desconocida muestra una página de
"no encontrada".

### Estructura modular

```
frontend/
├── index.html
├── ionic.config.json
├── package.json
├── vite.config.ts
└── src/
    ├── App.tsx            # Estructura de navegación: split pane + menú + tabs
    ├── main.tsx           # Punto de entrada y estilos de Ionic
    ├── components/        # Componentes reutilizables de la interfaz
    ├── context/           # Estado de sesión compartido
    ├── data/              # Datos simulados: publicaciones, usuarios, operaciones y catálogos
    ├── models/            # Tipos del dominio (Usuario, Publicacion, Operacion)
    ├── pages/             # Una página por ruta
    ├── routes/            # Definición de rutas y control de acceso
    ├── services/          # Acceso a los datos; en EP2 se reemplaza por la API REST
    ├── theme/             # Colores de marca y estilos propios
    └── utils/             # Formato de precios y fechas
```

Los servicios son asíncronos aunque hoy lean datos locales, de modo que al conectar la API REST en
EP2 solo cambia el cuerpo de esas funciones, sin modificar páginas ni componentes (RNF-MAN-01).

### Instalación y ejecución

Requisitos: **Node.js 20.19+ o 22.12+** y npm.

```bash
git clone <URL_DEL_REPOSITORIO>
cd <CARPETA_DEL_REPOSITORIO>/frontend
npm install
npm run dev
```





La aplicación queda disponible en <http://localhost:5173>. Si el equipo tiene instalado el CLI de
Ionic, también funciona `ionic serve`, ya que el proyecto incluye `ionic.config.json` con el tipo
`react-vite`.

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Verifica los tipos con TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la versión construida. |
| `npm run lint` | Solo la verificación de tipos. |

### Cuenta de prueba

| Correo | Contraseña |
| :--- | :--- |
| `usuario@replay.cl` | `123456` |

La pantalla de inicio de sesión incluye un botón que completa estos datos automáticamente.

### Capturas de pantalla

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

### Pendiente para las próximas entregas

- Implementación de las pantallas y funcionalidades aún no incorporadas al frontend, como favoritos, edición de publicaciones, calificación, perfil y funciones administrativas adicionales.
- Carga y almacenamiento real de fotografías.
- Implementación de la API REST y conexión con una base de datos relacional.
- Implementación de autenticación mediante JWT y manejo de sesiones desde el backend.

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

**Planificadas para entregas posteriores:** Node.js con Express o Flask, PostgreSQL o MySQL,
autenticación con JWT, Postman o Insomnia para pruebas de API, y Docker con docker-compose para el
despliegue.

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
