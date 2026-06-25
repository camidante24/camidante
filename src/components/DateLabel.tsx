interface DateLabelProps {
  date: string | null;
  locale?: string;
}

export function DateLabel({date, locale = 'es'}: DateLabelProps) {
  if (!date) return null;
  const formatted = new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return <>{formatted}</>;
}

export function DateLabelShort({date, locale = 'es'}: DateLabelProps) {
  if (!date) return null;
  return <>{new Date(date).toLocaleDateString(locale)}</>;
}
