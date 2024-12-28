<script>
	import { ICONS } from './../../../js/icons.js';
  export let onCategoryChange;
  export let active_view;
</script>

  <div class="btn-menu-central">
    <button class="btn-op {active_view == 'games'? 'u-category-select' : ''}"  on:click={()=>onCategoryChange("games")}>
      {@html ICONS.games}
      <span>Juegos</span>
    </button>
    <button class="btn-op {active_view == 'brands'? 'u-category-select' : ''}"  on:click={()=>onCategoryChange("brands")}>
      <i class="bi bi-people"></i>
      <span>Marcas</span>
    </button>
    <button class="btn-op {active_view == 'clients'? 'u-category-select' : ''}" on:click={()=>onCategoryChange("clients")}>
      {@html ICONS.persons}
      <span>Clientes</span>
    </button>
    <button class="btn-op {active_view == 'users'? 'u-category-select' : ''}" on:click={()=>onCategoryChange("users")}>
      {@html ICONS.user}
      <span>Jugadores</span>
    </button>
    <button class="btn-op {active_view == 'admins'? 'u-category-select' : ''}"  on:click={()=>onCategoryChange("admins")}>
      {@html ICONS.user}
      <span>Administradores</span>
    </button>
    <button class="btn-op {active_view == 'transactions'? 'u-category-select' : ''}" on:click={()=>onCategoryChange("transactions")}>
      {@html ICONS.trx}
      <span>Transacciones</span>
    </button>
    <button class="btn-op {active_view == 'direct_trx'? 'u-category-select' : ''}" on:click={()=>onCategoryChange('direct_trx')}>
      {@html ICONS.trx}
      <span>Transacciones Manuales</span>
    </button>
    <button class="btn-op {active_view == 'provider'? 'u-category-select' : ''}" on:click={() => onCategoryChange('provider')}>
      {@html ICONS.graf}
      <span>R. Proveedores</span>
    </button>
    <button class="btn-op {active_view == 'client'? 'u-category-select' : ''}"  on:click={() => onCategoryChange('client')}>
      {@html ICONS.graf}
      <span>R. Clientes</span>
    </button>
    <button class="btn-op {active_view == 'monday'? 'u-category-select' : ''}" on:click={() => onCategoryChange('monday')}>
      {@html ICONS.database}
      <span>Monday</span>
    </button>
    <button class="btn-op {active_view == 'bonus'? 'u-category-select' : ''}" on:click={() => onCategoryChange('bonus')}>
      {@html ICONS.database}
      <span>Campañas</span>
    </button>
    <button class="btn-op {active_view == 'bonus'? 'u-category-select' : ''}" on:click={() => onCategoryChange('freebet')}>
      {@html ICONS.database}
      <span>FreeBets</span>
    </button>
  </div>

<style>
  .btn-menu-central {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    flex-direction: row;
    padding: 0.5rem;
  }

  .btn-op {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    width: 12rem;
    text-align: center;
    color: #fff;
    border-radius: 0.4rem;
    background-color: #FF0090;
    border: none; /* Elimina el borde predeterminado del botón */
  }

  .btn-op:hover {
    background-color: #e100ff; /* Efecto hover */
  }

  .bi {
    font-size: 1.5em;
    margin-bottom: 10px;
  }
  .u-category-select{
    background-color: #e100ff;
    border: none; /* Elimina el borde predeterminado del botón */
    color: #fff; /* Color del texto */
    border-radius: 0.4rem; /* Redondeado del botón */
    font-weight: bold; /* Negrita el texto */
    cursor: pointer; /* Cursos al pasar el mouse */
    transition: background-color 0.3s; /* Efecto de transición */
  }

 @media (max-width: 600px) {
  .btn-menu-central {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

  }
}
</style>
