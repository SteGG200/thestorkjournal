<script>
import { browser } from "$app/environment";
import Editor from "$lib/editor.svelte";

import "../../app.css";
import Navbar from '../../lib/navbar.svelte';
//const editor = new EditorJS('editorjs');

$effect(()=>{
    
})
</script>
{#if browser}
  <Editor />
{:else}
  <!-- Prevent layout shift -->
{/if}