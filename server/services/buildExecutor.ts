import { spawn, exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { detectProjectStack, type ProjectStack } from "./stackDetector";

export interface BuildOptions {
  projectPath: string;
  buildType: "debug" | "release";
  outputType?: "apk" | "aab" | "exe" | "ipa";
  onLog?: (log: string) => void;
  onError?: (error: string) => void;
}

export interface BuildResult {
  success: boolean;
  artifactPath?: string;
  logs: string[];
  errors: string[];
  duration: number;
}

/**
 * Executa o build de um projeto
 */
export async function executeBuild(options: BuildOptions): Promise<BuildResult> {
  const startTime = Date.now();
  const logs: string[] = [];
  const errors: string[] = [];

  const addLog = (log: string) => {
    logs.push(log);
    options.onLog?.(log);
  };

  const addError = (error: string) => {
    errors.push(error);
    options.onError?.(error);
  };

  try {
    // Detectar o stack do projeto
    addLog("[INFO] Detectando stack do projeto...");
    const stackResult = await detectProjectStack(options.projectPath);
    addLog(`[INFO] Stack detectado: ${stackResult.stack}`);

    if (stackResult.stack === "unknown") {
      addError("Não foi possível detectar o tipo de projeto");
      return {
        success: false,
        logs,
        errors,
        duration: Date.now() - startTime,
      };
    }

    // Executar build baseado no stack
    let artifactPath: string | undefined;

    switch (stackResult.stack) {
      case "android":
        artifactPath = await buildAndroid(options, addLog, addError);
        break;
      case "flutter":
        artifactPath = await buildFlutter(options, addLog, addError);
        break;
      case "react-native":
        artifactPath = await buildReactNative(options, addLog, addError);
        break;
    }

    const duration = Date.now() - startTime;

    return {
      success: !!artifactPath,
      artifactPath,
      logs,
      errors,
      duration,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    addError(errorMessage);

    return {
      success: false,
      logs,
      errors,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Build para Android (Gradle)
 */
async function buildAndroid(
  options: BuildOptions,
  addLog: (log: string) => void,
  addError: (error: string) => void
): Promise<string | undefined> {
  return new Promise((resolve) => {
    try {
      addLog("[INFO] Iniciando build Android com Gradle...");

      const buildType = options.buildType === "release" ? "Release" : "Debug";
      const taskName = `assemble${buildType}`;

      const process = spawn("gradle", [taskName], {
        cwd: options.projectPath,
        stdio: ["pipe", "pipe", "pipe"],
      });

      process.stdout?.on("data", (data) => {
        addLog(data.toString().trim());
      });

      process.stderr?.on("data", (data) => {
        addError(data.toString().trim());
      });

      process.on("close", (code) => {
        if (code === 0) {
          addLog("[SUCCESS] Build Android concluído com sucesso!");

          // Procurar pelo APK gerado
          const buildDir = path.join(options.projectPath, "app", "build", "outputs", "apk", options.buildType);
          if (fs.existsSync(buildDir)) {
            const apkFiles = fs.readdirSync(buildDir).filter((f) => f.endsWith(".apk"));
            if (apkFiles.length > 0) {
              const artifactPath = path.join(buildDir, apkFiles[0]);
              addLog(`[INFO] APK gerado: ${artifactPath}`);
              resolve(artifactPath);
              return;
            }
          }

          // Se não encontrar, procurar em locais alternativos
          const altBuildDir = path.join(options.projectPath, "build", "outputs", "apk");
          if (fs.existsSync(altBuildDir)) {
            const apkFiles = fs.readdirSync(altBuildDir, { recursive: true }).filter((f) => String(f).endsWith(".apk"));
            if (apkFiles.length > 0) {
              const artifactPath = path.join(altBuildDir, String(apkFiles[0]));
              addLog(`[INFO] APK gerado: ${artifactPath}`);
              resolve(artifactPath);
              return;
            }
          }

          addError("APK não foi encontrado após o build");
          resolve(undefined);
        } else {
          addError(`Build falhou com código: ${code}`);
          resolve(undefined);
        }
      });
    } catch (error) {
      addError(error instanceof Error ? error.message : String(error));
      resolve(undefined);
    }
  });
}

/**
 * Build para Flutter
 */
async function buildFlutter(
  options: BuildOptions,
  addLog: (log: string) => void,
  addError: (error: string) => void
): Promise<string | undefined> {
  return new Promise((resolve) => {
    try {
      addLog("[INFO] Iniciando build Flutter...");

      const buildType = options.buildType === "release" ? "release" : "debug";
      const args = ["build", "apk", "--${buildType}"];

      const process = spawn("flutter", args, {
        cwd: options.projectPath,
        stdio: ["pipe", "pipe", "pipe"],
      });

      process.stdout?.on("data", (data) => {
        addLog(data.toString().trim());
      });

      process.stderr?.on("data", (data) => {
        addError(data.toString().trim());
      });

      process.on("close", (code) => {
        if (code === 0) {
          addLog("[SUCCESS] Build Flutter concluído com sucesso!");

          // Procurar pelo APK gerado
          const apkPath = path.join(options.projectPath, "build", "app", "outputs", "flutter-apk", `app-${buildType}.apk`);
          if (fs.existsSync(apkPath)) {
            addLog(`[INFO] APK gerado: ${apkPath}`);
            resolve(apkPath);
          } else {
            addError("APK não foi encontrado após o build");
            resolve(undefined);
          }
        } else {
          addError(`Build falhou com código: ${code}`);
          resolve(undefined);
        }
      });
    } catch (error) {
      addError(error instanceof Error ? error.message : String(error));
      resolve(undefined);
    }
  });
}

/**
 * Build para React Native
 */
async function buildReactNative(
  options: BuildOptions,
  addLog: (log: string) => void,
  addError: (error: string) => void
): Promise<string | undefined> {
  return new Promise((resolve) => {
    try {
      addLog("[INFO] Iniciando build React Native...");

      const buildType = options.buildType === "release" ? "release" : "debug";
      const cmd = `cd ${options.projectPath} && npx react-native run-android --variant=${buildType}`;

      const process = exec(cmd, (error, stdout, stderr) => {
        if (error) {
          addError(`Build falhou: ${error.message}`);
          resolve(undefined);
          return;
        }

        if (stdout) addLog(stdout);
        if (stderr) addError(stderr);

        addLog("[SUCCESS] Build React Native concluído com sucesso!");

        // Procurar pelo APK gerado
        const apkDir = path.join(options.projectPath, "android", "app", "build", "outputs", "apk", buildType);
        if (fs.existsSync(apkDir)) {
          const apkFiles = fs.readdirSync(apkDir).filter((f) => f.endsWith(".apk"));
          if (apkFiles.length > 0) {
            const artifactPath = path.join(apkDir, apkFiles[0]);
            addLog(`[INFO] APK gerado: ${artifactPath}`);
            resolve(artifactPath);
            return;
          }
        }

        addError("APK não foi encontrado após o build");
        resolve(undefined);
      });

      process.stdout?.on("data", (data) => {
        addLog(data.toString().trim());
      });

      process.stderr?.on("data", (data) => {
        addError(data.toString().trim());
      });
    } catch (error) {
      addError(error instanceof Error ? error.message : String(error));
      resolve(undefined);
    }
  });
}

/**
 * Calcula o tamanho do arquivo em MB
 */
export function getFileSizeMB(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
  } catch {
    return 0;
  }
}
