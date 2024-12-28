<script>
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import backend from "../../../../server";
  import Pagination from "../../Pagination.svelte";
  import { onMount } from "svelte";
  import Loading from "../../Loading.svelte";
  import AddGames from "./AddGames.svelte";
  import alertify from "alertifyjs";

  export let client = {};
  export let showModalGames;
  export let onAddGames;

  let providers = [];
  let brands = [];
  let games = { list: [] };
  let filters = { page: 1, xpage: 20 };
  let promise;
  let gameBrands = [];
  let gamesNoSelected = [];  
  let gamesSelected = [];
  let isLoading=false;

  onMount(async () => {
    filters = { provider: "", brand: "", mode: "" };
    await listProviderByClient();
    promise = listGames();
    // Initialize gamesNoSelected with all game IDs
    gamesNoSelected = games.list.map(game => game.id);
  });

  const listGames = async () => {
    try {
      console.log("actualizando");
      games.list = [];
      let params = { ...filters, clientId: client.id };
      if (params.provider == "") delete params.provider;
      if (params.brand == "") delete params.brand;
      if (params.mode == "") delete params.mode;
      if (params.search == "") delete params.search;
      let games_ = await backend.games.listGamesbyclient(params);
      // Set checked property for each game
      games_.data.list.forEach(game => {
        game.checked = true;
      });
      games = games_.data;
    } catch (error) {
      alertify.error("No se puede listar los juegos");
    }
  };

  const listProviderByClient = async () => {
    try {
      let response = await backend.provider.listByClient(client.id);
      providers = response.data.sort();
    } catch (error) {
      alertify.error("Error:", error, `No se puede listar`);
    }
  };

  const onChangeProvider = async (isfilter) => {
    let params = {
      provider: filters.provider,
      clientid: client.id,
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

  const onPageClick = (page) => {
    filters.page = page;
    console.log(filters);
    listGames();
  };

  const onGameSelectedChange = (game) => {
    try {
      if (!game.checked) gamesNoSelected.push(game);
      else {
        const index = gamesNoSelected.indexOf(game);
        if (index !== -1) {
          gamesNoSelected.splice(index, 1);
        }
      }
      console.log("Games not selected", gamesNoSelected);
    } catch (error) {
      alertify.error("Error, No se pudo seleccionar el juego");
    }
  };

  const onDesactivateGame = async () => {
    if (gamesNoSelected.length) {
      isLoading=true;
      for (let i = 0; i < gamesNoSelected.length; i++) {
        console.log("Seleccion", gamesNoSelected[i].id);
        let gameId = gamesNoSelected[i].id;
        try {
          let response = await backend.games.removeGamesbyclient({
            clientId: client.id,
            gameId: gameId,
          });
          alertify.success(`Procesado! ${gamesNoSelected.map((e) => e.name)}`);
          console.log(`Procesado! ${gamesNoSelected.map((e) => e.name)}`)
        } catch (error) {
          alertify.error(`Error! ${gamesNoSelected.map((e) => e.name)}`);
          console.log(`Error! ${gamesNoSelected.map((e) => e.name)}`);
        }
      }
    }
    listGames();
    isLoading=false;
    gamesNoSelected = [];
  };

  const onShowEditGames = () => (showModalGames = !showModalGames);
</script>

<Modal isOpen={showModalGames} toggle={onShowEditGames} size={"xl"}>
  <ModalHeader toggle={onShowEditGames}>
    <h5 class="modal-title">
      Games de {client.businessname || ""}{" "}
      <button class="btn btn-primary btn-sm" on:click={onAddGames}>
        <i class="bi bi-plus-circle-fill" /> AGREGAR
      </button>{" "}
    </h5>
  </ModalHeader>
  <ModalBody>
    <div class="bo-modal-games">
      <div class="bo-games-modal-header">
        <div class="bo-concept-search">
          <span>Proveedor:</span>
          <select
            class="form-control"
            bind:value={filters.provider}
            on:change={onChangeProvider}
          >
            <option value="">Todos</option>
            {#each providers as provider}
              <option>{provider}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-search">
          <span>Marca:</span>
          <select class="form-control" bind:value={filters.brand}>
            <option value="">Todos</option>
            {#each brands as brand}
              <option>{brand}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-search">
          <span>Modo:</span>
          <select class="form-control" bind:value={filters.mode}>
            <option value="">Todos</option>
            <option value="wb">Web</option>
            <option value="mb">Mobile</option>
          </select>
        </div>
        <input
          class="form-control"
          placeholder="Buscar"
          bind:value={filters.search}
        />
        <button
          class="btn btn-primary btn-sm"
          title="Filtrar"
          on:click={() => {
            promise = listGames();
          }}
        >
          <i class="bi bi-search" />
        </button>
      </div>
      <div class="container-table-games">
        <table class="table table-striped table-sm">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>PROVEEDOR</th>
              <th>MARCA</th>
              <th>NOMBRE</th>
              <th>M</th>
            </tr>
          </thead>
          {#if games.list.length > 0}
            {#await promise}
              <tbody style="min-height: 80px;">
                <tr>
                  <td colspan="6" style="position:relative">
                    <Loading loading />
                  </td>
                </tr>
              </tbody>
            {:then l}
              <tbody>
                {#each games.list as game}
                  <tr>
                    <td>
                      <input
                        bind:checked={game.checked}
                        on:change={onGameSelectedChange(game)}
                        type="checkbox"
                      />
                      {game.id}
                    </td>
                    <td>{game.provider}</td>
                    <td>{game.brand}</td>
                    <td>{game.name}</td>
                    <td>
                      <i
                        title={game.mode}
                        class="bi bi-{game.mode == 'mb' ? 'tablet' : 'display'}"
                      />
                    </td>
                  </tr>
                {/each}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6">
                    {#if games.list.length}
                      <Pagination
                        bind:total={games.total}
                        bind:xpage={games.xpage}
                        bind:current={games.page}
                        {onPageClick}
                      />
                    {/if}
                  </td>
                </tr>
              </tfoot>
            {/await}
          {:else}
            <tbody>
              <tr>
                <td colspan="5">
                  <span style="text-align: center;">
                    No se encontraron resultados
                  </span>
                </td>
              </tr>
            </tbody>
          {/if}
        </table>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
   
    <button on:click={onDesactivateGame} class="btn btn-primary btn-sm" type="button"  title="Eliminar seleccionados" disabled={isLoading}>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: {isLoading ? 'inline-block' : 'none'};"></span>
      {isLoading ? 'Cargando...' : 'Guardar'}
    </button>
  </ModalFooter>
</Modal>

<style>
  @media (max-width: 1024px) {
    .bo-modal-games {
      background-color: white;
      width: 100%;
      height: 100%;
    }
    .bo-games-modal-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      gap: 0.8rem;
    }
    .bo-concept-search {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
    }
  }
  @media (min-width: 1025px) {
    .bo-modal-games {
      background-color: white;
      width: 100%;
      height: 100%;
    }
    .bo-games-modal-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      gap: 0.8rem;
    }
    .bo-concept-search {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
    }
  }
</style>
