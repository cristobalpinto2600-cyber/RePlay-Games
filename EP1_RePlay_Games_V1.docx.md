**INGENIERÍA WEB Y MÓVIL**

**Entrega Parcial 1 (EP1)**

Diseño y Estructura Inicial

**RePlay Games**

Marketplace web y móvil para compra y venta de videojuegos físicos de segunda mano

| Profesora | Francisco Ponce |
| :---- | :---- |
| Integrantes | \[Completar\] |
| Paralelo | \[Completar\] |
| Fecha de entrega | 21-09-2026 |
| Repositorio | \[Agregar URL pública\] |
| Figma | \[Agregar URL pública\] |

*Versión consolidada de documentación para README y entrega EP1.*

# **0\. Distribución de responsabilidades del equipo**

Completar esta tabla con la organización real del equipo. La evidencia de GitHub debe reflejar participación progresiva y colaborativa de los integrantes.

| Integrante | Rol interno | Responsabilidades EP1 |
| :---- | :---- | :---- |
| \[Nombre\] | \[Completar\] | \[Completar\] |
| \[Nombre\] | \[Completar\] | \[Completar\] |
| \[Nombre\] | \[Completar\] | \[Completar\] |
| \[Nombre\] | \[Completar\] | \[Completar\] |

# **1\. Información general del proyecto**

## **1.1 Descripción general**

RePlay Games será una aplicación web y móvil especializada en la compra y venta entre usuarios de videojuegos físicos de segunda mano para consolas con soporte de formato físico. La plataforma centralizará publicaciones, búsqueda y filtrado, información estandarizada sobre el estado del producto, favoritos, solicitudes de compra, seguimiento de operaciones, reputación y reportes.

En EP1 no se implementarán pagos reales ni integración logística. La acción de compra se modelará como una solicitud u operación entre comprador y vendedor, permitiendo que el frontend y la navegación evolucionen posteriormente hacia la API REST y base de datos exigidas en EP2.

## **1.2 Objetivo general**

Desarrollar una aplicación web y móvil que facilite la compra y venta de videojuegos físicos de segunda mano, proporcionando una experiencia especializada para publicar, buscar, comparar y gestionar operaciones entre usuarios mediante una interfaz clara, responsiva y con control de acceso por roles.

## **1.3 Objetivos específicos**

* Diseñar una experiencia coherente entre móvil y web.  
* Estandarizar la información de las publicaciones.  
* Permitir administrar publicaciones, favoritos y operaciones.  
* Incorporar mecanismos de reputación y reporte.  
* Diferenciar funciones de Usuario y Administrador.

## **1.4 Funcionalidades principales**

* Catálogo especializado con búsqueda y filtros.  
* Detalle normalizado de cada videojuego.  
* Publicación y gestión de juegos físicos usados.  
* Favoritos.  
* Solicitud de compra y seguimiento de operaciones.  
* Calificaciones asociadas a operaciones completadas.  
* Reportes y moderación administrativa.

# **2\. Justificación del problema y usuarios objetivo (EP 1.2)**

## **2.1 Justificación del problema**

El comercio electrónico constituye un canal relevante en Chile. La Cámara de Comercio de Santiago informó que durante 2025 las ventas online bordearon los US$ 10 mil millones y crecieron 11,6 % nominal \[1\]. En este contexto, los videojuegos físicos usados pueden encontrarse en plataformas generales de compraventa, pero dichas plataformas deben organizar productos muy distintos entre sí. Para una persona que busca un videojuego usado, resulta útil disponer de información especializada y comparable, como consola compatible, estado del disco o cartucho, condición de la caja, precio, ubicación y modalidad de entrega.

SERNAC destaca, en el contexto del comercio electrónico, la importancia de informar de manera clara el precio, las características relevantes, el stock y las condiciones de entrega \[2\]. Asimismo, SERNAC señala que cuando una empresa vende productos usados debe informar expresamente esa condición \[3\]. Estas referencias se utilizan como criterios de transparencia para el diseño académico de la plataforma, sin asumir que todas las obligaciones citadas se aplican de la misma forma a cada futura operación entre particulares.

