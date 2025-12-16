<script lang="ts">
    import { onMount } from "svelte";
    import { writable, get } from "svelte/store";
    import {
        fetchGithubProjects,
        filterProjects,
        findProject,
        type GithubProject,
    } from "$lib/helpers/projects";
    import {
        summarizeResume,
        typeReveal,
        downloadCoverLetter,
    } from "$lib/helpers/resumeHelper";
    import {
        PUBLIC_GITHUB_USERNAME,
        PUBLIC_GITHUB_URL,
        PUBLIC_LINKEDIN_URL,
        PUBLIC_TERMINAL_USERNAME,
        PUBLIC_ACTUAL_USERNAME,
    } from "$env/static/public";

    let input = "";
    let inputRef: HTMLInputElement;
    let currentDir = "~";
    let showCursor = true;
    const username = PUBLIC_TERMINAL_USERNAME || "neonframe";
    const history = writable<
        { type: "command" | "output"; text: string; glow?: string }[]
    >([]);
    let commandHistory: string[] = [];
    let historyIndex = 0;

    let sounds: Record<string, HTMLAudioElement> = {};
    let volume = 0.3;
    let soundEnabled = true;
    let crtEnabled = false;
    const TYPE_COLOR = "#4cfffc";

    function play(name: string) {
        if (!soundEnabled || !sounds[name]) return;
        const s = sounds[name];
        s.volume = volume;
        s.currentTime = 0;
        s.play().catch(() => {});
    }

    function decode(str: string) {
        if (!str) return "";
        try {
            return atob(str);
        } catch {
            return "";
        }
    }

    const fs: any = {
        "~": {
            children: {
                "intro.txt": {
                    type: "file",
                    content: `${PUBLIC_ACTUAL_USERNAME}\nFull-Stack Developer\nSvelte • React • Node • Web3`,
                },
                "contact.txt": {
                    type: "file",
                    content: `Applicant Name: ${PUBLIC_ACTUAL_USERNAME}\nEmail: ${decode("bWloaXIxNy51ZHVwYUBnbWFpbC5jb20=")}\nPhone: ${decode("KzkxIDgxOTc2MDc1MTQ=")}`,
                },
                projects: { type: "virtual-dir" },
            },
        },
    };

    const GITHUB_USERNAME = PUBLIC_GITHUB_USERNAME;
    let projects: GithubProject[] = [];
    let filteredProjects: GithubProject[] = [];
    let projectsLoaded = false;
    let loadingProjects = false;

    let bootProgress = 0;
    let showBoot = true;

    // ================ HELPERS ================
    async function loadProjects() {
        if (projectsLoaded) return;
        loadingProjects = true;
        const idx = get(history).length;
        history.update((h) => [
            ...h,
            { type: "output", text: "⏳ Fetching GitHub projects..." },
        ]);
        play("info");
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            history.update((h) => {
                h[idx].text =
                    `⏳ Fetching GitHub projects: [${"█".repeat(i)}${" ".repeat(steps - i)}] ${Math.round((i / steps) * 100)}%`;
                return [...h];
            });
            await new Promise((r) => setTimeout(r, 80));
        }
        try {
            projects = await fetchGithubProjects(GITHUB_USERNAME);
            filteredProjects = projects;
            projectsLoaded = true;
            history.update((h) => {
                h[idx].text = `✅ GitHub projects loaded (${projects.length})`;
                return [...h];
            });
            play("fs");
        } catch (err) {
            history.update((h) => {
                h[idx].text = "❌ Failed to fetch GitHub projects.";
                return [...h];
            });
            play("error");
        } finally {
            loadingProjects = false;
            scrollToBottom();
        }
    }

    async function printProjects() {
        for (const p of filteredProjects) {
            const glowColor =
                p.stars >= 50
                    ? "#FFD700"
                    : p.stars >= 20
                      ? "#4CFFFC"
                      : "#80FF80";
            const glow = p.stars >= 10 ? " ✨" : "";
            const block = `🚀 ${p.name}${glow}\n⭐ ${p.stars} stars\n📝 ${p.description}\n🔗 ${p.url}\n----------------------------`;
            const idx = get(history).length;
            history.update((h) => [...h, { type: "output", text: "" }]);
            await typeReveal(block, (chunk) => {
                history.update((h) => {
                    h[idx].text = chunk;
                    h[idx].glow = glowColor;
                    return [...h];
                });
                scrollToBottom();
            });
            play("info");
        }
    }

    function downloadFile(url: string, name: string) {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
    }
    function prompt() {
        return `${username}@portfolio:${currentDir}$ `;
    }
    function scrollToBottom() {
        const term = document.querySelector(".terminal") as HTMLElement;
        if (term) term.scrollTop = term.scrollHeight;
    }

    // ================= COMMAND PROCESSING ================
    async function processCommand(cmd: string) {
        const lower = cmd.trim().toLowerCase();
        const idx = get(history).length;
        history.update((h) => [
            ...h,
            { type: "command", text: prompt() + cmd },
        ]);
        play("enter");
        input = "";
        historyIndex = commandHistory.length;

        let output = "";

        // ===== EASTER EGGS =====
        if (lower === "sudo rm -rf /") {
            output = "😱 Whoa! Nice try, but permission denied!";
            play("error");
        } else if (lower === "matrix") {
            const messages = [
                "🟢 Welcome to the Matrix!",
                "🟢 Follow the white rabbit...",
                "🟢 Reality is an illusion!",
                "🟢 Neo, wake up!",
                "🟢 Red pill or blue pill?",
            ];

            const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];
            const rows = 20;
            const cols = 20;

            const idx = get(history).length;
            history.update((h) => [...h, { type: "output", text: "" }]);

            // Initialize columns with random positions for "falling drops"
            const drops = Array(cols)
                .fill(0)
                .map(() => Math.floor(Math.random() * rows));

            const interval = setInterval(() => {
                const matrixLines = Array(rows)
                    .fill("")
                    .map(() => Array(cols).fill(" ").join(""));

                // Fill drops
                drops.forEach((drop, i) => {
                    if (drop < rows)
                        matrixLines[drop] =
                            matrixLines[drop].substring(0, i) +
                            Math.round(Math.random()).toString() +
                            matrixLines[drop].substring(i + 1);
                    drops[i] = drop + 1 >= rows ? 0 : drop + 1;
                });

                history.update((h) => {
                    h[idx].text = matrixLines.join("\n");
                    return [...h];
                });
                scrollToBottom();
            }, 80); // speed of falling

            // Stop animation after 4 seconds and append final message
            setTimeout(() => {
                clearInterval(interval);
                const finalMatrix = Array.from({ length: rows }, () =>
                    Array.from({ length: cols }, () =>
                        Math.round(Math.random()).toString(),
                    ).join(""),
                ).join("\n");
                history.update((h) => {
                    h[idx].text = finalMatrix + "\n" + randomMessage;
                    return [...h];
                });
                scrollToBottom();
            }, 4000);

            play("info");
        } else if (lower === "coffee") {
            output = `   ( (\n    ) )\n ........\n |      |]\n \\      /\n  \`----'\n☕ Here’s your coffee!`;
            play("info");
        } else if (lower === "party") {
            output = "🎉🎊🎈 Party time in the terminal! 🎉🎊🎈";
            play("info");
        } else if (lower === "rickroll") {
            window.open(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "_blank",
            );
            output = "Never gonna give you up... 🎵";
            play("info");
        } else if (lower === "reboot") {
            output =
                "You need superuser privileges to reboot. Try: sudo reboot";
            play("error");
        } else if (lower === "sudo reboot") {
            output = "Rebooting terminal... 🔄";
            history.set([]);
            currentDir = "~";
            input = "";
            commandHistory = [];
            historyIndex = 0;
            setTimeout(() => boot(), 500);
            return;
        } else if (lower === "sudo") {
            output = "[sudo] password for neonframe:";
            play("error");
        } else if (lower.startsWith("sudo ")) {
            output = "Permission denied 😄";
            play("error");
        } else {
            switch (true) {
                case lower === "help":
                    const commandsTable = {
                        Profile: [
                            "whoami",
                            "skills",
                            "resume",
                            "summarize",
                            "coverletter",
                        ],
                        Filesystem: ["ls", "cd <dir>", "pwd", "cat <file>"],
                        Projects: ["open <project-name>", "filter <keyword>"],
                        Web: ["open github", "open linkedin"],
                        System: [
                            "volume <0-1>",
                            "crt on/off",
                            "sound on/off",
                            "sudo",
                            "clear",
                            "exit",
                            "reboot",
                        ],
                        "Easter Eggs": [
                            "matrix",
                            "coffee",
                            "party",
                            "rickroll",
                            "sudo rm -rf /",
                        ],
                    };
                    history.update((h) => [...h, { type: "output", text: "" }]);
                    await typeReveal(formatTable(commandsTable), (chunk) => {
                        history.update((h) => {
                            h[idx].text = chunk;
                            h[idx].glow = TYPE_COLOR;
                            return [...h];
                        });
                        scrollToBottom();
                    });
                    return;

                case lower === "whoami":
                    history.update((h) => [...h, { type: "output", text: "" }]);
                    await typeReveal(
                        `${PUBLIC_ACTUAL_USERNAME}\nLocation: Udupi, India\nEmail: ${decode("bWloaXIxNy51ZHVwYUBnbWFpbC5jb20=")}\n\nA Results-driven Full-Stack Developer with proven expertise in architecting and delivering scalable solutions
across diverse technology stacks and industry verticals. Experienced in building high-impact applications
serving 20,000+ combined active users, from real-time messaging systems and IoT vehicle management to
conversational AI and Web3 innovations.`,
                        (chunk) => {
                            history.update((h) => {
                                h[idx].text = chunk;
                                h[idx].glow = TYPE_COLOR;
                                return [...h];
                            });
                            scrollToBottom();
                        },
                    );
                    return;

                case lower === "skills":
                    history.update((h) => [...h, { type: "output", text: "" }]);
                    await typeReveal(
                        "Svelte, React, Node.js, Python, Blockchain, .NET MAUI",
                        (chunk) => {
                            history.update((h) => {
                                h[idx].text = chunk;
                                h[idx].glow = TYPE_COLOR;
                                return [...h];
                            });
                            scrollToBottom();
                        },
                    );
                    return;

                case lower === "resume":
                    downloadFile(
                        "/resume/resume.pdf",
                        `${PUBLIC_ACTUAL_USERNAME}_Resume.pdf`,
                    );
                    output = "Resume downloaded!";
                    break;
                case lower === "coverletter":
                    downloadCoverLetter();
                    output = "Cover letter downloaded!";
                    break;
                case lower === "summarize":
                    await summarizeResume(history, play);
                    return;

                case lower === "ls":
                    if (currentDir === "projects") {
                        output = filteredProjects.map((p) => p.name).join("\n");
                    } else {
                        output = Object.keys(fs[currentDir].children).join(
                            "  ",
                        );
                    }
                    break;

                case lower.startsWith("cd"):
                    const dir = lower.split(" ")[1];
                    if (!dir || dir === "~") currentDir = "~";
                    else if (dir === "projects") {
                        currentDir = "projects";
                        await loadProjects();
                        output = "📁 GitHub projects loaded";
                    } else if (fs[currentDir].children[dir]?.type === "dir")
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
                    if (currentDir === "projects" && file === "projects") {
                        await printProjects();
                        return;
                    }
                    const entry = fs[currentDir].children[file];
                    if (entry?.type === "file") output = entry.content;
                    else {
                        output = `cat: ${file}: No such file`;
                        play("error");
                    }
                    break;

                case lower.startsWith("open "):
                    const target = cmd.replace("open ", "").trim();
                    if (target === "linkedin") {
                        window.open(PUBLIC_LINKEDIN_URL, "_blank");
                        output = "Opening LinkedIn...";
                    } else if (target === "github") {
                        window.open(PUBLIC_GITHUB_URL, "_blank");
                        output = "Opening GitHub...";
                    } else if (currentDir === "projects") {
                        const proj = findProject(projects, target);
                        if (proj) {
                            window.open(proj.url, "_blank");
                            output = `Opening ${proj.name}...`;
                        } else {
                            output = `Project not found: ${target}`;
                            play("error");
                        }
                    }
                    break;

                case lower.startsWith("filter "):
                    if (currentDir === "projects") {
                        const key = cmd.replace("filter ", "").trim();
                        filteredProjects = filterProjects(projects, key);
                        output = filteredProjects.length
                            ? `Filtered by "${key}"`
                            : `No projects found for "${key}"`;
                    }
                    break;

                case lower === "clear":
                    history.set([]);
                    return;
                case lower === "exit":
                    output = "Session terminated.";
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
                case lower === "sound on":
                    soundEnabled = true;
                    output = "🔊 Sound enabled";
                    break;
                case lower === "sound off":
                    soundEnabled = false;
                    output = "🔇 Sound disabled";
                    break;

                default:
                    output = `Command not found: ${cmd}`;
                    play("error");
            }
        }

        if (output)
            history.update((h) => [...h, { type: "output", text: output }]);
        scrollToBottom();
    }

    // ================= KEYBOARD ================
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

    // ================= BOOT ===================
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

    async function boot() {
        play("boot");
        showBoot = true;
        bootProgress = 0;
        const steps = 30;
        for (let i = 0; i <= steps; i++) {
            bootProgress = i / steps;
            await new Promise((r) => setTimeout(r, 80));
        }
        const messages = [
            "Welcome to NeonFrame Terminal",
            "Type `help` to begin",
        ];
        for (const line of messages) {
            const idx = get(history).length;
            history.update((h) => [...h, { type: "output", text: "" }]);
            await typeReveal(line, (chunk) => {
                history.update((h) => {
                    h[idx].text = chunk;
                    h[idx].glow = TYPE_COLOR;
                    return [...h];
                });
                scrollToBottom();
            });
            play("info");
            await new Promise((r) => setTimeout(r, 300));
        }
        await processCommand("help");
        showBoot = false;
        setTimeout(() => inputRef?.focus(), 100);
    }

    function formatTable(obj: { [key: string]: string[] }) {
        const categories = Object.keys(obj);
        const maxLenPerCol = categories.map((c) =>
            Math.max(c.length, ...obj[c].map((cmd) => cmd.length)),
        );
        const header = categories
            .map((c, i) => c.padEnd(maxLenPerCol[i], " "))
            .join(" | ");
        const separator = categories
            .map((_, i) => "-".repeat(maxLenPerCol[i]))
            .join("-|-");
        const rowCount = Math.max(...Object.values(obj).map((a) => a.length));
        const rows: string[] = [];
        for (let i = 0; i < rowCount; i++) {
            rows.push(
                categories
                    .map((c, j) =>
                        obj[c][i]
                            ? obj[c][i].padEnd(maxLenPerCol[j], " ")
                            : "".padEnd(maxLenPerCol[j], " "),
                    )
                    .join(" | "),
            );
        }
        return [header, separator, ...rows].join("\n");
    }
