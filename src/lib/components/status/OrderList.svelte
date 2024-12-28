<script>
  export let orders = []; // Lista de órdenes
  let showAll = false; // Controla si se muestran todas las órdenes o solo las primeras

  // Función para alternar entre mostrar más o menos órdenes
  function toggleShowAll() {
    showAll = !showAll;
  }
</script>

<div class="order-list">
  <!-- Renderiza las órdenes, mostrando solo las primeras 3 si `showAll` es false -->
  {#each (showAll ? orders : orders.slice(0, 3)) as order}
    <div class="order-item">
      <img src="/placeholder-avatar.png" alt={order.name} class="avatar" />
      <div class="details">
        <p class="name">{order.name}</p>
        <p class="time">{order.time}</p>
      </div>
    </div>
  {/each}

  <!-- Botón para alternar entre mostrar más o menos -->
  {#if orders.length > 3}
    <button class="show-more-button" on:click={toggleShowAll}>
      {showAll ? "Mostrar Menos" : "Mostrar Más"}
    </button>
  {/if}
</div>

<style>
  .order-list {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
    color: #fff;
  }

  .order-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
  }

  .details {
    flex-grow: 1;
  }

  .name {
    font-size: 1rem;
    font-weight: bold;
  }

  .time {
    font-size: 0.9rem;
    color: #aaa;
  }

  .show-more-button {
    background: #e63946;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    width: 100%;
    text-align: center;
    font-size: 1rem;
  }

  .show-more-button:hover {
    background: #d62839;
  }
</style>
