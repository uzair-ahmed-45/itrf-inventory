import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder,
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1\/2" style={{ transform: 'translateY(-50%)' }}>
            <Icon className="w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''}
            border-none rounded-lg bg-gray-100
            focus:ring-2 focus:ring-blue-500 focus:bg-white
            transition-all duration-200
            ${error ? 'bg-red-50 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

