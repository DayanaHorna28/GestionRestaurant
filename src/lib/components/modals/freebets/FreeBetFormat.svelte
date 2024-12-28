<script>
	import alertify  from 'alertifyjs';
    import { onMount } from "svelte";
    import { ModalBody, ModalFooter, ModalHeader, Modal } from "sveltestrap";
    import { ICONS } from "../../../../js/icons";
    import Pagination from "../../Pagination.svelte";
    import backend from "../../../../server";

    export let platform;
    export let showFormFreeBet;

    let freebets = [];
    let isSaving = false;
    let filters = { page: 1, xpage: 50 };
    let platforms = [];
    let users ={};

    onMount(() => {
      listPlatforms();
      listPlayers();
      listFreeBets();
    });

    const listFreeBets = async ()=>{
      let params = {...filters, platform: platform.name}
      if(params.search == "") delete params.search;
      try {
        let response = await backend.freespin.listFreeBets(params);
        freebets = response.data;
        console.log("freeBets: ", freebets);
      } catch (error) {
        console.log("No se puede listar");
      }
    }
    

    const listPlayers = async () => {
        let params = { ...filters, client_id: platform.clientId};
        if(params.search == "") delete params.search;
        try {
          let response = await backend.gamers.list(params);
          users = response.data;
          users.list = users.list.map(user => ({ ...user, amount: 0 }));
        } catch (error) {
          console.log("No se puede listar");
        }
    };

    const listPlatforms = async () => {
      let response = await backend.freespin.listPlatforms();
      platforms = response.data;
    };

    const isOnlyNumber = (event) => {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
        alertify.error("Ingrese solo números positivos");
      }
    };

    const searchEnter = (e) => {
      if (e.charCode === 13) {
        listFreeBets();
        listPlayers();
      }
    };

    const onPageClick = (page) => {
      filters.page = page;
    };

    const onshowModalFreeBet = () => (showFormFreeBet = !showFormFreeBet);

    // Funciones para asignar y eliminar bonos
    const assignFreebet = async (user) => {
      const data = {
        user: {
          code: user.id,
          username: user.username,
          name: user.firstname, 
          currency: user.currency, 
          platform: user.client.businessname
        },
        gameId: "first_2024", 
        bonusId: user.bonusId, 
        amount: user.amount
      };
      try {
        await backend.freespin.saveFreeBet(data);
        alertify.success("Free Bet Asignado Correctamente");
        listFreeBets();
        listPlayers();
      } catch (error) {
        console.log(error, "error");
        if(error.response.data.errorCode == "USER_FREEBET_ALREADY_EXISTS") alertify.error("Este usuario ya tiene un bono");
        else if(error.response.data.message == "Invalid amount") alertify.error("Monto Invalido"); 
        else if(error.response.data.message == "Maximum amount exceeded") alertify.error("Monto Maximo Excedido");
        else if(error.response.data.message == "Maximum customers exceeded") alertify.error("Usuarios Maximo Excedido");
        else alertify.error("Error al asignar free bet");
      }
    };

    const removeFreeBet = async(bonus) => {
      try {
        await backend.freespin.deleteFreeBet(bonus);
        alertify.success("ELIMINADO CORRECTAMENTE");
        listFreeBets();
      } catch (error) {
        alertify.error("ERROR AL ELIMINAR");
      }
    };

</script>