También existe una necesidad de señales de confianza. Facebook Marketplace utiliza valoraciones entre usuarios, pero Meta indica que no verifica necesariamente que la persona que califica haya comprado el producto o utilizado el servicio \[4\]. Como decisión de diseño, RePlay Games propone vincular las calificaciones únicamente con operaciones registradas como completadas dentro del sistema.

La necesidad abordada es contar con una plataforma especializada que reduzca la dispersión de información, facilite la comparación de publicaciones y entregue mayor trazabilidad a la compra y venta de videojuegos físicos usados.

## **2.2 Consecuencias asociadas**

* Mayor tiempo de búsqueda al revisar publicaciones poco pertinentes.  
* Dificultad para comparar alternativas cuando cada vendedor describe el producto de forma distinta.  
* Mayor incertidumbre respecto del estado del juego y de la confiabilidad del vendedor.  
* Repetición de preguntas que podrían resolverse con campos estandarizados.  
* Menor trazabilidad cuando publicación, acuerdo y seguimiento de la operación quedan dispersos.

## **2.3 Caracterización de usuarios objetivo**

| Aspecto | Caracterización preliminar |
| :---- | :---- |
| Grupo objetivo | Personas usuarias de consolas con formato físico interesadas en comprar o vender videojuegos de segunda mano. |
| Características generales | Usuarios con distintos niveles de experiencia en aplicaciones de compraventa; pueden comparar precios, publicar productos y revisar información desde móvil o computador. |
| Necesidades | Buscar títulos concretos, comparar precio/estado, publicar con rapidez, conocer modalidades de entrega y disponer de señales de confianza. |
| Posibles dificultades | Información incompleta, fotografías poco claras, publicaciones mal clasificadas, estados descritos de forma desigual y dudas sobre la contraparte. |
| Contexto de uso | Consultas rápidas desde smartphone y uso complementario de computador para revisar o administrar varias publicaciones. |
| Tareas | Explorar, filtrar, revisar detalle, publicar, administrar publicaciones, guardar favoritos, iniciar y seguir operaciones, calificar y reportar. |
| Experiencia tecnológica estimada | Básica a intermedia; se asume familiaridad con patrones habituales de aplicaciones móviles y comercio electrónico. |
| Accesibilidad | Interfaz legible, jerarquía clara, mensajes de error comprensibles, controles identificables y diseño responsivo. |
| Seguridad y privacidad | Solicitar pocos datos personales, proteger las funciones según sesión/rol y evitar exponer información privada innecesaria. |

## **2.4 Roles del sistema**

| Rol | Descripción |
| :---- | :---- |
| Usuario | Puede comprar y vender con una misma cuenta: explorar, publicar, administrar publicaciones, guardar favoritos, iniciar operaciones, calificar y reportar. |
| Administrador | Revisa reportes y modera publicaciones y usuarios según las reglas de la plataforma. |

## **2.5 Proto-personas**

*Nota metodológica: los siguientes perfiles son hipotéticos. No corresponden a entrevistas ni a resultados obtenidos de usuarios reales. Se construyen a partir de fuentes secundarias, análisis de soluciones existentes y supuestos razonados.*

### **Proto-persona 1: Sebastián \- comprador frecuente**

| Tipo de usuario / rol | Usuario \- comprador |
| :---- | :---- |
| Edad hipotética | 23 años |
| Características generales | Estudiante universitario, jugador frecuente y usuario habitual de aplicaciones móviles. |
| Necesidades principales | Encontrar juegos físicos compatibles con su consola, comparar precio y estado, revisar fotografías y señales de confianza. |
| Objetivos de uso | Localizar un título, revisar alternativas, guardar favoritos e iniciar una compra. |
| Dificultades / frustraciones | Publicaciones incompletas, fotos deficientes, información confusa sobre el estado y vendedores sin referencias. |
| Funcionalidades | Catálogo, filtros, detalle, favoritos, operaciones, calificaciones y reportes. |
| Dispositivo y contexto | Principalmente smartphone; consultas rápidas y revisión previa a una compra. |

### **Proto-persona 2: Camila \- vendedora ocasional**

