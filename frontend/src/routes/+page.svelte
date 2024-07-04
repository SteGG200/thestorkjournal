<script>
  import "../app.css";
  import Navbar from '../lib/navbar.svelte';
</script>

<Navbar/>

<div class="pt-20" id=""></div>

{#each {length: 30} as _, i}
    <li>nothing {i + 1}</li>
{/each}