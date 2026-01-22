import { Code, Copy, ShieldCheck, Eye, EyeSlash, Check } from '@phosphor-icons/react';
import { useState } from 'react';
import clsx from 'clsx';
import type { ApiKeyCredential } from '../../../types/credential.types';
import { useClipboard } from '../../../hooks/useClipboard';
import { getEnvironmentColors } from '../../../constants/colors';

interface ApiKeyCardProps {
  credential: ApiKeyCredential;
}

export function ApiKeyCard({ credential }: ApiKeyCardProps) {
  const { copyToClipboard } = useClipboard();
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const envColors = getEnvironmentColors(credential.env);
  
  const handleCopy = (text: string, message: string, field: string) => {
    copyToClipboard(text, message);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  return (
    <div className="space-y-3">
      {/* Environment & Type */}
      <div className="flex items-center justify-between gap-2">
        <div className={clsx(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold',
          envColors.bg, envColors.text, envColors.border
        )}>
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              credential.env === 'Production' ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 
              credential.env === 'Staging' ? 'bg-yellow-500' : 'bg-green-500'
            )}
          ></span>
          {credential.env}
        </div>
        <button
          onClick={() => handleCopy(credential.keyType, 'Key type copied', 'keyType')}
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-zinc-800/50 transition-all group/type hover:scale-105 active:scale-95"
          title="Copy key type"
        >
          <ShieldCheck size={14} weight="bold" className="group-hover/type:text-primary transition-colors" />
          <span className="font-medium">{credential.keyType}</span>
          {copiedField === 'keyType' ? (
            <Check size={12} className="text-green-400 check-mark-animate" />
          ) : (
            <Copy size={12} className="opacity-0 group-hover/type:opacity-100 transition-opacity" />
          )}
        </button>
      </div>
      
      {/* API Secret */}
      <div className="glass-morphism rounded-lg p-3.5 hover:border-white/20 transition-all group/secret">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-zinc-500 flex-shrink-0" weight="bold" />
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Secret Key</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="text-zinc-500 hover:text-zinc-300 transition-all duration-200 p-1 rounded hover:bg-zinc-800 hover:scale-110 active:scale-95"
              title={showSecret ? 'Hide secret' : 'Show secret'}
              aria-label={showSecret ? 'Hide secret' : 'Show secret'}
            >
              {showSecret ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
            </button>
            <button
              onClick={() => handleCopy(credential.secret, 'API key copied', 'secret')}
              className="text-zinc-500 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-zinc-800 hover:scale-110 active:scale-95"
              title="Copy secret"
              aria-label="Copy secret key"
            >
              {copiedField === 'secret' ? (
                <Check size={16} weight="bold" className="text-green-400 check-mark-animate" />
              ) : (
                <Copy size={16} weight="bold" />
              )}
            </button>
          </div>
        </div>
        <div className="font-mono text-xs text-zinc-300 break-all leading-relaxed">
          {showSecret ? credential.secret : '•'.repeat(Math.min(credential.secret.length, 48))}
        </div>
      </div>
    </div>
  );
}
