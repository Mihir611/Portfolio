<!-- src/lib/components/Experience.svelte -->
<script lang="ts">
  import { flip } from 'svelte/animate';
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import * as THREE from 'three';

  interface Project {
    name: string;
    desc: string;
    techStack: string[];
    users: string; // e.g., "2,000+ active users"
  }

  interface Experience {
    title: string;
    date: string;
    location: string;
    projects: Project[];
  }

  let experiences: Experience[] = [
    {
      title: 'Software Developer, Blackwater Tech East',
      date: '01/2025 – Present',
      location: 'Hyderabad, India',
      projects: [
        { 
          name: 'Pet Services Management Platform', 
          desc: 'Architected and developed a comprehensive dual-mobile application ecosystem from scratch for pet services management, serving both customer-facing booking operations and internal company workflows. Implemented real-time messaging system enabling seamless communication between clients, company representatives, and internal team members using Ably integration. Built robust administrative dashboard for user management, scheduling optimization (bus pickup/dropoff coordination), and fleet management with dynamic vehicle addition capabilities. Engineered enterprise-grade database backup solution following industry-standard 3-2-1 backup methodology with point-in-time restoration functionality for system administrators. Impact: Streamlined pet service operations and enhanced customer communication workflows.',
          techStack: ['.NET MAUI', 'MongoDB', 'Next.js', 'Node.js', 'Express.js', 'Ably'],
          users: '20,000+ combined active users'
        },
        { 
          name: 'Education Management System', 
          desc: 'Developed and deployed a comprehensive examination management dashboard serving 2,000+ active users in the education sector. Implemented role-based access control system ensuring secure multi-tier user permissions and data integrity. Created seamless file management workflow enabling administrators to upload examination materials and students to access downloadable content. Built integrated scoring and analytics system providing real-time exam results and performance tracking for students. Impact: Digitized examination processes for 2,000+ users, improving administrative efficiency and student experience.',
          techStack: ['React.js'],
          users: '2,000+ active users'
        }
      ]
    },
    {
      title: 'Svelte JS Developer, Blackwater Tech East',
      date: '10/2023 – 12/2024',
      location: 'Hyderabad, India',
      projects: [
        { 
          name: 'Vehicle Wizard Dashboard', 
          desc: 'Architected and developed a comprehensive vehicle management dashboard from scratch, currently serving 1,500+ active users. Built intuitive user interface for fleet tracking, maintenance scheduling, and operational analytics. Impact: Streamlined vehicle operations for 1,500+ users, improving fleet management efficiency.',
          techStack: ['React TS'],
          users: '1,500+ active users'
        },
        { 
          name: 'Parts Silver Platform', 
          desc: 'Developed enterprise-grade parts management dashboard supporting 2,000+ active users with advanced inventory tracking capabilities. Integrated barcode/QR scanner functionality enabling real-time parts identification and inventory updates. Built comprehensive search and filtering system for efficient parts catalog navigation. Implemented automated inventory alerts and low-stock notifications for proactive management. Impact: Optimized parts management workflows for 2,000+ users with integrated scanning capabilities.',
          techStack: ['React JS'],
          users: '2,000+ active users'
        }
      ]
    },
    {
      title: 'Frontend Developer, lotracx private limited',
      date: '08/2021 – 08/2023',
      location: 'Manipal, India',
      projects: [
        { 
          name: 'Flocco - WhatsApp Chatbot Platform', 
          desc: 'Developed and deployed intelligent chatbot system with seamless WhatsApp integration, currently serving 5,000+ active users. Built conversational AI workflows for automated customer service, order processing, and user engagement. Implemented robust messaging API integration ensuring reliable real-time communication and response handling. Created scalable backend architecture supporting high-volume concurrent conversations. Impact: Automated customer interactions for 5,000+ users, significantly reducing manual support overhead.',
          techStack: ['Node.js', 'MongoDB', 'Python'],
          users: '5,000+ active users'
        },
        { 
          name: 'Mouvit - Vehicle Ordering Platform', 
          desc: 'Architected comprehensive vehicle ordering ecosystem supporting 1,000+ monthly vehicle orders with 10,000+ registered user base. Established strategic partnership integration with CAMACO for expanded service capabilities. Built scalable order management system with real-time inventory tracking and automated dispatch workflows. Implemented user-friendly booking interface with advanced filtering and scheduling capabilities. Impact: Facilitated 1,000+ vehicle orders for 10,000+ users while securing key industry partnerships.',
          techStack: ['React.js', 'Node.js'],
          users: '10,000+ registered users, 1,000+ monthly orders'
        },
        { 
          name: 'Radboards - IoT Vehicle Management System', 
          desc: 'Developed IoT-enabled vehicle tracking solution managing 100+ vehicles in rental model operations. Implemented large-scale IoT deployment enabling 3,000+ vehicles with location tracking capabilities over 12 months. Built real-time monitoring dashboard for fleet management, utilization analytics, and maintenance scheduling. Created automated reporting system for operational insights and performance metrics. Impact: IoT-enabled 3,000+ vehicles annually, optimizing 100+ rental fleet operations.',
          techStack: ['React.js', 'IoT Protocols'],
          users: '3,000+ vehicles annually, 100+ rental fleet'
        },
        { 
          name: 'Shockwave - Electric Scooter Control System', 
          desc: 'Engineered custom UI and socket server architecture for electric scooter fleet management using Python. Developed real-time vehicle control interface enabling remote scooter operations and monitoring. Implemented secure socket communication protocols for reliable vehicle-to-server connectivity. Built comprehensive rental management system with booking, payment, and usage tracking. Impact: Facilitated 25+ monthly scooter rentals through custom-developed control infrastructure.',
          techStack: ['Python', 'Socket Programming'],
          users: '25+ monthly rentals'
        },
        { 
          name: 'Web3 & NFT Innovation Projects', 
          desc: 'Created proof-of-concept applications exploring blockchain integration and NFT marketplace functionality. Developed smart contract interfaces and Web3 wallet connectivity solutions. Built prototype NFT minting and trading platforms demonstrating emerging technology capabilities. Researched and implemented decentralized application (dApp) architectures. Impact: Established company\'s capabilities in emerging blockchain and NFT technologies.',
          techStack: ['Solidity', 'Web3.js', 'Hardhat'],
          users: 'Proof-of-concept (emerging tech demos)'
        },
        { 
          name: 'Food Delivery Service Manager', 
          desc: 'Developed automated service management system streamlining food delivery operations and order processing. Implemented intelligent routing algorithms for optimized delivery scheduling and resource allocation. Built comprehensive admin dashboard for order tracking, delivery management, and performance analytics. Impact: Streamlined food delivery operations with automated service management.',
          techStack: ['React.js', 'Node.js'],
          users: 'Streamlined operations (user base not specified)'
        }
      ]
    },
    {
      title: 'Software Development Intern, Hexagon Global It Services Private Limited',
      date: '01/2021 – 07/2021',
      location: 'Bangalore, India',
      projects: [
        { 
          name: 'Construction Project Website', 
          desc: 'Responsible for developing a website for one of their construction projects. This involved designing a system that captured the entire flow of the building construction process, including bill generation and a 3D model view of the progress. Through my work, I contributed to the company\'s goal of streamlining construction processes and increasing efficiency in project management.',
          techStack: ['HTML5', 'CSS', 'Bootstrap', 'C#.Net', 'SQL'],
          users: 'Internal project management tool'
        }
      ]
    }
  ];

  let visibleExperiences = [];
  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particles: THREE.Points;
  let timelineNodes: THREE.Mesh[] = [];
  let animationId: number;

  onMount(() => {
    visibleExperiences = experiences;

    // 3D Timeline setup remains the same
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 600);
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xff6600, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff6600, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Vertical timeline line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -experiences.length * 5, 0),
      new THREE.Vector3(0, experiences.length * 5, 0)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.3 });
    const timelineLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(timelineLine);

    // Floating nodes for each experience
    experiences.forEach((exp, i) => {
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xff6600, wireframe: true });
      const node = new THREE.Mesh(geometry, material);
      node.position.set((Math.random() - 0.5) * 4, (i - experiences.length / 2) * 5, (Math.random() - 0.5) * 4);
      scene.add(node);
      timelineNodes.push(node);
    });

    // Ambient particles
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 0.1,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 600);
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

    // Animate timeline nodes
    timelineNodes.forEach((node, i) => {
      node.rotation.y += 0.01;
      node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005;
    });

    // Subtle particle drift
    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
  }

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

