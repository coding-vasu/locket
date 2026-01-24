import { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check, Eye, EyeSlash, User, Key, Globe, Code, Database, Link } from '@phosphor-icons/react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { Credential } from '../../types/credential.types';
import { useClipboard } from '../../hooks/useClipboard';

export function QuickCopyWindow() {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { copyToClipboard } = useClipboard();

  const handleClose = useCallback(async () => {
    try {
      await invoke('close_quick_copy_window');
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  }, []);

  const handleDragStart = () => {
    getCurrentWindow().startDragging();
  };

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text, '');
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    // Request credential data from backend
    const loadCredential = async () => {
      try {
        const credentialJson = await invoke<string>('get_quick_copy_credential');
        const cred = JSON.parse(credentialJson) as Credential;
        setCredential(cred);
      } catch (error) {
        console.error('Failed to load credential:', error);
      }
    };

    loadCredential();
  }, []);

  useEffect(() => {
    // Handle ESC key to close window
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!credential) {
    return (
      <div className="w-full h-full bg-surface/95 backdrop-blur-xl flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-surface/98 via-surface/95 to-surfaceHighlight/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
      {/* Custom Title Bar */}
      <div 
        className="bg-surfaceHighlight/30 border-b border-white/10 px-4 py-3 flex items-center justify-between cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
          <span className="text-xs font-semibold text-main">Quick Copy</span>
        </div>
        <button
          onClick={handleClose}
          className="text-muted hover:text-red-400 transition-all duration-200 p-1 rounded hover:bg-surfaceHighlight/50 relative z-10"
          aria-label="Close"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X size={16} weight="bold" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto no-scrollbar space-y-3">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-sm text-main leading-tight line-clamp-1">
            {credential.title}
          </h3>
          <p className="text-xs text-muted truncate mt-0.5">
            {credential.subtitle}
          </p>
        </div>

        {/* Login Credential Fields */}
        {credential.type === 'login' && (
          <>
            {/* URL */}
            {credential.url && (
              <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Globe size={14} className="text-muted" weight="bold" />
                    <div className="text-[9px] font-bold text-muted uppercase tracking-wider">URL</div>
                  </div>
                  <button
                    onClick={() => handleCopy(credential.url!, 'url')}
                    className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                  >
                    {copiedField === 'url' ? (
                      <Check size={12} weight="bold" className="text-green-400" />
                    ) : (
                      <Copy size={12} weight="bold" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-main truncate pl-5">
                  {credential.url.replace(/^https?:\/\//, '')}
                </div>
              </div>
            )}

            {/* Username */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Username</div>
                </div>
                <button
                  onClick={() => handleCopy(credential.username, 'username')}
                  className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                >
                  {copiedField === 'username' ? (
                    <Check size={12} weight="bold" className="text-green-400" />
                  ) : (
                    <Copy size={12} weight="bold" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-main truncate pl-5">
                {credential.username}
              </div>
            </div>

            {/* Password */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Key size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Password</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted hover:text-main transition-all p-1 rounded hover:bg-surfaceHighlight"
                  >
                    {showPassword ? <EyeSlash size={12} weight="bold" /> : <Eye size={12} weight="bold" />}
                  </button>
                  <button
                    onClick={() => handleCopy(credential.password, 'password')}
                    className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                  >
                    {copiedField === 'password' ? (
                      <Check size={12} weight="bold" className="text-green-400" />
                    ) : (
                      <Copy size={12} weight="bold" />
                    )}
                  </button>
                </div>
              </div>
              <div className="font-mono text-xs text-main pl-5">
                {showPassword ? credential.password : '•'.repeat(credential.password.length)}
              </div>
            </div>
          </>
        )}

        {/* API Key Credential Fields */}
        {credential.type === 'api' && (
          <>
            {/* Environment */}
            <div className="glass-morphism rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Code size={14} className="text-muted" weight="bold" />
                <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Environment</div>
              </div>
              <div className="text-xs text-main pl-5">{credential.env}</div>
            </div>

            {/* Key Type */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Link size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Key Type</div>
                </div>
                <button
                  onClick={() => handleCopy(credential.keyType, 'keyType')}
                  className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                >
                  {copiedField === 'keyType' ? (
                    <Check size={12} weight="bold" className="text-green-400" />
                  ) : (
                    <Copy size={12} weight="bold" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-main truncate pl-5">
                {credential.keyType}
              </div>
            </div>

            {/* Secret */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Key size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Secret</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted hover:text-main transition-all p-1 rounded hover:bg-surfaceHighlight"
                  >
                    {showPassword ? <EyeSlash size={12} weight="bold" /> : <Eye size={12} weight="bold" />}
                  </button>
                  <button
                    onClick={() => handleCopy(credential.secret, 'secret')}
                    className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                  >
                    {copiedField === 'secret' ? (
                      <Check size={12} weight="bold" className="text-green-400" />
                    ) : (
                      <Copy size={12} weight="bold" />
                    )}
                  </button>
                </div>
              </div>
              <div className="font-mono text-xs text-main pl-5 break-all">
                {showPassword ? credential.secret : '•'.repeat(20)}
              </div>
            </div>
          </>
        )}

        {/* Database Credential Fields */}
        {credential.type === 'database' && (
          <>
            <div className="glass-morphism rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Database size={14} className="text-muted" weight="bold" />
                <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Engine</div>
              </div>
              <div className="text-xs text-main pl-5">{credential.dbEngine}</div>
            </div>

            {/* Host */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Globe size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Host</div>
                </div>
                <button
                  onClick={() => handleCopy(credential.dbHost, 'dbHost')}
                  className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                >
                  {copiedField === 'dbHost' ? (
                    <Check size={12} weight="bold" className="text-green-400" />
                  ) : (
                    <Copy size={12} weight="bold" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-main truncate pl-5">
                {credential.dbHost}:{credential.dbPort}
              </div>
            </div>

            {/* Database Name */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Database size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Database</div>
                </div>
                <button
                  onClick={() => handleCopy(credential.dbName, 'dbName')}
                  className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                >
                  {copiedField === 'dbName' ? (
                    <Check size={12} weight="bold" className="text-green-400" />
                  ) : (
                    <Copy size={12} weight="bold" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-main truncate pl-5">
                {credential.dbName}
              </div>
            </div>

            {/* Username */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Username</div>
                </div>
                <button
                  onClick={() => handleCopy(credential.dbUser, 'dbUser')}
                  className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                >
                  {copiedField === 'dbUser' ? (
                    <Check size={12} weight="bold" className="text-green-400" />
                  ) : (
                    <Copy size={12} weight="bold" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-main truncate pl-5">
                {credential.dbUser}
              </div>
            </div>

            {/* Password */}
            <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Key size={14} className="text-muted" weight="bold" />
                  <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Password</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted hover:text-main transition-all p-1 rounded hover:bg-surfaceHighlight"
                  >
                    {showPassword ? <EyeSlash size={12} weight="bold" /> : <Eye size={12} weight="bold" />}
                  </button>
                  <button
                    onClick={() => handleCopy(credential.dbPass, 'password')}
                    className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
                  >
                    {copiedField === 'password' ? (
                      <Check size={12} weight="bold" className="text-green-400" />
                    ) : (
                      <Copy size={12} weight="bold" />
                    )}
                  </button>
                </div>
              </div>
              <div className="font-mono text-xs text-main pl-5">
                {showPassword ? credential.dbPass : '•'.repeat(credential.dbPass.length)}
              </div>
            </div>
          </>
        )}

        {/* Note Credential */}
        {credential.type === 'note' && (
          <div className="glass-morphism rounded-lg p-2.5 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="text-[9px] font-bold text-muted uppercase tracking-wider">Content</div>
              <button
                onClick={() => handleCopy(credential.content, 'content')}
                className="text-muted hover:text-primary transition-all p-1 rounded hover:bg-surfaceHighlight hover:scale-110"
              >
                {copiedField === 'content' ? (
                  <Check size={12} weight="bold" className="text-green-400" />
                ) : (
                  <Copy size={12} weight="bold" />
                )}
              </button>
            </div>
            <div className="text-xs text-main leading-relaxed whitespace-pre-wrap">
              {credential.content}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-surfaceHighlight/20 px-4 py-2 text-center">
        <span className="text-[10px] text-dim">Press ESC to close</span>
      </div>
    </div>
  );
}
