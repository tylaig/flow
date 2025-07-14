
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AnalyticsData } from '../types';

const mockAnalyticsData: AnalyticsData = {
    messagesSent: 15320,
    activeConversations: 89,
    buttonClickRate: 62.5,
    engagementByHour: [
        { hour: '08:00', interactions: 120 },
        { hour: '10:00', interactions: 250 },
        { hour: '12:00', interactions: 400 },
        { hour: '14:00', interactions: 320 },
        { hour: '16:00', interactions: 500 },
        { hour: '18:00', interactions: 380 },
        { hour: '20:00', interactions: 210 },
    ],
    popularButtons: [
        { name: 'Saber Mais', clicks: 4502 },
        { name: 'Falar com Atendente', clicks: 2310 },
        { name: 'Ver Preços', clicks: 1856 },
        { name: 'Não', clicks: 980 },
    ]
};

const StatCard: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
    <div className="bg-dark-surface p-6 rounded-lg border border-dark-border shadow-md">
        <h3 className="text-sm font-medium text-dark-text-tertiary">{title}</h3>
        <p className="text-3xl font-bold text-dark-text-primary mt-1">{value}</p>
        <p className="text-xs text-dark-text-secondary mt-2">{description}</p>
    </div>
);


const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="flex-grow p-8 bg-dark-bg text-dark-text-primary overflow-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard de Análises</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total de Mensagens Enviadas" value={mockAnalyticsData.messagesSent.toLocaleString('pt-BR')} description="Últimos 30 dias" />
                <StatCard title="Conversas Ativas" value={mockAnalyticsData.activeConversations.toString()} description="No momento" />
                <StatCard title="Taxa de Cliques em Botões" value={`${mockAnalyticsData.buttonClickRate}%`} description="Média geral de engajamento" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-surface p-6 rounded-lg border border-dark-border shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Engajamento por Hora</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockAnalyticsData.engagementByHour}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="hour" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Line type="monotone" dataKey="interactions" name="Interações" stroke="#2563EB" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-dark-surface p-6 rounded-lg border border-dark-border shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Botões Mais Populares</h2>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={mockAnalyticsData.popularButtons} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" stroke="#9CA3AF" />
                            <YAxis type="category" dataKey="name" width={120} stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} cursor={{ fill: 'rgba(30, 64, 175, 0.2)' }}/>
                            <Legend />
                            <Bar dataKey="clicks" name="Cliques" fill="#2563EB" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
