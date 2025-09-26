/**
 * Personal Finance Tracker - Google Apps Script
 * Este script maneja la sincronización entre la aplicación web y Google Sheets
 */

// Configuración - CAMBIA ESTE ID POR EL DE TU HOJA DE CÁLCULO
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI'; // Reemplaza con tu ID de Google Sheets

// Nombres de las hojas
const SHEET_NAMES = {
  ACCOUNT_TYPES: 'TiposCuenta',
  ACCOUNTS: 'Cuentas',
  SAVINGS_GOALS: 'MetasAhorro',
  TRANSACTIONS: 'Transacciones',
  CONFIG: 'Configuracion'
};

/**
 * Función principal para manejar peticiones POST
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const type = data.type;
    const payload = data.data;

    console.log(`Acción recibida: ${action}, Tipo: ${type}`);

    switch (action) {
      case 'sync':
        return syncData(type, payload);
      case 'load':
        return loadData(type);
      case 'backup':
        return createBackup();
      default:
        throw new Error(`Acción no reconocida: ${action}`);
    }
  } catch (error) {
    console.error('Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función para manejar peticiones GET
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const type = e.parameter.type;

    if (action === 'load') {
      return loadData(type);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Acción GET no válida'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error en doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Sincroniza datos con Google Sheets
 */
function syncData(type, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = getOrCreateSheet(spreadsheet, getSheetName(type));
    
    // Limpiar hoja existente
    sheet.clear();
    
    // Configurar headers según el tipo de datos
    const headers = getHeaders(type);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Formatear headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    if (data && data.length > 0) {
      // Convertir datos al formato de filas
      const rows = data.map(item => formatDataRow(type, item));
      
      // Escribir datos
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      
      // Aplicar formato
      formatSheet(sheet, type);
    }
    
    // Actualizar timestamp de sincronización
    updateSyncTimestamp(spreadsheet, type);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `${data.length} registros sincronizados para ${type}`,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error(`Error sincronizando ${type}:`, error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Carga datos desde Google Sheets
 */
function loadData(type) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = getSheetName(type);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          data: [],
          message: `Hoja ${sheetName} no existe`
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          data: [],
          message: 'No hay datos en la hoja'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const formattedData = rows.map(row => parseDataRow(type, headers, row));
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: formattedData,
        count: formattedData.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error(`Error cargando ${type}:`, error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obtiene o crea una hoja
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Obtiene el nombre de la hoja según el tipo de datos
 */
function getSheetName(type) {
  const mapping = {
    'accountTypes': SHEET_NAMES.ACCOUNT_TYPES,
    'accounts': SHEET_NAMES.ACCOUNTS,
    'savingsGoals': SHEET_NAMES.SAVINGS_GOALS,
    'transactions': SHEET_NAMES.TRANSACTIONS
  };
  return mapping[type] || type;
}

/**
 * Obtiene los headers según el tipo de datos
 */
function getHeaders(type) {
  const headers = {
    'accountTypes': ['ID', 'Nombre', 'Icono', 'Fecha Creación'],
    'accounts': ['ID', 'Nombre', 'Tipo ID', 'Balance', 'Límite Crédito', 'Es Crédito', 'Fecha Creación'],
    'savingsGoals': ['ID', 'Nombre', 'Monto Objetivo', 'Monto Actual', 'Cuenta ID', 'Fecha Objetivo', 'Fecha Creación'],
    'transactions': ['ID', 'Tipo', 'Monto', 'Descripción', 'Categoría', 'Cuenta ID', 'Fecha', 'Es Diferido', 'Mes Diferido', 'Fecha Creación']
  };
  return headers[type] || ['ID', 'Datos'];
}

/**
 * Formatea una fila de datos según el tipo
 */
function formatDataRow(type, item) {
  switch (type) {
    case 'accountTypes':
      return [
        item.id,
        item.name,
        item.icon,
        new Date(item.createdAt)
      ];
      
    case 'accounts':
      return [
        item.id,
        item.name,
        item.typeId,
        item.balance,
        item.creditLimit || '',
        item.isCredit ? 'Sí' : 'No',
        new Date(item.createdAt)
      ];
      
    case 'savingsGoals':
      return [
        item.id,
        item.name,
        item.targetAmount,
        item.currentAmount,
        item.accountId,
        new Date(item.targetDate),
        new Date(item.createdAt)
      ];
      
    case 'transactions':
      return [
        item.id,
        item.type === 'income' ? 'Ingreso' : 'Gasto',
        item.amount,
        item.description,
        item.category,
        item.accountId,
        new Date(item.date),
        item.isDeferred ? 'Sí' : 'No',
        item.deferredMonth || '',
        new Date(item.createdAt)
      ];
      
    default:
      return [item.id, JSON.stringify(item)];
  }
}

/**
 * Parsea una fila de datos desde Sheets
 */
function parseDataRow(type, headers, row) {
  const obj = {};
  
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  
  // Convertir según el tipo específico
  switch (type) {
    case 'accountTypes':
      return {
        id: obj['ID'],
        name: obj['Nombre'],
        icon: obj['Icono'],
        createdAt: obj['Fecha Creación']
      };
      
    case 'accounts':
      return {
        id: obj['ID'],
        name: obj['Nombre'],
        typeId: obj['Tipo ID'],
        balance: parseFloat(obj['Balance']) || 0,
        creditLimit: parseFloat(obj['Límite Crédito']) || undefined,
        isCredit: obj['Es Crédito'] === 'Sí',
        createdAt: obj['Fecha Creación']
      };
      
    case 'savingsGoals':
      return {
        id: obj['ID'],
        name: obj['Nombre'],
        targetAmount: parseFloat(obj['Monto Objetivo']) || 0,
        currentAmount: parseFloat(obj['Monto Actual']) || 0,
        accountId: obj['Cuenta ID'],
        targetDate: obj['Fecha Objetivo'],
        createdAt: obj['Fecha Creación']
      };
      
    case 'transactions':
      return {
        id: obj['ID'],
        type: obj['Tipo'] === 'Ingreso' ? 'income' : 'expense',
        amount: parseFloat(obj['Monto']) || 0,
        description: obj['Descripción'],
        category: obj['Categoría'],
        accountId: obj['Cuenta ID'],
        date: obj['Fecha'],
        isDeferred: obj['Es Diferido'] === 'Sí',
        deferredMonth: obj['Mes Diferido'] || undefined,
        createdAt: obj['Fecha Creación']
      };
      
    default:
      return obj;
  }
}

/**
 * Aplica formato a la hoja
 */
function formatSheet(sheet, type) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow <= 1) return;
  
  // Formato general
  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  dataRange.setVerticalAlignment('middle');
  
  // Formato específico según tipo
  switch (type) {
    case 'accounts':
      // Formato para columna de balance (columna 4)
      if (lastCol >= 4) {
        const balanceRange = sheet.getRange(2, 4, lastRow - 1, 1);
        balanceRange.setNumberFormat('$#,##0.00');
      }
      // Formato para límite de crédito (columna 5)
      if (lastCol >= 5) {
        const creditRange = sheet.getRange(2, 5, lastRow - 1, 1);
        creditRange.setNumberFormat('$#,##0.00');
      }
      break;
      
    case 'savingsGoals':
      // Formato para montos (columnas 3 y 4)
      if (lastCol >= 4) {
        const amountRange = sheet.getRange(2, 3, lastRow - 1, 2);
        amountRange.setNumberFormat('$#,##0.00');
      }
      break;
      
    case 'transactions':
      // Formato para monto (columna 3)
      if (lastCol >= 3) {
        const amountRange = sheet.getRange(2, 3, lastRow - 1, 1);
        amountRange.setNumberFormat('$#,##0.00');
      }
      break;
  }
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, lastCol);
  
  // Congelar primera fila
  sheet.setFrozenRows(1);
}

