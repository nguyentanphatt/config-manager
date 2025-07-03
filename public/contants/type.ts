export type ConfigInputProps = {
  data: any;
  parentPath?: string;
  onChange?: (fullKey: string, value: any) => void;
  focusKey?: string;
  edit?: boolean;
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

export interface EditFormProps {
  data: any;
  onChange: (newData: any) => void;
}

export interface AddFieldFormProps {
  onAdd: (key: string, value: any) => void;
  existingKeys?: string[];
}
