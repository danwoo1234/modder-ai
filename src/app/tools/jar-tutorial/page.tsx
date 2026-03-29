"use client";

import AdBanner from "@/components/AdBanner";

export default function JarTutorial() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📖</span>
              <div>
                <h1 className="text-2xl font-black">JAR Tutorial</h1>
                <p className="text-sm text-foreground/50">Complete guide to building & exporting JAR files</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">FREE</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Auto-JAR info */}
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                <h2 className="text-lg font-bold mb-2">⚡ Auto-JAR Building</h2>
                <p className="text-sm text-foreground/70">
                  With Modder AI, JAR files are <strong>automatically built</strong> when you generate a mod. No manual setup needed!
                  Just click {`"Download JAR"`} after generating your mod.
                </p>
              </div>

              {/* Steps */}
              {[
                {
                  step: 1,
                  title: "Understanding JAR Files",
                  content: "A JAR (Java ARchive) file is a package file format that bundles Java class files, metadata, and resources into a single file. Minecraft plugins and mods are distributed as JAR files.",
                  code: null,
                },
                {
                  step: 2,
                  title: "Prerequisites",
                  content: "To manually build JARs, you need Java Development Kit (JDK) 17+ installed, and optionally Gradle or Maven as a build tool.",
                  code: `# Check Java version
java -version

# Install JDK on macOS
brew install openjdk@17

# Install JDK on Windows (using winget)
winget install Oracle.JDK.17

# Install JDK on Linux
sudo apt install openjdk-17-jdk`,
                },
                {
                  step: 3,
                  title: "Project Structure (Spigot/Paper)",
                  content: "Your plugin project should follow this structure:",
                  code: `MyPlugin/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/myplugin/
│       │       └── MyPlugin.java
│       └── resources/
│           └── plugin.yml
├── build.gradle
└── settings.gradle`,
                },
                {
                  step: 4,
                  title: "build.gradle Setup",
                  content: "Configure Gradle to build your plugin:",
                  code: `plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

repositories {
    mavenCentral()
    maven { url = 'https://repo.papermc.io/repository/maven-public/' }
}

dependencies {
    compileOnly 'io.papermc.paper:paper-api:1.21-R0.1-SNAPSHOT'
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}`,
                },
                {
                  step: 5,
                  title: "Build the JAR",
                  content: "Run the Gradle build command to create your JAR file:",
                  code: `# Build the JAR
./gradlew build

# Your JAR will be at:
# build/libs/MyPlugin-1.0.0.jar

# Copy to server
cp build/libs/MyPlugin-1.0.0.jar /path/to/server/plugins/`,
                },
                {
                  step: 6,
                  title: "Fabric Mod Setup",
                  content: "For Fabric mods, use the Fabric template generator or set up manually:",
                  code: `# Clone Fabric template
git clone https://github.com/FabricMC/fabric-example-mod

# Build Fabric mod
./gradlew build

# JAR at: build/libs/modid-1.0.0.jar
# Copy to: .minecraft/mods/`,
                },
                {
                  step: 7,
                  title: "Forge Mod Setup",
                  content: "For Forge mods, use the MDK (Mod Development Kit):",
                  code: `# Download Forge MDK from files.minecraftforge.net
# Extract and set up workspace

./gradlew genEclipseRuns  # For Eclipse
./gradlew genIntellijRuns  # For IntelliJ

# Build
./gradlew build

# JAR at: build/libs/`,
                },
              ].map((s) => (
                <div key={s.step} className="rounded-xl bg-surface border border-border p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-sm font-bold">
                      {s.step}
                    </span>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                  </div>
                  <p className="text-sm text-foreground/70 mb-3">{s.content}</p>
                  {s.code && (
                    <div className="code-editor rounded-lg overflow-hidden">
                      <pre className="p-4 text-sm text-foreground/80 leading-relaxed overflow-x-auto">
                        <code>{s.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}

              {/* CTA */}
              <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Skip All This With Auto-JAR! ⚡</h3>
                <p className="text-sm text-foreground/50 mb-4">
                  Modder AI automatically compiles and builds JAR files for you. Just describe your mod and download the ready-to-use JAR.
                </p>
                <a href="/tools/ai-generator" className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:opacity-90 transition-opacity">
                  Open AI Generator ⚡
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-64 space-y-4">
            <AdBanner slot="tutorial-sidebar" />
            <div className="rounded-xl bg-surface border border-border p-4">
              <h3 className="font-bold text-sm mb-3">Quick Links</h3>
              <ul className="space-y-2 text-xs text-foreground/50">
                <li><a href="#" className="hover:text-foreground transition-colors">📥 Download JDK 17</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">📦 Gradle Setup Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">📄 Paper API Docs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">🧵 Fabric Wiki</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">🔨 Forge Docs</a></li>
              </ul>
            </div>

            <div className="rounded-xl bg-surface border border-border p-4">
              <h3 className="font-bold text-sm mb-3">Platform Guides</h3>
              <ul className="space-y-1.5 text-xs text-foreground/50">
                <li>📄 Paper / Spigot plugins</li>
                <li>🧵 Fabric mods</li>
                <li>🔨 Forge mods</li>
                <li>📦 NeoForge mods</li>
                <li>🪶 Quilt mods</li>
                <li>📋 Datapacks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
