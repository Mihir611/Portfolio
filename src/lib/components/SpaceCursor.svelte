<script lang="ts">
  import { onMount } from 'svelte';

  let cursor: HTMLDivElement;
  let trail: HTMLDivElement;
  let x = 0, y = 0;
  let tx = 0, ty = 0;

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

  onMount(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      x = lerp(x, tx, 0.18);
      y = lerp(y, ty, 0.18);

      cursor.style.transform = `translate(${x}px, ${y}px)`;
      trail.style.transform = `translate(${x}px, ${y}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    animate();

    return () => {
      window.removeEventListener('mousemove', move);
      document.body.style.cursor = 'auto';
    };
  });
</script>

<div class="space-cursor" bind:this={cursor}></div>
<div class="space-trail" bind:this={trail}></div>

<style>
  .space-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 22px;
    height: 22px;
    border: 2px solid rgba(255, 140, 0, 0.9);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    box-shadow:
      0 0 10px rgba(255, 140, 0, 0.8),
      inset 0 0 6px rgba(255, 140, 0, 0.6);
    transform: translate(-50%, -50%);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .space-trail {
    position: fixed;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    background: rgba(255, 140, 0, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    filter: blur(4px);
    transform: translate(-50%, -50%);
  }

  a:hover ~ .space-cursor,
  button:hover ~ .space-cursor {
    border-color: #00e5ff;
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.9);
  }
</style>
