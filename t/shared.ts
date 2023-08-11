export type CSNames =
  | "montery"
  | "sierra"
  | "alice"
  | "greenade"
  | "purpleIsle"
  | "yellowmine";

export interface ColorScheme {
  name: CSNames;
  bg: string;
  color: string;
}

export interface ColorSchemeSlice {
  colorScheme: CSNames;
  setColorScheme: (name?: CSNames) => void;
}

export interface DefaultSlice {
  product: { pagn: number };
  setPagn: (no: number) => void;
}

export interface RSCProps {
  params: { id: string; [key: string]: string };
  searchParams: { [key: string]: string };
}
