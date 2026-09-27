import { Wish } from '../types';
import { DEFAULT_APPS_SCRIPT_URL, INITIAL_SAMPLE_WISHES, STORAGE_KEY_APPS_SCRIPT_URL } from '../config';

const STORAGE_KEY_LOCAL_WISHES = 'judath_birthday_local_wishes';
const STORAGE_KEY_DELETED_IDS = 'judath_birthday_deleted_ids';

/**
 * Normalizes any Google Drive or cloud image URL into a high-reliability direct view URL.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Extract Google Drive ID if present
  const driveIdMatch =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/open\?id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/file\/d\/([a-zA-Z0-9_-]+)/);

  if (driveIdMatch && driveIdMatch[1]) {
    const fileId = driveIdMatch[1];
    // Google's high-performance thumbnail/CDN endpoint
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }

  return trimmed;
}

export function getStoredScriptUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_APPS_SCRIPT_URL;
  const stored = localStorage.getItem(STORAGE_KEY_APPS_SCRIPT_URL);
  if (!stored || stored.trim() === '') {
    return DEFAULT_APPS_SCRIPT_URL;
  }
  return stored.trim();
}

export function setStoredScriptUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_APPS_SCRIPT_URL, url.trim());
  }
}

export function getDeletedWishIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDeletedWishId(id: string): void {
  if (typeof window === 'undefined') return;
  const list = getDeletedWishIds();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY_DELETED_IDS, JSON.stringify(list));
  }
}

export function getCustomLocalWishes(): Wish[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_WISHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomLocalWish(wish: Wish): void {
  if (typeof window === 'undefined') return;
  const list = getCustomLocalWishes();
  list.unshift(wish);
  localStorage.setItem(STORAGE_KEY_LOCAL_WISHES, JSON.stringify(list));
}

/**
 * Extracts a Google Spreadsheet ID from a URL if possible.
 */
export function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Lightweight, robust CSV Parser capable of handling quoted cells, commas, and newlines.
 */
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Maps CSV headers dynamically to Wish fields.
 */
function mapCsvHeaders(headers: string[]) {
  const norm = headers.map((h) => h.toLowerCase().trim());
  let nameIdx = -1;
  let relIdx = -1;
  let wishIdx = -1;
  let imageIdx = -1;
  let timeIdx = -1;

  norm.forEach((h, idx) => {
    if (h.includes('name') || h === 'who') {
      if (nameIdx === -1) nameIdx = idx;
    } else if (h.includes('relation') || h.includes('connection')) {
      if (relIdx === -1) relIdx = idx;
    } else if (h.includes('wish') || h.includes('message') || h.includes('birthday wish') || h.includes('blessing')) {
      if (wishIdx === -1) wishIdx = idx;
    } else if (h.includes('image') || h.includes('photo') || h.includes('picture') || h.includes('memorable')) {
      if (imageIdx === -1) imageIdx = idx;
    } else if (h.includes('timestamp') || h.includes('date') || h.includes('time')) {
      if (timeIdx === -1) timeIdx = idx;
    }
  });

  // Fallback defaults if not matched by name
  if (nameIdx === -1 && headers.length > 1) nameIdx = 1;
  if (relIdx === -1 && headers.length > 2) relIdx = 2;
  if (wishIdx === -1 && headers.length > 3) wishIdx = 3;
  if (imageIdx === -1 && headers.length > 4) imageIdx = 4;

  return { nameIdx, relIdx, wishIdx, imageIdx, timeIdx };
}

export interface FetchResult {
  wishes: Wish[];
  isLive: boolean;
  sourceType: 'apps_script' | 'google_sheet_csv' | 'sample_preview';
  error?: string;
}

