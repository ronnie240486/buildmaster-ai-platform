import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Download, Copy, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

export default function BuildPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/projects/:projectId/build/:buildId");
  
  const [buildStatus, setBuildStatus] = useState<"pending" | "running" | "success" | "failed">("pending");
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [artifactPath, setArtifactPath] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const projectId = params?.projectId;
  const buildId = params?.buildId;

  useEffect(() => {
    // Simular execução de build
    if (buildStatus === "pending") {
      setIsRunning(true);
      setBuildStatus("running");
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Simular logs
      const logMessages = [
        "[INFO] Detectando stack do projeto...",
        "[INFO] Stack detectado: android",
        "[INFO] Iniciando build Android com Gradle...",
        "[INFO] Compilando código...",
        "[INFO] Processando recursos...",
        "[INFO] Gerando DEX...",
        "[INFO] Empacotando APK...",
        "[SUCCESS] Build Android concluído com sucesso!",
        "[INFO] APK gerado: /home/project/app/build/outputs/apk/debug/app-debug.apk",
      ];

      let logIndex = 0;
      const logInterval = setInterval(() => {
        if (logIndex < logMessages.length) {
          setLogs((prev) => [...prev, logMessages[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logInterval);
          clearInterval(interval);
          setBuildStatus("success");
          setIsRunning(false);
          setArtifactPath("app-debug.apk");
        }
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [buildStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "failed":
        return <AlertCircle className="w-5 h-5" />;
      case "running":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation(`/projects/${projectId}`)}
              className="text-slate-600 dark:text-slate-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Build #{buildId}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Projeto #{projectId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(buildStatus)}>
              {getStatusIcon(buildStatus)}
              <span className="ml-2">{buildStatus}</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Build Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(buildStatus)}
                <span className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                  {buildStatus}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Duração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Artefato
              </CardTitle>
            </CardHeader>
            <CardContent>
              {artifactPath ? (
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {artifactPath}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-500">Aguardando...</span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Logs Section */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-8">
          <CardHeader>
            <CardTitle>Logs do Build</CardTitle>
            <CardDescription>Saída em tempo real do processo de compilação</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="bg-slate-900 dark:bg-slate-950 rounded p-4 font-mono text-sm text-slate-100 overflow-x-auto max-h-96 overflow-y-auto border border-slate-700">
              {logs.length === 0 ? (
                <div className="text-slate-500">Aguardando logs...</div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-slate-300">
                      {log}
                    </div>
                  ))}
                  {errors.map((error, index) => (
                    <div key={`error-${index}`} className="text-red-400">
                      {error}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="text-blue-400 animate-pulse">
                      ▌ Executando...
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          {buildStatus === "success" && artifactPath && (
            <>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2">
                <Download className="w-4 h-4" />
                Baixar APK
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="w-4 h-4" />
                Copiar Caminho
              </Button>
            </>
          )}

          {buildStatus === "failed" && (
            <Button
              onClick={() => {
                setLogs([]);
                setErrors([]);
                setBuildStatus("pending");
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2"
            >
              <Play className="w-4 h-4" />
              Tentar Novamente
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setLocation(`/projects/${projectId}`)}
          >
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}
