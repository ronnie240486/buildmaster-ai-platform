import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Settings, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ProjectDetail() {
  const [, setLocation] = useLocation();

  // Mock data - será substituído por dados reais da API
  const project = {
    id: 1,
    name: "Meu App Android",
    description: "Um aplicativo Android de exemplo",
    projectType: "android",
    status: "active",
    gitUrl: "https://github.com/usuario/meu-app",
    createdAt: new Date("2026-08-01"),
    lastBuild: {
      id: 1,
      buildNumber: 5,
      status: "success",
      duration: 245,
      completedAt: new Date(),
    },
  };

  const builds = [
    {
      id: 5,
      buildNumber: 5,
      status: "success",
      buildType: "release",
      outputType: "apk",
      duration: 245,
      completedAt: new Date(),
    },
    {
      id: 4,
      buildNumber: 4,
      status: "failed",
      buildType: "debug",
      outputType: "apk",
      duration: 120,
      completedAt: new Date(Date.now() - 86400000),
      errorMessage: "Erro de compilação: Symbol not found",
    },
    {
      id: 3,
      buildNumber: 3,
      status: "success",
      buildType: "debug",
      outputType: "apk",
      duration: 180,
      completedAt: new Date(Date.now() - 172800000),
    },
  ];

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
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
              onClick={() => setLocation("/dashboard")}
              className="text-slate-600 dark:text-slate-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{project.gitUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2"
            >
              <Play className="w-4 h-4" />
              Novo Build
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {project.projectType}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Builds Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{builds.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Taxa de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.round((builds.filter(b => b.status === "success").length / builds.length) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Último Build
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(project.lastBuild.status)}>
                {project.lastBuild.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="builds" className="w-full">
          <TabsList className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <TabsTrigger value="builds">Histórico de Builds</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="builds" className="space-y-4">
            {builds.map((build) => (
              <Card
                key={build.id}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(build.status)}
                        <Badge className={getStatusColor(build.status)}>
                          {build.status}
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          Build #{build.buildNumber}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {build.buildType} • {build.outputType?.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {build.duration}s
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {build.completedAt.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {build.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-800 dark:text-red-400">
                        <strong>Erro:</strong> {build.errorMessage}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Configurações do Projeto</CardTitle>
                <CardDescription>
                  Gerencie as configurações do seu projeto
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    URL do Repositório
                  </label>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">{project.gitUrl}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tipo de Projeto
                  </label>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">{project.projectType}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="destructive"
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar Projeto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Logs do Último Build</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="bg-slate-900 dark:bg-slate-950 rounded p-4 font-mono text-sm text-slate-100 overflow-x-auto max-h-96 overflow-y-auto">
                  <pre>{`[INFO] Iniciando build...
[INFO] Detectando tipo de projeto: Android
[INFO] Instalando dependências...
[INFO] Compilando código...
[INFO] Gerando APK...
[SUCCESS] Build concluído em 245 segundos!`}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
