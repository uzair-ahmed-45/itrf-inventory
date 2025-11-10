import { motion } from 'framer-motion';
import { Card } from './ui';

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const paths = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // For 100% (full circle), we need to draw it as two 180-degree arcs
    if (percentage >= 99.9) {
      return {
        ...item,
        path: 'M 50 10 A 40 40 0 1 1 49.99 10 Z',
        percentage: percentage.toFixed(1)
      };
    }

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: percentage.toFixed(1)
    };
  });

  if (!data || data.length === 0) {
    return (
      <Card title={title} className="h-full">
        <div className="flex items-center justify-center h-48 text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} className="h-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.svg
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewBox="0 0 100 100"
          className="w-48 h-48 flex-shrink-0"
        >
          {paths.map((item, index) => (
            <motion.path
              key={index}
              d={item.path}
              fill={item.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </motion.svg>
        
        <div className="flex-1 space-y-3 w-full">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                <span className="text-xs text-gray-500">({paths[index].percentage}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PieChart;

