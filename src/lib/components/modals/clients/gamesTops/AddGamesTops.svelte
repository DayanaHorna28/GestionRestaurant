<script>
	import Pagination from './../../../Pagination.svelte';
  import { ICONS } from "./../../../../../js/icons.js";
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../../../server";

  export let showModalAddGamePosition;
  export let client;
  export let gamesTemp;

  let providers = ["TODOS"];
  let brands = ["TODOS"];
  let filters = { page: 1, xpage: 10 };
  let games = {list:[]};
  let game_temp_a = {games: []};

  onMount(() => {
    listProviderByClient();
    listGames();
  });

  const listProviderByClient = async () => {
    try {
      let response = await backend.provider.listByClient(client);
      providers = response.data.sort();
    } catch (error) {
      alertify.error("Error:", error, `No se puede listar`);
    }
  };

  const onChangeProvider = async (isfilter) => {
    let params = {
      provider: filters.provider,
      clientid: client,
    };
    try {
      let { data } = await backend.games.listBrandsByClient(params);
      if (isfilter) {
        brands = data;
        filters.brand = "";
      } else {
        gameBrands = data;
      }
    } catch (error) {
      alertify.error("No se pudo mostrar marcas");
    }
  };

  const listGames = async () => {
    try {
      games.list = [];
      let params = { ...filters, clientId: client };
      if (params.provider == "") delete params.provider;
      if (params.brand == "") delete params.brand;
      if (params.mode == "") delete params.mode;
      if (params.search == "") delete params.search;
      let games_ = await backend.games.listGamesbyclient(params);
      games.list = games_.data.list.map(game => ({
        ...game, // Mantener todas las propiedades originales del juego
        checked: false, // Inicializar 'checked' como falso
      }));
    } catch (error) {
      alertify.error("No se puede listar los juegos");
    }
  };

  // Agregar o quitar un juego del array temporal
  const toggleGameSelection = (item) => {
    item.checked = !item.checked; // Cambiar el valor de `checked` al seleccionar/deseleccionar
    if (item.checked) {
      game_temp_a.games.push(item); // Si está seleccionado, lo agregamos
    } else {
      game_temp_a.games = game_temp_a.games.filter((game) => game.id !== item.id); // Si no está seleccionado, lo eliminamos
    }
    games.list = [...games.list];
    game_temp_a = { ...game_temp_a };
  };

  const saveGametemp = () => {
    alertify.confirm(
      "CONFIRMACIÓN",
      "¿Está seguro de realizar el siguiente proceso?",
      () => {
        try {
          gamesTemp(game_temp_a.games);
          addGamesModal();
        } catch (error) {
          alertify.error("Error al guardar");
        }
      },
      () => {}
    );
  };

  const onPageClick = (page) => {
    filters.page = page;
  };

  const searchEnter = (e) => {
    if (e.charCode === 13) listGames();
  };
  const addGamesModal = () =>(showModalAddGamePosition = !showModalAddGamePosition);

</script>

<Modal isOpen={showModalAddGamePosition} toggle={addGamesModal} size={"xl"}>
  <ModalHeader toggle={addGamesModal}>ESCOGE EL JUEGO</ModalHeader>
  <ModalBody>
    <div class="add-games-content">
      <div class="filters">
        <div class="filter-group">
          <b>Proveedor:</b>
          <select class="form-control" bind:value={filters.provider} on:change={() => onChangeProvider(filters.provider, "xfilter")} >
            <option value="">Todos</option>
            {#each providers as provider}
              <option>{provider}</option>
            {/each}
          </select>
        </div>
        <div class="filter-group">
          <b>Marca:</b>
          <select class="form-control" bind:value={filters.brand}>
            <option value="">Todos</option>
            {#each brands as brand}
              <option>{brand}</option>
            {/each}
          </select>
        </div>
        <div class="filter-group">
          <b>Buscar:</b>
          <div style="display: flex; flex-direction:row; gap:0.5rem">
            <input
              bind:value={filters.search}
              class="form-control"
              placeholder="Buscar"
              on:keypress={searchEnter}
            />
            <button
              class="btn search-btn btn-sm"
              title="Buscar"
              on:click={listGames}>{@html ICONS.search}</button
            >
          </div>
        </div>
      </div>

      <div class="table">
        <div class="table-header">
          <div class="column">ID</div>
          <div class="column">PROVEEDOR</div>
          <div class="column">MARCA</div>
          <div class="column">NOMBRE</div>
          <div class="column" style="text-align: center;">-</div>
        </div>
        <div class="table-body">
          {#each games.list as game}
            <div class="table-row {game.checked ? 'selected-row' : ''}">
              <div class="column">{game.id}</div>
              <div class="column">{game.provider}</div>
              <div class="column">{game.brand}</div>
              <div class="column">{game.name}</div>
              <div class="column" style="text-align: center;">
                <button
                  on:click={() => toggleGameSelection(game)}
                  class="btn-add {game.checked ? 'selected' : ''}">
                  {@html game.checked ? ICONS.minus : ICONS.addCircle}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <Pagination
        bind:total={games.total}
        bind:xpage={games.xpage}
        bind:current={games.page}
        {onPageClick}
      />
    </div>
  </ModalBody>
  <ModalFooter>
    <button on:click={saveGametemp} class="btn btn-sm btn-save">Guardar</button>
  </ModalFooter>
</Modal>

<style>
  .add-games-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .filter-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .form-control {
    border: 1px solid #fc0074;
  }

  .search-btn,
  .btn-save {
    background: #fc0074;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
  }
  .btn-add {
    background: #fc0074;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .table {
    border-collapse: collapse;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #fc0074;
  }

  .table-header {
    display: flex;
    background: #f0f0f0;
    font-weight: bold;
    border-radius: 0.5rem;
  }
  .table-row {
    display: flex;
    border-bottom: 1px solid #ddd;
  }
  .column {
    flex: 1;
    padding: 0.5rem;
    text-align: left;
    border: 1px solid #fc0074;
  }
  .selected-row{
    background-color: red;
  }

  .table-row.selected-row {
    background-color: #f4c9d3; /* Rosa pastel */
  }


  .selected {
    background-color: rgb(255, 192, 218);
  }

</style>
