<script>
  import AddGamesTops from "./AddGamesTops.svelte";
  import { ICONS } from "./../../../../../js/icons.js";
  import { onMount } from "svelte";
  import {Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../../../server";
  import DropDown from "../../../../DropDown.svelte";

  export let showModalEditGamePosition;
  export let client;

  let sections = [];
  let filters = { page: 1, xpage: 20 };
  let types = [];
  let selectedSectionId = 1;
  let selectedTypeId = 1;
  let showModalAddGamePosition = false;
  let game_temp_a = [];
  let gamesTop = { games: []};
  let searchTerm = "";
  let filteredSections = sections;
  let showMenu = false;
  let titleSections = "Secciones";
  let titleTypes = "Categorias";
  let selectedSectionName = "Sección no seleccionada";
  let selectedTypeName = "Categoría no seleccionada";
  let searchEnabled = true; // Habilitar búsqueda por defecto

  onMount(() => {
    listSections();
    listTypes();
    listGamesTop();
  });

  // Filtrar cuando cambie el searchTerm
  $: 
  if(filteredSections.length > 0) {
    filteredSections = sections.filter((section) =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  const addGamesTopModal = () => {
    showModalAddGamePosition = true;
  };

  const onShowEditGamePosition = () =>(showModalEditGamePosition = !showModalEditGamePosition);

  const saveGamePosition = async() =>{
    if (!selectedSectionId || !selectedTypeId) {
      alertify.error("Seleccione una sección y una categoría.");
      return;
    }
    // Validar posiciones duplicadas y límite máximo
    const positions = gamesTop.games.map(game => game.position);
    const uniquePositions = new Set(positions);
    
    if (uniquePositions.size !== positions.length) {
      alertify.error("Las posiciones deben ser únicas.");
      return;
    }

    const maxPosition = gamesTop.games.length;
    if (positions.some(pos => pos < 1 || pos > maxPosition)) {
      alertify.error(`La posición debe estar entre 1 y ${maxPosition}.`);
      return;
    }

    // Reordenar posiciones
    const sortedGames = [...gamesTop.games].sort((a, b) => a.position - b.position);
    sortedGames.forEach((game, index) => {
      game.position = index + 1; // Asignar posiciones continuas
    });
    const requestBody = gamesTop.games.map((game) => ({
      id: game.gameTop_id ?? "",
      gameId: game.gameId ?? game.id,
      clientId: client.id,
      sectionId: selectedSectionId,
      typeId: selectedTypeId,
      position: game.position,
    }));
    console.log("REQUEST: ",requestBody);
    
    try {
      await backend.client.saveGamesPosition(requestBody);
      alertify.success("Posiciones guardadas correctamente.");
      onShowEditGamePosition();
    } catch (error) {
      alertify.error("Error al guardar posiciones.");
      console.error(error);
    }
  };

  const updateGamePosition = (game, newPosition) => {
    // Validar el nuevo valor de posición
    const maxPosition = gamesTop.games.length;
    if (newPosition < 1 || newPosition > maxPosition) {
      alertify.error(`La posición debe estar entre 1 y ${maxPosition}.`);
      return;
    }

    // Cambiar la posición del juego
    game.position = newPosition;

    // Reordenar automáticamente
    const sortedGames = [...gamesTop.games].sort((a, b) => a.position - b.position);
    sortedGames.forEach((g, index) => {
      g.position = index + 1; // Asignar posiciones continuas
    });

    // Actualizar el estado de gamesTop
    gamesTop.games = sortedGames;
  };

  const gamesTemp = (list) => {
    if (!Array.isArray(list)) {
      console.error("El parámetro 'list' no es un arreglo");
      return;
    }
    const cleanedGames = list.map(({ position, ...rest }) => rest);
    game_temp_a.games = [...cleanedGames];
    gamesTop.games = [...game_temp_a.games];
  };
  
  const changeSection = (section)=>{
    selectedSectionId = section.id;
    selectedSectionName = section.name; // Actualizar nombre seleccionado
    showMenu = false;
    listGamesTop();
  }
  const changeType = (type)=>{
    selectedTypeId = type.id;
    selectedTypeName = type.name; // Actualizar nombre seleccionado
    showMenu = false;
    listGamesTop();
  }

  const listGamesTop = async() =>{
    let params = {
      ...filters,
      clientId: client.id,
      sectionId: selectedSectionId,
      typeId: selectedTypeId,
    };
    try {
      let response = await backend.client.listTopGames(params);
      gamesTop = response.data;
      console.log("GamesTop: ", gamesTop);
    } catch (error) {
      console.log("Failed to list");
    }
    
  }

  const listSections = async ()=>{
    let response = await backend.client.listSections();
    sections = response.data;
  }

  const listTypes = async ()=>{
    let response = await backend.client.listTypes();
    types = response.data;
  }

  const addType = async (type)=>{
    let params = {
      name: type
    }
    try {
      await backend.client.addType(params);
      listTypes();
    } catch (error) {
      console.log("Failed to add type")
    }
  }

  const deleteGame = async (game)=>{
    let id = game.gameTop_id;
    try {
      await backend.client.deleteTops(id);
      listGamesTop();
    } catch (error) {
      console.log("Failed to delete game");
    }
  }

  const isOnlyNumber = (event) => {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      alertify.error("Ingrese solo números positivos");
    }
  };
</script>

<Modal isOpen={showModalEditGamePosition} toggle={onShowEditGamePosition} class="modal-fullscreen" >
  <ModalHeader toggle={onShowEditGamePosition}>Editar la posición de juegos: {client.businessname}</ModalHeader>
  <ModalBody>
    <div class="container-tops">

      <div class="filters">
        <div class="filter-group">
          <DropDown
            items={sections}
            bind:title={titleSections}
            bind:searchEnabled
            onSelectItem={(item) => changeSection(item)}
          />
        </div>
        <div class="filter-group">
          <DropDown
            items={types}
            bind:title={titleTypes}
            bind:searchEnabled
            addEnabled={true}
            onSelectItem={(item) => changeType(item)}
            {addType}
          />
        </div>
        <div class="filter-group">
          <button on:click={listGamesTop} class="search-btn btn btn-sm">{@html ICONS.reload}</button>
          <button on:click={addGamesTopModal} class="search-btn btn btn-sm">AGREGAR {@html ICONS.addCircle}</button>
        </div>
      </div>
  
      <div>
        <span>La sección seleccionada es: <strong>{selectedSectionName}</strong></span>
        <span> y la categoría seleccionada es: <strong>{selectedTypeName}</strong></span>
      </div>
  
      <div style="overflow-x: auto;">
        <table size="sm" class="table table-striped table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>PROVEEDOR</th>
              <th>GAMEID</th>
              <th>NOMBRE</th>
              <th>SECCIÓN</th>
              <th>CATEGORIA</th>
              <th>POSICIÓN</th>
              <th class="center">-</th>
            </tr>
          </thead>
          <tbody style="min-height: 80px;">
            {#if gamesTop.games.length > 0}
              {#each gamesTop.games as game}
                <tr>
                  <td>{game.gameTop_id}</td>
                  <td>{game.provider}</td>
                  <td>{game.gameId || game.id}</td>
                  <td>{game.gameName || game.name}</td>
                  <td>{game.sectionName || selectedSectionName}</td>
                  <td>{game.typeName || selectedTypeName}</td>
                  <td><input 
                    bind:value={game.position} 
                    on:keypress={isOnlyNumber}
                    on:change={(e) => updateGamePosition(game, parseInt(e.target.value))}>
                  </td>
                  <td><button class="btn btn-sm btn-pink" on:click={() => deleteGame(game)}>{@html ICONS.delete}</button></td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

  </ModalBody>
  <ModalFooter>
    <button on:click={saveGamePosition} class="btn btn-sm btn-save">Guardar</button>
  </ModalFooter>
</Modal>

{#if showModalAddGamePosition}
  <AddGamesTops bind:showModalAddGamePosition client={client.id} {gamesTemp} />
{/if}

<style>
  .container-tops{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .filters {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .filter-group {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }


  .search-btn,.btn-save {
    background: #fc0074;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
  }
  .search-btn:hover{
    background-color: #d6478a;
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
  }
  .btn-pink{
    background-color: #FF1493;
    color: white;
  }
</style>