| Tipo de usuario / rol | Usuario \- vendedora |
| :---- | :---- |
| Edad hipotética | 29 años |
| Características generales | Jugadora ocasional que conserva juegos físicos que ya no utiliza y usa smartphone y computador. |
| Necesidades principales | Publicar con pocos pasos, describir correctamente el estado y gestionar sus ventas desde un mismo lugar. |
| Objetivos de uso | Crear una publicación clara, recibir una solicitud y hacer seguimiento hasta completar la operación. |
| Dificultades / frustraciones | Formularios extensos, repetición de preguntas y dificultad para organizar varias publicaciones. |
| Funcionalidades | Publicar, editar/pausar, mis publicaciones, operaciones, perfil y calificaciones. |
| Dispositivo y contexto | Teléfono para fotografiar/publicar y computador cuando administra varias publicaciones. |

### **Proto-persona 3: Daniel \- administrador**

| Tipo de usuario / rol | Administrador |
| :---- | :---- |
| Características generales | Adulto con experiencia básica/intermedia en herramientas administrativas web. |
| Necesidades principales | Revisar reportes con contexto suficiente y aplicar acciones de moderación de manera controlada. |
| Objetivos de uso | Identificar el motivo del reporte, revisar la publicación y registrar una decisión. |
| Dificultades / frustraciones | Reportes ambiguos, falta de confirmación en acciones sensibles y poca trazabilidad. |
| Funcionalidades | Panel administrativo, reportes, moderación de publicaciones y gestión de usuarios. |
| Dispositivo y contexto | Principalmente computador de escritorio o portátil. |

## **2.6 Supuestos utilizados**

* El smartphone será uno de los principales dispositivos de acceso.  
* Precio, consola, estado físico, fotografías y entrega influyen en la comparación.  
* Una misma persona puede comprar y vender con la misma cuenta.  
* Los vendedores ocasionales preferirán formularios breves y estructurados.  
* La reputación y las fotografías pueden disminuir la incertidumbre previa a una operación.  
* Las calificaciones vinculadas a operaciones completadas pueden entregar mayor trazabilidad interna que una valoración desvinculada de una operación registrada.

# **3\. Requerimientos (EP 1.1)**

Los requerimientos funcionales siguientes no contabilizan registro ni inicio de sesión, ya que esas funciones se documentan de forma transversal. Cada requerimiento incluye identificador, nombre, descripción y rol, tal como exige la pauta.

## **3.1 Requerimientos funcionales por rol**

| ID | Nombre | Descripción | Rol |
| :---- | :---- | :---- | :---- |
| RF-01 | Explorar y filtrar catálogo | El sistema deberá permitir visualizar las publicaciones disponibles y buscar o filtrar videojuegos por título, consola, género, rango de precio, estado de conservación y ubicación. | Usuario |
| RF-02 | Consultar detalle de publicación | El sistema deberá permitir visualizar el detalle de una publicación, incluyendo fotografías, título, consola, género, precio, estado de conservación, descripción, ubicación, modalidad de entrega y datos públicos del vendedor. | Usuario |
| RF-03 | Publicar videojuego | El sistema deberá permitir al usuario crear una publicación de un videojuego físico, ingresando los datos obligatorios definidos por la plataforma y fotografías del producto. | Usuario |
| RF-04 | Gestionar publicaciones propias | El sistema deberá permitir al usuario editar, pausar, reactivar o eliminar sus propias publicaciones, siempre que el estado de la operación asociada lo permita. | Usuario |
| RF-05 | Gestionar favoritos | El sistema deberá permitir agregar y eliminar publicaciones de una lista personal de favoritos y consultar dicha lista posteriormente. | Usuario |
| RF-06 | Iniciar solicitud de compra | El sistema deberá permitir iniciar una solicitud de compra sobre una publicación disponible y seleccionar una modalidad de entrega definida por el vendedor. | Usuario |
| RF-07 | Consultar y gestionar operaciones | El sistema deberá permitir al comprador y al vendedor consultar sus operaciones y visualizar su estado, por ejemplo: pendiente, confirmada, completada o cancelada. | Usuario |
| RF-08 | Calificar una operación completada | El sistema deberá permitir registrar una calificación y una reseña únicamente cuando exista una operación completada entre comprador y vendedor. | Usuario |
| RF-09 | Reportar publicación | El sistema deberá permitir reportar una publicación mediante un motivo predefinido y un comentario opcional. | Usuario |
| RF-10 | Moderar publicaciones y reportes | El sistema deberá permitir al administrador consultar reportes, revisar la publicación asociada, mantenerla visible u ocultarla y registrar la acción de moderación realizada. | Administrador |

