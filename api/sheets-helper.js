// lib/sheets-helper.js
const { google } = require('googleapis');

class SheetsHelper {
  constructor() {
    this.auth = null;
    this.sheets = null;
  }

  async init() {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      throw new Error('Missing Google Sheet credentials in env vars');
    }

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PRIVATE_KEY.split('"project_id":"')[1]?.split('"')[0],
        private_key_id: 'key-id',
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: 'client-id',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async appendRow(tabName, values) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${tabName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
      return { success: true };
    } catch (err) {
      console.error('Sheets append error:', err.message);
      return { success: false, error: err.message };
    }
  }

  async updateCell(tabName, range, value) {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${tabName}!${range}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[value]] },
      });
      return { success: true };
    } catch (err) {
      console.error('Sheets update error:', err.message);
      return { success: false, error: err.message };
    }
  }
}

module.exports = SheetsHelper;
