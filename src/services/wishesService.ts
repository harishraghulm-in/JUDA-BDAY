// Service to fetch wishes from Google Sheets (via Apps Script) with robust fallbacks
import { DEFAULT_APPS_SCRIPT_URL } from '../config';

export interface Wish {
  id: string;
  name: string;
  relationship: string;
  wish: string;
  photoUrl?: string;
  timestamp: string;
  source?: 'sheet' | 'local' | 'demo';
  rowNumber?: number;
}

const STORAGE_KEY_WISHES = 'judath_birthday_wishes_cache';
const STORAGE_KEY_SCRIPT_URL = 'judath_birthday_script_url';

export function extractDriveFileId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const match = rawUrl.match(/(?:id=|\/d\/|open\?id=|file\/d\/)([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
}

export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  const fileId = extractDriveFileId(trimmed);
  if (fileId) {
    // lh3.googleusercontent.com works seamlessly across all mobile browsers & devices
    return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
  }
  return trimmed;
}

export function getStoredScriptUrl(): string {
  return localStorage.getItem(STORAGE_KEY_SCRIPT_URL) || DEFAULT_APPS_SCRIPT_URL;
}

export function setStoredScriptUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY_SCRIPT_URL, url.trim());
}

// Fallback demo wishes
const DEMO_WISHES: Wish[] = [
  {
    id: 'demo-1',
    name: 'Aiden & Sophie',
    relationship: 'Best Friends',
    wish: 'Happy 25th Quarter-Century milestone, Judath! May your year ahead be filled with world travel, big laughs, and boundless happiness.',
    photoUrl: '/assets/polaroid_placeholder_1790532097729.jpg',
    timestamp: '2026-09-27T08:00:00Z',
    source: 'demo'
  },
  {
    id: 'demo-2',
    name: 'Uncle Robert',
    relationship: 'Family',
    wish: 'Dear Judath, watching you grow into such a graceful, ambitious explorer has been our greatest joy. Happy 25th birthday!',
    photoUrl: '/assets/teddy_bear_judath_1790532074650.jpg',
    timestamp: '2026-09-27T07:30:00Z',
    source: 'demo'
  },
  {
    id: 'demo-3',
    name: 'College Crew',
    relationship: 'Squad',
    wish: 'To the queen of spontaneous road trips! Cheers to 25 fabulous years and all the new destinations waiting for you.',
    photoUrl: '/assets/teddy_bear_kith_1790532086458.jpg',
    timestamp: '2026-09-27T06:15:00Z',
    source: 'demo'
  }
];

export async function fetchWishesFromSheet(customUrl?: string): Promise<Wish[]> {
  const url = customUrl || getStoredScriptUrl();
  if (!url) {
    return [];
  }

  try {
    const fetchUrl = `${url}?action=getWishes&t=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    let rawItems: any[] = [];

    if (Array.isArray(data)) {
      rawItems = data;
    } else if (data && Array.isArray(data.wishes)) {
      rawItems = data.wishes;
    } else if (data && Array.isArray(data.data)) {
      rawItems = data.data;
    } else {
      return [];
    }

    const parsed: Wish[] = rawItems.map((item, index) => {
      const name = item.name || item.fullName || item['Your Name'] || item['Name'] || 'A Loving Well-wisher';
      const relationship = item.relationship || item['Relationship to Judath'] || item['Relationship'] || 'Friend / Family';
      const wish = item.wish || item.message || item['Your Birthday Wish'] || item['Birthday Wish'] || 'Wishing you the happiest birthday!';
      const rawPhoto = item.photoUrl || item.imageUrl || item.photo || item['Photo'] || item['Memorable photo with Judath'] || '';
      const photoUrl = normalizeImageUrl(rawPhoto);
      const timestamp = item.timestamp || item['Timestamp'] || new Date().toISOString();
      const rowNumber = item.rowNumber || (index + 2);

      return {
        id: item.id ? String(item.id) : `sheet-${index}-${Date.now()}`,
        name: String(name).trim(),
        relationship: String(relationship).trim(),
        wish: String(wish).trim(),
        photoUrl: photoUrl || undefined,
        timestamp: String(timestamp),
        source: 'sheet',
        rowNumber
      };
    });

    return parsed;
  } catch (err) {
    console.warn('Apps Script fetch failed:', err);
    throw err;
  }
}

export async function deleteWishRemotely(params: {
  pin: string;
  rowNumber?: number;
  id?: string;
  name?: string;
  timestamp?: string;
}): Promise<{ success: boolean; message?: string }> {
  const url = getStoredScriptUrl();
  if (!url) {
    throw new Error('No Apps Script URL configured.');
  }

  try {
    const postPayload = JSON.stringify({
      action: 'deleteWish',
      pin: params.pin,
      rowNumber: params.rowNumber,
      id: params.id,
      name: params.name,
      timestamp: params.timestamp
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: postPayload
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    console.error('Remote delete failed:', err);
    throw new Error(err.message || 'Failed to contact delete endpoint');
  }
}

export function getCachedWishes(): Wish[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_WISHES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(e);
  }
  return DEMO_WISHES;
}

export function saveCachedWishes(wishes: Wish[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishes));
  } catch (e) {
    console.error(e);
  }
}

export async function getWishes(forceRefresh = false): Promise<Wish[]> {
  if (!forceRefresh) {
    const cached = getCachedWishes();
    if (cached && cached.length > 0 && cached[0].source === 'sheet') {
      return cached;
    }
  }

  try {
    const remote = await fetchWishesFromSheet();
    if (remote && remote.length > 0) {
      saveCachedWishes(remote);
      return remote;
    }
  } catch (e) {
    console.warn('Using cached wishes due to fetch error:', e);
  }

  const cached = getCachedWishes();
  return cached.length > 0 ? cached : DEMO_WISHES;
}