## **3.2 Funcionalidades transversales**

* FT-01 \- Registro de usuarios: crear una cuenta con los datos mínimos definidos.  
* FT-02 \- Inicio de sesión: ingresar mediante credenciales válidas.  
* FT-03 \- Cierre de sesión: finalizar una sesión activa.  
* FT-04 \- Restricción por rol: limitar funcionalidades según Usuario o Administrador.

## **3.3 Requerimientos no funcionales**

| ID | Nombre | Categoría | Descripción |
| :---- | :---- | :---- | :---- |
| RNF-UX-01 | Diseño adaptable | Usabilidad | La interfaz deberá adaptarse a dispositivos móviles y de escritorio sin pérdida de funcionalidades esenciales ni información crítica. |
| RNF-UX-02 | Navegación consistente | Usabilidad | La aplicación deberá mantener nombres, ubicación y comportamiento coherentes para los controles principales entre sus distintas vistas. |
| RNF-UX-03 | Retroalimentación al usuario | Usabilidad | Las acciones relevantes deberán mostrar estados de carga, confirmación o mensajes de error comprensibles. |
| RNF-ACC-01 | Accesibilidad de la interfaz | Accesibilidad | Los formularios y controles deberán utilizar etiquetas comprensibles, jerarquía visual clara, contraste adecuado y navegación mediante teclado cuando corresponda. |
| RNF-SEG-01 | Autenticación de funciones protegidas | Seguridad | Las funciones de publicación, favoritos, operaciones, calificación, reportes y administración deberán requerir una sesión válida. |
| RNF-SEG-02 | Autorización por roles | Seguridad | El sistema deberá verificar el rol del usuario antes de permitir acceso a funciones administrativas. |
| RNF-SEG-03 | Privacidad y minimización de datos | Seguridad / privacidad | El registro inicial deberá solicitar únicamente los datos necesarios para crear y utilizar la cuenta, evitando exponer información privada innecesaria. |
| RNF-SEG-04 | Protección de secretos | Seguridad | Credenciales, claves de API y secretos no deberán publicarse en el repositorio ni escribirse directamente en el código fuente. |
| RNF-REN-01 | Rendimiento de consultas | Rendimiento | Las vistas habituales de catálogo, detalle y operaciones deberán cargar de forma fluida, sin bloquear la interfaz, bajo las condiciones normales definidas para las pruebas del sistema. |
| RNF-COMP-01 | Compatibilidad | Compatibilidad | La versión web deberá funcionar correctamente en navegadores modernos y conservar su funcionalidad en tamaños de pantalla móviles y de escritorio. |
| RNF-MAN-01 | Estructura modular | Mantenibilidad | El frontend deberá organizarse modularmente en pages, components, routes, services, models y data, evitando duplicación innecesaria. |

# **4\. Arquitectura de navegación y experiencia de usuario (EP 1.4)**

## **4.1 Rutas públicas**

| Ruta | Vista | Descripción |
| :---- | :---- | :---- |
| / | Inicio / catálogo | Permite explorar publicaciones disponibles y acceder a la búsqueda. |
| /catalogo | Catálogo | Permite buscar y filtrar videojuegos. |
| /publicacion/:id | Detalle de publicación | Muestra la información completa de una publicación. |
| /login | Inicio de sesión | Permite ingresar con credenciales. |
| /registro | Registro | Permite crear una cuenta. |

## **4.2 Rutas protegidas del Usuario**

| Ruta | Vista | Descripción |
| :---- | :---- | :---- |
| /favoritos | Favoritos | Publicaciones guardadas por el usuario. |
| /publicar | Publicar videojuego | Formulario para crear una publicación. |
| /mis-publicaciones | Mis publicaciones | Permite administrar publicaciones propias. |
| /publicaciones/:id/editar | Editar publicación | Permite modificar una publicación propia. |
| /operaciones | Compras y ventas | Consulta del estado de las operaciones del usuario. |
| /calificar/:operacionId | Calificar operación | Permite calificar una operación completada. |
| /perfil | Perfil | Muestra información pública y reputación del usuario. |