<section class="py-16 relative z-10" transition:slide={{ duration: 1000 }}>
  <!-- 3D Timeline Canvas -->
  <div class="relative mx-auto mb-12 w-full max-w-4xl h-96">
    <canvas bind:this={canvas} class="absolute inset-0 w-full h-full" />
  </div>

  <h2 class="text-4xl font-bold mb-8 text-center text-orange-400 drop-shadow-lg glow">Professional Experience</h2>
  <div class="space-y-8 max-w-4xl mx-auto">
    {#each visibleExperiences as exp, i (exp.title)}
      <div 
        class="group bg-gray-900/50 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/70 hover:bg-orange-900/10 transition-all duration-700 ease-out hover:scale-105 shadow-lg hover:shadow-orange-500/25 relative overflow-hidden"
        in:flip={{ delay: i * 200, duration: 800 }}
      >
        <!-- Timeline connector line -->
        <div class="absolute left-0 top-4 w-1 h-12 bg-gradient-to-b from-orange-500/50 to-transparent" style="left: -1rem; z-index: 0;"></div>

        <!-- Experience Header with User Metric Highlight -->
        <div class="relative z-10 flex items-start space-x-4 mb-6">
          <div class="flex-shrink-0 w-4 h-4 bg-orange-500 rounded-full mt-2 glow-node"></div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-orange-300 group-hover:text-orange-200 transition-colors">{exp.title}</h3>
            <p class="text-orange-400 opacity-80 mt-1">{exp.date} • {exp.location}</p>
            <!-- Overall User Highlight if applicable -->
            {#if exp.projects.some(p => p.users !== 'Internal project management tool')}
              <div class="mt-2 flex items-center space-x-2">
                <span class="text-orange-500 text-lg">👥</span>
                <span class="font-semibold text-orange-300">Total Served: {exp.projects.map(p => p.users).join(', ')}</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Projects Accordion-like Expansion -->
        <div class="space-y-4 relative z-10">
          {#each exp.projects as proj, j}
            <details class="group/project bg-gray-800/50 p-4 rounded-lg border-l-4 border-orange-400 cursor-pointer transition-all duration-300 hover:bg-gray-700/50" open={j === 0}>
              <summary class="font-medium text-orange-300 flex items-center justify-between mb-2">
                {proj.name}
                <span class="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div class="mt-2 text-sm text-orange-200 leading-relaxed opacity-90">
                {proj.desc}
                <!-- User Metric Highlight -->
                {#if proj.users && proj.users !== 'Internal project management tool'}
                  <div class="mt-3 p-3 bg-orange-900/20 rounded border border-orange-500/30">
                    <span class="text-orange-400 font-semibold">Users Served/Using: </span>
                    <span class="text-orange-200">{proj.users}</span>
                  </div>
                {/if}
                <!-- Tech Stack Badges -->
                <div class="mt-4 flex flex-wrap gap-2">
                  {#each proj.techStack as tech}
                    <span class="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 transition-colors">
                      {tech}
                    </span>
                  {/each}
                </div>
              </div>
            </details>
          {/each}
        </div>

        <!-- Hover glow overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl"></div>
      </div>
    {/each}
  </div>
</section>

<style>
  .glow {
    text-shadow: 0 0 10px #ff6600, 0 0 20px #ff6600;
  }

  .glow-node {
    box-shadow: 0 0 10px #ff6600;
  }

  details summary {
    list-style: none;
  }

  details summary::-webkit-details-marker {
    display: none;
  }
</style>