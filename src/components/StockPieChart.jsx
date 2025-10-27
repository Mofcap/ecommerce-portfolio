import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const StockPieChart = () => {
  const products = useSelector(state => state.products.products);
  const stats = useSelector(state => state.products.stats);

  // Préparer les données pour le pie chart
  const chartData = useMemo(() => {
    return products
      .filter(p => p.stockQuantity > 0)
      .map(product => ({
        name: product.name,
        value: product.stockQuantity,
        percentage: ((product.stockQuantity / stats.totalStock) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  }, [products, stats.totalStock]);

  // Palette de couleurs
  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7',
    '#84cc16', '#f43f5e', '#0ea5e9', '#eab308', '#6366f1'
  ];

  // Calculer les coordonnées pour le SVG pie chart
  const createPieSlices = () => {
    let currentAngle = 0;
    return chartData.map((item, index) => {
      const percentage = (item.value / stats.totalStock) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Convertir en radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      // Coordonnées pour le path
      const x1 = 150 + 120 * Math.cos(startRad);
      const y1 = 150 + 120 * Math.sin(startRad);
      const x2 = 150 + 120 * Math.cos(endRad);
      const y2 = 150 + 120 * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M 150 150`,
        `L ${x1} ${y1}`,
        `A 120 120 0 ${largeArc} 1 ${x2} ${y2}`,
        `Z`
      ].join(' ');

      // Position du label
      const labelAngle = (startAngle + endAngle) / 2;
      const labelRad = (labelAngle - 90) * (Math.PI / 180);
      const labelX = 150 + 90 * Math.cos(labelRad);
      const labelY = 150 + 90 * Math.sin(labelRad);

      return {
        pathData,
        color: COLORS[index % COLORS.length],
        labelX,
        labelY,
        percentage: item.percentage,
        name: item.name,
        value: item.value,
        showLabel: percentage > 5
      };
    });
  };

  const pieSlices = useMemo(() => createPieSlices(), [chartData, stats.totalStock]);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Répartition du Stock
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Total en stock:</span>{' '}
            <span className="text-blue-600 font-bold">{stats.totalStock}</span> unités
          </div>
          <div>
            <span className="font-semibold">Produits:</span>{' '}
            <span className="text-green-600 font-bold">{chartData.length}</span>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="flex justify-center mb-6">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {pieSlices.map((slice, index) => (
                <g key={index}>
                  <path
                    d={slice.pathData}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                    opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.5}
                    style={{
                      cursor: 'pointer',
                      transition: 'opacity 0.2s, transform 0.2s',
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: '150px 150px'
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  {slice.showLabel && (
                    <text
                      x={slice.labelX}
                      y={slice.labelY}
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {slice.percentage}%
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {hoveredIndex !== null && (
            <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-800">
                {pieSlices[hoveredIndex].name}
              </p>
              <p className="text-sm text-gray-600">
                Stock: <span className="font-bold text-blue-600">
                  {pieSlices[hoveredIndex].value}
                </span> unités
              </p>
              <p className="text-sm text-gray-600">
                Part: <span className="font-bold text-green-600">
                  {pieSlices[hoveredIndex].percentage}%
                </span>
              </p>
            </div>
          )}

          <div className="mt-6 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {chartData.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    backgroundColor: hoveredIndex === index ? '#f3f4f6' : 'transparent'
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.value} unités ({item.percentage}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit en stock</p>
        </div>
      )}
    </div>
  );
};

export default StockPieChart;