## **4.3 Rutas protegidas del Administrador**

| Ruta | Vista | Descripción |
| :---- | :---- | :---- |
| /admin | Panel administrador | Resumen de moderación. |
| /admin/reportes | Reportes | Listado y revisión de reportes. |
| /admin/publicaciones | Moderación de publicaciones | Permite mantener u ocultar publicaciones. |
| /admin/usuarios | Usuarios | Vista administrativa de usuarios. |

## **4.4 Jerarquía de vistas**

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

## **4.5 Diferenciación de acceso según roles**

| Funcionalidad | Visitante | Usuario | Administrador |
| :---- | :---- | :---- | :---- |
| Explorar catálogo y ver detalle | Sí | Sí | Sí |
| Registrar / iniciar sesión | Sí | \- | \- |
| Publicar y gestionar publicaciones propias | \- | Sí | \- |
| Favoritos | \- | Sí | \- |
| Iniciar y consultar operaciones | \- | Sí | \- |
| Calificar operación completada | \- | Sí | \- |
| Reportar publicación | \- | Sí | \- |
| Moderar reportes/publicaciones | \- | \- | Sí |
| Gestionar usuarios | \- | \- | Sí |

## **4.6 Flujos de tareas (task flows)**

### **Task Flow 1: buscar e iniciar una compra**

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

### **Task Flow 2: publicar un videojuego**

Login → Publicar → Ingresar datos → Agregar fotografías → Revisar  
                         ↓  
                    ¿Datos válidos?  
                    No → mostrar errores  
                    Sí → publicar → confirmación → Mis publicaciones

### **Task Flow 3: moderar un reporte**

Login administrador → Panel → Reportes → Seleccionar reporte  
      ↓  
Revisar publicación → Mantener visible / Ocultar → Confirmar → Registrar resultado

## **4.7 Puntos críticos de interacción**

* Inicio de sesión y acceso por rol: mensajes claros y bloqueo de rutas no autorizadas.  
* Formulario de publicación: validación de obligatorios, conservación de datos y confirmación.  
* Disponibilidad: una publicación vendida o pausada no debe permitir una nueva operación.  
* Confirmación de compra: mostrar resumen del producto y modalidad de entrega antes de crear la operación.  
* Calificación: habilitar solo para operaciones completadas.  
* Moderación: solicitar confirmación y registrar acciones sensibles.  
* Cambio entre web y móvil: mantener etiquetas, funciones y lógica aunque cambie la distribución visual.

## **4.8 Coherencia entre dispositivos y justificación técnica**

En móvil se propone una barra inferior mediante IonTabs; en web, un IonMenu o navegación lateral/superior equivalente. Las mismas funciones mantendrán nombres y comportamientos coherentes, mientras la grilla, los filtros y los formularios se reorganizarán según el ancho disponible.

La arquitectura favorece la usabilidad mediante una navegación predecible; la eficiencia al mantener recorridos breves; la claridad estructural al separar rutas públicas, de Usuario y de Administrador; y la escalabilidad al permitir incorporar la futura API REST sin reorganizar completamente el frontend.

# **5\. Bocetos UI/UX y prototipo en Figma (EP 1.3)**

El prototipo deberá ser construido manualmente por el equipo en Figma, sin utilizar asistentes de IA generativa para crear automáticamente las pantallas, componentes, estilos, navegación o prototipo. Esta redacción debe cambiarse a “fue elaborado” solo cuando el trabajo haya sido efectivamente realizado.

Enlace público de Figma: \[AGREGAR CUANDO ESTÉ DISPONIBLE\]

Se planifican siete pantallas asociadas a funcionalidades, además de Inicio de sesión y Registro, todas en versión móvil y web.

