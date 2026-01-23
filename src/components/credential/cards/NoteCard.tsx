import { FileText, Article } from '@phosphor-icons/react';
import type { NoteCredential } from '../../../types/credential.types';

interface NoteCardProps {
  credential: NoteCredential;
  onEdit: () => void;
}

export function NoteCard({ credential, onEdit }: NoteCardProps) {
  const charCount = credential.content.length;
  const lineCount = credential.content.split('\n').length;
  const wordCount = credential.content.trim().split(/\s+/).filter(Boolean).length;
  
  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1.5 font-medium">
          <Article size={14} weight="bold" />
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>
        <span className="text-dim">·</span>
        <span className="font-medium">{wordCount} words</span>
        <span className="text-dim">·</span>
        <span className="font-medium">{charCount} chars</span>
      </div>
      
      {/* Content Preview */}
      <div
        className="min-h-[100px] max-h-[140px] overflow-hidden relative group/note cursor-pointer rounded-lg border border-border bg-surfaceHighlight/40 p-3.5 hover:border-dim transition-all hover:bg-surfaceHighlight/60"
        onClick={onEdit}
      >
        <p className="text-sm text-main leading-relaxed whitespace-pre-wrap">{credential.content}</p>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-surface via-surface/70 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/note:opacity-100 transition-opacity bg-surface/90 backdrop-blur-sm rounded-lg">
          <span className="text-sm text-main font-semibold flex items-center gap-2">
            <FileText size={18} weight="bold" />
            Click to view full note
          </span>
        </div>
      </div>
    </div>
  );
}
