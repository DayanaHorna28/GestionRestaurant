<script>
	import { ICONS } from './../js/icons.js';
  import { onMount } from "svelte";
  import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader} from "sveltestrap";
  import backend from "../server";
  import Configuration from "../config";
  import NewGame from "../../src/lib/components/modals/games/FormGame.svelte";
  import Pagination from "../lib/components/Pagination.svelte";
  import Loading from "../lib/components/Loading.svelte";
  import moment from "moment";
  import alertify from 'alertifyjs';

  const conf = Configuration.getConfiguration();
  let games = { list: [] };
  let showGameModal = false;
  let game = {};
  let providers = [];
  let brands = [];
  let filters = { page: 1, xpage: 30, mode: 'wb'};
  let orderBy = "gameid";
  let orderMode = "asc";
  let gameBrands = [];
  let loading = false;
  let showModalNoimages = false;
  let promise;
  let promiseNoImages;
  let gamesNoImages = [];
  let gamesNoImageStatus = "";
  let categories = [];
  let typesGames=[];

  onMount(() => {
    listProvider();
    listCategories();
  });

  let origen = [
    { value: 1, name: "Original" },
    { value: 2, name: "Replica" },
  ];

  const listGames = async () => {
    games.list = [];
    let params = { ...filters, orderBy, orderMode, category:game.category, type:game.type };
    if (params.brand == "") delete params.brand;
    if (params.provider == "") delete params.provider;
    if (params.status == "") delete params.status;
    if (params.mode == "") delete params.mode;
    if (params.original == "") delete params.original;
    if (params.from == "") delete params.from;
    if (params.to == "") delete params.to;
    if (params.search == "") delete params.search;
    if (!params.category) delete params.category;
    if (!params.type) delete params.type;
    try {
      loading = true;
      let games_ = await backend.games.list(params);
      loading = false;
      games = games_.data;
      filters.page = 1;
      alertify.success("Los juegos se listaron correctamente");
    } catch (error) {
      alertify.error("Error al listar correctamente");
    }
  };

  const listCategories = async () => {
    try {
      let data = await backend.games.listCategories();
      categories = data.data.sort();
      console.log("Categories:", categories);
    } catch (error) {
      alertify.error("No se puede listar categorias");
    }
  };

  const onChangeCategory = async (isfilter) => {
    console.log("onChangeCategory", isfilter);
    let category = isfilter;
    try {
      let { data } = await backend.games.listTypes(category);
      typesGames = data.filter(game => {
        // Filtrar los elementos según los criterios establecidos
        return game && game !== game.toLowerCase() && game !== 'undefined' && game !== '0' && game !== 'scratch';
      });
    } catch (error) {
      alertify.error("No se pudo mostrar los tipos de juegos");
    }
  };

  const prepareNew = () => {
    showGameModal = true;
    game.mode= 'wb';
  };

  const prepareEdit = (g) => {
    game = g;
    showGameModal = true;
  };

  const onPageClick = (page) => {
    filters.page = page;
    listGames();
  };

  const modalDeleteGame = (g) => {
    const game = g; // Asigna el juego seleccionado a la variable local
    alertify.confirm(
      "Cuidado", 
      `¿Estás seguro de eliminar <b>${game.name}</b>?`,
      async () => { // Si el usuario confirma
        try {
          let response = await backend.games.remove(game.id);
          console.log(response);
          listGames();
          alertify.success("Juego eliminado exitosamente!");
        } catch (error) {
          alertify.error("Error al eliminar el juego.");
        }
      },
      () => { // Si el usuario cancela
          alertify.message("Eliminación cancelada.");
      }
    );
  };

  const searchEnter = (e) => {
    if (e.charCode === 13) listGames();
  };
  const listProvider = async () => {
    let response = await backend.games.listProvider();
    providers = response.data.sort();
    filters.provider = "";
    listGames();
  };
  const onChangeProvider = async (provider, isfilter) => {
    let params = {
      provider: filters.provider,
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
  
  const setOrder = (field, mode) => {
    orderBy = field;
    orderMode = mode;
    listGames(); // Vuelve a listar los juegos con el nuevo orden
  };
  const prepareCheckImages = () => {
    showModalNoimages = true;
    gamesNoImages.list = [];
    let page = 1;
    promiseNoImages = checkImages(page);
  };
  const checkImages = async (page) => {
    let pages = Math.ceil(games.total / games.xpage);
    console.log("paginas", pages);
    gamesNoImageStatus = `Revisando pagina ${page} de ${pages}`;
    const mode = "wb";
    let params = { page: page, mode: mode };
    let { data } = await backend.games.list(params);
    //data.list = data.list.filter(e=>e.mode==="wb")
    for (var i = 0; i < data.list.length; i++) {
      let game_ = data.list[i];
      let url = getImgUrl(game_);
      if (/localhost/.test(location.href)) url = url.replace("https", "http");
      let exists = await checkIfImageExists(url);
      if (!exists) {
        gamesNoImages.push({ ...game_, url });
        console.log("No image", gamesNoImages);
      }
    }
    if (page <= pages && page <= 5) promiseNoImages = checkImages(page + 1);
    else {
      console.log("Finalizado");
      alertify.success("Busqueda de imagenes terminada.");
    }
  };

  function downloadCSVFile() {
    let data = gamesNoImages
      .map(
        (e) => `${e.id};${e.gameid};${e.name};${e.provider};${e.brand};${e.url}`
      )
      .reduce((s, e) => (s += e + "\n"), "");
    console.log(data);
    let csvFile = new Blob([data], { type: "text/csv" });
    var temp_link = document.createElement("a");
    temp_link.download = "games_no_image.csv";
    var url = window.URL.createObjectURL(csvFile);
    temp_link.href = url;
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
  }
  const checkIfImageExists = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      if (img.complete) {
        resolve(true);
      } else {
        img.onload = () => {
          resolve(true);
        };
        img.onerror = () => {
          resolve(false);
        };
      }
    });
  };
  const getImgUrl = (game) => {
    return `${conf.ASSETS}/us_img_games/${game.gameid}${game.urlimage}`;
  };

  const onShowModalNoimages = () => (showModalNoimages = !showModalNoimages);
