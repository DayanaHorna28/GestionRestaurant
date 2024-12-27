<script>
  import { onMount } from "svelte";

  export let items;
  export let onSelectItem;
  export let value = null;
  export let title;
  export let size = "";
  export let tagNews = [];

  let selected;
  let activeContent = false;
  let isBigDropdown = true;

  onMount(() => {
    if (value) {
      let item = items.find((e) => e.id == value);
      onSelectItem(item);
    }
    
  });

  const onSelect = (item) => {
    let viewmore = document.getElementById("viewMore");
    if (viewmore) {
      viewmore.style.removeProperty("style");
    }
    selected = item.code;
    activeContent = false;
    onSelectItem(item);
  };

  const hasNewTag = (item)=>{
    return tagNews.includes(item.name) ;
  }
  let totalProviders = 0;
  function detectItems(params) {
    totalProviders = params.length;
  }
  
  $:detectItems(items);
</script>

<div class="u-main-universal-dropdown">
  <div
    class="universal-dropdown {isBigDropdown ? 'big-dropdown-container ' : ''}"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <button
      class="dropbtn"
      on:click={() => {
        activeContent = !activeContent;
      }}
    >
      <div class="u-title">{title} ({totalProviders})</div>
      <div class="u-tab-label button-select">
        <svg
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
          />
        </svg>
      </div>
    </button>
    {#if activeContent}
      <div
        class="dropdown-content {isBigDropdown
          ? 'big-dropdown'
          : ''} dropdown-{size}"
      >
        {#each items as item}
          <button
            class="u-select {selected && item.code == selected
              ? 'u-dropdown-select'
              : ''}"
            on:click={() => onSelect(item)}
            style="position:relative;"
          >
            {#if item.id != 0}
              <span>{item.name}</span>
              {#if hasNewTag(item)}
                <span class="new-badge">Nuevo</span>
              {/if}
              {#if item.total}
                <span>({item.total})</span>
              {/if}
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .u-dropdown-select {
     background: linear-gradient(20deg, rgb(120, 55, 194), rgb(164, 82, 255));
  }
  .dropdown-content .u-select {
      text-transform: uppercase;
  }
    .new-badge {
    width: 50px;
    height: 15px;
    position: relative;
    background-color: red;
    transform: skewX(-20deg);
    text-transform: lowercase;
  }
  @media only screen and (max-width: 1023px) {
    button {
      color: white;
      background-color: transparent;
      border: none;
    }
    .u-main-universal-dropdown {
      display: flex;
      height: 2rem;
      align-items: center;
      justify-content: center;
      width: 100%;
      border-radius: 0.5rem;
    }
    .u-tab-label {
      align-items: center;
      justify-content: center;
    }
    .universal-dropdown {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    /* Style The Dropdown Button */
    .dropbtn {
      cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    line-height: 11px;
    border-radius: 0.5rem;
    height: 40px;
    background: #353940;
    border: 1px solid rgb(164, 82, 255);
    }

    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #353535;
      box-shadow: 0 8px 16px #0003;
      z-index: 1;
      min-width: max-content;
      height: auto;
      width: 100%;
      max-height: 78vh;
      overflow-y: auto;
      top: 1.5rem;
      border-radius: 0.5rem;
      left: 0;
    }

    /*.big-dropdown {
      left: 0;
    }*/
    .big-dropdown-container {
      position: relative;
    }
    /* Links inside the dropdown */
    .dropdown-content .u-select {
      color: white;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      border-bottom: 1px solidrgb(164, 82, 255);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      gap: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    /* Change color of dropdown links on hover */
    .u-select:hover {
      background: linear-gradient(20deg, rgb(120, 55, 194), rgb(164, 82, 255));
      color: white;
    }

    /* Show the dropdown menu on hover */
    .universal-dropdown:active .dropdown-content,
    .universal-dropdown:hover .dropdown-content {
      display: block;
    }

    /* Change the background color of the dropdown button when the dropdown content is shown */
    .universal-dropdown:active .dropbtn,
    .universal-dropdown:hover .dropbtn {
      background: linear-gradient(20deg, rgb(120, 55, 194), rgb(164, 82, 255));
    }
    .button-select svg {
      display: flex;
      align-items: flex-start;
      width: 25px;
      height: 25px;
    }
    .u-title {
      font-size: 14px;
    }

    /*.dropdown-small{
      height: 28vh;
    }*/
  }
  @media only screen and (min-width: 1024px) {
    button {
      color: white;
      background-color: transparent;
      border: none;
    }
    .u-main-universal-dropdown {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      border-radius: 0.5rem;
      width: 100%;
    }
    .u-tab-label {
      padding-top: 0;
      padding-bottom: 0.1rem;
      align-items: center;
      justify-content: center;
    }
    .universal-dropdown {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
    /*.dropbtn:checked + .u-tab-label::after {
    transform: rotate(90deg);
    }*/

    /* Style The Dropdown Button */
    .dropbtn {
      background: #353940;
    border: 1px solid rgb(164, 82, 255);
      color: white;
      padding: 5px;
      font-size: 16px;
      width: 100%;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      height: 40px;
    }

    /* The container <div> - needed to position the dropdown content */
    .universal-dropdown {
      height: 100%;
     
    }

    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
      display: none;
      position: absolute;
      top: 2.4rem;
      background-color: #353535;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
      z-index: 1;
      width: 100%;
      height: auto;
      max-height: 15rem;
      overflow-y: auto;
      cursor: pointer;
    }

    .dropdown-content::-webkit-scrollbar {
      border-radius: 5px;
      width: 0.5rem;
    }
    .dropdown-content::-webkit-scrollbar-thumb {
       background: linear-gradient(20deg, rgb(120, 55, 194), rgb(164, 82, 255));
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

    /* Links inside the dropdown */
    .dropdown-content .u-select {
      color: white;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      border-bottom: 1px solid rgb(164, 82, 255);
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    /* Change color of dropdown links on hover */
    .u-select:hover {
       background: linear-gradient(20deg, rgb(120, 55, 194), rgb(164, 82, 255));
      color: white;
      cursor: pointer;
    }

    /* Show the dropdown menu on hover */
    .universal-dropdown:active .dropdown-content,
    .universal-dropdown:hover .dropdown-content {
      display: block;
    }

    /* Change the background color of the dropdown button when the dropdown content is shown */
    .universal-dropdown:active .dropbtn,
    .universal-dropdown:hover .dropbtn {
       background: linear-gradient(20deg, rgb(120, 55, 194), rgb(164, 82, 255));
    }
    .button-select svg {
      display: flex;
      align-items: flex-start;
      width: 25px;
      height: 25px;
    }
    .dropdown-large {
      height: 58vh;
    }
    /*.dropdown-small{
      height: 28vh;
    }*/
  }
</style>
