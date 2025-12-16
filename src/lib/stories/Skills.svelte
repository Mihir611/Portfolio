<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import { fade, fly, scale } from "svelte/transition";

  // Enhanced skills data with proficiency levels (inferred from resume usage frequency and complexity)
  interface Skill {
    name: string;
    icon: string; // Correct Simple Icons slug
    projects: string[];
    description?: string;
    proficiency: number; // 0-100 proficiency level
  }

  const skills: Skill[] = [
    {
      name: "React JS",
      icon: "react",
      projects: [
        "Education Management System: Comprehensive examination dashboard for 2,000+ users with role-based access and analytics.",
        "Vehicle Wizard Dashboard: Fleet tracking and maintenance UI for 1,500+ users.",
        "Parts Silver Platform: Inventory management with QR scanning for 2,000+ users.",
        "Mouvit - Vehicle Ordering Platform: User booking interface with filtering.",
        "Radboards - IoT Vehicle Management: Real-time monitoring dashboard.",
        "Food Delivery Service Manager: Admin dashboard for order tracking.",
      ],
      proficiency: 95,
    },
    {
      name: "Svelte JS",
      icon: "svelte",
      projects: [
        "ERC20 Token Generator: UI for minting custom ERC20 tokens on Polygon/Ethereum testnet using ethers and web3.js.",
      ],
      proficiency: 85,
    },
    {
      name: "Express JS",
      icon: "express",
      projects: [
        "Pet Services Management Platform: Backend for real-time messaging and workflows.",
      ],
      proficiency: 80,
    },
    {
      name: "Solidity",
      icon: "solidity",
      projects: [
        "Web3 & NFT Innovation Projects: Smart contract interfaces for NFT minting and trading platforms.",
      ],
      proficiency: 75,
    },
    {
      name: "Web3",
      icon: "web3dotjs",
      projects: [
        "ERC20 Token Generator: Integration with MetaMask for token minting and storage.",
        "Web3 & NFT Innovation Projects: dApp architectures and wallet connectivity.",
      ],
      proficiency: 80,
    },
    {
      name: "Next JS",
      icon: "nextjs",
      projects: [
        "Pet Services Management Platform: Frontend for booking and admin dashboard.",
      ],
      proficiency: 85,
    },
    {
      name: "Node JS",
      icon: "nodedotjs",
      projects: [
        "Flocco - WhatsApp Chatbot: Scalable backend for concurrent conversations.",
        "Mouvit - Vehicle Ordering: Order management with real-time inventory.",
        "WhatsApp-Integrated Chatbot: Core integration with MongoDB and Python.",
      ],
      proficiency: 90,
    },
    {
      name: "Python",
      icon: "python",
      projects: [
        "Shockwave - Electric Scooter Control: Socket server for real-time vehicle control.",
        "Flocco - WhatsApp Chatbot: AI workflows with NLTK and TensorFlow.",
        "Face Recognition System: Detection and identification using OpenCV.",
        "WhatsApp-Integrated Chatbot: NLP processing for order placement.",
      ],
      proficiency: 85,
    },
    {
      name: "MongoDB",
      icon: "mongodb",
      projects: [
        "Pet Services Management Platform: Database for user and scheduling data.",
        "Flocco - WhatsApp Chatbot: Storage for conversation histories.",
        "WhatsApp-Integrated Chatbot: Backend data management.",
      ],
      proficiency: 80,
    },
    {
      name: "Tailwind CSS",
      icon: "tailwindcss",
      projects: [], // No specific project mentioned, but used globally
      proficiency: 90,
    },
    {
      name: "HTML5",
      icon: "html5",
      projects: [
        "E Commerce Site: Core structure for online goods listing and purchasing.",
      ],
      proficiency: 95,
    },
    {
      name: "Bootstrap",
      icon: "bootstrap",
      projects: [
        "E Commerce Site: Responsive design for client-facing e-commerce.",
      ],
      proficiency: 85,
    },
    {
      name: ".Net MAUI",
      icon: "dotnet",
      projects: [
        "Pet Services Management Platform: Cross-platform mobile apps for booking and workflows.",
      ],
      proficiency: 75,
    },
    {
      name: "React Native",
      icon: "reactnative",
      projects: [], // Assumed mobile extension, no specific
      proficiency: 70,
    },
    {
      name: "Hardhat",
      icon: "hardhat",
      projects: [
        "Web3 & NFT Innovation Projects: Ethereum development environment for smart contracts.",
      ],
      proficiency: 70,
    },
    {
      name: "Adobe XD",
      icon: "adobexd",
      projects: [], // Design tool, no specific
      proficiency: 80,
    },
    {
      name: "Figma",
      icon: "figma",
      projects: [], // Design tool, no specific
      proficiency: 85,
    },
  ];

  const languages = ["English", "Hindi", "Kannada"];
  const interests = [
    "Cybersecurity",
    "Internet of Things",
    "Designing Websites and Apps",
    "Blockchains",
    "Web3",
    "Arduino",
    "Raspberry Pi",
  ];
  const organizations = ["Sri Sathya Sai Seva Samithi (Present, Udupi)"];

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particles: THREE.Points;
  let cubes: THREE.Mesh[] = [];
  let animationId: number;
  let hoveredSkill: number | null = null;

  // Modal state for lightbox
  let showModal = false;
  let selectedSkill: Skill | null = null;

  function openModal(skill: Skill) {
    selectedSkill = skill;
    showModal = true;
    document.body.style.overflow = "hidden"; // Prevent body scroll
  }

  function closeModal() {
    showModal = false;
    selectedSkill = null;
    document.body.style.overflow = "auto";
  }

  onMount(() => {
    // 3D scene setup remains the same for ambient effects
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);

    camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(800, 300);
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xff6600, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff6600, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      const color = new THREE.Color(0xff6600);
      color.multiplyScalar(Math.random() * 0.5 + 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Orbiting cubes
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshLambertMaterial({
        color: 0xff6600,
        wireframe: true,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = Math.cos((i / 8) * Math.PI * 2) * 30;
      cube.position.y = Math.sin((i / 8) * Math.PI * 2) * 30;
      cube.position.z = (Math.random() - 0.5) * 20;
      scene.add(cube);
      cubes.push(cube);
    }

    animate();

    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Close modal on Escape key
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeydown);
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  });

  function animate() {
    animationId = requestAnimationFrame(animate);

    particles.rotation.y += 0.0005;
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    cubes.forEach((cube, i) => {
      const radius = 30;
      const speed = 0.005;
      cube.position.x = Math.cos(Date.now() * speed + i) * radius;
      cube.position.y = Math.sin(Date.now() * speed + i) * radius;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });

    camera.position.x = Math.sin(Date.now() * 0.0002) * 5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  function handleHover(index: number) {
    hoveredSkill = index;
  }

  function handleLeave() {
    hoveredSkill = null;
  }
</script>

<section
  class="py-16 relative z-10 bg-black/80 backdrop-blur-sm rounded-lg border border-orange-500/20 overflow-hidden"
  in:fade={{ duration: 1000 }}
>
  <h2
    class="text-4xl font-bold mb-8 text-orange-400 drop-shadow-lg glow text-center"
  >
    Skills
  </h2>

  <!-- 3D Ambient Canvas -->
  <div class="relative mx-auto mb-12 w-full max-w-4xl h-64">
    <canvas bind:this={canvas} class="absolute inset-0 w-full h-full" />
  </div>

  <!-- Skills Grid: Clickable Cards with Proficiency -->
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative"
  >
    {#each skills as skill, i}
      <div
        class="group relative bg-gray-900/50 rounded-xl border border-orange-500/30 p-6 backdrop-blur-sm overflow-hidden transition-all duration-700 ease-out hover:border-orange-500/70 hover:bg-orange-900/20 hover:scale-105 cursor-pointer z-20"
        style="transform-origin: center;"
        on:click={() => openModal(skill)}
        on:mouseenter={() => handleHover(i)}
        on:mouseleave={handleLeave}
        in:fly={{ y: 50, duration: 800, delay: i * 50 }}
        role="button"
        tabindex="0"
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") openModal(skill);
        }}
      >
        <!-- Logo and Name: Enhanced Visibility -->
        <div class="flex items-center space-x-4 mb-6 relative z-10">
          <div
            class="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/50 backdrop-blur-sm p-2 flex items-center justify-center shadow-lg glow-icon"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/{skill.icon}.svg"
              alt="{skill.name} logo"
              class="w-10 h-10 drop-shadow-lg filter brightness-150 saturate-150 group-hover:scale-110 transition-transform"
              style="color: #ff6600; filter: drop-shadow(0 0 8px #ff6600);"
            />
          </div>
          <div class="flex-1">
            <h3
              class="text-2xl font-bold text-orange-300 group-hover:text-orange-200 transition-colors"
            >
              {skill.name}
            </h3>
            {#if skill.description}
              <p class="text-sm text-orange-400 opacity-80 mt-1">
                {skill.description}
              </p>
            {/if}
            <!-- Proficiency Bar -->
            <div class="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-orange-500 to-orange-300 h-2 rounded-full transition-all duration-700 ease-out"
                style="width: {skill.proficiency}%"
              ></div>
            </div>
            <p class="text-xs text-orange-400 mt-1">
              {skill.proficiency}% Proficiency
            </p>
          </div>
        </div>

        <!-- Click indicator -->
        <div
          class="absolute bottom-2 right-2 text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Click to explore projects
        </div>

        <!-- Subtle gradient overlay for depth -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        ></div>
      </div>
    {/each}
  </div>

  <!-- Additional Sections: Unchanged -->
  <div
    class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 text-orange-300"
  >
    <div
      class="space-y-2 p-6 bg-gray-900/30 rounded-lg border border-orange-500/20"
      in:scale={{ duration: 600, delay: 800 }}
    >
      <h3 class="text-lg font-semibold text-orange-400">Languages</h3>
      <ul class="text-sm space-y-1">
        {#each languages as lang}
          <li transition:fade={{ duration: 600, delay: 900 }}>{lang}</li>
        {/each}
      </ul>
    </div>

    <div
      class="space-y-2 p-6 bg-gray-900/30 rounded-lg border border-orange-500/20"
      in:scale={{ duration: 600, delay: 1000 }}
    >
      <h3 class="text-lg font-semibold text-orange-400">Interests</h3>
      <ul class="text-sm space-y-1">
        {#each interests as interest}
          <li transition:fade={{ duration: 600, delay: 1100 }}>{interest}</li>
        {/each}
      </ul>
    </div>

    <div
      class="space-y-2 p-6 bg-gray-900/30 rounded-lg border border-orange-500/20"
      in:scale={{ duration: 600, delay: 1200 }}
    >
      <h3 class="text-lg font-semibold text-orange-400">Organizations</h3>
      <ul class="text-sm space-y-1">
        {#each organizations as org}
          <li transition:fade={{ duration: 600, delay: 1300 }}>{org}</li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Centered Lightbox Modal -->
  {#if showModal && selectedSkill}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px);"
      transition:fade={{ duration: 300 }}
      on:click={closeModal}
    >
      <div
        class="relative bg-gray-900/95 rounded-xl border border-orange-500/30 max-w-4xl max-h-[90vh] w-full mx-auto overflow-hidden shadow-2xl shadow-orange-500/25"
        style="max-width: 800px; transform: translateY(0);"
        on:click|stopPropagation
        transition:scale={{ duration: 300, delay: 100 }}
      >
        <!-- Modal Header with Proficiency -->
        <div
          class="flex items-center justify-between p-6 border-b border-orange-500/20"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/50 flex items-center justify-center"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/{selectedSkill.icon}.svg"
                alt="{selectedSkill.name} logo"
                class="w-8 h-8 drop-shadow-lg filter brightness-150 saturate-150"
                style="color: #ff6600; filter: drop-shadow(0 0 8px #ff6600);"
              />
            </div>
            <div>
              <h3 class="text-3xl font-bold text-orange-300">
                {selectedSkill.name}
              </h3>
              {#if selectedSkill.description}
                <p class="text-sm text-orange-400 opacity-80">
                  {selectedSkill.description}
                </p>
              {/if}
              <!-- Proficiency Bar in Modal -->
              <div class="mt-2 w-48 bg-gray-700 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-orange-500 to-orange-300 h-2 rounded-full"
                  style="width: {selectedSkill.proficiency}%"
                ></div>
              </div>
              <p class="text-sm text-orange-400 mt-1">
                {selectedSkill.proficiency}% Proficiency
              </p>
            </div>
          </div>
          <button
            class="text-orange-400 hover:text-orange-300 transition-colors text-2xl p-2 hover:bg-gray-800 rounded"
            on:click={closeModal}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <!-- Projects List -->
        <div class="p-6 max-h-96 overflow-y-auto">
          {#if selectedSkill.projects.length > 0}
            <h4
              class="text-orange-400 font-bold text-xl mb-4 border-b border-orange-500/30 pb-2"
            >
              Related Projects
            </h4>
            <ul class="space-y-4 text-sm text-orange-200">
              {#each selectedSkill.projects as proj, j}
                <li
                  class="p-4 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-orange-900/30 hover:pl-4 border-l-4 border-orange-400"
                  in:fly={{ y: 20, duration: 400, delay: j * 100 }}
                >
                  <span class="text-orange-500 mr-2">▸</span>
                  <span class="leading-relaxed">{proj}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <div
              class="flex items-center justify-center h-32 text-orange-400 text-lg italic"
            >
              Applied across various projects and prototypes
            </div>
          {/if}
        </div>

        <!-- Subtle 3D glow in modal -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none"
        ></div>
      </div>
    </div>
  {/if}
</section>

<style>
  .glow {
    text-shadow:
      0 0 10px #ff6600,
      0 0 20px #ff6600,
      0 0 30px #ff6600;
  }

  .glow-icon {
    box-shadow: 0 0 15px #ff6600;
  }

  /* Custom scrollbar for modal */
  .max-h-96::-webkit-scrollbar {
    width: 4px;
  }

  .max-h-96::-webkit-scrollbar-track {
    background: #1f2937;
  }

  .max-h-96::-webkit-scrollbar-thumb {
    background: #ff6600;
    border-radius: 2px;
  }

  .max-h-96::-webkit-scrollbar-thumb:hover {
    background: #ff8800;
  }
</style>
