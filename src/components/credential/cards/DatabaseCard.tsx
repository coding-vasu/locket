import { UserCircle, Key, Link, Copy, Database as DatabaseIcon, Eye, EyeSlash, Check } from '@phosphor-icons/react';
import { useState } from 'react';
import clsx from 'clsx';
import type { DatabaseCredential } from '../../../types/credential.types';
import { useClipboard } from '../../../hooks/useClipboard';
import { generateConnectionString } from '../../../utils/connectionString';
import { getDatabaseEngineColors } from '../../../constants/colors';

interface DatabaseCardProps {
  credential: DatabaseCredential;
}

export function DatabaseCard({ credential }: DatabaseCardProps) {
  const { copyToClipboard } = useClipboard();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const engineColors = getDatabaseEngineColors(credential.dbEngine);
  
  const handleCopyConnectionString = () => {
    const connStr = generateConnectionString(credential);
    copyToClipboard(connStr, 'Connection string copied');
    setCopiedField('connString');
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const handleCopyField = (value: string, label: string, field: string) => {
    copyToClipboard(value, `${label} copied`);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  return (
    <div className="space-y-3">
      {/* Engine Badge */}
      <div className="flex items-center justify-between">
        <div className={clsx(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold',
          engineColors.bg, engineColors.text, engineColors.border
        )}>
          <DatabaseIcon size={14} weight="bold" className={engineColors.icon} />
          {credential.dbEngine}
        </div>
        <button
          onClick={handleCopyConnectionString}
          className="text-xs bg-cyan-500/15 text-cyan-400 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-cyan-500/25 transition-all flex items-center gap-1.5 border border-cyan-500/30 font-semibold hover:scale-105 active:scale-95"
          title="Copy connection string"
        >
          {copiedField === 'connString' ? (
            <Check size={14} weight="bold" className="check-mark-animate" />
          ) : (
            <Link size={14} weight="bold" />
          )}
          URI
        </button>
      </div>
      
      {/* Connection Details */}
      <div className="space-y-2.5">
        {/* Host:Port */}
        <div className="glass-morphism rounded-lg p-3 hover:border-white/20 transition-all group/field">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Host : Port</div>
            <button
              onClick={() => handleCopyField(`${credential.dbHost}:${credential.dbPort}`, 'Host', 'host')}
              className="text-zinc-500 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-zinc-800 hover:scale-110 active:scale-95"
              title="Copy host and port"
              aria-label="Copy host and port"
            >
              {copiedField === 'host' ? (
                <Check size={14} weight="bold" className="text-green-400 check-mark-animate" />
              ) : (
                <Copy size={14} weight="bold" />
              )}
            </button>
          </div>
          <div className="font-mono text-sm text-zinc-200 truncate">{credential.dbHost}:{credential.dbPort}</div>
        </div>
        
        {/* Database Name */}
        <div className="glass-morphism rounded-lg p-3 hover:border-white/20 transition-all group/field">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Database</div>
            <button
              onClick={() => handleCopyField(credential.dbName, 'Database name', 'dbName')}
              className="text-zinc-500 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-zinc-800 hover:scale-110 active:scale-95"
              title="Copy database name"
              aria-label="Copy database name"
            >
              {copiedField === 'dbName' ? (
                <Check size={14} weight="bold" className="text-green-400 check-mark-animate" />
              ) : (
                <Copy size={14} weight="bold" />
              )}
            </button>
          </div>
          <div className="font-mono text-sm text-zinc-200 truncate">{credential.dbName}</div>
        </div>
        
        {/* User & Password */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Username */}
          <div className="glass-morphism rounded-lg p-3 hover:border-white/20 transition-all group/field">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <UserCircle size={14} weight="fill" className="text-zinc-500 flex-shrink-0" />
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">User</div>
              </div>
              <button
                onClick={() => handleCopyField(credential.dbUser, 'Username', 'dbUser')}
                className="text-zinc-500 hover:text-primary transition-all duration-200 p-0.5 rounded hover:scale-110 active:scale-95"
                title="Copy username"
                aria-label="Copy username"
              >
                {copiedField === 'dbUser' ? (
                  <Check size={12} weight="bold" className="text-green-400 check-mark-animate" />
                ) : (
                  <Copy size={12} weight="bold" />
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-zinc-200 truncate">{credential.dbUser}</div>
          </div>
          
          {/* Password */}
          <div className="glass-morphism rounded-lg p-3 hover:border-white/20 transition-all group/field">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Key size={14} weight="fill" className="text-zinc-500 flex-shrink-0" />
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Pass</div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 transition-all duration-200 p-0.5 rounded hover:scale-110 active:scale-95"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlash size={12} weight="bold" /> : <Eye size={12} weight="bold" />}
                </button>
                <button
                  onClick={() => handleCopyField(credential.dbPass, 'Password', 'dbPass')}
                  className="text-zinc-500 hover:text-primary transition-all duration-200 p-0.5 rounded hover:scale-110 active:scale-95"
                  title="Copy password"
                  aria-label="Copy password"
                >
                  {copiedField === 'dbPass' ? (
                    <Check size={12} weight="bold" className="text-green-400 check-mark-animate" />
                  ) : (
                    <Copy size={12} weight="bold" />
                  )}
                </button>
              </div>
            </div>
            <div className="font-mono text-xs text-zinc-200">
              {showPassword ? credential.dbPass : '•'.repeat(Math.min(credential.dbPass.length, 8))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
