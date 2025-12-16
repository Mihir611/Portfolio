<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const username = "mihir";
  let currentDir = "~";
  let input = "";
  let showCursor = true;
  const prompt = () => `${username}@portfolio:${currentDir}$ `;
  const history = writable<{ type: "command" | "output"; text: string }[]>([]);
  let commandHistory: string[] = [];
  let historyIndex = 0;
  let inputRef: HTMLInputElement;

  // Audio
  let sounds: Record<string, HTMLAudioElement> = {};
  let volume = 0.3;
  let soundEnabled = true;
  let crtEnabled = false;

  function play(name: string) {
    if (!soundEnabled || !sounds[name]) return;
    const s = sounds[name];
    s.volume = volume;
    s.currentTime = 0;
    s.play().catch(() => {});
  }

  // Filesystem
  const fs: any = {
    "~": {
      children: {
        "resume.txt": {
          type: "file",
          content:
            "Mihir Gurudas Udupa\nFull-Stack Developer\nSvelte • React • Node • Web3",
        },
        "contact.txt": {
          type: "file",
          content: "Email: mihir17.udupa@gmail.com",
        },
        projects: { type: "dir" },
      },
    },
  };

  // Boot
  const bootMessages = [
    "Welcome to Mihir’s Portfolio Terminal",
    "Type `help` to begin",
  ];
  let progress = 0;
  let showLogo = true;

  async function boot() {
    play("boot");
    showLogo = true;
    progress = 0;
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      progress = i / steps;
      await new Promise((r) => setTimeout(r, 100));
    }
    showLogo = false;

    for (const line of bootMessages) {
      history.update((h) => [...h, { type: "output", text: line }]);
      play("info");
      await new Promise((r) => setTimeout(r, 500));
    }

    // Available commands immediately
    history.update((h) => [
      ...h,
      {
        type: "output",
        text: `
Available commands (type 'help' for detailed layout):

whoami       skills          resume
ls           cd <dir>        pwd
cat <file>   open linkedin   open github
volume       crt on/off      sudo
clear        exit            summarize
coverletter
        `.trim(),
      },
    ]);

    setTimeout(() => inputRef?.focus(), 100);
  }

  // summarize the resume
  async function summarizeResume() {
    try {
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfWorker/pdf.worker.mjs";

      const url = "/resume/Mihir_Udupa_Resume.pdf";
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(" ") + "\n";
      }

      // Helper to extract content by keywords
      const extractSection = (keywords: string[], maxChars = 200) => {
        for (const kw of keywords) {
          const idx = fullText.toLowerCase().indexOf(kw.toLowerCase());
          if (idx >= 0) {
            const snippet = fullText.slice(idx, idx + maxChars);
            return snippet.replace(/\n/g, " ").trim();
          }
        }
        return "";
      };

      const experience = extractSection(["experience", "work", "employment"]);
      const education = extractSection([
        "education",
        "degree",
        "university",
        "college",
      ]);
      const projects = extractSection(["projects", "project"]);
      const skills = extractSection(["skills", "technologies"]);
      const certifications = extractSection(["certifications", "certificate"]);
      const interests = extractSection(["interests", "hobbies"]);

      // Split into neat terminal lines (~12-15 lines)
      const summaryLines = [
        `📄 Resume Summary for Mihir Gurudas Udupa`,
        `----------------------------------------`,
        `👨‍💻 Experience: ${experience}`,
        `🎓 Education: ${education}`,
        `🛠 Skills: ${skills}`,
        `📁 Projects: ${projects}`,
        `📜 Certifications: ${certifications}`,
        `🌟 Interests: ${interests}`,
        `----------------------------------------`,
        `Tip: Type 'coverletter' to download a pre-filled cover letter.`,
        `Tip: Use 'ls', 'cat', 'whoami' to explore more info.`,
      ];

      // Update terminal
      for (const line of summaryLines) {
        history.update((h) => [...h, { type: "output", text: line }]);
        play("info");
        await new Promise((r) => setTimeout(r, 100)); // slight delay for animation effect
      }
    } catch (err) {
      console.error(err);
      history.update((h) => [
        ...h,
        { type: "output", text: "❌ Failed to read resume PDF." },
      ]);
      play("error");
    }
  }

  // Command handler
  function processCommand(cmd: string) {
    const lower = cmd.trim().toLowerCase();
    let output = "";

    history.update((h) => [...h, { type: "command", text: prompt() + cmd }]);
    play("enter");

    // ================= EASTER EGGS =================
    if (lower === "sudo rm -rf /") {
      output = "😱 Whoa! Nice try, but permission denied!";
      play("error");
    } else if (lower === "matrix") {
      output =
        Array(20)
          .fill(0)
          .map(() => Math.random().toString(2).padStart(8, "0"))
          .join("\n") + "\n🟢 Enjoy the Matrix!";
      play("info");
    } else if (lower === "reboot") {
      output = "You need superuser privileges to reboot. Try: sudo reboot";
      play("error");
    } else if (lower === "sudo reboot") {
      output = "Rebooting terminal... 🔄";
      history.update((h) => [...h, { type: "output", text: output }]);
      play("boot");

      // Clear terminal state
      history.set([]);
      currentDir = "~";
      input = "";
      commandHistory = [];
      historyIndex = 0;

      // Restart boot sequence after short delay
      setTimeout(() => boot(), 500);
      return; // Exit current command processing
    } else if (lower === "coffee") {
      output = `
       ( (
        ) )
     ........
     |      |]
     \\      /
      \`----'
☕ Here’s your coffee!
      `;
      play("info");
    } else if (lower === "party") {
      output = "🎉🎊🎈 Party time in the terminal! 🎉🎊🎈";
      play("info");
    } else if (lower.includes("secret")) {
      output = "🤫 You found the secret Easter egg!";
      play("info");
    } else if (lower === "rickroll") {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      output = "Never gonna give you up... 🎵";
      play("info");
    } else {
      // ================= NORMAL COMMANDS =================
      switch (true) {
        case lower === "help":
          output = `
Profile                                   Filesystem                             Web                     System
-----------------------------          -----------------------------            --------------------    -------------------
whoami                                   ls                                     open linkedin           sound on
skills                                   cd <dir>                               open github             sound off
resume                                   pwd                                                            volume <0–1>
summarize                                cat <file>                                                     crt on | off
coverletter                                                                                             sudo
                                                                                                        clear
                                                                                                        exit
                                                                                                        reboot
          `.trim();
          break;
        case lower === "whoami":
          output = output = `
Mihir Gurudas Udupa
Full-Stack Developer | Svelte • React • Node.js • Python • Web3
Location: Udupi, India
Email: mihir17.udupa@gmail.com
Portfolio: https://portfolio-gold-ten-77.vercel.app

Experience:
- Software Developer @ Blackwater Tech East (2025–Present)
- Svelte JS Developer @ Blackwater Tech East (2023–2024)
- Frontend Developer @ lotracx Pvt Ltd (2021–2023)
- Intern @ Hexagon Global IT Services (2021)

Education:
- PG Program in Cyber Security, Great Lakes University
- Master of Computer Applications, Manipal Institute of Technology
- Bachelor of Computer Applications, Mahatma Gandhi Memorial College

Key Skills:
Frontend: React, Svelte, Next.js, Tailwind CSS
Backend: Node.js, Express, Python
Mobile: React Native, .NET MAUI
Blockchain: Solidity, Web3, Hardhat
Other: Web Design, UI/UX
  `.trim();
          play("info");
          break;
        case lower === "skills":
          output = "Svelte, React, Node.js, Python, Blockchain, .NET MAUI";
          play("info");
          break;
        case lower === "ls":
          output = Object.keys(fs[currentDir].children).join("  ");
          play("fs");
          break;
        case lower.startsWith("cd"):
          const dir = lower.split(" ")[1];
          if (!dir || dir === "~") currentDir = "~";
          else if (fs[currentDir].children[dir]?.type === "dir")
            currentDir = dir;
          else {
            output = `cd: ${dir}: No such directory`;
            play("error");
          }
          break;
        case lower === "pwd":
          output = `/home/${username}`;
          break;
        case lower.startsWith("cat "):
          const file = lower.replace("cat ", "");
          const entry = fs[currentDir].children[file];
          if (entry?.type === "file") output = entry.content;
          else {
            output = `cat: ${file}: No such file`;
            play("error");
          }
          break;
        case lower === "open linkedin":
          window.open(
            "https://www.linkedin.com/in/mihir-udupa-9834a9167/",
            "_blank",
          );
          output = "Opening LinkedIn...";
          break;
        case lower === "open github":
          window.open("https://github.com/Mihir611", "_blank");
          output = "Opening GitHub...";
          break;
        case lower === "resume":
          const link = document.createElement("a");
          link.href = "/resume/Mihir_Udupa_Resume.pdf";
          link.download = "Mihir_Udupa_Resume.pdf";
          link.click();
          output = "Resume downloaded!";
          break;
        case lower === "summarize":
          summarizeResume();
          play("info");
          break;
        case lower === "coverletter":
          const coverlink = document.createElement("a");
          coverlink.href = "/resume/coverLetter.pdf";
          coverlink.download = "Mihir_Udupa_Cover_Letter.pdf";
          coverlink.click();
          break;
        case lower.startsWith("volume "):
          const v = parseFloat(lower.split(" ")[1]);
          if (!isNaN(v) && v >= 0 && v <= 1) {
            volume = v;
            output = `Volume set to ${v}`;
          } else {
            output = "Volume must be between 0 and 1";
            play("error");
          }
          break;
        case lower === "crt on":
          crtEnabled = true;
          sounds.crt?.play();
          output = "CRT ambient hum enabled";
          break;
        case lower === "crt off":
          crtEnabled = false;
          sounds.crt?.pause();
          output = "CRT ambient hum disabled";
          break;
        case lower === "sound off":
          soundEnabled = false;
          output = "🔇 Sound disabled";
          break;
        case lower === "sound on":
          soundEnabled = true;
          output = "🔊 Sound enabled";
          break;
        case lower === "sudo":
          output = "[sudo] password for mihir:";
          play("error");
          break;
        case lower.startsWith("sudo "):
          output = "Permission denied 😄";
          play("error");
          break;
        case lower === "clear":
          history.set([]);
          return;
        case lower === "exit":
          output = "Session terminated.";
          break;
        default:
          output = `Command not found: ${cmd}`;
          play("error");
      }
    }

    if (output) history.update((h) => [...h, { type: "output", text: output }]);
    input = "";
    historyIndex = commandHistory.length;

    const terminal = document.querySelector(".terminal") as HTMLElement;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key.length === 1) play("type");
    if (e.key === "Enter" && input.trim()) {
      commandHistory.push(input);
      processCommand(input);
    }
    if (e.key === "ArrowUp") {
      historyIndex = Math.max(0, historyIndex - 1);
      input = commandHistory[historyIndex] || "";
      e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input = commandHistory[historyIndex] || "";
      e.preventDefault();
    }
  }

  onMount(() => {
    sounds = {
      type: new Audio("/sounds/type.mp3"),
      enter: new Audio("/sounds/enter.mp3"),
      error: new Audio("/sounds/error.mp3"),
      boot: new Audio("/sounds/boot.mp3"),
      info: new Audio("/sounds/info.mp3"),
      fs: new Audio("/sounds/fs.mp3"),
      crt: new Audio("/sounds/crt.mp3"),
    };
    sounds.crt.loop = true;
    boot();
    const blink = setInterval(() => (showCursor = !showCursor), 500);
    setTimeout(() => inputRef?.focus(), 100);
    return () => clearInterval(blink);
  });