| N° | Pantalla | RF / función | Contenido |
| :---- | :---- | :---- | :---- |
| 1 | Catálogo / inicio | RF-01 | Buscador, filtros, grilla/lista de juegos, precio, consola, estado y ubicación. |
| 2 | Detalle del videojuego | RF-02 | Fotografías, datos del producto, vendedor, reputación, entrega, favorito y acción de compra. |
| 3 | Publicar videojuego | RF-03 | Formulario con título, consola, género, estado, precio, descripción, ubicación, entrega e imágenes. |
| 4 | Mis publicaciones | RF-04 | Listado propio con edición, pausa, reactivación y eliminación según estado. |
| 5 | Favoritos | RF-05 | Listado de publicaciones guardadas y acceso al detalle. |
| 6 | Mis compras y ventas | RF-06 / RF-07 / RF-08 | Operaciones separadas por tipo/estado, confirmaciones y acceso a calificación cuando corresponda. |
| 7 | Administración de reportes | RF-09 / RF-10 | Listado de reportes, detalle de publicación y acciones de moderación. |
| 8 | Inicio de sesión | FT-02 | Correo/usuario, contraseña, mensajes de error y redirección posterior. |
| 9 | Registro | FT-01 | Usuario, correo, contraseña, confirmación, región/comuna opcional y aceptación de términos, con validaciones. |

## **5.1 Adaptación web y móvil**

* Web: mayor densidad de información, filtros visibles y navegación lateral/superior.  
* Móvil: contenido priorizado, filtros desplegables y navegación inferior.  
* Mantener jerarquía visual, nombres de acciones y estados de interacción en ambas versiones.

## **5.2 Formulario de registro y justificación de datos**

| Campo | Condición | Justificación |
| :---- | :---- | :---- |
| Nombre de usuario | Obligatorio | Identificación pública dentro de la plataforma. |
| Correo electrónico | Obligatorio | Identificación de cuenta y recuperación de acceso. |
| Contraseña | Obligatorio | Autenticación del usuario. |
| Confirmación de contraseña | Obligatorio | Disminuir errores al crear la cuenta. |
| Región o comuna | Opcional | Apoyar búsquedas y coordinación de entregas sin solicitar una dirección exacta. |
| Aceptación de términos | Obligatorio | Registrar aceptación de las reglas de uso. |

No se propone solicitar RUT, dirección exacta, teléfono ni fecha de nacimiento durante el registro inicial, porque no son necesarios para las funcionalidades definidas en EP1. El prototipo deberá representar campos obligatorios/opcionales, formatos esperados, validaciones, mensajes de error, retroalimentación y condiciones de seguridad de contraseña.

# **6\. Frontend Ionic \+ React (EP 1.5 y EP 1.6)**

## **6.1 Configuración requerida**

* Ionic \+ React \+ TypeScript.  
* React Router mediante @ionic/react-router.  
* Rutas públicas y protegidas.  
* Redirección a /login al intentar acceder a una ruta protegida sin sesión.  
* Protección adicional de rutas administrativas según rol.  
* Estructura modular de vistas.

## **6.2 Estructura modular propuesta**

src/  
├── components/  
├── pages/  
│   └── admin/  
├── routes/  
├── services/  
├── models/  
├── data/  
├── theme/  
└── App.tsx

## **6.3 Pantallas principales de EP1**

El enunciado exige al menos cuatro pantallas implementadas. Para asegurar coherencia con el prototipo se recomienda implementar inicialmente Catálogo, Detalle, Publicar y Operaciones, además de Login y Registro para demostrar redirecciones y rutas protegidas.

| Pantalla | Componentes Ionic sugeridos |
| :---- | :---- |
| Catálogo | IonPage, IonHeader, IonToolbar, IonContent, IonSearchbar, IonGrid, IonCard, IonChip. |
| Detalle | IonPage, IonHeader, IonContent, IonImg, IonBadge, IonButton. |
| Publicar | IonPage, IonContent, IonInput, IonSelect, IonTextarea, IonButton. |
| Operaciones | IonPage, IonSegment, IonList, IonItem, IonBadge, IonButton. |
| Login / Registro | IonPage, IonInput, IonButton, validaciones y mensajes de error. |

## **6.4 Evidencia pendiente de incorporar al README**

Cuando las pantallas estén programadas, se deberán agregar capturas reales dentro del repositorio (por ejemplo en docs/img/) y enlazarlas en Markdown. No se recomienda declarar como implementada una pantalla que todavía no exista.

