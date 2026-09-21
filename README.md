# RePlay Games — Marketplace web y móvil para la compra y venta de videojuegos físicos de segunda mano

# Presentado por:

- *Francisco Javier Reyes Villalón*
- *Tomás Ignacio Moraga Gálvez*
- *Cristóbal Jesús Pinto Quiroga*
- *Marco Antonio Fernandoy Rojas*

|Tipo |Link |
| Repositorio | *https://github.com/cristobalpinto2600-cyber/Web-Proyecto* |
| Prototipo en Figma | *agregar* |

## Índice

1. [Justificación del problema](#justificación-del-problema)
2. [Usuarios](#usuarios-objetivo-quién-usará-la-aplicación)
    - [Roles](#roles-del-sistema)
    - [Proto-personas](#proto-personas)
3. [Requerimientos](#requerimientos)
4. [Arquitectura de la Información / UX](#arquitectura-de-navegación)
    - [Diferenciación x roles](#diferenciación-de-acceso-según-roles)
    - [Flujos principales de tareas](#flujos-de-tareas)
    - [Puntos críticos de interacción](#puntos-críticos-de-interacción)
    - [Justificación Técnica](#justificación-técnica)
5. [Bocetos UX/UI](#bocetos-uiux)
6. [Frontend con Ionic-React](#frontend-con-ionic-react)

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
| Grupo objetivo | Personas usuarias de consolas con formato físico interesadas en comprar o vender videojuegos de segunda mano. |
| Características generales | Usuarios con distintos niveles de experiencia en aplicaciones de compraventa; pueden comparar precios, publicar productos y revisar información desde móvil o computador. |
| Necesidades | Buscar títulos concretos, comparar precio/estado, publicar con rapidez, conocer modalidades de entrega y disponer de señales de confianza. |
| Posibles dificultades | Información incompleta, fotografías poco claras, publicaciones mal clasificadas, estados descritos de forma desigual y dudas sobre la contraparte. |
| Contexto de uso | Consultas rápidas desde smartphone y uso complementario de computador para revisar o administrar varias publicaciones. |
| Tareas | Explorar, filtrar, revisar detalle, publicar, administrar publicaciones, guardar favoritos, iniciar y seguir operaciones, calificar y reportar. |
| Experiencia tecnológica estimada | Básica a intermedia; se asume familiaridad con patrones habituales de aplicaciones móviles y comercio electrónico. |
| Accesibilidad | Interfaz legible, jerarquía clara, mensajes de error comprensibles, controles identificables y diseño responsivo. |
| Seguridad y privacidad | Solicitar pocos datos personales, proteger las funciones según sesión/rol y evitar exponer información privada innecesaria. |

Personas compradoras
Corresponde a jugadores y jugadoras que buscan videojuegos específicos para su consola y que suelen comparar distintas publicaciones antes de tomar una decisión de compra. Acceden principalmente desde dispositivos móviles, generalmente en sesiones breves, por lo que necesitan identificar con rapidez aspectos relevantes como el precio, el estado de conservación, la ubicación y la modalidad de entrega.

Necesidades principales
Encontrar videojuegos compatibles con su consola mediante herramientas de búsqueda y filtros.
Comparar publicaciones considerando criterios equivalentes, como precio, estado de conservación y modalidad de entrega.
Revisar fotografías e información sobre la reputación de la persona vendedora antes de iniciar una compra.
Guardar publicaciones de interés y realizar seguimiento al estado de las operaciones iniciadas.

Personas vendedoras
Corresponde a personas que poseen videojuegos físicos que ya no utilizan y que desean venderlos de manera ocasional. Generalmente utilizan el teléfono móvil para fotografiar y publicar sus productos, aunque pueden preferir el computador cuando necesitan administrar varias publicaciones al mismo tiempo.

Necesidades principales
Publicar videojuegos mediante un proceso simple y guiado, con campos que ayuden a completar la información necesaria.
Describir de manera clara el estado del producto, reduciendo dudas y consultas repetidas por parte de posibles compradores.
Administrar sus publicaciones mediante acciones como editar, pausar, reactivar o eliminar.
Recibir solicitudes de compra y realizar seguimiento a cada operación hasta su finalización.

Administración de la plataforma
Corresponde a las personas responsables de revisar reportes, moderar publicaciones y supervisar el cumplimiento de las reglas definidas para la plataforma. Su uso se concentra principalmente en computadores de escritorio o portátiles, ya que requieren visualizar suficiente información antes de tomar una decisión de moderación.

Necesidades principales
Revisar los reportes recibidos junto con la información y el contexto de la publicación asociada.
Mantener visible u ocultar una publicación mediante acciones claras y confirmadas.
Registrar las decisiones tomadas durante la moderación para conservar la trazabilidad de las acciones realizadas.

## Roles del Sistema
| Rol | Descripción |
| Usuario | Puede comprar y vender con una misma cuenta: explorar, publicar, administrar publicaciones, guardar favoritos, iniciar operaciones, calificar y reportar. |
| Administrador | Revisa reportes y modera publicaciones y usuarios según las reglas de la plataforma. |

### Definición de conceptos
**Rol:** conjunto de permisos y funcionalidades que el sistema asigna a un tipo de usuario. Determina a qué vistas o rutas puede acceder y qué acciones puede realizar dentro de la plataforma.

**Proto-persona:** perfil hipotético elaborado a partir de fuentes secundarias, análisis de soluciones existentes y supuestos razonados. Se utiliza para representar características, necesidades y contextos de uso probables cuando aún no se dispone de investigación directa con usuarios reales.

> *Nota metodológica:* los siguientes perfiles son hipotéticos y corresponden a una caracterización preliminar. No representan entrevistas ni resultados obtenidos directamente de usuarios reales.

### Proto-personas
Se definen tres proto-personas que representan los principales contextos de uso de la aplicación: compra, venta y administración.

### Proto-persona 1: Sebastián — comprador frecuente
**Características generales:** estudiante universitario de 23 años, jugador frecuente y usuario habitual de aplicaciones móviles y plataformas de compraventa.

**Necesidades y objetivos:** encontrar videojuegos compatibles con su consola, comparar publicaciones según precio, estado, fotografías y reputación del vendedor, guardar opciones de interés e iniciar una compra cuando encuentre una alternativa adecuada.

**Dificultades y funcionalidades asociadas:** puede enfrentarse a publicaciones incompletas, fotografías poco claras o descripciones poco precisas. Para resolver estas necesidades utilizaría principalmente el catálogo, buscador, filtros, detalle de publicación, favoritos, operaciones, calificaciones y reportes.

**Dispositivo y contexto de acceso:** principalmente smartphone, utilizado para realizar consultas rápidas, revisar publicaciones y comparar alternativas antes de una compra.

### Proto-persona 2: Camila — vendedora ocasional
**Características generales:** jugadora ocasional de 29 años que conserva videojuegos físicos que ya no utiliza y que desea venderlos de manera sencilla.

**Necesidades y objetivos:** publicar juegos mediante un proceso simple, describir claramente su estado, administrar varias publicaciones y realizar seguimiento a cada operación hasta completarla.

**Dificultades y funcionalidades asociadas:** puede encontrar formularios extensos, consultas repetidas o dificultades para organizar varias publicaciones. Utilizaría principalmente las funciones de publicación, edición, gestión de publicaciones, operaciones, perfil y calificaciones.

**Dispositivo y contexto de acceso:** utiliza el teléfono móvil para fotografiar y publicar videojuegos, y el computador cuando necesita administrar varias publicaciones.

### Proto-persona 3: Daniel — administrador
**Características generales:** persona adulta con experiencia básica a intermedia en el uso de herramientas administrativas y plataformas web.

**Necesidades y objetivos:** revisar reportes con suficiente contexto, evaluar publicaciones, tomar decisiones de moderación y mantener un registro de las acciones realizadas.

**Dificultades y funcionalidades asociadas:** puede enfrentarse a reportes con información insuficiente, acciones sensibles sin confirmación o falta de trazabilidad. Para estas tareas utilizaría el panel administrativo, la revisión de reportes, la moderación de publicaciones y la gestión de usuarios.

**Dispositivo y contexto de acceso:** principalmente computador de escritorio o portátil, ya que las tareas administrativas requieren revisar mayor cantidad de información.

## Requerimientos
Los requerimientos funcionales no contabilizan el registro ni el inicio de sesión, ya que esas
funciones se documentan como funcionalidades transversales.

## Requerimientos
Los requerimientos definidos a continuación describen las principales funcionalidades que deberá ofrecer la plataforma. De acuerdo con la pauta del proyecto, el registro y el inicio de sesión no se contabilizan como requerimientos funcionales principales, ya que se consideran funcionalidades transversales necesarias para el acceso y control de usuarios.

## Requerimientos funcionales por rol

| ID | Requerimiento funcional | Rol |

| RF-01 | **Explorar y filtrar el catálogo.** La aplicación deberá permitir visualizar las publicaciones disponibles y buscar o filtrar videojuegos según título, consola, género, rango de precio, estado de conservación y ubicación. | Usuario |

| RF-02 | **Consultar el detalle de una publicación.** La aplicación deberá mostrar la información completa de una publicación, incluyendo fotografías, título, consola, género, precio, estado de conservación, descripción, ubicación, modalidad de entrega y datos públicos del vendedor. | Usuario |

| RF-03 | **Publicar un videojuego.** El usuario deberá poder crear una publicación de un videojuego físico, incorporando los datos obligatorios definidos por la plataforma y fotografías del producto. | Usuario |

| RF-04 | **Gestionar publicaciones propias.** El usuario deberá poder editar, pausar, reactivar o eliminar sus publicaciones, siempre que el estado de la operación asociada permita realizar dicha acción. | Usuario |

| RF-05 | **Gestionar favoritos.** El usuario deberá poder agregar o eliminar publicaciones de una lista personal de favoritos y consultarlas posteriormente. | Usuario |

| RF-06 | **Iniciar una solicitud de compra.** El usuario deberá poder iniciar una solicitud de compra sobre una publicación disponible y seleccionar una de las modalidades de entrega definidas por el vendedor. | Usuario |

| RF-07 | **Consultar y gestionar operaciones.** El comprador y el vendedor deberán poder consultar las operaciones en las que participan y visualizar su estado, por ejemplo: pendiente, confirmada, completada o cancelada. | Usuario |

| RF-08 | **Calificar una operación completada.** El usuario deberá poder registrar una calificación y una reseña únicamente cuando exista una operación completada entre comprador y vendedor. | Usuario |

| RF-09 | **Reportar una publicación.** El usuario deberá poder reportar una publicación seleccionando un motivo predefinido y, de forma opcional, agregando un comentario que entregue mayor contexto. | Usuario |

| RF-10 | **Moderar publicaciones y reportes.** El administrador deberá poder revisar los reportes recibidos, consultar la publicación asociada, mantenerla visible u ocultarla y registrar la decisión de moderación realizada. | Administrador |

## Funcionalidades Transversales
| ID | Funcionalidad | Descripción |
| FT-01 | Registro de usuarios | Permitir la creación de una cuenta utilizando únicamente los datos necesarios definidos por la plataforma. |
| FT-02 | Inicio de sesión | Permitir el acceso a la plataforma mediante credenciales válidas asociadas a una cuenta registrada. |
| FT-03 | Cierre de sesión | Permitir al usuario finalizar de forma segura una sesión activa. |
| FT-04 | Restricción por rol | Controlar el acceso a funcionalidades y rutas de acuerdo con el rol asignado al usuario: Usuario o Administrador. |

## Requerimientos No Funcionales
### UX y Usabilidad
#### RNF-UX-01 — Diseño adaptable
La interfaz deberá adaptarse correctamente a dispositivos móviles y de escritorio, manteniendo accesibles las funcionalidades principales y evitando la pérdida de información relevante.

#### RNF-UX-02 — Navegación consistente
La aplicación deberá mantener una estructura de navegación coherente entre sus distintas vistas, utilizando nombres, ubicaciones y comportamientos consistentes para los controles principales.

#### RNF-UX-03 — Retroalimentación al usuario
Las acciones relevantes deberán entregar una respuesta visual clara, mediante indicadores de carga, mensajes de confirmación o avisos de error comprensibles para el usuario.

### Accesibilidad
#### RNF-ACC-01 — Accesibilidad de la interfaz
Los formularios, controles y elementos de navegación deberán utilizar etiquetas comprensibles, una jerarquía visual clara, contraste adecuado y permitir navegación mediante teclado cuando corresponda.

### Seguridad
#### RNF-SEG-01 — Acceso a funciones protegidas
Las funcionalidades relacionadas con publicaciones, favoritos, operaciones, calificaciones, reportes y administración deberán estar disponibles únicamente para usuarios con una sesión válida.

#### RNF-SEG-02 — Autorización según rol
El sistema deberá verificar el rol del usuario antes de permitir el acceso a funcionalidades y rutas restringidas, diferenciando los permisos de Usuario y Administrador.

#### RNF-SEG-03 — Privacidad y minimización de datos
El sistema deberá solicitar únicamente la información personal necesaria para crear y utilizar una cuenta, evitando recopilar o mostrar datos que no sean requeridos para el funcionamiento de la plataforma.

#### RNF-SEG-04 — Protección de credenciales y secretos
Las credenciales, claves de API y demás información sensible no deberán almacenarse directamente en el código fuente ni publicarse en el repositorio del proyecto.

### Rendimiento
#### RNF-REN-01 — Rendimiento de la aplicación
Las vistas principales, como catálogo, detalle de publicación y operaciones, deberán cargar de manera fluida y permitir la interacción del usuario sin bloqueos bajo condiciones normales de uso y prueba.

### Compatibilidad y Mantenibilidad
#### RNF-COMP-01 — Compatibilidad
La aplicación web deberá funcionar correctamente en navegadores modernos y mantener sus funcionalidades principales en distintos tamaños de pantalla, tanto en dispositivos móviles como de escritorio.

#### RNF-MAN-01 — Estructura modular
El frontend deberá organizarse mediante una estructura modular en carpetas como `pages`, `components`, `routes`, `services`, `models` y `data`, favoreciendo la reutilización de código y evitando duplicaciones innecesarias.

## Arquitectura de Navegación
### 1. Rutas principales y secundarias
#### Rutas públicas

| Ruta | Vista | Descripción |
| :--- | :--- | :--- |
| `/` | Inicio / catálogo | Permite explorar publicaciones disponibles y acceder a la búsqueda. |
| `/catalogo` | Catálogo | Permite buscar y filtrar videojuegos. |
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
1. **Inicio de sesión y acceso por rol:** la aplicación deberá informar de manera clara los errores de autenticación y restringir el acceso a rutas o funcionalidades que no correspondan al rol del usuario.

2. **Formulario de publicación:** se deberán validar los campos obligatorios, evitar la pérdida accidental de la información ingresada y solicitar confirmación antes de crear una publicación.

3. **Disponibilidad de las publicaciones:** una publicación marcada como vendida o pausada no deberá permitir el inicio de una nueva operación de compra.

4. **Confirmación de compra:** antes de generar una operación, el sistema deberá presentar un resumen del videojuego, su precio y la modalidad de entrega seleccionada.

5. **Calificación de operaciones:** la opción de calificar deberá estar disponible únicamente cuando la operación haya sido registrada como completada.

6. **Moderación de contenido:** las acciones sensibles, como ocultar una publicación, deberán solicitar confirmación y dejar registro de la decisión realizada.

7. **Consistencia entre web y móvil:** la distribución visual podrá adaptarse según el dispositivo, pero las etiquetas, funcionalidades y lógica de interacción deberán mantenerse coherentes.

### Justificación técnica
La arquitectura de navegación busca mantener una experiencia consistente entre las versiones móvil y web. En dispositivos móviles se propone utilizar una barra de navegación inferior mediante `IonTabs`, mientras que en la versión web se utilizará un menú lateral con `IonMenu` dentro de un `IonSplitPane`.

Las funcionalidades conservarán los mismos nombres y comportamientos en ambas versiones, mientras que elementos como la grilla de publicaciones, los filtros y los formularios se reorganizarán según el espacio disponible en pantalla.

### Usabilidad
La navegación se plantea de forma simple y predecible, manteniendo las principales secciones visibles mediante la barra inferior en móvil y el menú lateral en web. Además, las acciones relevantes deberán entregar retroalimentación mediante indicadores de carga, mensajes de confirmación y avisos de error comprensibles.

### Eficiencia de interacción
Los principales recorridos de la aplicación se diseñan para requerir pocos pasos. Desde el catálogo será posible acceder directamente al detalle de una publicación y, desde allí, iniciar una solicitud de compra. Los filtros podrán aplicarse sin abandonar la vista de resultados y el formulario de publicación concentrará la información necesaria en un flujo claro y guiado.

### Claridad estructural
La separación entre rutas públicas, rutas protegidas para el rol Usuario y rutas exclusivas para el Administrador permite identificar claramente qué funcionalidades requieren autenticación y cuáles necesitan permisos específicos. Esta diferenciación se reflejará tanto en la navegación como en la organización del código.

### Escalabilidad
La organización modular del frontend y la separación del acceso a datos mediante la carpeta `services/` permitirán incorporar posteriormente la API REST correspondiente a EP2 sin modificar la estructura principal de las vistas y rutas. De esta forma, la lógica de acceso a datos podrá evolucionar sin afectar significativamente la interfaz.

## Bocetos UI/UX
El prototipo UI/UX será construido manualmente por los integrantes del equipo utilizando Figma. Para su elaboración no se utilizarán asistentes de inteligencia artificial generativa destinados a crear automáticamente pantallas, componentes, estilos, estructuras de navegación o interacciones del prototipo.

**Enlace público de Figma:** *https://www.figma.com/design/HjfX9dFW7dpfEzYFaPNR0Z/Figma-Web?node-id=0-1&p=f&t=z6N2bHfQjHtF0jdA-0*

Se planifican siete pantallas asociadas a funcionalidades, además de Inicio de sesión y Registro, todas en versión móvil y web.

| N° | Pantalla | RF / función | Contenido |
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

## Frontend con Ionic-React

### Estado de esta entrega

EP1 es una entrega parcial. Se implementaron las seis pantallas recomendadas para esta etapa, con
navegación real, rutas protegidas y diseño responsivo.

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

*[Agregar capturas reales en `docs/img/` y enlazarlas aquí cuando estén disponibles.]*

### Pendiente para las próximas entregas

- Pantallas de favoritos, mis publicaciones, edición, calificación, perfil y panel de administración
  (RF-04, RF-05, RF-08, RF-09, RF-10).
- Carga real de fotografías.
- API REST, base de datos relacional y autenticación con JWT.
- Capturas reales en el repositorio y enlace público al prototipo de Figma.

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
