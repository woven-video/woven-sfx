export type Sound = {
  id: string;
  file: string;
  tags: string[];
  duration_ms: number;
  default_volume: number;
  url: string;
  peaks_url?: string;
};

export type Catalog = {
  version: string;
  sounds: Sound[];
};
