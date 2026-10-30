# Resultados de las pruebas de la API (newman)

Ejecución: 2026-10-24 00:40:31 UTC · colección `RePlay Games API (EP2)`.

| Solicitudes | Pruebas (assertions) | Fallidas | Tiempo promedio de respuesta |
| :---: | :---: | :---: | :---: |
| 64 | 149 | 0 | 14 ms |

## Resumen por solicitud

| # | Caso | Solicitud | Código | Pruebas |
| :-- | :-- | :-- | :-: | :-: |
| **0. Salud del servidor** | | | | |
| 1 | Estado de la API y de la base de datos | `GET /api/salud` | 200 | ✅ 3/3 |
| **1. Autenticación (FT-01, FT-02)** | | | | |
| 2 | Registro exitoso | `POST /api/auth/registro` | 201 | ✅ 5/5 |
| 3 | Registro con correo duplicado | `POST /api/auth/registro` | 409 | ✅ 3/3 |
| 4 | Registro con datos inválidos | `POST /api/auth/registro` | 400 | ✅ 5/5 |
| 5 | Login usuario (sebastian_r) | `POST /api/auth/login` | 200 | ✅ 4/4 |
| 6 | Login segunda cuenta (camila_v) | `POST /api/auth/login` | 200 | ✅ 4/4 |
| 7 | Login administrador | `POST /api/auth/login` | 200 | ✅ 5/5 |
| 8 | Login con contraseña incorrecta | `POST /api/auth/login` | 401 | ✅ 3/3 |
| 9 | Perfil con token | `GET /api/auth/perfil` | 200 | ✅ 3/3 |
| 10 | Perfil sin token | `GET /api/auth/perfil` | 401 | ✅ 2/2 |
| 11 | Perfil con token manipulado | `GET /api/auth/perfil` | 401 | ✅ 2/2 |
| **2. Catálogo y perfiles públicos (RF-01, RF-02)** | | | | |
| 12 | Catálogos para formularios | `GET /api/catalogos` | 200 | ✅ 2/2 |
| 13 | Listar catálogo | `GET /api/publicaciones` | 200 | ✅ 3/3 |
| 14 | Buscar sin tildes ni mayúsculas | `GET /api/publicaciones?texto=POKEMON` | 200 | ✅ 2/2 |
| 15 | Filtrar por consola y precio máximo | `GET /api/publicaciones?consola=Nintendo%20Switch&precioMaximo=35000` | 200 | ✅ 2/2 |
| 16 | Filtro con valor inválido | `GET /api/publicaciones?precioMaximo=barato` | 400 | ✅ 2/2 |
| 17 | Detalle de publicación | `GET /api/publicaciones/1` | 200 | ✅ 2/2 |
| 18 | Detalle inexistente | `GET /api/publicaciones/999999` | 404 | ✅ 2/2 |
| 19 | Detalle con identificador inválido | `GET /api/publicaciones/abc` | 400 | ✅ 2/2 |
| 20 | Perfil público del vendedor | `GET /api/usuarios/3` | 200 | ✅ 3/3 |
| **3. Publicaciones (RF-03, RF-04, RF-10)** | | | | |
| 21 | Crear publicación | `POST /api/publicaciones` | 201 | ✅ 3/3 |
| 22 | Crear sin sesión | `POST /api/publicaciones` | 401 | ✅ 2/2 |
| 23 | Crear con datos inválidos | `POST /api/publicaciones` | 400 | ✅ 5/5 |
| 24 | Crear con comuna de otra región | `POST /api/publicaciones` | 400 | ✅ 2/2 |
| 25 | Crear como administrador (rol no permitido) | `POST /api/publicaciones` | 403 | ✅ 2/2 |
| 26 | Editar publicación propia | `PUT /api/publicaciones/13` | 200 | ✅ 2/2 |
| 27 | Editar publicación ajena | `PUT /api/publicaciones/13` | 403 | ✅ 2/2 |
| 28 | Pausar publicación | `PATCH /api/publicaciones/13/estado` | 200 | ✅ 2/2 |
| 29 | Estado de publicación inválido | `PATCH /api/publicaciones/13/estado` | 400 | ✅ 2/2 |
| 30 | Reactivar publicación | `PATCH /api/publicaciones/13/estado` | 200 | ✅ 2/2 |
| 31 | Mis publicaciones | `GET /api/publicaciones/mias` | 200 | ✅ 3/3 |
| 32 | Moderar con rol usuario | `PATCH /api/publicaciones/13/moderacion` | 403 | ✅ 2/2 |
| 33 | Ocultar publicación (administrador) | `PATCH /api/publicaciones/13/moderacion` | 200 | ✅ 2/2 |
| 34 | Visitante no ve la publicación oculta | `GET /api/publicaciones/13` | 404 | ✅ 1/1 |
| 35 | El dueño sí ve su publicación oculta | `GET /api/publicaciones/13` | 200 | ✅ 2/2 |
| 36 | Mostrar publicación (administrador) | `PATCH /api/publicaciones/13/moderacion` | 200 | ✅ 2/2 |
| **4. Operaciones (RF-06, RF-07)** | | | | |
| 37 | Comprar publicación propia | `POST /api/operaciones` | 409 | ✅ 2/2 |
| 38 | Comprar con modalidad no ofrecida | `POST /api/operaciones` | 400 | ✅ 2/2 |
| 39 | Solicitar compra | `POST /api/operaciones` | 201 | ✅ 3/3 |
| 40 | Solicitud duplicada | `POST /api/operaciones` | 409 | ✅ 2/2 |
| 41 | Comprar como administrador (rol no permitido) | `POST /api/operaciones` | 403 | ✅ 1/1 |
| 42 | Compras y ventas del comprador | `GET /api/operaciones` | 200 | ✅ 2/2 |
| 43 | El comprador no puede confirmar | `PATCH /api/operaciones/7/estado` | 409 | ✅ 2/2 |
| 44 | Completar sin confirmar (transición inválida) | `PATCH /api/operaciones/7/estado` | 409 | ✅ 2/2 |
| 45 | Un tercero no puede cambiar la operación | `PATCH /api/operaciones/7/estado` | 403 | ✅ 2/2 |
| 46 | Vendedor confirma | `PATCH /api/operaciones/7/estado` | 200 | ✅ 2/2 |
| 47 | Eliminar publicación con operaciones | `DELETE /api/publicaciones/13` | 409 | ✅ 2/2 |
| 48 | Vendedor completa | `PATCH /api/operaciones/7/estado` | 200 | ✅ 3/3 |
| 49 | Editar publicación vendida | `PUT /api/publicaciones/13` | 409 | ✅ 2/2 |
| **5. Eliminar publicación (RF-04)** | | | | |
| 50 | Crear publicación temporal | `POST /api/publicaciones` | 201 | ✅ 1/1 |
| 51 | Eliminar publicación ajena | `DELETE /api/publicaciones/14` | 403 | ✅ 2/2 |
| 52 | Eliminar publicación propia | `DELETE /api/publicaciones/14` | 204 | ✅ 1/1 |
| 53 | La publicación eliminada ya no existe | `GET /api/publicaciones/14` | 404 | ✅ 1/1 |
| **6. Administración y roles (FT-04, RNF-SEG-02)** | | | | |
| 54 | Listar usuarios con rol usuario | `GET /api/usuarios` | 403 | ✅ 2/2 |
| 55 | Listar usuarios sin sesión | `GET /api/usuarios` | 401 | ✅ 1/1 |
| 56 | Listar usuarios (administrador) | `GET /api/usuarios` | 200 | ✅ 3/3 |
| 57 | Desactivar cuenta | `PATCH /api/usuarios/6/estado` | 200 | ✅ 2/2 |
| 58 | Login de cuenta desactivada | `POST /api/auth/login` | 403 | ✅ 2/2 |
| 59 | Token de cuenta desactivada | `GET /api/auth/perfil` | 401 | ✅ 2/2 |
| 60 | El administrador no puede desactivarse | `PATCH /api/usuarios/5/estado` | 400 | ✅ 2/2 |
| 61 | Reactivar cuenta | `PATCH /api/usuarios/6/estado` | 200 | ✅ 2/2 |
| 62 | Actualizar perfil propio | `PATCH /api/usuarios/perfil` | 200 | ✅ 2/2 |
| **7. Errores generales** | | | | |
| 63 | JSON mal formado | `POST /api/auth/login` | 400 | ✅ 2/2 |
| 64 | Ruta inexistente | `GET /api/ruta-inexistente` | 404 | ✅ 2/2 |

