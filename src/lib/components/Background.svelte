<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas;
  let scene, camera, renderer;
  let stars, asteroids, ship, exhaust;
  let meteors = [];
  let enemies = [];
  let animationId;

  const STAR_COUNT = 2500;
  const ASTEROID_COUNT = 120;
  const METEOR_COUNT = 25;
  const ENEMY_COUNT = 6;
  const SPEED = 6;

  let camOffset = new THREE.Vector3(0, 20, 140);
  let targetOffset = camOffset.clone();

  onMount(() => {
    /* ================= CORE ================= */

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      12000
    );

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    /* ================= STARFIELD ================= */

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 5000;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 5000;
      starPos[i * 3 + 2] = -Math.random() * 10000;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.4,
        transparent: true,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(stars);

    /* ================= MAIN SHIP ================= */

    ship = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 10, 45, 16),
      new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.3 })
    );
    body.rotation.x = Math.PI / 2;

    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(6, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x2288ff,
        transparent: true,
        opacity: 0.75
      })
    );
    cockpit.position.z = 14;

    ship.add(body, cockpit);
    ship.position.set(0, -12, 50);
    scene.add(ship);

    /* 🔥 ENGINE EXHAUST */

    exhaust = new THREE.Mesh(
      new THREE.ConeGeometry(4, 25, 16),
      new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })
    );
    exhaust.rotation.x = Math.PI;
    exhaust.position.z = -30;
    ship.add(exhaust);

    /* ================= ASTEROIDS ================= */

    const astGeo = new THREE.IcosahedronGeometry(1, 0);
    const astMat = new THREE.MeshStandardMaterial({ roughness: 1 });

    asteroids = new THREE.InstancedMesh(astGeo, astMat, ASTEROID_COUNT);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 4000,
        -Math.random() * 10000
      );
      const s = Math.random() * 14 + 4;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      asteroids.setMatrixAt(i, dummy.matrix);
    }
    scene.add(asteroids);

    /* 💥 NEAR-MISS ASTEROIDS */

    function spawnFlyby() {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(8, 1),
        new THREE.MeshStandardMaterial({ color: 0x666666 })
      );
      m.position.set(
        (Math.random() > 0.5 ? 1 : -1) * 80,
        (Math.random() - 0.5) * 40,
        -200
      );
      m.userData.speed = 45;
      scene.add(m);
      meteors.push(m);
    }

    setInterval(spawnFlyby, 3500);

    /* 🌠 SHADER METEORS */

    const meteorMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying float vZ;
        void main() {
          vZ = position.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
      `,
      fragmentShader: `
        varying float vZ;
        void main() {
          float alpha = smoothstep(-30., 0., vZ);
          gl_FragColor = vec4(1., 0.6, 0.2, alpha);
        }
      `
    });

    for (let i = 0; i < METEOR_COUNT; i++) {
      const g = new THREE.CylinderGeometry(0.6, 2, 40, 8);
      const m = new THREE.Mesh(g, meteorMat);
      m.rotation.x = Math.PI / 2;
      resetMeteor(m);
      meteors.push(m);
      scene.add(m);
    }

    function resetMeteor(m) {
      m.position.set(
        (Math.random() - 0.5) * 3000,
        (Math.random() - 0.5) * 3000,
        -Math.random() * 10000
      );
      m.userData.speed = Math.random() * 25 + 25;
    }

    /* 🛸 ENEMY SHIPS */

    for (let i = 0; i < ENEMY_COUNT; i++) {
      const e = ship.clone();
      e.scale.set(0.6, 0.6, 0.6);
      e.position.set((i - 3) * 50, 20, -400 - i * 200);
      enemies.push(e);
      scene.add(e);
    }

    /* 🎬 CAMERA SECTIONS */

    const observer = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          if (e.target.dataset.scene === 'projects')
            targetOffset.set(30, 30, 160);
          if (e.target.dataset.scene === 'skills')
            targetOffset.set(-40, 10, 180);
          if (e.target.dataset.scene === 'hero')
            targetOffset.set(0, 20, 140);
        }
      }
    }, { threshold: 0.6 });

    document
      .querySelectorAll('[data-scene]')
      .forEach(el => observer.observe(el));

    /* ================= ANIMATE ================= */

    let t = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      t += 0.01;

      exhaust.scale.y = 1 + Math.sin(t * 10) * 0.2;

      camOffset.lerp(targetOffset, 0.03);
      camera.position.lerp(camOffset, 0.05);
      camera.lookAt(ship.position);

      stars.geometry.attributes.position.array.forEach((_, i, arr) => {
        if (i % 3 === 2) {
          arr[i] += SPEED * 3;
          if (arr[i] > 50) arr[i] = -10000;
        }
      });
      stars.geometry.attributes.position.needsUpdate = true;

      meteors.forEach(m => {
        m.position.z += m.userData.speed;
        if (m.position.z > 100) resetMeteor(m);
      });

      enemies.forEach((e, i) => {
        e.position.x += Math.sin(t + i) * 0.3;
        e.position.z += SPEED * 0.5;
        if (e.position.z > 200) e.position.z = -1200;
      });

      renderer.render(scene, camera);
    };

    animate();
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 z-0 pointer-events-none"
  style="background: transparent"
/>

<div class="relative z-10">
  <slot />
</div>
