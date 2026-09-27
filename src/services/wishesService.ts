import { Wish } from '../types';
import { DEFAULT_APPS_SCRIPT_URL, INITIAL_SAMPLE_WISHES, STORAGE_KEY_APPS_SCRIPT_URL } from '../config';

const STORAGE_KEY_LOCAL_WISHES = 'judath_birthday_local_wishes';
const STORAGE_KEY_DELETED_IDS = 'judath_birthday_deleted_ids';

/**
 * Normalizes any Google Drive or cloud image URL into a high-reliability direct view URL.
 */
export function extractDriveFileId(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const driveIdMatch =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/open\?id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/file\/d\/([a-zA-Z0-9_-]+)/);

  return driveIdMatch ? driveIdMatch[1] : null;
}

export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const fileId = extractDriveFileId(trimmed);
  if (fileId) {
    // lh3.googleusercontent.com is Google's high-speed public CDN
    return `https://lh3.googleusercontent.com/d/${fileId}`;
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
 * Fetches wishes from Google Sheet via published CSV link (No Apps Script needed!).
 */
export async function fetchWishesFromCsv(csvUrl: string): Promise<Wish[]> {
  try {
    const bustCacheUrl = `${csvUrl}${csvUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
    const res = await fetch(bustCacheUrl);
    if (!res.ok) {
      throw new Error(`CSV HTTP status ${res.status}`);
    }
    const csvData = await res.text();
    const rows = parseCsvRows(csvData);
    if (rows.length < 2) return [];

    const headers = rows[0].map((h) => h.toLowerCase());

    const findIndex = (keywords: string[]) =>
      headers.findIndex((h) => keywords.some((k) => h.includes(k)));

    const nameIdx = findIndex(['name', 'who', 'from']);
    const wishIdx = findIndex(['wish', 'message', 'birthday', 'note', 'blessing']);
    const relIdx = findIndex(['relationship', 'relation', 'connection']);
    const photoIdx = findIndex(['photo', 'image', 'picture', 'file', 'drive', 'upload']);
    const timeIdx = findIndex(['timestamp', 'date', 'time']);

    const wishes: Wish[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : 'Loving Family & Friends';
      const wishText = wishIdx !== -1 && row[wishIdx] ? row[wishIdx] : '';
      const relationship = relIdx !== -1 && row[relIdx] ? row[relIdx] : 'Friend / Family';
      const rawPhoto = photoIdx !== -1 && row[photoIdx] ? row[photoIdx] : '';
      const photoUrl = normalizeImageUrl(rawPhoto);
      const timestamp = timeIdx !== -1 && row[timeIdx] ? row[timeIdx] : new Date().toISOString();

      if (wishText.trim() || name.trim()) {
        wishes.push({
          id: `csv-${i}-${Date.now()}`,
          name: name.trim(),
          relationship: relationship.trim(),
          wish: wishText.trim() || 'Wishing you the happiest 25th birthday, Judath! 🌟',
          photoUrl: photoUrl || undefined,
          timestamp,
          source: 'csv',
        });
      }
    }

    return wishes.reverse();
  } catch (err) {
    console.warn('Failed to parse published CSV:', err);
    return [];
  }
}

/**
 * Fetches wishes from Google Apps Script Web App JSON API.
 */
export async function fetchWishesFromAppsScript(scriptUrl: string): Promise<Wish[]> {
  const url = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}action=getWishes&t=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Apps Script responded with status ${response.status}`);
  }

  const raw = await response.json();
  const data = Array.isArray(raw) ? raw : raw?.wishes || raw?.data || [];

  if (!Array.isArray(data)) {
    throw new Error('Unexpected data structure received from Apps Script endpoint.');
  }

  const normalized: Wish[] = data.map((item: any, idx: number) => {
    const rawPhoto =
      item.photoUrl ||
      item.imageUrl ||
      item.image ||
      item.photo ||
      item['Photo'] ||
      item['Photo URL'] ||
      '';

    const photoUrl = normalizeImageUrl(rawPhoto);

    return {
      id: item.id || `wish-${idx}-${item.timestamp || Date.now()}`,
      name: item.name || item.Name || 'A Loving Well-wisher',
      relationship: item.relationship || item.Relationship || 'Friend / Family',
      wish: item.wish || item.Wish || item.message || item.Message || 'Wishing you a magnificent 25th birthday!',
      photoUrl: photoUrl || undefined,
      timestamp: item.timestamp || item.Timestamp || new Date().toISOString(),
      source: 'apps-script',
    };
  });

  return normalized;
}

/**
 * Main fetch function: Merges live Google data with custom local wishes and filters deleted wishes.
 */
export async function fetchLiveWishes(): Promise<{ wishes: Wish[]; isLive: boolean }> {
  const customScriptUrl = getStoredScriptUrl();
  const deletedIds = getDeletedWishIds();
  const localWishes = getCustomLocalWishes().filter((w) => !deletedIds.includes(w.id));

  // 1. Check if configured as a published CSV URL
  if (customScriptUrl && (customScriptUrl.includes('pub?output=csv') || customScriptUrl.includes('/pub?'))) {
    try {
      const csvWishes = await fetchWishesFromCsv(customScriptUrl);
      if (csvWishes.length > 0) {
        const filtered = csvWishes.filter((w) => !deletedIds.includes(w.id));
        return {
          wishes: [...localWishes, ...filtered],
          isLive: true,
        };
      }
    } catch (e) {
      console.warn('CSV fetch attempt failed, trying fallback...', e);
    }
  }

  // 2. Check if configured as an Apps Script Web App URL
  if (customScriptUrl && customScriptUrl.includes('script.google.com')) {
    try {
      const liveWishes = await fetchWishesFromAppsScript(customScriptUrl);
      if (liveWishes && liveWishes.length > 0) {
        const filtered = liveWishes.filter((w) => !deletedIds.includes(w.id));
        return {
          wishes: [...localWishes, ...filtered],
          isLive: true,
        };
      }
    } catch (err) {
      console.warn('Google Apps Script live fetch was unreachable:', err);
    }
  }

  // 3. Fallback: Local custom wishes + bundled initial wishes
  const fallback = INITIAL_SAMPLE_WISHES.map((w) => ({
    ...w,
    photoUrl: normalizeImageUrl(w.photoUrl),
  })).filter((w) => !deletedIds.includes(w.id));

  return {
    wishes: [...localWishes, ...fallback],
    isLive: false,
  };
}

/**
 * Remote or local wish deletion.
 */
export async function deleteWish(
  id: string,
  pin: string
): Promise<{ success: boolean; message?: string }> {
  // Always record deletion locally so user sees immediate deletion
  addDeletedWishId(id);

  // If local wish, remove from storage
  const localWishes = getCustomLocalWishes();
  const updatedLocal = localWishes.filter((w) => w.id !== id);
  if (localWishes.length !== updatedLocal.length) {
    localStorage.setItem(STORAGE_KEY_LOCAL_WISHES, JSON.stringify(updatedLocal));
    return { success: true, message: 'Local wish deleted successfully.' };
  }

  // Attempt remote deletion if Apps Script is configured
  const scriptUrl = getStoredScriptUrl();
  if (scriptUrl && scriptUrl.includes('script.google.com')) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteWish',
          id,
          pin,
        }),
        mode: 'no-cors',
      });
    } catch (err) {
      console.warn('Remote deletion notice could not be sent to script:', err);
    }
  }

  return { success: true, message: 'Wish removed successfully.' };
}
