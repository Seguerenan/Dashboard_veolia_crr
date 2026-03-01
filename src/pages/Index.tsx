import { useState, useEffect } from "react";
import { BarChart3, Filter } from "lucide-react";
import { loadData } from "@/lib/data-store";
import { KPICards } from "@/components/KPICards";
import { TipoServicoKPIs } from "@/components/TipoServicoKPIs";
import { ChartBarTipoServico, ChartPieStatus, ChartLineByMonth, RankingAtivos } from "@/components/Charts";
import { FilterBar, applyFilters, emptyFilters, type Filters } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { OrdemServico } from "@/lib/types";

const Index = () => {
  const [allData, setAllData] = useState<OrdemServico[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setAllData(loadData());
  }, []);

  const filteredData = applyFilters(allData, filters);

  if (allData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <BarChart3 className="h-16 w-16 text-primary opacity-60" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard de Ordens de Serviço</h1>
          <p className="text-muted-foreground mb-6">
            Nenhum dado disponível. Faça upload de um arquivo CSV para começar.
          </p>
          <Button onClick={() => navigate("/admin")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Importar Dados
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="dashboard-header px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Dashboard — Ordens de Serviço</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-muted-foreground hover:text-foreground"
          >
            Admin
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-[1440px] mx-auto">
        {/* Filters */}
        {showFilters && (
          <FilterBar filters={filters} onChange={setFilters} data={allData} />
        )}

        {/* KPIs */}
        <KPICards data={filteredData} />
        <TipoServicoKPIs data={filteredData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartBarTipoServico data={filteredData} />
          <ChartPieStatus data={filteredData} />
          <ChartLineByMonth data={filteredData} />
          <RankingAtivos data={filteredData} />
        </div>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground text-center pt-4">
          Exibindo {filteredData.length.toLocaleString("pt-BR")} de {allData.length.toLocaleString("pt-BR")} ordens de serviço
        </p>
      </main>
    </div>
  );
};

export default Index;
