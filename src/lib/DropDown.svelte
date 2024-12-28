<script>
  import { onMount } from "svelte";
  import { ICONS } from "../js/icons";

  export let items;
  export let onSelectItem;
  export let value = null;
  export let title;
  export let size = "";
  export let searchEnabled = true;
  export let addEnabled = false; 
  export let addType;

  let selected;
  let activeContent = false;
  let isBigDropdown = true;
  let searchTerm = "";
  let newType;

  onMount(() => {
    console.log("items:", items);
    if (value) {
      let item = items.find((e) => e.id == value);
      onSelectItem(item);
    }
  });

  function onSelect(item) {
    let viewmore = document.getElementById("viewMore");
    if (viewmore) {
      viewmore.style.removeProperty("style");
    }
    selected = item.code;
    activeContent = false;
    onSelectItem(item);
  }

</script>


<div class="u-main-universal-dropdown">
  <div class="universal-dropdown {isBigDropdown ? 'big-dropdown-container ' : ''}">
    <button class="dropbtn" on:click={() => { activeContent = !activeContent;}}>
      <div class="u-title">{title}</div>
      <div class="u-tab-label button-select">
        <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" >
          <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
        </svg>
      </div>
    </button>
    {#if activeContent}
      <div class="dropdown-content {isBigDropdown ? 'big-dropdown' : ''} dropdown-{size}">
        {#if searchEnabled}
          <input class="search-input" placeholder="Buscar..." />
        {/if}
        {#each items as item}
          {#if item.id != 0 && item.name.toLowerCase().includes(searchTerm.toLowerCase())}
            <button class="u-select {selected && item.code == selected ? 'u-dropdown-select' : ''}" on:click={() => onSelect(item)} style="position:relative;" >
              <span>{item.name}</span>
            </button>
          {/if}
        {/each}
        {#if addEnabled}
          <div class="addTypes">
            <input class="add-input" bind:value={newType} placeholder="Agregar..." />
            <button on:click={()=>addType(newType)}>{@html ICONS.addCircle}</button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .u-main-universal-dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    border-radius: 0.5rem;
    width: 100%;
  }
  .universal-dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  .universal-dropdown:active .dropdown-content, .universal-dropdown:hover .dropdown-content {
    display: block;
  }

  .universal-dropdown:active .dropbtn, .universal-dropdown:hover .dropbtn {
    background: linear-gradient(20deg, #fc0074, #d102b5);
  }

  .dropbtn {
    background: linear-gradient(20deg, #fc0074, #d102b5);
    padding: 5px;
    font-size: 16px;
    border: none;
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    height: 2.8rem;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    color: black;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index: 1;
    min-width: max-content;
    height: auto;
    width: 100%;
    max-height: 48vh;
    overflow-y: auto;
    top: 1.5rem;
    border-radius: 0.5rem;
    left: 0;
  }

  .search-input, .add-input{
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #444;
    color: white;
  }

  .u-select {
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #ad2b82;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: black;
  }

  .u-select:hover {
    background: linear-gradient(20deg, #fc0074, #d102b5);
    color: white;
  }

  .button-select svg {
    display: flex;
    align-items: flex-start;
    width: 25px;
    height: 25px;
  }
  button {
    color: white;
    background-color: transparent;
    border: none;
  }

  .u-title {
    font-size: 14px;
  }

  .big-dropdown {
    left: 0;
  }

  .big-dropdown-container {
    position: relative;
  }


  .addTypes{
    display: flex;
    flex-direction: row;
  }

  .u-tab-label {
    padding-top: 0;
    padding-bottom: 0.1rem;
    align-items: center;
    justify-content: center;
  }

  .dropdown-content::-webkit-scrollbar {
    border-radius: 5px;
    width: 0.5rem;
  }

  .dropdown-content::-webkit-scrollbar-thumb {
    background: linear-gradient(20deg, #fc0074, #d102b5);
  }

  .dropdown-content::-webkit-scrollbar-track {
    background-color: #313131;
  }

  .big-dropdown {
    left: 0;
  }

  .big-dropdown-container {
    position: relative;
  }

  .dropdown-large {
    height: 58vh;
  }


</style>
