interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  help?: string;
}

export function SelectField({ label, options, help, ...props }: SelectFieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        {...props}
        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {help && <span className="text-xs text-slate-500">{help}</span>}
    </label>
  );
}