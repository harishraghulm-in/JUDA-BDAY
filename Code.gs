/**
 * Google Apps Script for Judath's Birthday Website
 * 
 * Instructions:
 * 1. Open your Google Form's linked Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Replace all code in the script editor with this Code.gs content.
 * 4. Set your private Admin PIN:
 *    - In Apps Script, go to Project Settings (gear icon on the left).
 *    - Under "Script Properties", click "Add script property".
 *    - Property: ADMIN_PIN
 *    - Value: [Choose your private secret PIN, e.g. 1998 or 2026]
 *    - Click "Save script properties".
 * 5. Deploy as Web App:
 *    - Click "Deploy" > "New deployment".
 *    - Click Select type > "Web app".
 *    - Description: Judath Birthday Wishes API
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (crucial so Judath's website can read responses)
 *    - Click "Deploy".
 *    - Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 6. Paste the Web App URL into the website's settings or configure in src/config.ts!
 */

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var data = sheet.getDataRange().getValues();
    
    if (!data || data.length < 2) {
      return createJsonResponse([]);
    }
    
    var headers = data[0];
    var colMap = mapHeaders(headers);
    
    var wishes = [];
    // Row 1 is headers, rows 2..N are data
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var nameVal = colMap.name !== -1 ? String(row[colMap.name] || '').trim() : '';
      var wishVal = colMap.wish !== -1 ? String(row[colMap.wish] || '').trim() : '';
      
      // Skip empty blank rows
      if (!nameVal && !wishVal) continue;
      
      var relVal = colMap.relationship !== -1 ? String(row[colMap.relationship] || '').trim() : 'Friend';
      var rawImage = colMap.image !== -1 ? String(row[colMap.image] || '').trim() : '';
      var displayImage = processImageUrl(rawImage);
      var timestampVal = colMap.timestamp !== -1 ? String(row[colMap.timestamp] || '') : '';
      
      wishes.push({
        id: String(i + 1), // 1-based row number in Google Sheet
        name: nameVal || 'Loving Well-Wisher',
        relationship: relVal || 'Friend',
        wish: wishVal,
        image: displayImage,
        timestamp: timestampVal
      });
    }
    
    return createJsonResponse(wishes);
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : '';
    var payload = {};
    if (contents) {
      try {
        payload = JSON.parse(contents);
      } catch (pErr) {
        payload = {};
      }
    }
    
    var action = payload.action || (e.parameter ? e.parameter.action : '');
    var id = payload.id || (e.parameter ? e.parameter.id : '');
    var pin = payload.pin || (e.parameter ? e.parameter.pin : '');
    
    if (action === 'delete') {
      var scriptProps = PropertiesService.getScriptProperties();
      var storedPin = scriptProps.getProperty('ADMIN_PIN');
      
      if (!storedPin) {
        return createJsonResponse({ 
          success: false, 
          error: 'ADMIN_PIN is not set in Apps Script Properties. Please set ADMIN_PIN in Project Settings.' 
        });
      }
      
      if (String(pin).trim() !== String(storedPin).trim()) {
        return createJsonResponse({ 
          success: false, 
          error: 'Incorrect Admin PIN. Deletion not authorized.' 
        });
      }
      
      var rowIndex = parseInt(id, 10);
      if (isNaN(rowIndex) || rowIndex < 2) {
        return createJsonResponse({ 
          success: false, 
          error: 'Invalid row ID for deletion.' 
        });
      }
      
      var sheet = getTargetSheet();
      var maxRows = sheet.getLastRow();
      if (rowIndex > maxRows) {
        return createJsonResponse({ 
          success: false, 
          error: 'Row does not exist or has already been deleted.' 
        });
      }
      
      // Permanently delete row from Google Sheet
      sheet.deleteRow(rowIndex);
      
      return createJsonResponse({ 
        success: true, 
        message: 'Wish row permanently deleted from Google Sheet.' 
      });
    }
    
    return createJsonResponse({ 
      success: false, 
      error: 'Unrecognized action: ' + action 
    });
  } catch (err) {
    return createJsonResponse({ 
      success: false, 
      error: err.toString() 
    });
  }
}

function getTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('No active spreadsheet found. Bind this script to your Form responses Sheet.');
  }
  // Try 'Form Responses 1', or return the first sheet
  var sheet = ss.getSheetByName('Form Responses 1') || ss.getSheets()[0];
  return sheet;
}

function mapHeaders(headers) {
  var map = {
    timestamp: -1,
    name: -1,
    relationship: -1,
    wish: -1,
    image: -1
  };
  
  for (var c = 0; c < headers.length; c++) {
    var rawH = String(headers[c] || '').toUpperCase().trim();
    
    if (rawH.indexOf('TIMESTAMP') !== -1 || rawH.indexOf('DATE') !== -1) {
      map.timestamp = c;
    } else if (rawH.indexOf('NAME') !== -1 && rawH.indexOf('RELATIONSHIP') === -1) {
      map.name = c;
    } else if (rawH.indexOf('RELATIONSHIP') !== -1 || rawH.indexOf('RELATION') !== -1) {
      map.relationship = c;
    } else if (rawH.indexOf('WISH') !== -1 || rawH.indexOf('MESSAGE') !== -1) {
      map.wish = c;
    } else if (rawH.indexOf('IMAGE') !== -1 || rawH.indexOf('PHOTO') !== -1 || rawH.indexOf('ATTACHMENT') !== -1 || rawH.indexOf('PICTURE') !== -1) {
      map.image = c;
    }
  }
  
  // Fallbacks if Google Form headers differed
  if (map.name === -1 && headers.length > 1) map.name = 1;
  if (map.relationship === -1 && headers.length > 2) map.relationship = 2;
  if (map.wish === -1 && headers.length > 3) map.wish = 3;
  if (map.image === -1 && headers.length > 4) map.image = 4;
  
  return map;
}

function processImageUrl(rawUrl) {
  if (!rawUrl) return '';
  
  // Google Forms often records multiple URLs separated by commas if multiple files were uploaded
  var firstUrl = rawUrl.split(',')[0].trim();
  
  // Extract file ID
  var fileId = '';
  var idMatch = firstUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                firstUrl.match(/id=([a-zA-Z0-9_-]+)/) ||
                firstUrl.match(/open\?id=([a-zA-Z0-9_-]+)/);
                
  if (idMatch && idMatch[1]) {
    fileId = idMatch[1];
  } else if (/^[a-zA-Z0-9_-]{25,}$/.test(firstUrl)) {
    fileId = firstUrl;
  }
  
  if (fileId) {
    try {
      // Ensure file permissions allow public viewing so Judath's web app can render it
      var file = DriveApp.getFileById(fileId);
      if (file) {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      }
    } catch (ignorePermissionError) {
      // Best effort; if Drive permissions are restricted by domain policy, proceed with thumbnail URL
    }
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1200';
  }
  
  return firstUrl;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