<Modal isOpen={showFormFreeBet} toggle={onshowModalFreeBet} size="xl">
  <ModalHeader toggle={onshowModalFreeBet}>
    CONFIGURACIÓN DE FREE BET- "{platform.name || "Nuevo"}"
  </ModalHeader>
  <ModalBody>
    <div class="campaign-data">
      <label>ID<input class="form-control" bind:value={platform.code} disabled /></label>
      <label>Nombre<input class="form-control" bind:value={platform.name} disabled={!!platform.code}/></label>
      <div>
        <span>Plataforma</span>
        <select disabled={!!platform.code} bind:value={platform.clientId} class="form-control">
          <option value="">Todos</option>
          {#each platforms as platform}
            <option value={platform.clientId}>{platform.name}</option>
          {/each}
        </select>
      </div>
    </div>
    {#if platform.clientId}
      <div class="bonus-assing">
        <!-- Usuarios sin bono -->
        <div class="users">
          <div class="filters-header">
            <h5>Usuarios</h5>
            <div class="filter-games">
              <input on:keypress={searchEnter} bind:value={filters.search} class="form-control" placeholder="Buscar"/>
              <button on:click={listPlayers} class="btn btn-pink btn-sm" title="Buscar">{@html ICONS.search}</button>
            </div>
          </div>
          <div class="list-group">
            {#if users.list}
              {#each users.list as user}
                <div class="list-group-item users-items">
                  <span>{user.firstname} ({user.username})</span>
                  <label for="">FreeBet ID
                    <input class="form-control" bind:value={user.bonusId} on:keypress={isOnlyNumber}>
                  </label>
                  <label for="">Amount
                    <input class="form-control" bind:value={user.amount} on:keypress={isOnlyNumber}>
                  </label>
                  <button class="btn btn-sm btn-pink" on:click={() => assignFreebet(user)}>{@html ICONS.add} </button>
                </div>
              {/each}
            {/if}
          </div>
          <Pagination
            bind:total={users.total}
            bind:xpage={users.xpage}
            bind:current={users.page}
            {onPageClick}
          />
        </div>

        <!-- Usuarios con bono -->
        <div class="bonus">
          <div class="filters-header">
            <h5>FreeBets Asignados</h5>
            <div class="filter-games">
              <input
                on:keypress={searchEnter}
                bind:value={filters.name}
                class="form-control"
                placeholder="Buscar"
              />
              <button on:click={listFreeBets} class="btn btn-pink btn-sm" title="Buscar">{@html ICONS.search}</button>
            </div>
          </div>
          <div class="list-group">
            {#each freebets as freebet}
              <div class="list-group-item bonus-assign-items">
                <div><span>{freebet.user.name} ({freebet.user.username})</span></div>
                <div><span>{freebet.amount.toFixed(2)} {freebet.user.currency}</span></div>
                <div><span class="status-circle {freebet.status == 1 ? 'status-active' : 'status-inactive'}"></span></div>
                <button class="btn btn-pink btn-sm" on:click={() => removeFreeBet(freebet)} disabled={freebet.status === 0}>{@html ICONS.delete}</button>
              </div>
            {/each}
          </div>
          <Pagination
            bind:total={freebets.total}
            bind:xpage={freebets.xpage}
            bind:current={freebets.page}
            {onPageClick}
          />
        </div>

      </div>
    {/if}
  </ModalBody>
</Modal>

<style>
  /* Estilos adaptados */
  .campaign-data{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  .bonus-assing{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .users, .bonus{
    display: flex;
    flex-direction: column;
    max-height: 100%;
    gap: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #FF1493;
    border-radius: 8px;
    padding: 0.5rem;
  }

  .btn-pink{
    background-color: #FF1493;
    color: white;
  }
  .users-items{
    display: grid;
    grid-template-columns: 28% 28% 28% 7%;
  }
  .bonus-assign-items{
    display: grid;
    grid-template-columns: 45% 35% 5% 10%;
  }

  .list-group-item {    
    align-items: center;
    padding: 8px;
    border: 1px solid #757575;
    gap: 0.5rem;
    border-radius: 0.5rem;
  }
  .list-group{
    max-height: 17rem;
    height: 15rem;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scrollbar-width: 1rem; /* Firefox */
    scrollbar-color: #FC0074 #7a7474bb; /* Color del thumb y track */
  }
  .list-group::-webkit-scrollbar-thumb {
    background-color: #FC0074 !important;
    border-radius: 10px !important;
  }
  .list-group::-webkit-scrollbar-track {
    background-color: #eaeaea !important;
    border-radius: 10px !important;
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
  .filter-games {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 0.3rem;
  }
</style>