## Respuestas recibidas

Los tokens JWT se reemplazan por `<token JWT>`.

<details><summary>1. Estado de la API y de la base de datos — GET /api/salud → 200 OK</summary>

- ✅ Responde 200
- ✅ Base de datos conectada
- ✅ Responde en menos de 3 segundos (RNF-REN-01)

```json
{
  "estado": "ok",
  "baseDatos": "conectada"
}
```
</details>
<details><summary>2. Registro exitoso — POST /api/auth/registro → 201 Created</summary>

- ✅ Responde 201
- ✅ Crea la cuenta con rol usuario
- ✅ Entrega un JWT
- ✅ Incluye el encabezado Location
- ✅ No expone contraseñas ni hashes

```json
{
  "token": "<token JWT>",
  "expiraEn": "2h",
  "usuario": {
    "id": 6,
    "nombreUsuario": "jugador_1792802431458",
    "correo": "jugador1792802431458@replay.cl",
    "rol": "usuario",
    "region": "Biobío",
    "comuna": "Talcahuano",
    "reputacion": 0,
    "totalCalificaciones": 0,
    "fechaRegistro": "2026-10-24",
    "activo": true
  }
}
```
</details>
<details><summary>3. Registro con correo duplicado — POST /api/auth/registro → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible
- ✅ Informa el error del campo "correo"

