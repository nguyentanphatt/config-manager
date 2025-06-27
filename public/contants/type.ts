export type ConfigInputProps = {
  data: any;
  parentPath?: string;
  onChange?: (fullKey: string, value: any) => void;
  focusKey?: string;
};

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface ObjectField {
  id: number;
  key: string;
  type: string;
  value: string;
}
