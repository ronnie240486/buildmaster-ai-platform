import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Github, Upload, Copy } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type ProjectSourceType = "github" | "zip" | "clone";

export default function NewProject() {
  const [, setLocation] = useLocation();
  const [sourceType, setSourceType] = useState<ProjectSourceType>("github");
  const [projectType, setProjectType] = useState("android");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gitUrl: "",
    gitToken: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      alert("Por favor, insira um nome para o projeto");
      return;
    }

    // TODO: Implementar chamada à API para criar projeto
    console.log("Criando projeto:", {
      ...formData,
      sourceType,
      projectType,
    });

    alert("Projeto criado com sucesso! (em desenvolvimento)");
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            className="text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Novo Projeto</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Source Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Fonte do Projeto
            </h2>

            <div className="space-y-3">
              <Card
                className={`cursor-pointer transition-all ${
                  sourceType === "github"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
                onClick={() => setSourceType("github")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">GitHub</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Conectar repositório</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  sourceType === "zip"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
                onClick={() => setSourceType("zip")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Upload ZIP</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Enviar arquivo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  sourceType === "clone"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
                onClick={() => setSourceType("clone")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Clonar URL</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Via Git URL</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
                <CardDescription>
                  Preencha as informações do seu projeto
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Project Name */}
                <div>
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                    Nome do Projeto *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Meu App Android"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva seu projeto..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 resize-none"
                    rows={4}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <Label htmlFor="projectType" className="text-slate-700 dark:text-slate-300">
                    Tipo de Projeto *
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="mt-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="android">Android (Java/Kotlin)</SelectItem>
                      <SelectItem value="flutter">Flutter (Dart)</SelectItem>
                      <SelectItem value="react-native">React Native (JavaScript/TypeScript)</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Git URL (for GitHub or Clone) */}
                {(sourceType === "github" || sourceType === "clone") && (
                  <div>
                    <Label htmlFor="gitUrl" className="text-slate-700 dark:text-slate-300">
                      URL do Repositório *
                    </Label>
                    <Input
                      id="gitUrl"
                      name="gitUrl"
                      placeholder="https://github.com/usuario/repo"
                      value={formData.gitUrl}
                      onChange={handleInputChange}
                      className="mt-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}

                {/* GitHub Token */}
                {sourceType === "github" && (
                  <div>
                    <Label htmlFor="gitToken" className="text-slate-700 dark:text-slate-300">
                      Token do GitHub (opcional)
                    </Label>
                    <Input
                      id="gitToken"
                      name="gitToken"
                      type="password"
                      placeholder="ghp_..."
                      value={formData.gitToken}
                      onChange={handleInputChange}
                      className="mt-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      Use um token para repositórios privados
                    </p>
                  </div>
                )}

                {/* ZIP Upload */}
                {sourceType === "zip" && (
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300">
                      Arquivo ZIP *
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Clique ou arraste um arquivo ZIP aqui
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    className="flex-1 border-slate-200 dark:border-slate-600"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Criar Projeto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
