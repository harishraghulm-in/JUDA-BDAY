export interface Wish {
  id: string;
  name: string;
  relationship: string;
  wish: string;
  image: string;
  timestamp?: string;
}

export type PageView = 'landing' | 'judath' | 'kith_kin';
