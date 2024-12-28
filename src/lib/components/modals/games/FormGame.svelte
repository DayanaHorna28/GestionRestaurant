<script>
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import backend from "../../../../server";
  import Configuration from "../../../../config";
  import { onDestroy, onMount } from "svelte";
  import moment from "moment";
  const conf = Configuration.getConfiguration();

  export let showGameModal;
  export let game;
  export let listGames;

  onMount(async () => {
    
    listProvider();
    if (!game.id) {
      game.clicks = 1;
      game.position = 1;
      game.original = 1;
      game.direct = 1;
      game.includeMobile = true;
      game.status = 1;
      game.category = game.category || "slot"; 
      game.reg_date = moment().format("YYYY-MM-DD");
    } else {
      game.reg_date = moment(game.reg_date).format("YYYY-MM-DD");
    }
    await onChangeCategory(false); 
  });

  onDestroy(() => {
    game = {};
    listGames();
  });

  let dataFile = null;
  let files;
  let image = null;
  let showImage = false;
  let categories = [];
  let typesGames = [];
  let providers = [];
  let gameBrands = [];

  let status = [
    { value: 1, name: "Activo" },
    { value: 2, name: "Desactivo" },
  ];

  let origen = [
    { value: 1, name: "Original" },
    { value: 2, name: "Replica" },
  ];

  let direct = [
    { value: 1, name: "Directo" },
    { value: 2, name: "Agregador" },
  ];

  function onChangeImage() {
    let file = files[0];
    if (file) {
      showImage = true;
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
    }
  }

  async function saveGame() {
    // Cargar envio de imagen
    const formData = new FormData();
    if (!game.gameid) return alert("Ingrese el Game ID");
    if (!game.provider) return alert("Ingrese el Proveedor");
    if (!game.brand) return alert("Ingrese la Brand");
    if (!game.name) return alert("Ingrese el Nombre de juego");
    if (!game.original) return alert("Seleccione el origen del juego");
    if (files && files.length) { formData.append("file", files[0]); }
    if (game.description == null) { game.description = "New game"; }
    if (game.id) formData.set("id", Number(game.id));
    formData.set("gameid", game.gameid);
    formData.set("provider", game.provider);
    formData.set("name", game.name);
    formData.set("description", game.description);
    formData.set("type", game.type);
    formData.set("mode", game.mode);
    formData.set("brand", game.brand);
    formData.set("status", game.status);
    formData.set("position", game.position);
    formData.set("category", game.category);
    formData.set("clicks", game.clicks);
    formData.set("original", game.original);
    formData.set("direct", game.direct);
    let response = await backend.games.saveGame(formData);
    showGameModal = false;
  }

  const getImgUrl = () => {
    return `${conf.ASSETS}/us_img_games/${game.gameid ? game.gameid : ""}${game.urlimage}`;
  };

  const listProvider = async () => {
    try {
      let response = await backend.games.listProvider();
      providers = response.data.sort();
      listCategories();
    } catch (error) {
      alert("No se puede listar proveedores");
    }
  };

  const listCategories = async () => {
    try {
      let data = await backend.games.listCategories();
      categories = data.data.sort();
    } catch (error) {
      alert("No se puede listar categorias");
    }
  };

  const onChangeProvider = async (isfilter) => {
    let params = {
      provider: game.provider,
    };
    try {
      let { data } = await backend.games.listBrandsByClient(params);
      gameBrands = data;
    } catch (error) {
      alert("No se pudo mostrar marcas");
    }
  };

  const onChangeCategory = async (isFilter) => {
    let category = game.category || (isFilter ? isFilter : "slot"); // Use default category if not filtering
    try {
      let { data } = await backend.games.listTypes(category);
      typesGames = [...data.filter(gameType => {
        return gameType && gameType !== gameType.toLowerCase() && gameType !== 'undefined' && gameType !== '0' && gameType !== 'scratch';
      })];
      console.log(typesGames);
    } catch (error) {
      alert("No se pudo mostrar los tipos de juegos");
    }
  };

  const onShowGameModal = () => (showGameModal = !showGameModal);
</script>



