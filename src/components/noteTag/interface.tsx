export interface NoteTagProps {
  isReading: boolean;
  noteKey: string;
  isCard: boolean;
  tag: string[];
  handleTag: (tag: string[]) => void;
}