```json
{
  "mensaje": "Ya existe una cuenta registrada con ese correo.",
  "errores": [
    {
      "campo": "correo",
      "mensaje": "Ya existe una cuenta registrada con ese correo."
    }
  ]
}
```
</details>
<details><summary>4. Registro con datos inválidos — POST /api/auth/registro → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Incluye un mensaje de error comprensible
- ✅ Informa el error del campo "nombreUsuario"
- ✅ Informa el error del campo "correo"
- ✅ Informa el error del campo "clave"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "nombreUsuario",
      "mensaje": "El nombre de usuario debe tener entre 3 y 30 caracteres."
    },
    {
      "campo": "correo",
      "mensaje": "El formato del correo no es válido."
    },
    {
      "campo": "clave",
      "mensaje": "La contraseña debe tener entre 6 y 72 caracteres."
    }
  ]
}
```
</details>
<details><summary>5. Login usuario (sebastian_r) — POST /api/auth/login → 200 OK</summary>

- ✅ Responde 200
- ✅ Entrega un JWT y los datos del usuario
- ✅ El token solo contiene sub, rol y fechas
- ✅ No expone contraseñas ni hashes

```json
{
  "token": "<token JWT>",
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
</details>
<details><summary>6. Login segunda cuenta (camila_v) — POST /api/auth/login → 200 OK</summary>

- ✅ Responde 200
- ✅ Entrega un JWT y los datos del usuario
- ✅ El token solo contiene sub, rol y fechas
- ✅ No expone contraseñas ni hashes

```json
{
  "token": "<token JWT>",
  "expiraEn": "2h",
  "usuario": {
    "id": 2,
    "nombreUsuario": "camila_v",
    "correo": "camila@replay.cl",
    "rol": "usuario",
    "region": "Valparaíso",
    "comuna": "Viña del Mar",
    "reputacion": 4.6,
    "totalCalificaciones": 27,
    "fechaRegistro": "2025-11-02",
    "activo": true
  }
}
```
</details>
<details><summary>7. Login administrador — POST /api/auth/login → 200 OK</summary>

- ✅ Responde 200
- ✅ Entrega un JWT y los datos del usuario
- ✅ El token solo contiene sub, rol y fechas
- ✅ No expone contraseñas ni hashes
- ✅ Rol administrador

```json
{
  "token": "<token JWT>",
  "expiraEn": "2h",
  "usuario": {
    "id": 5,
    "nombreUsuario": "daniel_admin",
    "correo": "admin@replay.cl",
    "rol": "administrador",
    "region": "Metropolitana",
    "comuna": "Santiago",
    "reputacion": 0,
    "totalCalificaciones": 0,
    "fechaRegistro": "2025-09-01",
    "activo": true
  }
}
```
</details>
<details><summary>8. Login con contraseña incorrecta — POST /api/auth/login → 401 Unauthorized</summary>

- ✅ Responde 401
- ✅ Incluye un mensaje de error comprensible
- ✅ No entrega token

```json
{
  "mensaje": "El correo o la contraseña no son correctos."
}
```
</details>
<details><summary>9. Perfil con token — GET /api/auth/perfil → 200 OK</summary>

- ✅ Responde 200
- ✅ Devuelve la cuenta autenticada
- ✅ No expone contraseñas ni hashes

```json
{
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
```
</details>
<details><summary>10. Perfil sin token — GET /api/auth/perfil → 401 Unauthorized</summary>

- ✅ Responde 401
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Debes iniciar sesión para continuar."
}
```
</details>
<details><summary>11. Perfil con token manipulado — GET /api/auth/perfil → 401 Unauthorized</summary>

- ✅ Responde 401
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "El token de sesión no es válido."
}
```
</details>
<details><summary>12. Catálogos para formularios — GET /api/catalogos → 200 OK</summary>

- ✅ Responde 200
- ✅ Incluye consolas, géneros y regiones con comunas

```json
{
  "consolas": [
    "PlayStation 5",
    "PlayStation 4",
    "Nintendo Switch",
    "Xbox Series X|S",
    "Xbox One",
    "Nintendo 3DS"
  ],
  "generos": [
    "Acción / Aventura",
    "RPG",
    "Deportes",
    "Carreras",
    "Plataformas",
    "Estrategia",
    "Terror"
  ],
  "estadosConservacion": [
    "Nuevo / sellado",
    "Como nuevo",
    "Bueno",
    "Aceptable",
    "Con detalles"
  ],
  "modalidadesEntrega": [
    "Retiro en persona",
    "Punto de encuentro",
    "Envío por pagar"
  ],
  "regiones": [
    {
      "nombre": "Valparaíso",
      "comunas": [
        "Valparaíso",
        "Viña del Mar",
        "Quilpué",
        "Villa Alemana",
        "Concón"
      ]
    },
    {
      "nombre": "Metropolitana",
      "comunas": [
        "Santiago",
        "Providencia",
        "Ñuñoa",
        "Maipú",
        "La Florida"
      ]
    },
    {
      "nombre": "Biobío",
      "comunas": [
        "Concepción",
        "Talcahuano",
        "San Pedro de la Paz"
      ]
    }
  ]
}
```
</details>
<details><summary>13. Listar catálogo — GET /api/publicaciones → 200 OK</summary>

