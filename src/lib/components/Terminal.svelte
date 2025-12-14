<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';

  const prompt = 'mihir@portfolio:~$ ';
  const fullText = 'type `help` for available commands';
  const typed = tweened(0, { duration: 1200, easing: cubicOut });

  // Terminal history store
  const history: Writable<{ type: 'command' | 'output'; text: string }[]> = writable([]);

  // Initial welcome
  onMount(() => {
    typed.set(fullText.length);
    history.update(h => [...h, { type: 'output', text: '> Welcome to Mihir\'s Portfolio Terminal' }]);
    history.update(h => [...h, { type: 'output', text: '> Type `help` for available commands' }]);
  });

  let input = '';
  let showCursor = true;
  let cursorInterval: NodeJS.Timeout;

  onMount(() => {
    // Blinking cursor
    cursorInterval = setInterval(() => {
      showCursor = !showCursor;
    }, 500);
    return () => clearInterval(cursorInterval);
  });

  function processCommand(cmd: string) {
    const lowerCmd = cmd.toLowerCase().trim();
    let output = '';

    switch (lowerCmd) {
      case 'help':
        output = 'Available commands:\n  whoami - Display profile\n  contact - Show contact info\n  skills - List skills\n  experience - Show professional experience\n  education - Display education\n  projects - List projects\n  certificates - Show certificates\n  resume - Download resume\n  coverletter - Request cover letter\n  summarize - Summarize entire resume\n  clear - Clear terminal\n  exit - Close terminal';
        break;
      case 'whoami':
        output = 'Full-Stack Developer with expertise in .NET MAUI, React.js, Next.js, Node.js, Python, MongoDB, Ably, Socket Programming, Web3, NFT, Blockchain. Serving 20,000+ users across IoT, AI, and real-time systems.';
        break;
      case 'contact':
        output = 'Email: mihir17.udupa@gmail.com\nPhone: +91 8197607514\nLocation: Udupi, India\nPortfolio: portfolio-gold-ten-77.vercel.app';
        break;
      case 'skills':
        output = 'Frontend: React JS, Svelte JS, Next JS, CSS 3, Tailwind 3.4.13, HTML5, Bootstrap 5.0, Adobe XD, Figma\nBackend: Express JS, Node JS, Python\nMobile: React Native, .Net MAUI\nBlockchain: Solidity, Web3, Hardhat\nOther: Web Designing';
        break;
      case 'experience':
        output = 'Software Developer @ Blackwater Tech East (01/2025–Present): Pet Services Platform, Education Management System\nSvelte JS Developer @ Blackwater Tech East (10/2023–12/2024): Vehicle Wizard Dashboard, Parts Silver Platform\nFrontend Developer @ lotracx private limited (08/2021–08/2023): Flocco Chatbot, Mouvit Ordering, Radboards IoT, Shockwave Scooter Control, Web3/NFT Projects, Food Delivery Manager\nIntern @ Hexagon Global IT Services (01/2021–07/2021): Construction Project Website';
        break;
      case 'education':
        output = 'Post Graduate Program in Cyber Security, Great Lakes University (Udupi)\nMaster of Computer Applications, Manipal Institute of Technology (Manipal)\nBachelor of Computer Applications, Mahatma Gandhi Memorial College (Manipal)';
        break;
      case 'projects':
        output = 'ERC20 Token Generator (2024): Svelte + Ethers.js for minting tokens\nWhatsApp Chatbot (2022): Node.js, MongoDB, Python, NLTK, TensorFlow\nE-Commerce Site (2020): HTML5, CSS, Bootstrap, C#.Net, SQL\nFace Recognition System (2020): Python 3.7, OpenCV\nIntelligent Braking System (2019): Arduino IoT project\nAutomation System for Hi Tech Home World (2019): C#.Net, SQL';
        break;
      case 'certificates':
        output = 'Python for Absolute Beginners\nPost Graduate Program in Cyber Security\nBootstrap & jQuery Certification Course for Beginners\nApplication Security Vulnerability Assessments (SFNOS 909)\nMTA: Introduction to Programming Using Python Certified 2020';
        break;
      case 'resume':
        const link = document.createElement('a');
        link.href = '/resume/Mihir_Udupa_Resume.pdf';
        link.download = 'Mihir_Udupa_Resume.pdf';
        link.click();
        output = 'Resume downloaded successfully!';
        break;
      case 'coverletter':
        output = 'Cover letter available upon request. Email me at mihir17.udupa@gmail.com for a tailored version.';
        break;
      case 'summarize':
        output = 'Mihir Gurudas Udupa: Full-Stack Developer (1998, Udupi, India) with 4+ years experience in scalable apps for 20k+ users across IoT, AI, Web3. Key skills: React/Svelte/Next.js, Node/Python, MongoDB, Solidity/Web3, .NET MAUI. Roles: Blackwater Tech (Pet/Education/Vehicle Dashboards), lotracx (Chatbots/IoT/Web3), Hexagon Intern. Education: MCA (MIT), BCA (MGMC), PG Cyber Security (Great Lakes). Projects: ERC20 Generator, WhatsApp Bot, E-Commerce, Face Recog. Certs: Python, Bootstrap, Security. Interests: Cybersecurity, IoT, Blockchain.';
        break;
      case 'clear':
        history.set([]);
        output = '';
        break;
      case 'exit':
        output = 'Goodbye! Visit my portfolio for more.';
        // Optionally close or fade out
        break;
      default:
        output = `Command not found: ${cmd}\nType 'help' for available commands.`;
    }

    // Add to history
    history.update(h => [...h, { type: 'command', text: `${prompt}${cmd}` }]);
    if (output) {
      history.update(h => [...h, { type: 'output', text: output }]);
    }
    input = '';
    // Auto-scroll to bottom
    const terminal = document.querySelector('.terminal') as HTMLElement;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
    }
  }
