<script lang="ts">
  export let options = []; // Opciones del dropdown
  export let selected = ''; // Opción seleccionada por defecto
  export let placeholder = 'Selecciona una opción'; // Texto de marcador de posición

  let isOpen = false; // Controla si el dropdown está abierto o cerrado

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectOption(option) {
    selected = option;
    isOpen = false;
    dispatch('change', { value: selected });
  }

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher(); // Permite emitir eventos personalizados
</script>

<div class="dropdown">
  <!-- Botón para abrir/cerrar el dropdown -->
  <button class="dropdown-toggle" on:click={toggleDropdown}>
    {selected || placeholder}
    <span class="caret">{isOpen ? '▲' : '▼'}</span>
  </button>

  <!-- Opciones del dropdown -->
  {#if isOpen}
    <ul class="dropdown-menu">
      {#each options as option}
        <li
          class="dropdown-item"
          on:click={() => selectOption(option)}
          class:selected={selected === option}
        >
          {option}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .dropdown-toggle {
    width: 100%;
    background: #2e2e3e;
    color: white;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    text-align: left;
    font-size: 1rem;
    cursor: pointer;
  }

  .dropdown-toggle .caret {
    float: right;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #2e2e3e;
    border: 1px solid #444;
    border-radius: 8px;
    z-index: 10;
    list-style: none;
    margin: 0;
    padding: 0.5rem 0;
  }

  .dropdown-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: white;
  }

  .dropdown-item:hover,
  .dropdown-item.selected {
    background: #444;
  }
</style>