- ✅ Responde 200
- ✅ No muestra publicaciones vendidas ni ocultas
- ✅ Responde en menos de 3 segundos (RNF-REN-01)

```json
[
  {
    "id": 5,
    "titulo": "Super Mario Odyssey",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 32990,
    "estadoConservacion": "Nuevo / sellado",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Copia sellada, regalo repetido. Nunca abierta. Solo entrega en persona para que puedas revisarla.",
    "region": "Valparaíso",
    "comuna": "Valparaíso",
    "entregas": [
      "Retiro en persona",
      "Punto de encuentro"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-09-15"
  },
  {
    "id": 4,
    "titulo": "EA Sports FC 25",
    "consola": "PlayStation 5",
    "genero": "Deportes",
    "precio": 24990,
    "estadoConservacion": "Bueno",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Vendo porque ya salió la edición nueva. Disco con micro rayas superficiales que no afectan la lectura.",
    "region": "Valparaíso",
    "comuna": "Quilpué",
    "entregas": [
      "Retiro en persona"
    ],
    "incluyeCaja": true,
    "incluyeManual": false,
    "vendedorId": 2,
    "fechaPublicacion": "2026-09-14"
  },
  {
    "id": 12,
    "titulo": "God of War Ragnarök",
    "consola": "PlayStation 4",
    "genero": "Acción / Aventura",
    "precio": 19990,
    "estadoConservacion": "Bueno",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Incluye caja original. Disco en buen estado, se probó antes de publica
… (respuesta recortada)
```
</details>
<details><summary>14. Buscar sin tildes ni mayúsculas — GET /api/publicaciones?texto=POKEMON → 200 OK</summary>

- ✅ Responde 200
- ✅ Encuentra Pokémon Ultra Sun

```json
[
  {
    "id": 11,
    "titulo": "Pokémon Ultra Sun",
    "consola": "Nintendo 3DS",
    "genero": "RPG",
    "precio": 22990,
    "estadoConservacion": "Con detalles",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Cartucho original con la etiqueta despegada en una esquina. Funciona perfecto, partida guardada borrada.",
    "region": "Metropolitana",
    "comuna": "La Florida",
    "entregas": [
      "Envío por pagar"
    ],
    "incluyeCaja": false,
    "incluyeManual": false,
    "vendedorId": 3,
    "fechaPublicacion": "2026-08-30"
  }
]
```
</details>
<details><summary>15. Filtrar por consola y precio máximo — GET /api/publicaciones?consola=Nintendo%20Switch&precioMaximo=35000 → 200 OK</summary>

- ✅ Responde 200
- ✅ Todas cumplen los filtros

