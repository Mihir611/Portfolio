<script lang="ts">
import { onMount } from 'svelte';
import * as THREE from 'three';


let el: HTMLDivElement;


onMount(() => {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });


renderer.setSize(innerWidth, innerHeight);
el.appendChild(renderer.domElement);


const geometry = new THREE.BufferGeometry();
const vertices = [];


for (let i = 0; i < 1000; i++) {
vertices.push(
(Math.random() - 0.5) * 400,
(Math.random() - 0.5) * 400,
(Math.random() - 0.5) * 400
);
}


geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));


const material = new THREE.PointsMaterial({ color: 0xff8c00, size: 1.2 });
const points = new THREE.Points(geometry, material);


scene.add(points);
camera.position.z = 300;


const animate = () => {
requestAnimationFrame(animate);
points.rotation.y += 0.0005;
renderer.render(scene, camera);
};


animate();
});
</script>


<div bind:this={el} class="fixed inset-0 -z-10 opacity-30"></div>