</script>

<div class="terminal" tabindex="0" on:click={() => inputRef?.focus()}>
    {#if showBoot}
        <div class="boot-screen">
            <pre class="logo">
   _   _                     __  _____
  | \ | | _____      _____  / _|/ _  |
  |  \| |/ _ \ \ /\ / / _ \| |_| | | |
  | |\  |  __/\ V  V / (_) |  _| |_| |
  |_| \_|\___| \_/\_/ \___/|_|  \____|
      </pre>
            <div class="boot-progress">
                {#each Array(30) as _, i}
                    <span class="bar"
                        >{i < Math.round(bootProgress * 30) ? "█" : " "}</span
                    >
                {/each}
                <span> {Math.round(bootProgress * 100)}%</span>
            </div>
        </div>
    {:else}
        {#each $history as line}
            <div
                class={line.type === "command" ? "cmd" : "out"}
                style="color:{line.glow || ''}"
            >
                {line.text}
            </div>
        {/each}

        <div class="input">
            <span class="prompt">{username}@portfolio:{currentDir}$ </span>
            <input
                bind:this={inputRef}
                bind:value={input}
                on:keydown={handleKey}
            />
            {#if showCursor && !input}<span class="cursor">█</span>{/if}
        </div>
    {/if}

    {#if crtEnabled}<div class="crt-overlay"></div>{/if}
</div>

<style>
    @import url("https://fonts.cdnfonts.com/css/lucid-console");
    .terminal {
        position: relative;
        background: black;
        color: #4cfffc;
        font-family: "Lucid Console", monospace;
        padding: 1rem;
        height: 40rem;
        overflow-y: auto;
        border-radius: 0.5rem;
        border: 1px solid rgba(79, 255, 252, 0.3);
        font-size: 0.85rem;
        white-space: pre-wrap;
        display: flex;
        flex-direction: column;
    }
    .cmd {
        color: #80ff80;
    }
    .out {
        color: #4cfffc;
    }
    .input {
        display: flex;
        align-items: center;
    }
    .prompt {
        color: #80ff80;
        margin-right: 0.25rem;
    }
    input {
        background: transparent;
        border: none;
        outline: none;
        color: #4cfffc;
        flex: 1;
        font-size: 0.85rem;
    }
    .cursor {
        animation: blink 1s infinite;
    }
    @keyframes blink {
        50% {
            opacity: 0;
        }
    }
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
        mix-blend-mode: overlay;
        animation: flicker 0.15s infinite;
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
    .boot-screen {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        text-align: center;
    }
    .logo {
        color: #4cfffc;
        text-shadow:
            0 0 2px #4cfffc,
            0 0 4px #4cfffc,
            0 0 6px #4cfffc;
        margin-bottom: 1rem;
    }
    .boot-progress {
        font-family: monospace;
        display: flex;
        align-items: center;
        color: #4cfffc;
    }
    .boot-progress .bar {
        display: inline-block;
        width: 0.5rem;
        animation: glowPulse 2s infinite alternate;
    }
    @keyframes glowPulse {
        0% {
            text-shadow:
                0 0 1px #4cfffc,
                0 0 2px #4cfffc,
                0 0 4px #4cfffc;
        }
        100% {
            text-shadow:
                0 0 2px #ffd700,
                0 0 4px #ffd700,
                0 0 6px #ffd700;
        }
    }
</style>