```json
[
  {
    "id": 5,
    "titulo": "Super Mario Odyssey",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 32990,
    "estadoConservacion": "Nuevo / sellado",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Copia sellada, regalo repetido. Nunca abierta. Solo entrega en persona para que puedas revisarla.",
    "region": "Valparaíso",
    "comuna": "Valparaíso",
    "entregas": [
      "Retiro en persona",
      "Punto de encuentro"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-09-15"
  }
]
```
</details>
<details><summary>16. Filtro con valor inválido — GET /api/publicaciones?precioMaximo=barato → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Informa el error del campo "precioMaximo"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "precioMaximo",
      "mensaje": "El precio máximo debe ser un número entero."
    }
  ]
}
```
</details>
<details><summary>17. Detalle de publicación — GET /api/publicaciones/1 → 200 OK</summary>

- ✅ Responde 200
- ✅ Incluye los datos estandarizados

```json
{
  "id": 1,
  "titulo": "The Last of Us Part II",
  "consola": "PlayStation 4",
  "genero": "Acción / Aventura",
  "precio": 18990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": false,
  "descripcion": "Disco sin rayas, se jugó una sola vez. Incluye caja original y manual. Se puede revisar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Viña del Mar",
  "entregas": [
    "Retiro en persona",
    "Punto de encuentro"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 2,
  "fechaPublicacion": "2026-09-10"
}
```
</details>
<details><summary>18. Detalle inexistente — GET /api/publicaciones/999999 → 404 Not Found</summary>

- ✅ Responde 404
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "La publicación no existe o fue retirada del catálogo."
}
```
</details>
<details><summary>19. Detalle con identificador inválido — GET /api/publicaciones/abc → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Informa el error del campo "id"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "id",
      "mensaje": "El identificador no es válido."
    }
  ]
}
```
</details>
<details><summary>20. Perfil público del vendedor — GET /api/usuarios/3 → 200 OK</summary>

- ✅ Responde 200
- ✅ No expone el correo
- ✅ Incluye la reputación

```json
{
  "id": 3,
  "nombreUsuario": "diego_games",
  "rol": "usuario",
  "region": "Metropolitana",
  "comuna": "Ñuñoa",
  "reputacion": 4.2,
  "totalCalificaciones": 8,
  "fechaRegistro": "2026-01-20"
}
```
</details>
<details><summary>21. Crear publicación — POST /api/publicaciones → 201 Created</summary>

- ✅ Responde 201
- ✅ Queda activa y pertenece a quien publica
- ✅ Incluye el encabezado Location

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 15990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": false,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": false,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>22. Crear sin sesión — POST /api/publicaciones → 401 Unauthorized</summary>

- ✅ Responde 401
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Debes iniciar sesión para continuar."
}
```
</details>
<details><summary>23. Crear con datos inválidos — POST /api/publicaciones → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Informa el error del campo "titulo"
- ✅ Informa el error del campo "precio"
- ✅ Informa el error del campo "descripcion"
- ✅ Informa el error del campo "entregas"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "titulo",
      "mensaje": "El título debe tener entre 3 y 120 caracteres."
    },
    {
      "campo": "consola",
      "mensaje": "Selecciona la consola compatible."
    },
    {
      "campo": "genero",
      "mensaje": "Selecciona el género."
    },
    {
      "campo": "estadoConservacion",
      "mensaje": "Indica un estado de conservación válido."
    },
    {
      "campo": "precio",
      "mensaje": "Ingresa un precio válido en pesos, hasta $500.000."
    },
    {
      "campo": "descripcion",
      "mensaje": "La descripción debe tener entre 20 y 400 caracteres."
    },
    {
      "campo": "region",
      "mensaje": "Selecciona tu región."
    },
    {
      "campo": "comuna",
      "mensaje": "Selecciona tu comuna."
    },
    {
      "campo": "entregas",
      "mensaje": "Elige al menos una modalidad de entrega."
    }
  ]
}
```
</details>
<details><summary>24. Crear con comuna de otra región — POST /api/publicaciones → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Informa el error del campo "comuna"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "comuna",
      "mensaje": "La comuna no pertenece a la región indicada."
    }
  ]
}
```
</details>
<details><summary>25. Crear como administrador (rol no permitido) — POST /api/publicaciones → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Tu cuenta no tiene permisos para realizar esta acción."
}
```
</details>
<details><summary>26. Editar publicación propia — PUT /api/publicaciones/13 → 200 OK</summary>

- ✅ Responde 200
- ✅ Guarda los cambios

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 13990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": false,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>27. Editar publicación ajena — PUT /api/publicaciones/13 → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Solo quien publicó el videojuego puede modificar esta publicación."
}
```
</details>
<details><summary>28. Pausar publicación — PATCH /api/publicaciones/13/estado → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda pausada

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 13990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "pausada",
  "oculta": false,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>29. Estado de publicación inválido — PATCH /api/publicaciones/13/estado → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Informa el error del campo "estadoPublicacion"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "estadoPublicacion",
      "mensaje": "El estado debe ser \"activa\" o \"pausada\"."
    }
  ]
}
```
</details>
<details><summary>30. Reactivar publicación — PATCH /api/publicaciones/13/estado → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda activa

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 13990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": false,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>31. Mis publicaciones — GET /api/publicaciones/mias → 200 OK</summary>

- ✅ Responde 200
- ✅ Incluye la publicación creada
- ✅ Solo publicaciones propias

```json
[
  {
    "id": 13,
    "titulo": "Hollow Knight",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 13990,
    "estadoConservacion": "Como nuevo",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
    "region": "Valparaíso",
    "comuna": "Quilpué",
    "entregas": [
      "Retiro en persona",
      "Envío por pagar"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-10-24"
  },
  {
    "id": 5,
    "titulo": "Super Mario Odyssey",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 32990,
    "estadoConservacion": "Nuevo / sellado",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Copia sellada, regalo repetido. Nunca abierta. Solo entrega en persona para que puedas revisarla.",
    "region": "Valparaíso",
    "comuna": "Valparaíso",
    "entregas": [
      "Retiro en persona",
      "Punto de encuentro"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-09-15"
  },
  {
    "id": 10,
    "titulo": "Animal Crossing: New Horizons",
    "consola": "Nintendo Switch",
    "genero": "Estrategia",
    "precio": 34990,
    "estadoConservacion": "Como nuevo",
    "estadoPublicacion": "vendida",
    "oculta": false,
    "descripcion": "Vendido a través de la plataforma. Se mantiene 
… (respuesta recortada)
```
</details>
<details><summary>32. Moderar con rol usuario — PATCH /api/publicaciones/13/moderacion → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Tu cuenta no tiene permisos para realizar esta acción."
}
```
</details>
<details><summary>33. Ocultar publicación (administrador) — PATCH /api/publicaciones/13/moderacion → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda oculta

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 13990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": true,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>34. Visitante no ve la publicación oculta — GET /api/publicaciones/13 → 404 Not Found</summary>

- ✅ Responde 404

```json
{
  "mensaje": "La publicación no existe o fue retirada del catálogo."
}
```
</details>
<details><summary>35. El dueño sí ve su publicación oculta — GET /api/publicaciones/13 → 200 OK</summary>

- ✅ Responde 200
- ✅ Marcada como oculta

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 13990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": true,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>36. Mostrar publicación (administrador) — PATCH /api/publicaciones/13/moderacion → 200 OK</summary>

- ✅ Responde 200
- ✅ Vuelve a ser visible

```json
{
  "id": 13,
  "titulo": "Hollow Knight",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 13990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": false,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": true,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>37. Comprar publicación propia — POST /api/operaciones → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "No puedes comprar tu propia publicación."
}
```
</details>
<details><summary>38. Comprar con modalidad no ofrecida — POST /api/operaciones → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Informa el error del campo "modalidadEntrega"

```json
{
  "mensaje": "Revisa los datos enviados.",
  "errores": [
    {
      "campo": "modalidadEntrega",
      "mensaje": "El vendedor no ofrece esa modalidad de entrega."
    }
  ]
}
```
</details>
<details><summary>39. Solicitar compra — POST /api/operaciones → 201 Created</summary>

- ✅ Responde 201
- ✅ Queda pendiente y con la contraparte
- ✅ No expone contraseñas ni hashes

```json
{
  "operacion": {
    "id": 7,
    "publicacionId": 13,
    "compradorId": 2,
    "vendedorId": 1,
    "estado": "pendiente",
    "modalidadEntrega": "Envío por pagar",
    "fechaCreacion": "2026-10-24",
    "calificada": false
  },
  "publicacion": {
    "id": 13,
    "titulo": "Hollow Knight",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 13990,
    "estadoConservacion": "Como nuevo",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
    "region": "Valparaíso",
    "comuna": "Quilpué",
    "entregas": [
      "Retiro en persona",
      "Envío por pagar"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-10-24"
  },
  "contraparte": {
    "id": 1,
    "nombreUsuario": "sebastian_r",
    "rol": "usuario",
    "region": "Valparaíso",
    "comuna": "Valparaíso",
    "reputacion": 4.8,
    "totalCalificaciones": 12,
    "fechaRegistro": "2026-03-14"
  },
  "rolUsuario": "comprador"
}
```
</details>
<details><summary>40. Solicitud duplicada — POST /api/operaciones → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Ya tienes una solicitud en curso para esta publicación."
}
```
</details>
<details><summary>41. Comprar como administrador (rol no permitido) — POST /api/operaciones → 403 Forbidden</summary>

- ✅ Responde 403

```json
{
  "mensaje": "Tu cuenta no tiene permisos para realizar esta acción."
}
```
</details>
<details><summary>42. Compras y ventas del comprador — GET /api/operaciones → 200 OK</summary>

- ✅ Responde 200
- ✅ La compra aparece en compras

```json
{
  "compras": [
    {
      "operacion": {
        "id": 7,
        "publicacionId": 13,
        "compradorId": 2,
        "vendedorId": 1,
        "estado": "pendiente",
        "modalidadEntrega": "Envío por pagar",
        "fechaCreacion": "2026-10-24",
        "calificada": false
      },
      "publicacion": {
        "id": 13,
        "titulo": "Hollow Knight",
        "consola": "Nintendo Switch",
        "genero": "Plataformas",
        "precio": 13990,
        "estadoConservacion": "Como nuevo",
        "estadoPublicacion": "activa",
        "oculta": false,
        "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
        "region": "Valparaíso",
        "comuna": "Quilpué",
        "entregas": [
          "Retiro en persona",
          "Envío por pagar"
        ],
        "incluyeCaja": true,
        "incluyeManual": true,
        "vendedorId": 1,
        "fechaPublicacion": "2026-10-24"
      },
      "contraparte": {
        "id": 1,
        "nombreUsuario": "sebastian_r",
        "rol": "usuario",
        "region": "Valparaíso",
        "comuna": "Valparaíso",
        "reputacion": 4.8,
        "totalCalificaciones": 12,
        "fechaRegistro": "2026-03-14"
      },
      "rolUsuario": "comprador"
    },
    {
      "operacion": {
        "id": 4,
        "publicacionId": 10,
        "compradorId": 2,
        "vendedorId": 1,
        "estado": "completada",
        "modalidadEntrega": "Retiro en persona",
      
… (respuesta recortada)
```
</details>
<details><summary>43. El comprador no puede confirmar — PATCH /api/operaciones/7/estado → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Como comprador no puedes cambiar una operación pendiente a confirmada."
}
```
</details>
<details><summary>44. Completar sin confirmar (transición inválida) — PATCH /api/operaciones/7/estado → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Como vendedor no puedes cambiar una operación pendiente a completada."
}
```
</details>
<details><summary>45. Un tercero no puede cambiar la operación — PATCH /api/operaciones/7/estado → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "No participas en esta operación."
}
```
</details>
<details><summary>46. Vendedor confirma — PATCH /api/operaciones/7/estado → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda confirmada

```json
{
  "operacion": {
    "id": 7,
    "publicacionId": 13,
    "compradorId": 2,
    "vendedorId": 1,
    "estado": "confirmada",
    "modalidadEntrega": "Envío por pagar",
    "fechaCreacion": "2026-10-24",
    "calificada": false
  },
  "publicacion": {
    "id": 13,
    "titulo": "Hollow Knight",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 13990,
    "estadoConservacion": "Como nuevo",
    "estadoPublicacion": "activa",
    "oculta": false,
    "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
    "region": "Valparaíso",
    "comuna": "Quilpué",
    "entregas": [
      "Retiro en persona",
      "Envío por pagar"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-10-24"
  },
  "contraparte": {
    "id": 2,
    "nombreUsuario": "camila_v",
    "rol": "usuario",
    "region": "Valparaíso",
    "comuna": "Viña del Mar",
    "reputacion": 4.6,
    "totalCalificaciones": 27,
    "fechaRegistro": "2025-11-02"
  },
  "rolUsuario": "vendedor"
}
```
</details>
<details><summary>47. Eliminar publicación con operaciones — DELETE /api/publicaciones/13 → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "La publicación tiene operaciones asociadas y no se puede eliminar. Puedes pausarla."
}
```
</details>
<details><summary>48. Vendedor completa — PATCH /api/operaciones/7/estado → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda completada
- ✅ La publicación queda vendida

```json
{
  "operacion": {
    "id": 7,
    "publicacionId": 13,
    "compradorId": 2,
    "vendedorId": 1,
    "estado": "completada",
    "modalidadEntrega": "Envío por pagar",
    "fechaCreacion": "2026-10-24",
    "calificada": false
  },
  "publicacion": {
    "id": 13,
    "titulo": "Hollow Knight",
    "consola": "Nintendo Switch",
    "genero": "Plataformas",
    "precio": 13990,
    "estadoConservacion": "Como nuevo",
    "estadoPublicacion": "vendida",
    "oculta": false,
    "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
    "region": "Valparaíso",
    "comuna": "Quilpué",
    "entregas": [
      "Retiro en persona",
      "Envío por pagar"
    ],
    "incluyeCaja": true,
    "incluyeManual": true,
    "vendedorId": 1,
    "fechaPublicacion": "2026-10-24"
  },
  "contraparte": {
    "id": 2,
    "nombreUsuario": "camila_v",
    "rol": "usuario",
    "region": "Valparaíso",
    "comuna": "Viña del Mar",
    "reputacion": 4.6,
    "totalCalificaciones": 27,
    "fechaRegistro": "2025-11-02"
  },
  "rolUsuario": "vendedor"
}
```
</details>
<details><summary>49. Editar publicación vendida — PUT /api/publicaciones/13 → 409 Conflict</summary>

- ✅ Responde 409
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Una publicación vendida ya no se puede editar."
}
```
</details>
<details><summary>50. Crear publicación temporal — POST /api/publicaciones → 201 Created</summary>

- ✅ Responde 201

```json
{
  "id": 14,
  "titulo": "Publicación para eliminar",
  "consola": "Nintendo Switch",
  "genero": "Plataformas",
  "precio": 15990,
  "estadoConservacion": "Como nuevo",
  "estadoPublicacion": "activa",
  "oculta": false,
  "descripcion": "Cartucho en perfecto estado, con caja original. Se puede probar antes de comprar.",
  "region": "Valparaíso",
  "comuna": "Quilpué",
  "entregas": [
    "Retiro en persona",
    "Envío por pagar"
  ],
  "incluyeCaja": true,
  "incluyeManual": false,
  "vendedorId": 1,
  "fechaPublicacion": "2026-10-24"
}
```
</details>
<details><summary>51. Eliminar publicación ajena — DELETE /api/publicaciones/14 → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Solo quien publicó el videojuego puede eliminar esta publicación."
}
```
</details>
<details><summary>52. Eliminar publicación propia — DELETE /api/publicaciones/14 → 204 No Content</summary>

- ✅ Responde 204

```json
(sin cuerpo)
```
</details>
<details><summary>53. La publicación eliminada ya no existe — GET /api/publicaciones/14 → 404 Not Found</summary>

- ✅ Responde 404

```json
{
  "mensaje": "La publicación no existe o fue retirada del catálogo."
}
```
</details>
<details><summary>54. Listar usuarios con rol usuario — GET /api/usuarios → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Tu cuenta no tiene permisos para realizar esta acción."
}
```
</details>
<details><summary>55. Listar usuarios sin sesión — GET /api/usuarios → 401 Unauthorized</summary>

- ✅ Responde 401

```json
{
  "mensaje": "Debes iniciar sesión para continuar."
}
```
</details>
<details><summary>56. Listar usuarios (administrador) — GET /api/usuarios → 200 OK</summary>

- ✅ Responde 200
- ✅ Incluye correo y estado de cada cuenta
- ✅ No expone contraseñas ni hashes

```json
[
  {
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
  },
  {
    "id": 2,
    "nombreUsuario": "camila_v",
    "correo": "camila@replay.cl",
    "rol": "usuario",
    "region": "Valparaíso",
    "comuna": "Viña del Mar",
    "reputacion": 4.6,
    "totalCalificaciones": 27,
    "fechaRegistro": "2025-11-02",
    "activo": true
  },
  {
    "id": 3,
    "nombreUsuario": "diego_games",
    "correo": "diego@replay.cl",
    "rol": "usuario",
    "region": "Metropolitana",
    "comuna": "Ñuñoa",
    "reputacion": 4.2,
    "totalCalificaciones": 8,
    "fechaRegistro": "2026-01-20",
    "activo": true
  },
  {
    "id": 4,
    "nombreUsuario": "fernanda_m",
    "correo": "fernanda@replay.cl",
    "rol": "usuario",
    "region": "Biobío",
    "comuna": "Concepción",
    "reputacion": 5,
    "totalCalificaciones": 5,
    "fechaRegistro": "2026-05-08",
    "activo": true
  },
  {
    "id": 5,
    "nombreUsuario": "daniel_admin",
    "correo": "admin@replay.cl",
    "rol": "administrador",
    "region": "Metropolitana",
    "comuna": "Santiago",
    "reputacion": 0,
    "totalCalificaciones": 0,
    "fechaRegistro": "2025-09-01",
    "activo": true
  },
  {
    "id": 6,
    "nombreUsuario": "jugador_1792802431458",
    "correo": "jugador1792802431458@replay.cl",
   
… (respuesta recortada)
```
</details>
<details><summary>57. Desactivar cuenta — PATCH /api/usuarios/6/estado → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda desactivada

```json
{
  "id": 6,
  "nombreUsuario": "jugador_1792802431458",
  "correo": "jugador1792802431458@replay.cl",
  "rol": "usuario",
  "region": "Biobío",
  "comuna": "Talcahuano",
  "reputacion": 0,
  "totalCalificaciones": 0,
  "fechaRegistro": "2026-10-24",
  "activo": false
}
```
</details>
<details><summary>58. Login de cuenta desactivada — POST /api/auth/login → 403 Forbidden</summary>

- ✅ Responde 403
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "Tu cuenta está desactivada. Contacta a la administración de RePlay Games."
}
```
</details>
<details><summary>59. Token de cuenta desactivada — GET /api/auth/perfil → 401 Unauthorized</summary>

- ✅ Responde 401
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "La cuenta no existe o está desactivada."
}
```
</details>
<details><summary>60. El administrador no puede desactivarse — PATCH /api/usuarios/5/estado → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "No puedes desactivar tu propia cuenta."
}
```
</details>
<details><summary>61. Reactivar cuenta — PATCH /api/usuarios/6/estado → 200 OK</summary>

- ✅ Responde 200
- ✅ Queda activa

```json
{
  "id": 6,
  "nombreUsuario": "jugador_1792802431458",
  "correo": "jugador1792802431458@replay.cl",
  "rol": "usuario",
  "region": "Biobío",
  "comuna": "Talcahuano",
  "reputacion": 0,
  "totalCalificaciones": 0,
  "fechaRegistro": "2026-10-24",
  "activo": true
}
```
</details>
<details><summary>62. Actualizar perfil propio — PATCH /api/usuarios/perfil → 200 OK</summary>

- ✅ Responde 200
- ✅ Guarda la nueva ubicación

```json
{
  "id": 6,
  "nombreUsuario": "jugador_1792802431458",
  "correo": "jugador1792802431458@replay.cl",
  "rol": "usuario",
  "region": "Metropolitana",
  "comuna": "Providencia",
  "reputacion": 0,
  "totalCalificaciones": 0,
  "fechaRegistro": "2026-10-24",
  "activo": true
}
```
</details>
<details><summary>63. JSON mal formado — POST /api/auth/login → 400 Bad Request</summary>

- ✅ Responde 400
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "El cuerpo de la solicitud no es un JSON válido."
}
```
</details>
<details><summary>64. Ruta inexistente — GET /api/ruta-inexistente → 404 Not Found</summary>

- ✅ Responde 404
- ✅ Incluye un mensaje de error comprensible

```json
{
  "mensaje": "No existe la ruta GET /api/ruta-inexistente."
}
```
</details>
