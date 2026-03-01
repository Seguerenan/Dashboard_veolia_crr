import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { parseCSV } from "@/lib/csv-parser";
import { saveData } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import type { OrdemServico } from "@/lib/types";

interface CsvUploadProps {
  onUploaded: (data: OrdemServico[]) => void;
}

export function CsvUpload({ onUploaded }: CsvUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setMessage("Apenas arquivos CSV são aceitos.");
      return;
    }
    setStatus("loading");
    setMessage("Processando arquivo...");
    try {
      const data = await parseCSV(file);
      if (data.length === 0) {
        setStatus("error");
        setMessage("Nenhum registro válido encontrado no arquivo.");
        return;
      }
      saveData(data);
      setCount(data.length);
      setStatus("success");
      setMessage(`${data.length} ordens de serviço importadas com sucesso.`);
      onUploaded(data);
    } catch (e) {
      setStatus("error");
      setMessage("Erro ao processar o arquivo CSV.");
    }
  }, [onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="max-w-xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/40"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-foreground font-medium mb-1">Arraste o arquivo CSV aqui</p>
        <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar</p>
        <label>
          <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          <Button variant="outline" asChild>
            <span className="cursor-pointer">
              <FileText className="h-4 w-4 mr-2" />
              Selecionar Arquivo
            </span>
          </Button>
        </label>
      </div>

      {status !== "idle" && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            status === "success"
              ? "bg-kpi-green/10 text-kpi-green border border-kpi-green/20"
              : status === "error"
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-accent/10 text-accent border border-accent/20"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : status === "error" ? (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          ) : null}
          <span className="text-sm">{message}</span>
        </div>
      )}
    </div>
  );
}
