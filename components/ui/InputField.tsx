interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  help?: string;
}

export function InputField({ label, help, ...props }: InputFieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      {help && <span className="text-xs text-slate-500">{help}</span>}
    </label>
  );
}