</script>

<div class="terminal" tabindex="0" on:click={() => inputRef?.focus()}>
  {#if showLogo}
    <div class="logo">
      <pre>
   __  __ _ _     _           
  |  \/  (_) |__ | | ___  ___ 
  | |\/| | | '_ \| |/ _ \/ __|
  | |  | | | | | | |  __/\__ \
  |_|  |_|_|_| |_|_|\___||___/
      </pre>
    </div>
    <div class="progress-bar">
      <div class="progress" style="width: {progress * 100}%"></div>
    </div>
  {:else}
    {#each $history as line}
      <div class={line.type === "command" ? "cmd" : "out"}>{line.text}</div>
    {/each}

    <div class="input">
      <span class="prompt">{prompt()}</span>
      <input bind:this={inputRef} bind:value={input} on:keydown={handleKey} />
      {#if showCursor && !input}<span class="cursor">█</span>{/if}
    </div>
  {/if}

  {#if crtEnabled}
    <div class="crt-overlay"></div>
  {/if}
</div>

<style>
  @import url("https://fonts.cdnfonts.com/css/lucid-console");

  .terminal {
    position: relative;
    background: black;
    color: #4cfffc;
    font-family: "Lucid Console", monospace;
    padding: 1rem;
    height: 28rem;
    overflow-y: auto;
    white-space: pre-wrap;
    border-radius: 0.5rem;
    border: 1px solid rgba(79, 255, 252, 0.3);
    font-size: 0.75rem;
    text-shadow:
      0 0 1px #4cfffc,
      0 0 2px #4cfffc,
      0 0 4px #4cfffc,
      0 0 6px #4cfffc;
  }

  .cmd {
    color: #80ff80;
    text-shadow:
      0 0 1px #80ff80,
      0 0 2px #80ff80;
  }
  .out {
    color: #4cfffc;
    text-shadow:
      0 0 1px #4cfffc,
      0 0 2px #4cfffc;
  }

  .input {
    display: flex;
    align-items: center;
  }
  .prompt {
    color: #80ff80;
    margin-right: 0.25rem;
    text-shadow:
      0 0 1px #80ff80,
      0 0 2px #80ff80;
  }
  input {
    background: transparent;
    border: none;
    outline: none;
    color: #4cfffc;
    flex: 1;
    text-shadow:
      0 0 1px #4cfffc,
      0 0 2px #4cfffc;
  }
  .cursor {
    animation: blink 1s infinite;
    text-shadow:
      0 0 1px #4cfffc,
      0 0 2px #4cfffc;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  .logo {
    color: #80ff80;
    text-align: center;
    margin-bottom: 1rem;
    text-shadow:
      0 0 1px #80ff80,
      0 0 2px #80ff80;
  }
  .progress-bar {
    width: 100%;
    background: #111;
    height: 0.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  .progress {
    height: 100%;
    background: #4cfffc;
    transition: width 0.1s linear;
  }

  /* CRT scanlines overlay */
  .crt-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 255, 252, 0.12) 0px,
      rgba(0, 255, 252, 0.12) 1px,
      transparent 1px,
      transparent 2px
    );
    animation: flicker 0.15s infinite;
    mix-blend-mode: overlay;
  }
  @keyframes flicker {
    0%,
    100% {
      opacity: 0.15;
    }
    50% {
      opacity: 0.1;
    }
  }

  /* Glow pulse effect */
  .cmd,
  .out,
  .prompt,
  input,
  .cursor {
    animation: glowPulse 2s infinite alternate;
  }
  @keyframes glowPulse {
    0% {
      text-shadow:
        0 0 1px currentColor,
        0 0 2px currentColor,
        0 0 4px currentColor,
        0 0 6px currentColor;
    }
    100% {
      text-shadow:
        0 0 2px currentColor,
        0 0 4px currentColor,
        0 0 6px currentColor,
        0 0 8px currentColor;
    }
  }
</style>