export async function fetchWishesFromSheet(): Promise<FetchResult> {
  const configuredUrl = getStoredScriptUrl().trim();
  const deletedIds = getDeletedWishIds();
  const customWishes = getCustomLocalWishes().filter((w) => !deletedIds.includes(w.id));

  // If no source is configured yet, return custom local wishes or sample starter wishes
  if (!configuredUrl) {
    const starter = INITIAL_SAMPLE_WISHES.filter((w) => !deletedIds.includes(w.id));
    const combined = [...customWishes, ...starter];
    return {
      wishes: combined,
      isLive: false,
      sourceType: 'sample_preview',
    };
  }

  // Case 1: Google Sheet URL provided (direct CSV / GViz mode)
  const sheetId = extractSpreadsheetId(configuredUrl);
  if (sheetId || configuredUrl.includes('docs.google.com/spreadsheets')) {
    try {
      const targetSheetId = sheetId || '';
      // GViz CSV export endpoint works with "Anyone with link can view" or published sheets
      const csvUrls = [
        `https://docs.google.com/spreadsheets/d/${targetSheetId}/gviz/tq?tqx=out:csv`,
        `https://docs.google.com/spreadsheets/d/${targetSheetId}/export?format=csv`,
        configuredUrl.includes('output=csv') ? configuredUrl : '',
      ].filter(Boolean);

      let csvText = '';
      let fetchErr: Error | null = null;

      for (const url of csvUrls) {
        try {
          const resp = await fetch(url);
          if (resp.ok) {
            csvText = await resp.text();
            if (csvText && !csvText.includes('<!DOCTYPE html>')) {
              break;
            }
          }
        } catch (e) {
          fetchErr = e as Error;
        }
      }

      if (!csvText || csvText.includes('<!DOCTYPE html>')) {
        throw new Error(
          'Could not read Google Sheet CSV directly. Ensure the Google Sheet is set to "Anyone with the link can view" or use Google Apps Script (Code.gs).'
        );
      }

      const rows = parseCsvRows(csvText);
      if (rows.length < 2) {
        return {
          wishes: customWishes,
          isLive: true,
          sourceType: 'google_sheet_csv',
        };
      }

      const headers = rows[0];
      const { nameIdx, relIdx, wishIdx, imageIdx, timeIdx } = mapCsvHeaders(headers);

      const parsed: Wish[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
        const wish = wishIdx !== -1 && row[wishIdx] ? row[wishIdx].trim() : '';
        if (!name && !wish) continue;

        const rowId = String(i + 1);
        if (deletedIds.includes(rowId)) continue;

        const rel = relIdx !== -1 && row[relIdx] ? row[relIdx].trim() : 'Friend';
        const rawImg = imageIdx !== -1 && row[imageIdx] ? row[imageIdx].trim() : '';
        const timestamp = timeIdx !== -1 && row[timeIdx] ? row[timeIdx].trim() : '';

        parsed.push({
          id: rowId,
          name: name || 'A Loving Friend',
          relationship: rel || 'Friend',
          wish: wish || 'Happy Birthday Judath!',
          image: normalizeImageUrl(rawImg),
          timestamp: timestamp || undefined,
        });
      }

      return {
        wishes: [...customWishes, ...parsed],
        isLive: true,
        sourceType: 'google_sheet_csv',
      };
    } catch (sheetErr: unknown) {
      const msg = sheetErr instanceof Error ? sheetErr.message : 'Error fetching Google Sheet';
      const starter = INITIAL_SAMPLE_WISHES.filter((w) => !deletedIds.includes(w.id));
      return {
        wishes: [...customWishes, ...starter],
        isLive: false,
        sourceType: 'sample_preview',
        error: msg,
      };
    }
  }

  // Case 2: Google Apps Script Web App URL (Primary standard mode)
  try {
    const response = await fetch(configuredUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to reach Google Apps Script`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(String(data.error));
      }
      throw new Error('Invalid response format received from Google Apps Script Web App');
    }

    const parsedWishes: Wish[] = data
      .filter((item: Record<string, unknown>, index: number) => {
        const id = String(item.id || item.rowId || index + 1);
        return !deletedIds.includes(id);
      })
      .map((item: Record<string, unknown>, index: number) => ({
        id: String(item.id || item.rowId || index + 1),
        name: String(item.name || item.Name || 'A Loving Friend').trim(),
        relationship: String(item.relationship || item.Relationship || 'Friend').trim(),
        wish: String(item.wish || item.Wish || item.message || '').trim(),
        image: normalizeImageUrl(String(item.image || item.Image || item.photo || item.Photo || '')),
        timestamp: item.timestamp ? String(item.timestamp) : undefined,
      }));

    return {
      wishes: [...customWishes, ...parsedWishes],
      isLive: true,
      sourceType: 'apps_script',
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error reaching Google Apps Script';
    const starter = INITIAL_SAMPLE_WISHES.filter((w) => !deletedIds.includes(w.id));
    return {
      wishes: [...customWishes, ...starter],
      isLive: false,
      sourceType: 'sample_preview',
      error: errorMessage,
    };
  }
}

export interface DeleteResult {
  success: boolean;
  message?: string;
}

export async function deleteWishFromSheet(id: string, pin: string): Promise<DeleteResult> {
  const configuredUrl = getStoredScriptUrl().trim();

  // Validate that PIN is not completely empty
  if (!pin || !pin.trim()) {
    return {
      success: false,
      message: 'Please enter your Admin PIN.',
    };
  }

  // If in Preview / Test Mode or local wish
  if (!configuredUrl || !configuredUrl.includes('script.google.com')) {
    // Record as deleted locally
    addDeletedWishId(id);

    // Also remove from custom local wishes if exists
    if (typeof window !== 'undefined') {
      const list = getCustomLocalWishes().filter((w) => w.id !== id);
      localStorage.setItem(STORAGE_KEY_LOCAL_WISHES, JSON.stringify(list));
    }

    return {
      success: true,
      message: 'Wish removed successfully.',
    };
  }

  // Google Apps Script permanent deletion
  try {
    const response = await fetch(configuredUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'delete',
        id: String(id),
        pin: String(pin).trim(),
      }),
    });

    const result = await response.json();

    if (result && result.success) {
      addDeletedWishId(id);
      return { success: true };
    }

    return {
      success: false,
      message: result.error || result.message || 'Incorrect Admin PIN or deletion failed.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Deletion request failed';
    return {
      success: false,
      message: `Failed to communicate with Google Apps Script: ${errorMsg}`,
    };
  }
}
