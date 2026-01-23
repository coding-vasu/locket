
import { Transition } from '@headlessui/react';
import { CheckCircle } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';

export function ToastContainer() {
  const { toasts } = useToast();
  
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2">
      {toasts.map((toast) => (
        <Transition
          key={toast.id}
          show={true}
          appear
          enter="transform transition duration-300"
          enterFrom="translate-y-10 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
        >
          <div className="bg-surface border border-border text-main px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-3 min-w-[200px]">
            <CheckCircle size={20} weight="fill" className="text-emerald-400" />
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </Transition>
      ))}
    </div>
  );
}
