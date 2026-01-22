import { useState, useEffect } from 'react';
import { Globe, MagicWand, Eye, EyeSlash } from '@phosphor-icons/react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useUIStore } from '../../store/uiStore';
import { useCredentialStore } from '../../store/credentialStore';
import type { CredentialFormData, CredentialType } from '../../types/credential.types';
import { generatePassword } from '../../utils/passwordGenerator';
import { DATABASE_ENGINES, API_ENVIRONMENTS, API_KEY_TYPES } from '../../constants';
import clsx from 'clsx';

export function CredentialModal() {
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const modalMode = useUIStore((state) => state.modalMode);
  const editingCredential = useUIStore((state) => state.editingCredential);
  const closeModal = useUIStore((state) => state.closeModal);
  const addCredential = useCredentialStore((state) => state.addCredential);
  const updateCredential = useCredentialStore((state) => state.updateCredential);
  const addToast = useUIStore((state) => state.addToast);
  
  const [formData, setFormData] = useState<CredentialFormData>(getInitialFormData);
  
  useEffect(() => {
    if (modalMode === 'edit' && editingCredential) {
      setFormData(editingCredential);
    } else if (modalMode === 'add') {
      setFormData(getInitialFormData());
    }
  }, [modalMode, editingCredential]);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      addToast('Title is required', 'error');
      return;
    }
    
    if (modalMode === 'edit' && formData.id) {
      updateCredential(formData.id, formData);
      addToast('Changes saved');
    } else {
      addCredential(formData);
      addToast('Credential added');
    }
    
    closeModal();
  };
  
  const handleGeneratePassword = () => {
    const password = generatePassword();
    if (formData.type === 'database') {
      setFormData({ ...formData, dbPass: password });
    } else {
      setFormData({ ...formData, password });
    }
  };
  
  const updateField = (field: keyof CredentialFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={modalMode === 'edit' ? 'Edit Item' : 'New Credential'}
      subtitle="Securely store data in your vault"
    >
      <form 
        key={editingCredential?.id || 'new'} 
        onSubmit={handleSubmit}
      >
        <div className="p-6 space-y-5">
          {/* Type Tabs */}
          {modalMode !== 'edit' && (
            <div className="flex p-1 bg-zinc-950/50 border border-border rounded-lg">
              {(['login', 'api', 'database', 'note'] as CredentialType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...getInitialFormData(), type })}
                  className={clsx(
                    'flex-1 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                    formData.type === type
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
          
          {/* Title */}
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Netflix Personal"
            required
          />
          
          {/* Login Form */}
          {formData.type === 'login' && (
            <>
              <Input
                label="Website URL"
                value={formData.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://example.com"
                icon={<Globe size={16} weight="bold" />}
                className="font-mono"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={formData.username || ''}
                  onChange={(e) => updateField('username', e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password || ''}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 pr-16 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-zinc-500 hover:text-primary p-1"
                        title="Generate Password"
                      >
                        <MagicWand size={16} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                      >
                        {showPassword ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* API Form */}
          {formData.type === 'api' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Environment
                  </label>
                  <select
                    value={formData.env}
                    onChange={(e) => updateField('env', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                  >
                    {API_ENVIRONMENTS.map((env) => (
                      <option key={env}>{env}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Key Type
                  </label>
                  <select
                    value={formData.keyType}
                    onChange={(e) => updateField('keyType', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                  >
                    {API_KEY_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Secret Key
                </label>
                <textarea
                  value={formData.secret || ''}
                  onChange={(e) => updateField('secret', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono min-h-[80px]"
                  placeholder="sk_..."
                />
              </div>
            </>
          )}
          
          {/* Database Form */}
          {formData.type === 'database' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Engine
                  </label>
                  <select
                    value={formData.dbEngine}
                    onChange={(e) => updateField('dbEngine', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                  >
                    {DATABASE_ENGINES.map((engine) => (
                      <option key={engine}>{engine}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Database Name"
                  value={formData.dbName || ''}
                  onChange={(e) => updateField('dbName', e.target.value)}
                  placeholder="users_db"
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Host"
                    value={formData.dbHost || ''}
                    onChange={(e) => updateField('dbHost', e.target.value)}
                    placeholder="127.0.0.1"
                    className="font-mono"
                  />
                </div>
                <Input
                  label="Port"
                  value={formData.dbPort || ''}
                  onChange={(e) => updateField('dbPort', e.target.value)}
                  placeholder="5432"
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={formData.dbUser || ''}
                  onChange={(e) => updateField('dbUser', e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.dbPass || ''}
                      onChange={(e) => updateField('dbPass', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 pr-16 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-zinc-500 hover:text-primary p-1"
                        title="Generate Password"
                      >
                        <MagicWand size={16} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                      >
                        {showPassword ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Note Form */}
          {formData.type === 'note' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Content
              </label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 min-h-[120px] resize-none"
                placeholder="Enter secure notes here..."
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-0">
          <Button type="submit" className="w-full">
            Save Credential
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function getInitialFormData(): CredentialFormData {
  return {
    id: null,
    type: 'login',
    title: '',
    subtitle: '',
    url: '',
    username: '',
    password: '',
    env: 'Production',
    keyType: 'Standard API Key',
    secret: '',
    dbEngine: 'PostgreSQL',
    dbHost: '',
    dbPort: '',
    dbName: '',
    dbUser: '',
    dbPass: '',
    content: '',
  };
}
