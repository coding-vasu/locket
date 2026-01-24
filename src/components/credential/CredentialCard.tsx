import { memo } from 'react';
import { Trash, PencilSimple, ClipboardText, Globe, Code, Database, Notepad, PushPin } from '@phosphor-icons/react';
import clsx from 'clsx';
import type { Credential, CredentialFormData } from '../../types/credential.types';
import { CREDENTIAL_ICONS } from '../../constants';
import { LoginCard } from './cards/LoginCard';
import { ApiKeyCard } from './cards/ApiKeyCard';
import { DatabaseCard } from './cards/DatabaseCard';
import { NoteCard } from './cards/NoteCard';
import { useCredentialStore } from '../../store/credentialStore';
import { useUIStore } from '../../store/uiStore';
import { formatCredentialAsText } from '../../utils/formatCredential';
import { useClipboard } from '../../hooks/useClipboard';
import { useQuickCopy } from '../../hooks/useQuickCopy';
import { Tooltip } from '../ui/Tooltip';

interface CredentialCardProps {
  credential: Credential;
}

const ICON_MAP = {
  globe: Globe,
  code: Code,
  database: Database,
  notepad: Notepad,
};

export const CredentialCard = memo(function CredentialCard({ credential }: CredentialCardProps) {
  const deleteCredential = useCredentialStore((state) => state.deleteCredential);
  const openEditModal = useUIStore((state) => state.openEditModal);
  const addToast = useUIStore((state) => state.addToast);
  const pinnedCredentialId = useUIStore((state) => state.pinnedCredentialId);
  const { copyToClipboard } = useClipboard();
  const { openQuickCopy } = useQuickCopy();
  
  const isPinned = pinnedCredentialId === credential.id;
  
  const iconConfig = CREDENTIAL_ICONS[credential.type];
  const IconComponent = ICON_MAP[iconConfig.icon as keyof typeof ICON_MAP] || Globe;
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this credential?')) {
      deleteCredential(credential.id);
      addToast('Item deleted');
    }
  };
  
  const handleEdit = () => {
    openEditModal(credential as unknown as CredentialFormData);
  };
  
  const handleCopyAll = () => {
    const formattedText = formatCredentialAsText(credential);
    copyToClipboard(formattedText, 'All details copied');
  };

  const handleQuickCopy = () => {
    openQuickCopy(credential.id);
  };
  
  return (
    <div className="group relative glass-morphism rounded-2xl flex flex-col overflow-hidden h-full max-h-[440px] card-3d spotlight-border pulse-icon-hover">
      {/* Header Section */}
      <div className="p-5 pb-4 border-b border-border">
        <div className="flex justify-between items-start mb-3">
          <div className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm icon-pulse transition-all duration-300',
            iconConfig.bg
          )}>
            <IconComponent size={22} weight="fill" className={iconConfig.color} />
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content="Quick Copy Mode" position="top">
              <button
                onClick={handleQuickCopy}
                className={clsx(
                  "transition-all duration-200 p-2 rounded-lg hover:bg-surfaceHighlight/70 hover:scale-110 active:scale-95 ripple-effect",
                  isPinned ? "text-primary" : "text-muted hover:text-primary"
                )}
                aria-label="Open quick copy window"
              >
                <PushPin size={19} weight={isPinned ? "fill" : "bold"} />
              </button>
            </Tooltip>
            <Tooltip content="Copy All Details" position="top">
              <button
                onClick={handleCopyAll}
                className="text-muted hover:text-primary transition-all duration-200 p-2 rounded-lg hover:bg-surfaceHighlight/70 hover:scale-110 active:scale-95 ripple-effect"
                aria-label="Copy all credential details"
              >
                <ClipboardText size={19} weight="bold" />
              </button>
            </Tooltip>
            <Tooltip content="Delete Credential" position="top">
              <button
                onClick={handleDelete}
                className="text-muted hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-surfaceHighlight/70 hover:scale-110 active:scale-95 ripple-effect"
                aria-label="Delete credential"
              >
                <Trash size={19} weight="bold" />
              </button>
            </Tooltip>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-main leading-tight line-clamp-1">
            {credential.title}
          </h3>
          <p className="text-xs text-muted truncate">
            {credential.subtitle}
          </p>
        </div>
      </div>

      {/* Body (Polymorphic Content) */}
      <div className="flex-1 p-5 pt-4 overflow-auto no-scrollbar">
        {credential.type === 'login' && <LoginCard credential={credential} />}
        {credential.type === 'api' && <ApiKeyCard credential={credential} />}
        {credential.type === 'database' && <DatabaseCard credential={credential} />}
        {credential.type === 'note' && <NoteCard credential={credential} onEdit={handleEdit} />}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 mt-auto flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-dim font-medium">{credential.date}</span>
        <button
          onClick={handleEdit}
          className="text-muted hover:text-primary transition-all duration-200 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-surfaceHighlight/70 hover:scale-105 active:scale-95"
          aria-label="Edit credential"
        >
          <PencilSimple size={15} weight="bold" /> Edit
        </button>
      </div>
    </div>
  );
});
