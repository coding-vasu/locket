import { User, Key, Copy, Globe, Eye, EyeSlash, Check } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LoginCredential } from '../../../types/credential.types';
import { useClipboard } from '../../../hooks/useClipboard';
import { calculatePasswordStrength, PASSWORD_STRENGTH_COLORS } from '../../../constants/colors';

interface LoginCardProps {
  credential: LoginCredential;
}

export function LoginCard({ credential }: LoginCardProps) {
  const { copyToClipboard } = useClipboard();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const passwordStrength = calculatePasswordStrength(credential.password);
  const strengthConfig = PASSWORD_STRENGTH_COLORS[passwordStrength];
  
  const handleCopy = (text: string, message: string, field: string) => {
    copyToClipboard(text, message);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  return (
    <div className="space-y-3">
      {/* Website URL (if available) */}
      {credential.url && (
        <a
          href={credential.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted hover:text-primary transition-all duration-200 group"
        >
          <Globe size={14} weight="bold" className="group-hover:scale-110 transition-transform" />
          <span className="truncate font-medium">{credential.url.replace(/^https?:\/\//, '')}</span>
        </a>
      )}
      
      {/* Username Field */}
      <div className="glass-morphism rounded-lg p-3 hover:border-white/20 transition-all group/field">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted flex-shrink-0" weight="bold" />
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Username</div>
          </div>
          <button
            onClick={() => handleCopy(credential.username, 'Username copied', 'username')}
            className="text-muted hover:text-primary transition-all duration-200 p-1 rounded hover:bg-surfaceHighlight hover:scale-110 active:scale-95"
            title="Copy username"
            aria-label="Copy username"
          >
            {copiedField === 'username' ? (
              <Check size={14} weight="bold" className="text-green-400 check-mark-animate" />
            ) : (
              <Copy size={14} weight="bold" />
            )}
          </button>
        </div>
        <div className="font-mono text-sm text-main truncate pl-6">
          {credential.username}
        </div>
      </div>
      
      {/* Password Field */}
      <div className="glass-morphism rounded-lg p-3 hover:border-white/20 transition-all group/field">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-muted flex-shrink-0" weight="bold" />
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Password</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted hover:text-main transition-all duration-200 p-1 rounded hover:bg-surfaceHighlight hover:scale-110 active:scale-95"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeSlash size={14} weight="bold" /> : <Eye size={14} weight="bold" />}
            </button>
            <button
              onClick={() => handleCopy(credential.password, 'Password copied', 'password')}
              className="text-muted hover:text-primary transition-all duration-200 p-1 rounded hover:bg-surfaceHighlight hover:scale-110 active:scale-95"
              title="Copy password"
              aria-label="Copy password"
            >
              {copiedField === 'password' ? (
                <Check size={14} weight="bold" className="text-green-400 check-mark-animate" />
              ) : (
                <Copy size={14} weight="bold" />
              )}
            </button>
          </div>
        </div>
        <div className="font-mono text-sm text-main pl-6 mb-2">
          {showPassword ? credential.password : '•'.repeat(credential.password.length)}
        </div>
        
        {/* Password Strength Indicator */}
        <div className="flex items-center gap-2 pl-6">
          <div className="flex-1 h-1 bg-surfaceHighlight rounded-full overflow-hidden">
            <div 
              className={`h-full ${strengthConfig.bg} transition-all duration-300`}
              style={{ 
                width: passwordStrength === 'weak' ? '25%' : 
                       passwordStrength === 'medium' ? '50%' : 
                       passwordStrength === 'strong' ? '75%' : '100%' 
              }}
            />
          </div>
          <span className={`text-[10px] font-semibold ${strengthConfig.text}`}>
            {strengthConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
}
