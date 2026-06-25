import {Bookmark} from 'lucide-react';

interface BookmarkButtonProps {
  saved: boolean;
  onToggle: () => void;
}

export function BookmarkButton({saved, onToggle}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-outline/20 text-sm font-semibold hover:border-primary/40 transition-colors"
    >
      <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-primary' : ''} />
      {saved ? 'Guardado' : 'Guardar en mi colección'}
    </button>
  );
}
