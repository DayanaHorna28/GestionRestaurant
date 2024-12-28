<script>
  import Loading from "../lib/components/Loading.svelte";
  import NewGamer from "../lib/components/modals/players/NewGamer.svelte";
  import backend from "../server";
  import { onMount } from "svelte";
  import Pagination from "../lib/components/Pagination.svelte";
  import alertify from "alertifyjs";
  import { ICONS } from "../js/icons";

  let loading = false;
  let showNewGamer = false;
  let gamers = { list: [] };
  let platforms = [];
  let filters = { page: 1, xpage: 20 };
  let codeCountrys = [
    { value: "PE", name: "Perú" },
    { value: "CO", name: "Colombia" },
    { value: "CL", name: "Chile" },
    { value: "AR", name: "Argentina" },
    { value: "EC", name: "Ecuador" },
    { value: "DE", name: "Alemania" },
  ];
  let codeCurrencys = [
    { value: "COP", name: "Peso Colombiano" },
    { value: "PEN", name: "Sol" },
    { value: "USD", name: "Dolar" },
    { value: "BRL", name: "Real Brasilero" },
    { value: "ARS", name: "Peso Argentino" },
  ];

  onMount(() => {
    listPlatforms();
    list();
  });

  const list = async () => {
    let params = { ...filters };
    if (params.platform == "") delete params.platform;
    if (params.currency == "") delete params.currency;
    if (params.country == "") delete params.country;
    if (params.search == "") delete params.search;
    if (params.clientId == "") delete params.clientId;
    try {
      let response = await backend.gamers.list(params);
      gamers = response.data;
    } catch (error) {
      alertify.error("No se puede listar")
    }
  };

  const listPlatforms = async () => {
    let params = { platform: 1, xpage: 50, page: 1 };
    let response = await backend.client.list(params);
    platforms = response.data.list;
  };

  function newGamer() {
    showNewGamer = true;
  }

  const onPageClick = (page) => {
    filters.page = page;
    list();
  };
</script>

<div class="wrapp">
  <div class="bo-concept-header">
    <button class="btn btn-primary btn-sm" on:click={() => newGamer()} >{@html ICONS.addCircle} Nuevo</button>
    <div class="bo-header-filter">
      <div class="filter-games">
        <span>Plataforma</span><!--namesite-->
        <select bind:value={filters.clientId} class="form-control">
          <option value="">Todos</option>
          {#each platforms as platform}
            <option value={platform.id}>{platform.namesite}</option>
          {/each}
        </select>
      </div>
      <div class="filter-games">
        <span><b>País:</b></span>
        <select bind:value={filters.country} class="form-control">
          <option value="">Todos</option>
          {#each codeCountrys as country}
            <option value={country.value}>{country.name}</option>
          {/each}
        </select>
      </div>
      <div class="filter-games">
        <span><b>Moneda:</b></span>
        <select bind:value={filters.currency} class="form-control">
          <option value="">Todos</option>
          {#each codeCurrencys as currency}
            <option value={currency.value}>{currency.name}</option>
          {/each}
        </select>
      </div>
      <div class="filter-games">
        <input bind:value={filters.search} class="form-control" placeholder="Buscar" />
        <button class="btn btn-primary btn-sm" title="Buscar" on:click={list}>{@html ICONS.search}</button>
      </div>
    </div>
  </div>
  <div class="container-table">
    <Loading bind:loading />
    <div>
      <table class="table table-striped table-sm">
        <thead class="table-dark">
          <tr class="bo-table-title">
            <th>ID</th>
            <th>Plataforma</th>
            <th>Username Origin</th>
            <th>Username</th>
            <th>nombre</th>
            <th>Apellido</th>
            <th>País</th>
            <th>Moneda</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {#each gamers.list as gamer}
            <tr class="bo-table-data">
              <td>{gamer.id}</td>
              <td>{gamer.clientcode}</td>
              <td>{gamer.username_origin}</td>
              <td>{gamer.username}</td>
              <td>{gamer.firstname}</td>
              <td>{gamer.lastname}</td>
              <td>{gamer.country}</td>
              <td>{gamer.currency}</td>
              <td>{gamer.balance}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if gamers.list.length}
      <Pagination
        bind:total={gamers.total}
        bind:xpage={gamers.xpage}
        bind:current={gamers.page}
        {onPageClick}
      />
    {/if}
  </div>
</div>

{#if showNewGamer}
  <NewGamer bind:showNewGamer></NewGamer>
{/if}

<style>
  .bo-concept-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    background-color: #fafafa;
  }
  input {
    cursor: pointer;
  }
  .bo-header-filter {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    width: 70%;
  }
  .filter-games {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 0.3rem;
  }
</style>
