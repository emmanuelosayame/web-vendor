export type CSNames =
  | "montery"
  | "sierra"
  | "alice"
  | "greenade"
  | "purpleIsle";

export interface ColorScheme {
  name: CSNames;
  bg: string;
  color: string;
}

export interface ColorSchemeSlice {
  colorScheme: CSNames;
  setColorScheme: (name?: CSNames) => void;
}