<Modal isOpen={showGameModal} toggle={onShowGameModal} size={"xl"}>
  <ModalHeader toggle={onShowGameModal}>Juego {game.name || ""}</ModalHeader>
  <ModalBody>
    <div class="strech">
      <div class="row data">
        <div class="mb-3 col">
          <span class="form-label">ID</span>
          <input class="form-control" bind:value={game.id} disabled />
        </div>
        <div class="mb-3 col">
          <span class="form-label">GAME ID</span>
          <input class="form-control" bind:value={game.gameid} />
        </div>
        <div class="mb-3 col">
          <span class="form-label">PROVEEDOR</span>
          <input class="form-control" list="providers" bind:value={game.provider} on:change={() => onChangeProvider(game.provider)} />
          <datalist id="providers">
            {#each providers as provider}
              <option>{provider}</option>
            {/each}
          </datalist>
        </div>
        <div class="mb-3 col">
          <span class="form-label">MARCA</span>
          <input class="form-control" list="brands-dl" bind:value={game.brand} />
          <datalist id="brands-dl">
            {#each gameBrands as brand}
              <option>{brand}</option>
            {/each}
          </datalist>
        </div>
      </div>
      <div class="row">
        <div class="mb-3 col">
          <span class="form-label">NOMBRE</span>
          <input class="form-control" bind:value={game.name} />
        </div>
        <div class="mb-3 col">
          <span class="form-label">CATEGORIA</span>
          <select class="form-control" bind:value={game.category} on:change={() => onChangeCategory(game.category)}>
            {#each categories as category}
              <option>{category}</option>
            {/each}
          </select>
        </div>
        <div class="mb-3 col">
          <span class="form-label">TIPO</span>
          <select class="form-control" bind:value={game.type}>
            <option value="">Selecciona un tipo</option>
            {#each typesGames as typesGame}
              <option value={typesGame}>{typesGame}</option>
            {/each}
          </select>
        </div>
        <div class="mb-3 col">
          <span class="form-label">FECHA</span>
          <input type="date" class="form-control" bind:value={game.reg_date} />
        </div>
      </div>
      <div class="row">
        <div class="mb-3 col">
          <span class="form-label">ESTADO</span>
          <select class="form-control" bind:value={game.status}>
            {#each status as statu}
              <option value={statu.value}>{statu.name}</option>
            {/each}
          </select>
        </div>
        {#if game.id}
          <div class="mb-3 col">
            <span class="form-label">POSICION</span>
            <input class="form-control" bind:value={game.position} />
          </div>
        {/if}
      </div>
      <div class="row">
        <div class="mb-3 col">
          <span class="form-label">ORIGINAL</span>
          <select class="form-control" bind:value={game.original}>
            {#each origen as origen}
              <option value={origen.value}>{origen.name}</option>
            {/each}
          </select>
        </div>
        <div class="mb-3 col">
          <span class="form-label">DIRECTO</span>
          <select class="form-control" bind:value={game.direct}>
            {#each direct as direct}
              <option value={direct.value}>{direct.name}</option>
            {/each}
          </select>
        </div>
        <div class="mb-1 col">
          <span class="form-label">Comentarios</span>
          <input class="form-control" bind:value={game.description} />
        </div>
      </div>
    </div>

    <div class="wrapp-image">
      {#if game.gameid}
        <td class="center">
          <img class="img_game" src={getImgUrl()} alt="" on:error={(e) => (e.target.src = `${conf.ASSETS}/us_img_games/_no_game1.png`)} />
        </td>
      {/if}
      <div class="new-image">
        <input accept="image/*" id="fileUpload" type="file" bind:files on:change={onChangeImage} />
        {#if showImage}
          <img bind:this={image} src="" alt="Preview" />
        {/if}
        {#if dataFile && files[0]}
          <p>{files[0].name}</p>
        {/if}
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn-new btn-sm" on:click={saveGame}>Guardar</button>
  </ModalFooter>
</Modal>

<style>
  @media (max-width: 1024px) {
    input {
      cursor: pointer;
    }
    .wrapp-image {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      gap: 0.5rem;
    }
    input {
      cursor: pointer;
    }
    .data {
      display: flex;
      flex-direction: column;
    }
  }
  @media (min-width: 1025px) {
    input {
      cursor: pointer;
    }
    .wrapp-image {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      gap: 0.5rem;
    }
    input {
      cursor: pointer;
    }
  }
</style>
