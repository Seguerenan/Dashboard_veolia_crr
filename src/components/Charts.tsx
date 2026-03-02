import { useMemo } from "react";
import type { OrdemServico } from "@/lib/types";
import { TIPO_SERVICO_LABELS, STATUS_LABELS, STATUS_COLORS, TIPO_SERVICO_COLORS } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

interface ChartsProps {
  data: OrdemServico[];
}

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  color: "#1f2937",
  fontSize: "13px",
};

export function ChartBarTipoServico({ data }: ChartsProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      const label = TIPO_SERVICO_LABELS[d.tipoServico] || d.tipoServico;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const colors = Object.values(TIPO_SERVICO_COLORS);

  return (
    <div className="chart-container">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Ordens por Tipo de Serviço
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 22%)" />
          <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartPieStatus({ data }: ChartsProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      const label = STATUS_LABELS[d.status] || d.status;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const colors = Object.values(STATUS_COLORS);

  return (
    <div className="chart-container">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Ordens por Status
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "hsl(215, 15%, 55%)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartLineByMonth({ data }: ChartsProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      if (d.inicioPrevisto) {
        const month = d.inicioPrevisto.substring(0, 7); // YYYY-MM
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({
        name: month.split("-").reverse().join("/"),
        value,
      }));
  }, [data]);

  return (
    <div className="chart-container">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Ordens por Mês (Início Previsto)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 22%)" />
          <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke="hsl(45, 100%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(45, 100%, 55%)", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RankingAtivos({ data }: ChartsProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      if (d.ativo) counts[d.ativo] = (counts[d.ativo] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="chart-container">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Top 10 Ativos com Mais Ordens
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 22%)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="hsl(199, 80%, 50%)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
