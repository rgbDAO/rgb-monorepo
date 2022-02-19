export interface RgbSeed {
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface RgbData {
  parts: EncodedImage[];
  background: string;
}
