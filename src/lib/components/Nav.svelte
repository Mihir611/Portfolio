<script lang="ts">
  const POSITION: 'top' | 'right' = 'right';

  let open = false;

  const links = [
    { name: 'Home', id: 'hero', icon: '⦿' },
    { name: 'Terminal', id: 'terminal', icon: '⌘' },
    { name: 'About', id: 'about', icon: '◎' },
    { name: 'Projects', id: 'projects', icon: '⬡' },
    { name: 'Experience', id: 'experience', icon: '◈' },
    { name: 'Skills', id: 'skills', icon: '✦' }
  ];

  function scrollTo(id: string) {
    open = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function magnetic(node: HTMLElement) {
    let rect: DOMRect;

    function move(e: MouseEvent) {
      rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      node.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.12)`;
    }

    function reset() {
      node.style.transform = 'translate(0,0) scale(1)';
    }

    node.addEventListener('mousemove', move);
    node.addEventListener('mouseleave', reset);

    return {
      destroy() {
        node.removeEventListener('mousemove', move);
        node.removeEventListener('mouseleave', reset);
      }
    };
  }
</script>

<nav class="dock {POSITION}">
  {#each links as link}
    <button
      use:magnetic
      class="dock-item"
      on:click={() => scrollTo(link.id)}
      aria-label={link.name}
    >
      <span class="icon">{link.icon}</span>
      <span class="label">{link.name}</span>
    </button>
  {/each}
</nav>

<style>
  /* COMMON DOCK STYLE */
  .dock {
    position: fixed;
    z-index: 50;
    display: flex;
    gap: 1rem;
    padding: 0.8rem 1.2rem;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 140, 0, 0.25);
    box-shadow:
      0 0 30px rgba(255, 140, 0, 0.25),
      inset 0 0 20px rgba(255, 140, 0, 0.15);
  }

  /* TOP DOCK */
  .dock.top {
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 999px;
  }

  /* RIGHT DOCK */
  .dock.right {
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    flex-direction: column;
    border-radius: 999px;
  }

  .dock-item {
    position: relative;
    background: radial-gradient(
      circle at top,
      rgba(255, 170, 70, 0.25),
      rgba(0, 0, 0, 0.2)
    );
    border: none;
    border-radius: 50%;
    width: 54px;
    height: 54px;
    color: #fb923c;
    cursor: pointer;
    transition: box-shadow 0.25s ease;
    box-shadow: 0 0 12px rgba(255, 140, 0, 0.4);
  }

  .dock-item:hover {
    box-shadow:
      0 0 20px rgba(255, 160, 80, 0.8),
      0 0 40px rgba(255, 140, 0, 0.6);
  }

  .icon {
    font-size: 1.2rem;
  }

  .label {
    position: absolute;
    background: rgba(0, 0, 0, 0.85);
    padding: 0.3rem 0.6rem;
    border-radius: 0.5rem;
    font-size: 0.65rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    border: 1px solid rgba(255, 140, 0, 0.3);
    white-space: nowrap;
  }

  /* LABEL POSITION BASED ON DOCK LOCATION */
  .dock.top .label {
    bottom: -1.8rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .dock.right .label {
    right: 120%;
    top: 50%;
    transform: translateY(-50%);
  }

  .dock-item:hover .label {
    opacity: 1;
  }

  /* MOBILE: hide dock */
  @media (max-width: 768px) {
    .dock {
      display: none;
    }
  }
</style>
