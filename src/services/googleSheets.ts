// Servicio para integración con Google Sheets via Apps Script
export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private scriptUrl: string = '';

  private constructor() {}

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  setScriptUrl(url: string) {
    this.scriptUrl = url;
  }

  async syncData(dataType: string, data: any) {
    if (!this.scriptUrl) {
      console.warn('Google Apps Script URL not configured');
      return;
    }

    try {
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync',
          type: dataType,
          data: data
        })
      });

      console.log('Data synced to Google Sheets');
    } catch (error) {
      console.error('Error syncing to Google Sheets:', error);
    }
  }

  async loadData(dataType: string) {
    if (!this.scriptUrl) {
      console.warn('Google Apps Script URL not configured');
      return null;
    }

    try {
      const response = await fetch(`${this.scriptUrl}?action=load&type=${dataType}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading from Google Sheets:', error);
      return null;
    }
  }
}
