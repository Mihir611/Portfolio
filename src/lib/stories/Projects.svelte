<!-- src/lib/components/Projects.svelte -->
<script>
  import { fade } from 'svelte/transition';

  const projects = [
    {
      name: 'ERC20 Token Generator',
      period: '11/2024',
      desc: 'A ERC20 Smart Contract designed to mint custom ERC20 tokens on a polygon/Ethereum test net. The UI is developed in Svelte using ethers and web3 js. This project also uses MetaMask a web3 wallet provider to emulate the minting and storing of the generated/ minted tokens.',
      outcomes: 'Web3 enthusiasts can play around and generate their own ERC20 tokens for testing purposes'
    },
    {
      name: 'WhatsApp-Integrated Chatbot for Company Information and Order Placement',
      period: '09/2022 – 2022',
      desc: 'A chatbot designed using node js, mongo dB, python 3, nltk, TensorFlow to be integrated with WhatsApp',
      outcomes: 'Potential client can communicate with the chatbot to know more about the company and also be able place orders'
    },
    {
      name: 'E Commerce Site',
      period: '11/2020',
      desc: 'An E-Commerce website developed using HTML5, CSS, Bootstrap for a client who was planning to sell goods online. Used HTML, CSS, Bootstrap, C#.Net and SQL',
      outcomes: 'Able to list all the goods online and view or edit them if needed. Clients are able to purchase the goods and transfer the funds to the Business'
    },
    {
      name: 'Face Recognition System using Python',
      period: '05/2020',
      desc: 'A simple Face-Recognition System constructed using Python 3.7 and Open-CV',
      outcomes: 'To detect face of the person. To identify the person'
    },
    {
      name: 'Intelligent Braking System (Arduino project)',
      period: '09/2019',
      desc: 'An IoT project which detects obstacles in front of a moving car and applies brake by calculating the distance between the object and the car and prevents the car from colliding onto the object.',
      outcomes: ''
    },
    {
      name: 'Automation System for Hi Tech Home World.',
      period: '04/2019',
      desc: 'Billing and Automation System Developed as a BCA project for A client. Used C#.Net and SQL database.',
      outcomes: ''
    }
  ];
</script>

<section id="projects" class="py-20 px-8 bg-black/50">
  <h2 class="text-4xl font-bold mb-12 text-center" transition:fade={{ duration: 600 }}>PROJECTS</h2>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {#each projects as proj, i}
      <div class="p-6 bg-black/20 rounded-lg border border-orange-500/30" transition:fade={{ duration: 600, delay: i * 100 }}>
        <h3 class="text-xl font-semibold mb-2">{proj.name}</h3>
        <p class="text-sm opacity-75 mb-2">{proj.period}</p>
        <p class="text-orange-300 mb-2">{proj.desc}</p>
        {#if proj.outcomes}
          <p class="font-bold text-sm">Outcomes: {proj.outcomes}</p>
        {/if}
      </div>
    {/each}
  </div>
</section>