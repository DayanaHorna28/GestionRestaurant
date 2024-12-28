<script>
  import backend from "../../../../server";
  import { onMount } from "svelte";
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import Pagination from "../../Pagination.svelte";
  import Loading from "../../Loading.svelte";
  //import //alertify from "//alertifyjs";

  export let client;
  export let showModalAddGames;

  let providers = [];
  let brands = [];
  let filters = { page: 1, xpage: 20 };
  let games = { list: [] };
  let gameBrands = [];
  let gamesSelected = [];
  let promise;
  let brands_original = [];
  let brandswithoutclient = null;
  let isLoading=false;

  onMount(async () => {
    await listGamesWithoutClient();
    listBrandsWithoutClient();
  });

  const onPageClick = (page) => {
    filters.page = page;
  };

  const listGamesWithoutClient = async () => {
    let params = {
      ...filters,
      clientId: client.id,
    };
    if (params.provider == "") delete params.provider;
    if (params.brand == "") delete params.brand;
    if (params.search == "") delete params.search;
    try {
      let games_ = await backend.games.listGamesWithoutClient(params);
      games = games_.data;
      games.list = games_.data.list;
    } catch (error) {
      //alertify.error("No se puede listar juegos", error);
    }
  };

  const listBrandsWithoutClient = async () => {
    let clientId = client.id;
    try {
      brandswithoutclient =
        await backend.provider.listBrandsWithoutClient(clientId);
      providers = getUniqueProviders(brandswithoutclient.data).sort();
      brands_original = brandswithoutclient.data;
      brands = brands_original.filter((e) => e.provider == providers[0]);
    } catch (error) {
      //alertify.error("Error al listar marcas", error);
    }
  };

  const getUniqueProviders = (data) => {
    let providerUnique = [];
    for (let i = 0; i < data.length; i++) {
      let exit = providerUnique.find((e) => e == data[i].provider);
      if (!exit) providerUnique.push(data[i].provider);
    }
    return providerUnique;
  };

  const onChangeProvider = async (isfilter) => {
    let params = {
      provider: filters.provider,
      clientId: client.id,
    };
    try {
      let { data } = await backend.games.listBrandsNotByClient(params);
      if (isfilter) {
        brands = data;
        filters.brand = "";
      } else {
        gameBrands = data;
      }
    } catch (error) {
      //alertify.error("No se logro listar los marca");
    }
  };

  const onAllSelected = () => {
    try {
      const allSelected = games.list.every((game) => game.checked === 1);
      const newSelectionValue = allSelected ? 0 : 1;
      games.list = games.list.map((game) => ({
        ...game,
        checked: newSelectionValue,
      }));
      games.list.forEach((game) => {
        let gameIndex = gamesSelected.findIndex((e) => e.id == game.id);
        if (game.checked && gameIndex === -1) {
          gamesSelected.push(game);
        } else if (!game.checked && gameIndex > -1) {
          gamesSelected.splice(gameIndex, 1);
        }
      });
    } catch (error) {
      //alertify.error("No se puede seleccionar todos los juegos");
    }
  };

  const onGameSelectedChange = (game) => {
    try {
      let gameIndex = gamesSelected.findIndex((e) => e.id == game.id);
      if (game.checked && gameIndex === -1) {
        gamesSelected.push(game);
      } else if (!game.checked && gameIndex > -1) {
        gamesSelected.splice(gameIndex, 1);
      }
    } catch (error) {
      //alertify.error("Error", error, "No se seleccionó");
    }
  };

  const onShowAddGames = () => {
    showModalAddGames = !showModalAddGames;
  };

  const activeGames = async () => {
  if (gamesSelected.length) {
    isLoading=true;


    for (let i = 0; i < gamesSelected.length; i++) {
      let game = gamesSelected[i];
      try {
        let response = await backend.games.addGametoClient({
          clientId: client.id,
          gameId: game.id,
        });
        //alertify.success(`Procesado! ${game.name}`);
      } catch (error) {
         //alertify.error(`Error! ${game.name}`);
      }
    }

    gamesSelected = [];
    listGamesWithoutClient();
  }
  isLoading=false;

};

</script>

<Modal isOpen={showModalAddGames} toggle={onShowAddGames} size={"xl"}>
  <ModalHeader toggle={onShowAddGames}>Agregar Juegos</ModalHeader>
  <ModalBody>
    <div class="bo-modal-games">
      <div class="bo-games-modal-header">
        <div class="bo-concept-search">
          <span>Proveedor</span>
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
          <span>Marca</span>
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
            promise = listGamesWithoutClient();
          }}><i class="bi bi-search" /></button
        >
      </div>
      <div>
        <table class="table table-striped table-sm">
          <thead class="table-dark">
            <tr>
              <th
                ><button
                  on:click={onAllSelected}
                  class="btn btn-light btn-sm p-0"
                  title="Seleccionar todo"
                  ><i class="bi bi-check2-all" /></button
                >ID</th
              >
              <th>PROVEEDOR</th>
              <th>MARCA</th>
              <th>NOMBRE</th>
              <th>MODO</th>
            </tr>
          </thead>
          {#if games.list.length > 0}
            {#await promise}
              <tbody style="min-height: 80px;">
                <tr
                  ><td colspan="6" style="position:relative"
                    ><Loading loading /></td
                  ></tr
                >
              </tbody>
            {:then l}
              <tbody>
                {#each games.list as game}
                  <tr>
                    <td
                      ><input
                        type="checkbox"
                        bind:checked={game.checked}
                        on:change={onGameSelectedChange(game)}
                      />{game.id}</td
                    >
                    <td>{game.provider}</td>
                    <td>{game.brand}</td>
                    <td>{game.name}</td>
                    <td
                      ><i
                        title={game.mode}
                        class="bi bi-{game.mode == 'mb' ? 'tablet' : 'display'}"
                      /></td
                    >
                  </tr>
                {/each}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6">
                    <div class="bo-modal-games-pagination">
                      {#if games.list.length}
                        <Pagination
                          bind:total={games.total}
                          bind:xpage={games.xpage}
                          bind:current={games.page}
                          {onPageClick}
                        />
                      {/if}
                    </div>
                  </td>
                </tr>
              </tfoot>
            {/await}
          {:else}
            <tbody style="min-height: 80px;">
              <tr>
                <td colspan="6">
                  <span>No se encontraron resultados</span>
                </td>
              </tr>
            </tbody>
          {/if}
        </table>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    
    <button on:click={activeGames} class="btn btn-primary btn-sm" type="button" disabled={isLoading}>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: {isLoading ? 'inline-block' : 'none'};"></span>
      {isLoading ? 'Cargando...' : 'Guardar'}
    </button>

  </ModalFooter>
</Modal>

<style>
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
</style>
