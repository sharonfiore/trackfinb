import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Download, Upload, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { GoogleSheetsService } from '../../services/googleSheets';
import { useAppContext } from '../../context/AppContext';

export function Settings() {
  const { hideAmounts, toggleHideAmounts } = useAppContext();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');
  const googleSheets = GoogleSheetsService.getInstance();

  const handleSaveConfig = () => {
    googleSheets.setScriptUrl(scriptUrl);
    localStorage.setItem('googleSheetsUrl', scriptUrl);
    setIsConfigModalOpen(false);
    alert('Configuración guardada correctamente');
  };

  const handleExportData = () => {
    const data = localStorage.getItem('financeApp');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          localStorage.setItem('financeApp', data);
          alert('Datos importados correctamente. Recarga la página para ver los cambios.');
        } catch (error) {
          alert('Error al importar los datos');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('financeApp');
      window.location.reload();
    }
  };

  React.useEffect(() => {
    const savedUrl = localStorage.getItem('googleSheetsUrl');
    if (savedUrl) {
      setScriptUrl(savedUrl);
      googleSheets.setScriptUrl(savedUrl);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configuración</h2>

      {/* Privacidad */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Privacidad
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Ocultar montos</p>
              <p className="text-white/60 text-sm">Oculta los montos por privacidad</p>
            </div>
            <Button variant="secondary" onClick={toggleHideAmounts}>
              {hideAmounts ? 'Mostrar' : 'Ocultar'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Google Sheets */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Integración con Google Sheets
        </h3>
        <div className="space-y-4">
          <p className="text-white/80">
            Conecta tu aplicación con Google Sheets para sincronizar automáticamente tus datos.
          </p>
          <Button onClick={() => setIsConfigModalOpen(true)}>
            Configurar Google Sheets
          </Button>
          {scriptUrl && (
            <p className="text-green-400 text-sm">✓ Configurado correctamente</p>
          )}
        </div>
      </Card>

      {/* Respaldo de datos */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Respaldo de Datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Datos
          </Button>
          
          <label>
            <Button variant="secondary" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Importar Datos
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          
          <Button variant="danger" onClick={handleClearData}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Todo
          </Button>
        </div>
      </Card>

      {/* Instrucciones para Google Apps Script */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Cómo configurar Google Apps Script</h3>
        <div className="space-y-4 text-white/80">
          <ol className="list-decimal list-inside space-y-2">
            <li>Ve a <a href="https://script.google.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Apps Script</a></li>
            <li>Crea un nuevo proyecto</li>
            <li>Reemplaza el código con el script de integración</li>
            <li>Despliega como aplicación web</li>
            <li>Copia la URL del despliegue y pégala en la configuración</li>
          </ol>
          <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
            <h4 className="text-white font-medium mb-2">Código de ejemplo para Apps Script:</h4>
            <pre className="text-xs text-green-400 overflow-x-auto">
{`function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById('TU_SHEET_ID');
  
  // Lógica para procesar los datos
  // ...
  
  return ContentService.createTextOutput('Success');
}`}
            </pre>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configurar Google Sheets"
      >
        <div className="space-y-4">
          <Input
            label="URL del Google Apps Script"
            type="url"
            value={scriptUrl}
            onChange={(e) => setScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/..."
          />
          <p className="text-white/60 text-sm">
            Pega la URL de tu despliegue de Google Apps Script aquí para habilitar la sincronización automática.
          </p>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveConfig} className="flex-1">
              Guardar
            </Button>
            <Button variant="secondary" onClick={() => setIsConfigModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}