</script>

<div class="bo-wrapp-games">
  <div class="header">
    <span class="title">GAMES</span>
    <button class="btn btn-primary btn-sm" on:click={prepareNew}>{@html ICONS.addCircle} NUEVO</button>
  </div>
  <div class="bo-header-filter">
    <label><b>Proveedor:</b>
      <select class="form-control" bind:value={filters.provider} on:change={() => onChangeProvider(filters.provider, "xfilter")}>
        <option value="">Todos</option>
        {#each providers as provider}
          <option>{provider}</option>
        {/each}
      </select>
    </label>
    <label
      ><b>Marca:</b>
      <select class="form-control" bind:value={filters.brand}>
        <option value="">Todos</option>
        {#each brands as brand}
          <option>{brand}</option>
        {/each}
      </select>
    </label>
    <label><b>Categoria</b>
      <select class="form-control" bind:value={game.category} on:change={() => onChangeCategory(game.category)}>
        <option value="">Todos</option>
        {#each categories as category}
          <option>{category}</option>
        {/each}
      </select>
    </label>
    <label><b>Tipo</b>
      <select class="form-control" bind:value={game.type}>
        <option value="">Selecciona un tipo</option>
        {#each typesGames as typesGame}
          <option value={typesGame}>{typesGame}</option>
        {/each}
      </select>
    </label>
    <label><b>ORIGINAL</b>
      <select class="form-control" bind:value={filters.original}>
        <option value="">Todos</option>
        {#each origen as origen}
          <option value={origen.value}>{origen.name}</option>
        {/each}
      </select>
    </label>
    <label
      ><b>Estado:</b>
      <select class="form-control" bind:value={filters.status}>
        <option value="">Todos</option>
        <option value="1">Activo</option>
        <option value="2">Desactivo</option>
      </select>
    </label>
    <label>
      <b>Desde:</b>
      <input class="form-control" type="date" bind:value={filters.from} />
    </label>
    <label>
      <b>Hasta:</b>
      <input class="form-control" type="date" bind:value={filters.to} />
    </label>
    <label>
      <b>Buscar:</b>
      <div style="display: flex; flex-direction:row; gap:0.5rem">
        <input
          bind:value={filters.search}
          class="form-control"
          type="text"
          placeholder="Buscar"
          on:keypress={searchEnter}
        />
        <button class="btn btn-primary btn-sm" title="Buscar" on:click={listGames}>{@html ICONS.search}</button>
      </div>
    </label>
  </div>
  <div class="bo-body-table-games">
    <div style="overflow-x: auto;">
      <table class="table table-striped table-sm responsive">
        <thead class="table-dark">
          <tr>
            <th class="sticky-column"><button class="btn btn-success btn-sm" on:click={prepareCheckImages}><span title="Juegos sin portadas">CCC</span></button></th>
            <th class="sticky-column">ID</th>
            <th class="sticky-column">GAME ID</th>
            <th title="Categoria del juego">CAT</th>
            <th>PROV</th>
            <th>MARCA</th>
            <th>NOMBRE</th>
            <th title="Tipo de juego, por defecto es CLAS (Clasico)">TIPO</th>
            <th>ORIGINAL</th>
            <th>POSICIÓN</th>
            <th>
              <ButtonDropdown>
                <DropdownToggle
                  title="Fecha de creación, menor a 30 dias es NEW (nuevo)"
                  class="btn-sm"
                  color="dark"
                  caret><b>CREACIÓN</b></DropdownToggle
                >
                <DropdownMenu>
                  <DropdownItem on:click={() => setOrder("reg_date", "asc")}
                    >Ascendente</DropdownItem
                  >
                  <DropdownItem on:click={() => setOrder("reg_date", "desc")}
                    >Descendente</DropdownItem
                  >
                </DropdownMenu>
              </ButtonDropdown>
            </th>
            <th>ESTADO</th>
            <th class="center">OPCIONES</th>
          </tr>
        </thead>
        {#await promise}
          <tbody style="min-height: 80px;"
            ><tr
              ><td colspan="14" style="position:relative"
                ><Loading loading /></td
              ></tr
            ></tbody
          >
        {:then l}
          <tfoot>
            <tr>
              <td colspan="14">
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
        <tbody>
          {#if games.list.length > 0}
            {#each games.list as game}
              <tr class={game.status == 0 ? "table-secondary" : ""}>
                <td class="sticky-column">
                  <img
                    class="img_game"
                    src={getImgUrl(game)}
                    alt=""
                    on:error={(e) =>
                      (e.target.src = `${conf.ASSETS}/us_img_games/_no_game1.png`)}
                  />
                </td>
                <td class="sticky-column">{game.id}</td>
                <td class="sticky-column">{game.gameid}</td>
                <td>{game.category}</td>
                <td>{game.provider}</td>
                <td>{game.brand}</td>
                <td>{game.name}</td>
                <td>{game.type}</td>
                <td>{game.original == 1 ? "ORIGINAL" : "REPLICA"}</td>
                <td>{game.position}</td>
                <td>{moment(game.reg_date).format("DD/MM/YYYY")}</td>
                <td style="text-align: center;"> <span class="status-circle {game.status == 1 ? 'status-active' : 'status-inactive'}"></span></td>
                <td style="text-align: center;">
                  <button style="border: 1px solid black;" class="btn btn-light btn-sm" on:click={() => prepareEdit(game)} >{@html ICONS.edit}</button>
                  <button class="btn btn-danger btn-sm" on:click={() => modalDeleteGame(game)}>{@html ICONS.delete}</button>
                </td>
              </tr>
            {/each}
          {:else}
            <tr><td colspan="14">NO SE ENCONTRARON RESULTADOS</td></tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

{#if showGameModal}
  <NewGame bind:game bind:showGameModal {listGames}></NewGame>
{/if}

<Modal isOpen={showModalNoimages} toggle={onShowModalNoimages} size={"xl"}>
  <ModalHeader toggle={onShowModalNoimages}>Juegos sin imagenes</ModalHeader>
  <ModalBody>
    <button on:click={downloadCSVFile}>CSV</button>
    <table id="games-noimage-table" class="table table-stripped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>GAMEID</th>
          <th>NAME</th>
          <th>PROV</th>
          <th>BRAND</th>
          <th>URL</th>
        </tr>
      </thead>
      {#await promiseNoImages}
        <caption style="caption-side: bottom;">{gamesNoImageStatus}</caption>
      {:then l}
        <tbody>
          {#each gamesNoImages as game}
            <tr>
              <td>{game.id}</td>
              <td>{game.gameid}</td>
              <td>{game.name}</td>
              <td>{game.provider}</td>
              <td>{game.brand}</td>
              <td>{game.url}</td>
            </tr>
          {/each}
        </tbody>
        <caption style="caption-side: bottom;"
          >Se encontraron {gamesNoImages.length} resultados.</caption
        >
      {/await}
    </table>
  </ModalBody>
</Modal>

<style>
  .bo-wrapp-games {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .header {
    display: grid;
    grid-template-columns: 80% 5%;
    align-self: center;
    justify-content: center;
    width: 100%;
  }
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  }
  .img_game {
    width: 40px;
    height: 30px;
  }
  .status-circle {
    width: 16px; /* Tamaño del círculo */
    height: 16px; /* Tamaño del círculo */
    border-radius: 50%; /* Hace que el elemento sea un círculo */
    display: inline-block;
    vertical-align: middle;
    align-items: center;
  }
  .status-active {
    background-color: green; /* Color para el estado activo */
  }
  .status-inactive {
    background-color: red; /* Color para el estado inactivo */
  }

  @media (max-width: 1199px) {
    input {
      cursor: pointer;
    }
    .bo-header-filter {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      flex-direction: row;
      gap: 0.5rem;
    }
    .bo-body-table-games {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }

    input {
      cursor: pointer;
    }
  }
  @media (min-width: 1200px) {
    input {
      cursor: pointer;
    }
    .bo-header-filter {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
      width: 100%;
    }

    .bo-body-table-games {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }
    input {
      cursor: pointer;
    }
  }
</style>