# **7\. Tecnologías y herramientas**

## **7.1 Frontend EP1**

* Ionic Framework  
* React  
* TypeScript  
* @ionic/react  
* @ionic/react-router  
* react-router-dom  
* ionicons  
* CSS de Ionic o alternativa definida por el equipo  
* Figma  
* Git y GitHub

## **7.2 Planificadas para entregas posteriores**

* Backend: Node.js con Express o Flask.  
* Base de datos relacional: PostgreSQL o MySQL.  
* Autenticación: JWT.  
* Pruebas API: Postman o Insomnia.  
* Despliegue: Docker y docker-compose.

# **8\. Instalación, configuración, ejecución y uso**

Estos comandos deberán ajustarse a la estructura real del repositorio una vez creado el proyecto.

git clone \<URL\_DEL\_REPOSITORIO\>  
cd \<CARPETA\_FRONTEND\>  
npm install  
ionic serve

## **8.1 Uso básico esperado en EP1**

* Abrir la aplicación en el navegador.  
* Explorar el catálogo y acceder al detalle de una publicación.  
* Iniciar sesión para utilizar funciones protegidas.  
* Acceder a Publicar, Operaciones o Favoritos según las vistas implementadas.  
* Verificar la adaptación en tamaños móvil y escritorio.

# **9\. Gestión del repositorio**

* Repositorio y Figma públicos para revisión.  
* Rama frontend con código y documentación de requerimientos.  
* Commits progresivos y colaborativos; evitar una única carga final.  
* Registrar en Aula Virtual la URL correcta del repositorio.  
* Actualizar el README con enlace de Figma, capturas reales, instrucciones finales y recursos Markdown.

## **9.1 Matriz de cumplimiento EP1**

| Criterio | Cobertura documental | Evidencia que falta completar |
| :---- | :---- | :---- |
| EP 1.1 | 10 RF \+ 11 RNF \+ roles \+ funciones transversales. | Confirmar que implementación respete los requerimientos. |
| EP 1.2 | Problema, usuarios, contexto, tareas, experiencia, accesibilidad/privacidad, 3 proto-personas y supuestos, con fuentes. | Mantener enlaces/fuentes en README final. |
| EP 1.3 | Plan de 7 pantallas funcionales \+ Login \+ Registro; criterios web/móvil y formulario. | Construir manualmente Figma y agregar enlace público. |
| EP 1.4 | Rutas, jerarquía, roles, 3 task flows, puntos críticos, coherencia y justificación. | Alinear navegación implementada con esta arquitectura. |
| EP 1.5 | Estructura Ionic/React, rutas públicas/protegidas y redirecciones definidas. | Crear proyecto real y dejarlo ejecutable. |
| EP 1.6 | Pantallas y componentes Ionic recomendados. | Implementar mínimo 4 pantallas y agregar capturas reales. |
| Documentación/GitHub | README, instalación, tecnologías y checklist definidos. | Completar integrantes, responsabilidades, URLs, capturas y commits reales. |

# **10\. Fuentes secundarias**

\[1\] Cámara de Comercio de Santiago (CCS). Comercio electrónico bordeó los US$ 10 mil millones en 2025\. https://www.ccs.cl/area-publicacion/comercio-electronico-y-economia-digital/

\[2\] SERNAC. Tus derechos en el Comercio Electrónico. https://www.sernac.cl/portal/618/w3-propertyvalue-20982.html

\[3\] SERNAC. Derechos y deberes en el consumo. Referencia sobre información de productos usados. https://www.sernac.cl/portal/617/w3-propertyvalue-8321.html

\[4\] Meta \- Facebook Help Center. How ratings work on Facebook Marketplace. https://www.facebook.com/help/915385548593204/

\[5\] Sandra Cano \- PUCV. README de ejemplo para EP1. https://github.com/SandraCano-PUCV/IngenieriaWebMovil/blob/main/EP/EP1/Readme.md

\[6\] Enunciado del curso. Proyecto Final: Ingeniería Web y Móvil, Entrega Parcial 1 y rúbrica de evaluación. Documento entregado en Aula Virtual.