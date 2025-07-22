import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md'
}: SwitchProps) => {
  const sizeConfig = {
    sm: {
      switch: 'w-8 h-5',
      thumb: 'w-3 h-3',
      translate: 'translate-x-3'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-8',
      thumb: 'w-6 h-6',
      translate: 'translate-x-6'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          ${config.switch}
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-ios-blue focus:ring-offset-2 focus:ring-offset-white
          ${checked ? 'bg-ios-blue' : 'bg-gray-200 dark:bg-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <motion.span
          className={`
            ${config.thumb}
            pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 
            transition duration-200 ease-in-out
          `}
          animate={{
            x: checked ? config.translate.split(' ')[0].replace('translate-x-', '') : '0'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
      )}
    </div>
  );
};