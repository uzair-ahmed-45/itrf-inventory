import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon: Icon,
  className = '',
  hover = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
      className={`
        bg-white rounded-xl shadow-lg p-6
        border border-gray-100
        ${className}
      `}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;

