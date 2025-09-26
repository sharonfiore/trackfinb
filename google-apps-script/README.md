# Google Apps Script para Personal Finance Tracker

Este documento te guía paso a paso para configurar la integración entre tu aplicación web y Google Sheets.

## 📋 Pasos de Configuración

### 1. Crear el Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com)
2. Haz clic en "Nuevo proyecto"
3. Cambia el nombre del proyecto a "Personal Finance Tracker"
4. Borra el código existente y pega el contenido del archivo `Code.gs`

### 2. Configurar tu Google Sheets

1. Crea una nueva hoja de cálculo en [Google Sheets](https://sheets.google.com)
2. Copia el ID de tu hoja de cálculo desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```
3. En el código de Apps Script, reemplaza `TU_SPREADSHEET_ID_AQUI` con tu ID real

### 3. Configurar Permisos

1. En Apps Script, ve a "Configuración" (⚙️) en el menú lateral
2. Marca la casilla "Mostrar el archivo de manifiesto 'appsscript.json'"
3. Haz clic en el archivo `appsscript.json` y reemplaza su contenido con:

```json
{
  "timeZone": "America/Mexico_City",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "access": "ANYONE",
    "executeAs": "USER_DEPLOYING"
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

### 4. Probar la Configuración

1. En el editor de Apps Script, selecciona la función `testConfiguration`
2. Haz clic en "Ejecutar" (▶️)
3. Autoriza los permisos cuando se solicite
4. Verifica en los logs que todo funcione correctamente

### 5. Desplegar como Aplicación Web

1. Haz clic en "Desplegar" > "Nueva implementación"
2. Selecciona el tipo "Aplicación web"
3. Configura:
   - **Descripción**: "Personal Finance Tracker API"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: "Cualquier persona"
4. Haz clic en "Desplegar"
5. **¡IMPORTANTE!** Copia la URL de la aplicación web

### 6. Configurar la Aplicación Web

1. Abre tu aplicación web
2. Ve a "Configuración" en el menú lateral
3. Haz clic en "Configurar Google Sheets"
4. Pega la URL que copiaste en el paso anterior
5. Haz clic en "Guardar"

## 🔧 Funcionalidades del Script

### Sincronización Automática
- **Tipos de Cuenta**: Se guardan en la hoja "TiposCuenta"
- **Cuentas**: Se guardan en la hoja "Cuentas"
- **Metas de Ahorro**: Se guardan en la hoja "MetasAhorro"
- **Transacciones**: Se guardan en la hoja "Transacciones"
- **Configuración**: Timestamps de sincronización en "Configuracion"

### Formato de Datos
- **Montos**: Formato de moneda ($1,234.56)
- **Fechas**: Formato de fecha local
- **Headers**: Coloreados y en negrita
- **Columnas**: Auto-ajustadas al contenido

### Funciones Disponibles

#### `doPost(e)`
Maneja las peticiones POST desde la aplicación web:
- `sync`: Sincroniza datos hacia Google Sheets
- `backup`: Crea un respaldo completo

#### `doGet(e)`
Maneja las peticiones GET:
- `load`: Carga datos desde Google Sheets

#### `testConfiguration()`
Función de prueba para verificar la configuración

## 🚨 Solución de Problemas

### Error: "No se puede acceder a la hoja de cálculo"
- Verifica que el ID de la hoja sea correcto
- Asegúrate de que la hoja no esté en la papelera
- Confirma que tienes permisos de edición

### Error: "Función no autorizada"
- Ve a Apps Script > Configuración > Permisos
- Ejecuta `testConfiguration()` para autorizar permisos
- Verifica que el archivo `appsscript.json` esté configurado correctamente

### La sincronización no funciona
- Verifica que la URL en la aplicación web sea correcta
- Comprueba que el despliegue esté activo
- Revisa los logs en Apps Script para errores

### Datos no aparecen en Sheets
- Ejecuta `testConfiguration()` para crear las hojas
- Verifica que los nombres de las hojas coincidan
- Comprueba que no haya errores en los logs

## 📊 Estructura de las Hojas

### TiposCuenta
| ID | Nombre | Icono | Fecha Creación |
|----|--------|-------|----------------|

### Cuentas
| ID | Nombre | Tipo ID | Balance | Límite Crédito | Es Crédito | Fecha Creación |
|----|--------|---------|---------|----------------|------------|----------------|

### MetasAhorro
| ID | Nombre | Monto Objetivo | Monto Actual | Cuenta ID | Fecha Objetivo | Fecha Creación |
|----|--------|----------------|--------------|-----------|----------------|----------------|

### Transacciones
| ID | Tipo | Monto | Descripción | Categoría | Cuenta ID | Fecha | Es Diferido | Mes Diferido | Fecha Creación |
|----|------|-------|-------------|-----------|-----------|-------|-------------|--------------|----------------|

## 🔄 Actualizaciones

Para actualizar el script:
1. Copia el nuevo código
2. Pégalo en Apps Script
3. Guarda los cambios
4. No necesitas redesplegar si solo cambias la lógica

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Apps Script
2. Ejecuta `testConfiguration()` para diagnosticar
3. Verifica que todos los permisos estén otorgados
4. Confirma que la URL de despliegue sea correcta