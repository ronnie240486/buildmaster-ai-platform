import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export type ProjectStack = "android" | "flutter" | "react-native" | "unknown";

export interface StackDetectionResult {
  stack: ProjectStack;
  buildFile: string | null;
  hasGradle: boolean;
  hasPubspec: boolean;
  hasPackageJson: boolean;
  hasAndroidManifest: boolean;
}

/**
 * Detecta o tipo de stack de um projeto analisando arquivos de configuração
 */
export async function detectProjectStack(projectPath: string): Promise<StackDetectionResult> {
  const result: StackDetectionResult = {
    stack: "unknown",
    buildFile: null,
    hasGradle: false,
    hasPubspec: false,
    hasPackageJson: false,
    hasAndroidManifest: false,
  };

  try {
    // Verificar por build.gradle (Android)
    const buildGradlePath = path.join(projectPath, "build.gradle");
    const buildGradleKtsPath = path.join(projectPath, "build.gradle.kts");
    
    if (fs.existsSync(buildGradlePath)) {
      result.hasGradle = true;
      result.buildFile = buildGradlePath;
    } else if (fs.existsSync(buildGradleKtsPath)) {
      result.hasGradle = true;
      result.buildFile = buildGradleKtsPath;
    }

    // Verificar por pubspec.yaml (Flutter)
    const pubspecPath = path.join(projectPath, "pubspec.yaml");
    if (fs.existsSync(pubspecPath)) {
      result.hasPubspec = true;
      result.buildFile = pubspecPath;
    }

    // Verificar por package.json (React Native)
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      result.hasPackageJson = true;
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      
      if (packageJson.dependencies?.["react-native"] || packageJson.devDependencies?.["react-native"]) {
        result.buildFile = packageJsonPath;
      }
    }

    // Verificar por AndroidManifest.xml
    const manifestPath = path.join(projectPath, "android", "app", "src", "main", "AndroidManifest.xml");
    if (fs.existsSync(manifestPath)) {
      result.hasAndroidManifest = true;
    }

    // Determinar o stack
    if (result.hasPubspec) {
      result.stack = "flutter";
    } else if (result.hasGradle && result.hasAndroidManifest) {
      result.stack = "android";
    } else if (result.hasPackageJson && result.hasGradle) {
      result.stack = "react-native";
    } else if (result.hasGradle) {
      result.stack = "android";
    } else if (result.hasPackageJson) {
      result.stack = "react-native";
    }

    return result;
  } catch (error) {
    console.error("[StackDetector] Error detecting stack:", error);
    return result;
  }
}

/**
 * Verifica se as dependências necessárias estão instaladas
 */
export async function checkDependencies(): Promise<{
  hasGit: boolean;
  hasJava: boolean;
  hasGradle: boolean;
  hasFlutter: boolean;
  hasAndroidSdk: boolean;
  hasNodeJs: boolean;
}> {
  const result = {
    hasGit: false,
    hasJava: false,
    hasGradle: false,
    hasFlutter: false,
    hasAndroidSdk: false,
    hasNodeJs: false,
  };

  try {
    // Check Git
    try {
      execSync("git --version", { stdio: "ignore" });
      result.hasGit = true;
    } catch {}

    // Check Java
    try {
      execSync("java -version", { stdio: "ignore" });
      result.hasJava = true;
    } catch {}

    // Check Gradle
    try {
      execSync("gradle --version", { stdio: "ignore" });
      result.hasGradle = true;
    } catch {}

    // Check Flutter
    try {
      execSync("flutter --version", { stdio: "ignore" });
      result.hasFlutter = true;
    } catch {}

    // Check Android SDK
    try {
      const androidHome = process.env.ANDROID_HOME;
      if (androidHome && fs.existsSync(androidHome)) {
        result.hasAndroidSdk = true;
      }
    } catch {}

    // Check Node.js
    try {
      execSync("node --version", { stdio: "ignore" });
      result.hasNodeJs = true;
    } catch {}

    return result;
  } catch (error) {
    console.error("[DependencyChecker] Error checking dependencies:", error);
    return result;
  }
}

/**
 * Obtém a versão de uma ferramenta
 */
export async function getToolVersion(tool: string): Promise<string | null> {
  try {
    const version = execSync(`${tool} --version`, { encoding: "utf-8" });
    return version.trim();
  } catch {
    return null;
  }
}
