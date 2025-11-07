import { motion } from 'framer-motion';
import { Card } from './ui';

const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Card title={title} className="h-full">
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{item.count} items</span>
                  <span className="font-semibold text-blue-600">${item.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default BarChart;

