<script>
	import { ICONS } from './../js/icons.js';
    import Configuration from "../config";
    
    const conf = Configuration.getEnv();
    export let onLogout;
    export let userLoged;
    let showDropdown = false;


    function toggleDropdown() {
        console.log("Ingresa");
        showDropdown = !showDropdown;
        console.log("showDropdown", showDropdown);
        
    }
</script>

<nav class="navbar">
    <div class="navbar-brand">
        <img class="logo-universal" alt="Logo Universal Soft" src="https://assetsapiusoft.s3.us-west-2.amazonaws.com/bo_fontend/logo_small.png"/>
    </div>
      <button class="profile" on:click={toggleDropdown}>
        <span>{@html ICONS.user} {userLoged.username || ''}</span>
      </button>
      {#if showDropdown}
        <div class="dropdown-op">
          <button class="dropdown-item-op" on:click={onLogout}>Cerrar sesión</button>
        </div>
      {/if}
</nav>

<style>
    .navbar {
        background-color: #333;
        padding: 0.5rem 1rem;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .navbar-brand {
        display: flex;
        align-items: center;
    }

    .logo-universal {
        height: 25px;
    }
    .profile{
        display: flex;
        flex-direction: row;
        text-align: center;
        align-items: center;
        border: none;
        gap: .5rem;
        position: relative;
        background-color: #FA017C;
        color: white;
        border-radius: 0.5rem;
        font-size: 1.2rem
    }
    .dropdown-op {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #fff;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
        border-radius: 0.25rem;
        overflow: hidden;
        z-index: 1000;
        min-width: 200px;
    }
    .dropdown-item-op {
        width: 100%;
        padding: 0.5rem 1rem;
        text-align: center;
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .dropdown-item-op:hover {
        background-color: #f1f1f1;
    }
   
</style>
