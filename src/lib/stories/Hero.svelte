<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import * as THREE from 'three';
  import { Github, Linkedin, Mail, Youtube } from 'lucide-svelte';

  let container;
  let scene, camera, renderer, mesh;

  let heroSection;
  let scrollIndicator;
  let heroContent;

  let showScroll = true;
  let observer;

  const decode = (value) => atob(value);

  /* ---------------- THREE.JS ---------------- */
  onMount(() => {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(360, 360);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.004;
      mesh.rotation.y += 0.006;
      renderer.render(scene, camera);
    };
    animate();

    /* ---- Auto-hide scroll indicator ---- */
    const handleFirstScroll = () => {
      showScroll = false;
      window.removeEventListener('scroll', handleFirstScroll);
    };
    window.addEventListener('scroll', handleFirstScroll, { once: true });

    /* ---- Intersection fade ---- */
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!scrollIndicator) return;
        scrollIndicator.style.opacity =
          entry.intersectionRatio > 0.6 ? '1' : '0';
      },
      { threshold: [0, 0.6, 1] }
    );
    if (heroSection) observer.observe(heroSection);

    /* ---- Hero parallax ---- */
    const handleMouseMove = (e) => {
      if (!heroContent) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroContent.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      container?.removeChild(renderer.domElement);
      renderer?.dispose();
      observer?.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });

  /* ---------------- ICON PROXIMITY GLOW ---------------- */
  const proximityGlow = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const max = 80;
    const intensity = Math.max(0, 1 - distance / max);

    e.currentTarget.style.boxShadow =
      `0 0 ${20 + intensity * 30}px rgba(255, 140, 58, ${0.4 + intensity * 0.6})`;
  };

  const resetGlow = (e) => {
    e.currentTarget.style.boxShadow =
      '0 0 0 rgba(255, 140, 58, 0)';
  };

  /* ---------------- RIPPLE EFFECT ---------------- */
  const ripple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    circle.className = 'ripple';
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    button.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  };
</script>

<section
  bind:this={heroSection}
  class="relative h-screen flex items-center justify-center overflow-hidden"
>
  <!-- HERO CONTENT -->
  <div
    bind:this={heroContent}
    class="relative z-10 max-w-4xl text-center px-6 hero-parallax"
  >
    <h1 class="text-5xl md:text-7xl font-extrabold mb-4 glow">
      Mihir Gurudas Udupa
    </h1>

    <p class="text-xl md:text-2xl text-orange-300 mb-6">
      Full-Stack Developer · IoT · Web3 · Systems Thinker
    </p>

    <p class="text-base md:text-lg text-orange-100/80 max-w-3xl mx-auto mb-10">
      I build scalable platforms, embedded systems, and futuristic interfaces.
    </p>

    <!-- ICONS -->
    <div class="flex justify-center gap-6">
      {#each [
        { icon: Github, href: decode('aHR0cHM6Ly9naXRodWIuY29tL01paGlyNjEx')},
        { icon: Linkedin, href: 'https://linkedin.com/in/yourusername' },
        { icon: Youtube, href: 'https://youtube.com/@yourchannel' },
        { icon: Mail, href: decode('bWFpbHRvOm1paGlyOTgudWR1cGFAZ21haWwuY29t') }
      ] as item}
        <a
          href={item.href}
          target="_blank"
          class="icon-btn"
          on:mousemove={proximityGlow}
          on:mouseleave={resetGlow}
          on:click={ripple}
        >
          <svelte:component this={item.icon} size={22} />
        </a>
      {/each}
    </div>
  </div>

  <!-- 3D CUBE -->
  <div
    bind:this={container}
    class="absolute bottom-10 left-10 w-80 h-80 opacity-70 hidden md:block pointer-events-none"
  />

  <!-- SCROLL INDICATOR -->
  {#if showScroll}
    <div
      bind:this={scrollIndicator}
      class="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator"
    >
      <div class="mouse"><span class="wheel" /></div>
      <p class="scroll-text">SCROLL</p>
    </div>
  {/if}
</section>

<style>
  .glow {
    text-shadow: 0 0 25px rgba(255, 102, 0, 0.8);
  }

  .hero-parallax {
    transition: transform 0.2s ease-out;
    will-change: transform;
  }

  .icon-btn {
    position: relative;
    overflow: hidden;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 140, 58, 0.4);
    color: #ff8c3a;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .icon-btn:hover {
    transform: translateY(-2px);
  }

  /* Ripple */
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 140, 58, 0.35);
    transform: scale(0);
    animation: ripple 600ms ease-out;
    pointer-events: none;
  }

  @keyframes ripple {
    to {
      transform: scale(3);
      opacity: 0;
    }
  }

  /* Scroll indicator */
  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    pointer-events: none;
  }

  .mouse {
    width: 26px;
    height: 44px;
    border: 2px solid rgba(255, 140, 58, 0.8);
    border-radius: 9999px;
    position: relative;
  }

  .wheel {
    width: 4px;
    height: 8px;
    background: #ff8c3a;
    border-radius: 9999px;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    animation: scroll 1.6s ease-in-out infinite;
  }

  @keyframes scroll {
    0% { opacity: 0; transform: translate(-50%, 0); }
    40% { opacity: 1; }
    80% { opacity: 0; transform: translate(-50%, 14px); }
    100% { opacity: 0; }
  }
</style>
