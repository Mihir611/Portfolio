<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import Background from '$lib/components/Background.svelte';

  import Hero from '$lib/stories/Hero.svelte';
  import Terminal from '$lib/components/Terminal2.svelte';
  import About from '$lib/stories/About.svelte';
  import Projects from '$lib/stories/Projects.svelte';
  import Experience from '$lib/stories/Experience.svelte';
  import Skills from '$lib/stories/Skills.svelte';
  import Footer from '$lib/stories/Footer.svelte';
</script>

<svelte:head>
  <title>Mihir Gurudas Udupa - Full-Stack Developer</title>
  <meta
    name="description"
    content="Futuristic portfolio of Mihir Gurudas Udupa, expert in full-stack development, IoT, Web3, and more."
  />
</svelte:head>

<Nav />

<Background>
  <main class="min-h-screen text-orange-400 overflow-x-hidden pt-20">

    <section id="hero">
      <Hero />
    </section>

    <section id="terminal">
      <Terminal />
    </section>

    <section id="about">
      <About />
    </section>

    <section id="projects">
      <Projects />
    </section>

    <section id="experience">
      <Experience />
    </section>

    <section id="skills">
      <Skills />
    </section>

    <section id="footer">
      <Footer />
    </section>

  </main>
</Background>
