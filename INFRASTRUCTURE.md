# BuildMaster AI - Guia de Infraestrutura e Toolchain de Build

O **BuildMaster AI** foi desenvolvido para centralizar o gerenciamento e a compilação de aplicativos móveis (Android, Flutter e React Native). Como ferramentas como o Android SDK, Gradle, JDK e Flutter exigem ambiente nativo de sistema operacional, este documento descreve os requisitos para configurar o servidor de build dedicado.

## 1. Arquitetura do Sistema

- **Painel Web (Frontend & API)**: Executado em Node.js / Express / React. Pode ser acessado de qualquer dispositivo (computador, tablet ou celular) via navegador.
- **Engine de Build (Servidor Nativo)**: Executa os comandos de compilação em um ambiente Linux (ou macOS/Windows) com o toolchain móvel instalado.

## 2. Pré-requisitos do Servidor de Build

Para gerar APKs e AABs reais, o servidor host deve possuir as seguintes ferramentas instaladas e configuradas no `PATH`:

1. **Java Development Kit (JDK 17 ou 21)**
   ```bash
   sudo apt update
   sudo apt install -y openjdk-17-jdk
   ```

2. **Android SDK & Command-line Tools**
   - Definir a variável de ambiente `ANDROID_HOME`:
   ```bash
   export ANDROID_HOME=/opt/android-sdk
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
   ```

3. **Gradle**
   ```bash
   sudo apt install -y gradle
   ```

4. **Flutter SDK (para projetos Flutter)**
   ```bash
   git clone https://github.com/flutter/flutter.git -b stable /opt/flutter
   export PATH="$PATH:/opt/flutter/bin"
   flutter doctor
   ```

5. **Node.js & React Native CLI (para projetos React Native)**
   ```bash
   npm install -g react-native-cli
   ```

## 3. Uso pelo Celular

Através do celular, você pode:
- Fazer login na plataforma.
- Criar e importar projetos do GitHub ou via URL.
- Iniciar o processo de build.
- Acompanhar os logs de compilação em tempo real.
- Baixar o APK gerado diretamente no armazenamento do celular.
