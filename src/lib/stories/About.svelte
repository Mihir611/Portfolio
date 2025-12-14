<!-- src/lib/components/About.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import * as THREE from 'three';
  import { writable } from 'svelte/store';

  // Combined shortened profile into one block
  const fullProfile = `Results-driven Full-Stack Developer specializing in scalable solutions across diverse tech stacks. Built high-impact apps for 20,000+ users in real-time messaging, IoT vehicle management, conversational AI, and Web3 innovations.

Proficient in end-to-end development with .NET MAUI, React.js, Next.js, Node.js, Python; MongoDB architecture, Ably/Socket real-time comms, Web3/NFT/Blockchain.

Proven in strategic partnerships, 3-2-1 enterprise backups, and custom IoT hardware controls per industry standards.

Strong in cross-platform mobile, dashboards, APIs—from POC to production. Expert in role-based systems, automated workflows, and seamless UX for operational efficiency.`;

  // Core competencies as badges
  const competencies = [
    'Full-Stack Development',
    'Mobile Applications',
    'IoT Integration',
    'Real-Time Systems',
    'Database Management',
    'Web3/Blockchain',
    'Conversational AI',
    'API Development',
    'Socket Programming',
    'Enterprise Architecture'
  ];

  // Single store for the full profile typewriter
  const typedText = writable('');

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particles: THREE.Points;
  let animationId: number;
  let velocities: Float32Array; // Declare outside for scope

  onMount(() => {
    // Single typewriter effect for the full block
    const text = fullProfile;
    let index = 0;
    const interval = setInterval(() => {
      typedText.set(text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 20); // Faster speed for longer text

    // 3D Particle setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);

    // Ambient glow
    const ambientLight = new THREE.AmbientLight(0xff6600, 0.3);
    scene.add(ambientLight);

    // Particles
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Initialize velocities
    velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 400);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  });

  function animate() {
    animationId = requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Reset velocities for looping
      if (Math.abs(positions[i]) > 5) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 5) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 5) velocities[i + 2] *= -1;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.001;

    renderer.render(scene, camera);
  }

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

<section id="about" class="relative py-20 px-8 max-w-4xl mx-auto overflow-hidden" transition:fade={{ duration: 800 }}>
  <!-- 3D Particle Canvas -->
  <div class="absolute inset-0 -z-10">
    <canvas bind:this={canvas} class="w-full h-full" />
  </div>

  <h2 class="text-5xl font-bold mb-12 text-center text-orange-400 drop-shadow-lg glow relative z-10" transition:slide={{ duration: 1000 }}>
    PROFILE
  </h2>

  <!-- Single Profile Block with Typewriter Effect -->
  <div class="bg-gray-900/30 p-8 rounded-lg border border-orange-500/20 backdrop-blur-sm relative overflow-hidden prose prose-invert max-w-none leading-relaxed text-lg text-orange-300 relative z-10" in:slide={{ duration: 1000 }}>
    <div class="relative">
      <span class="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></span>
      <div class="typewriter-text whitespace-pre-wrap">
        {@html $typedText.replace(/\n/g, '<br>')}
        <span class="cursor">|</span>
      </div>
    </div>
  </div>

  <!-- Core Competencies Badges -->
  <div class="mt-12 relative z-10">
    <h3 class="text-2xl font-semibold mb-6 text-center text-orange-400 glow">Core Competencies</h3>
    <div class="flex flex-wrap justify-center gap-4">
      {#each competencies as comp, i}
        <span 
          class="px-6 py-3 bg-gray-900/50 rounded-full border border-orange-500/40 text-orange-300 text-sm font-medium backdrop-blur-sm hover:bg-orange-900/20 transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-orange-500/30"
          in:fly={{ y: 20, duration: 600, delay: i * 100 }}
        >
          {comp}
        </span>
      {/each}
    </div>
  </div>
</section>

<style>
  .glow {
    text-shadow: 0 0 10px #ff6600, 0 0 20px #ff6600, 0 0 30px #ff6600;
  }

  .typewriter-text {
    border-right: 2px solid #ff6600;
    animation: blink 1s infinite;
  }

  .cursor {
    border-left: 2px solid #ff6600;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { border-color: #ff6600; }
    51%, 100% { border-color: transparent; }
  }

  /* Prose overrides */
  .prose :where(p):not(:where([class~="not-prose"] *)) {
    @apply text-orange-300;
  }
</style>