export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}