</script>

<div class="terminal relative bg-black border border-orange-500/30 rounded-lg p-4 h-96 overflow-y-auto text-xs leading-relaxed">
  <!-- History -->
  {#each $history as line}
    <div class="{line.type === 'command' ? 'text-green-400' : 'text-orange-300'} whitespace-pre-wrap">
      {line.text}
    </div>
  {/each}

  <!-- Typing animation initial message -->
  <div class="text-orange-300 whitespace-pre-wrap">
    {prompt}{fullText.slice(0, Math.round($typed))}
    {#if $typed === fullText.length}
      <span class="animate-pulse">█</span>
    {/if}
  </div>

  <!-- Input line: Seamless, no borders, real terminal feel -->
  <div class="flex items-center mt-2 relative">
    <span class="text-green-400 mr-2 flex-shrink-0">{prompt}</span>
    <div class="flex-1 min-w-0">
      <input
        class="bg-transparent border-none outline-none text-orange-400 w-full caret-orange-400 focus:caret-orange-400 placeholder:text-orange-500/50 pr-2"
        bind:value={input}
        on:keydown={handleKey}
        placeholder="Type a command..."
        autocomplete="off"
        spellcheck="false"
      />
    </div>
    {#if showCursor && !input}<span class="text-orange-400 animate-pulse flex-shrink-0 ml-[-0.125em]">█</span>{/if}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap');

  .terminal {
    font-family: 'Fira Code', 'Courier New', monospace;
    font-feature-settings: 'liga' 1, 'calt' 1; /* Ligatures for code-like feel */
    scrollbar-width: thin;
    scrollbar-color: #ff6600 #000;
  }

  .terminal::-webkit-scrollbar {
    width: 4px;
  }

  .terminal::-webkit-scrollbar-track {
    background: #000;
  }

  .terminal::-webkit-scrollbar-thumb {
    background: #ff6600;
    border-radius: 2px;
  }

  .terminal::-webkit-scrollbar-thumb:hover {
    background: #ff8800;
  }

  /* Ensure input blends seamlessly */
  .terminal input {
    box-shadow: none !important;
  }

  .terminal input::placeholder {
    color: rgba(251, 146, 60, 0.5);
  }

  .terminal input:focus {
    box-shadow: none !important;
  }
</style>