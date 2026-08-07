import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Zap, Code2, Cpu, Rocket } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h1 className="text-2xl font-bold text-white">BuildMaster AI</h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Construa, Compile e Distribua
              </h2>
              <p className="text-xl text-slate-400">
                Plataforma inteligente para gerenciar e compilar seus projetos Android, Flutter e React Native
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Builds Automáticos</h3>
                  <p className="text-slate-400">
                    Compile seus projetos com um clique. Suporte para Android, Flutter e React Native
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">IA Integrada</h3>
                  <p className="text-slate-400">
                    Detecta erros de compilação e sugere correções automaticamente
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Gerenciamento de Projetos</h3>
                  <p className="text-slate-400">
                    Importe do GitHub, upload de ZIP ou clone repositórios facilmente
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Distribuição Simplificada</h3>
                  <p className="text-slate-400">
                    Assine APKs, gere AKBs e distribua seus aplicativos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Bem-vindo</CardTitle>
                <CardDescription>
                  Faça login para começar a gerenciar seus projetos
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Use sua conta Manus para fazer login
                  </p>
                  <Button
                    onClick={startLogin}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
                  >
                    Fazer Login com Manus
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Seguro e confiável
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>BuildMaster AI © 2026. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