/**
 * Actualiza timestamp de sincronización
 */
function updateSyncTimestamp(spreadsheet, type) {
  let configSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.CONFIG);
  
  // Buscar si ya existe el registro
  const data = configSheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === `sync_${type}`) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const timestamp = new Date();
  
  if (rowIndex === -1) {
    // Agregar nuevo registro
    const lastRow = configSheet.getLastRow();
    configSheet.getRange(lastRow + 1, 1, 1, 3).setValues([[
      `sync_${type}`,
      timestamp,
      `Última sincronización de ${type}`
    ]]);
  } else {
    // Actualizar registro existente
    configSheet.getRange(rowIndex, 2).setValue(timestamp);
  }
}

/**
 * Crea un respaldo completo
 */
function createBackup() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const backup = {
      timestamp: new Date().toISOString(),
      data: {}
    };
    
    // Respaldar cada tipo de datos
    const types = ['accountTypes', 'accounts', 'savingsGoals', 'transactions'];
    
    types.forEach(type => {
      const sheetName = getSheetName(type);
      const sheet = spreadsheet.getSheetByName(sheetName);
      
      if (sheet) {
        const data = sheet.getDataRange().getValues();
        backup.data[type] = data;
      }
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        backup: backup
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error creando respaldo:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función de prueba para verificar la configuración
 */
function testConfiguration() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Conexión exitosa con Google Sheets');
    console.log('📊 Nombre del archivo:', spreadsheet.getName());
    console.log('🔗 URL:', spreadsheet.getUrl());
    
    // Crear hojas de prueba si no existen
    Object.values(SHEET_NAMES).forEach(sheetName => {
      getOrCreateSheet(spreadsheet, sheetName);
    });
    
    console.log('✅ Todas las hojas están configuradas correctamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
    return false;
  }
}