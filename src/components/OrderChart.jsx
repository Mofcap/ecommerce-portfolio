import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrdersCharts = () => {
  const { orders } = useSelector((state) => state.order);

  // Traiter les données pour regrouper par jour
  const chartData = useMemo(() => {
    const groupedByDay = {};

    orders.forEach(order => {
      // Extraire la date (juste le jour)
      const date = new Date(order.orderDate);
      const dayKey = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = {
          date: dayKey,
          orders: 0,
          revenue: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0
        };
      }

      groupedByDay[dayKey].orders += 1;
      groupedByDay[dayKey].revenue += order.totalAmount;
      groupedByDay[dayKey][order.status] += 1;
    });

    // Convertir en tableau et trier par date
    return Object.values(groupedByDay).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA - dateB;
    });
  }, [orders]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0);
    const avgRevenue = totalRevenue / chartData.length;
    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
    const maxOrders = Math.max(...chartData.map(d => d.orders));

    return {
      totalRevenue,
      avgRevenue,
      maxRevenue,
      maxOrders,
      totalDays: chartData.length
    };
  }, [chartData]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Revenu' ? formatPrice(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Jours analysés</p>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.totalDays}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Revenu moyen/jour</p>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{formatPrice(stats.avgRevenue)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Meilleure journée</p>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{formatPrice(stats.maxRevenue)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Max commandes/jour</p>
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.maxOrders}</p>
        </div>
      </div>

      {/* Graphique des commandes par jour */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Nombre de commandes par jour</h2>
          <p className="text-sm text-gray-600">Évolution du volume de commandes</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="orders" name="Commandes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique du revenu par jour */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Revenu des ventes par jour</h2>
          <p className="text-sm text-gray-600">Évolution du chiffre d'affaires</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenu" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ r: 5, fill: '#10b981' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique des statuts par jour */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Distribution des statuts par jour</h2>
          <p className="text-sm text-gray-600">Répartition des commandes selon leur statut</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="pending" name="En attente" fill="#eab308" stackId="status" />
            <Bar dataKey="processing" name="En traitement" fill="#3b82f6" stackId="status" />
            <Bar dataKey="shipped" name="Expédié" fill="#a855f7" stackId="status" />
            <Bar dataKey="delivered" name="Livré" fill="#10b981" stackId="status" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau récapitulatif */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Détails par jour</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traitement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expédié</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livré</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chartData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {day.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatPrice(day.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{day.pending}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{day.processing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{day.shipped}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{day.delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersCharts;