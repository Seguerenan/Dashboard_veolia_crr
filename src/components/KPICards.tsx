import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { OrdemServico } from "@/lib/types";
import { STATUS_LABELS, TIPO_SERVICO_LABELS } from "@/lib/types";

interface KPICardsProps {
  data: OrdemServico[];
}

export function KPICards({ data }: KPICardsProps) {
  const total = data.length;
  const byStatus = {
    APPR: data.filter((d) => d.status === "APPR").length,
    COMP: data.filter((d) => d.status === "COMP").length,
    INPRG: data.filter((d) => d.status === "INPRG").length,
  };

  const cards = [
    {
      label: "Total de Ordens",
      value: total,
      icon: ClipboardList,
      color: "text-primary",
      borderColor: "border-l-primary",
    },
    {
      label: STATUS_LABELS.APPR,
      value: byStatus.APPR,
      icon: AlertCircle,
      color: "text-primary",
      borderColor: "border-l-primary",
    },
    {
      label: STATUS_LABELS.INPRG,
      value: byStatus.INPRG,
      icon: Clock,
      color: "text-accent",
      borderColor: "border-l-accent",
    },
    {
      label: STATUS_LABELS.COMP,
      value: byStatus.COMP,
      icon: CheckCircle2,
      color: "text-kpi-green",
      borderColor: "border-l-kpi-green",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`kpi-card border-l-4 ${card.borderColor} animate-fade-in`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              {card.label}
            </span>
            <card.icon className={`h-5 w-5 ${card.color} opacity-80`} />
          </div>
          <p className={`text-3xl font-bold ${card.color} animate-count-up`}>
            {card.value.toLocaleString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
}
