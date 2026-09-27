import { Wish } from './types';

export const GOOGLE_FORM_URL = 'https://forms.gle/mtDTG3BV6nRyZW7L7';

// The Apps Script Web App URL connected to live Google Sheet responses
export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzpOPhD0lwJHnjIk3R55GFmT0Ffa_HwixkJapav_azLTrztG3m3tl0_PKYx8Efq_iSrUA/exec';

export const STORAGE_KEY_APPS_SCRIPT_URL = 'judath_birthday_script_url';

export const INITIAL_SAMPLE_WISHES: Wish[] = [
  {
    id: 'sample-1',
    name: 'Victor',
    relationship: 'Brother',
    wish: "Happy birthday Judath! Can't wait to see you soon. May this year be filled with adventures, answered prayers, and endless blessings. You mean the world to us all!",
    image: '',
    timestamp: '2026-09-27 10:00:00',
  },
  {
    id: 'sample-2',
    name: 'Sarah',
    relationship: 'Cousin',
    wish: 'To the sweetest cousin in the universe, happy birthday! Remembering all our childhood holidays and cozy tea talks. Love you heaps!',
    image: '',
    timestamp: '2026-09-27 10:15:00',
  },
  {
    id: 'sample-3',
    name: 'Alex & Maya',
    relationship: 'Best Friends',
    wish: 'Happy Birthday Judath! Thank you for always bringing sunshine into every room you enter. Keep shining bright and traveling far!',
    image: '',
    timestamp: '2026-09-27 10:30:00',
  },
];
