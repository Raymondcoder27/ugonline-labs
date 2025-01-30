
export interface Form {
  sections: FormSection[];
}

export interface FormSection {
  fields: FormElement[];
  entries: SectionEntry[]
  name:string
  cardinality:string
}

export interface SectionEntry{
  fields: FormElement[];
}

export interface FormElement {
  label: string;
  name: string;
  type: string;
  options: FormOption[];
  required: boolean;
}

export interface FormOption {
  text: string;
  value: string;
}
