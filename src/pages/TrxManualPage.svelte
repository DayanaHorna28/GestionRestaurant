<script>
  import NewDirectPayments from "../lib/components/modals/trxManual/NewDirectPayments.svelte";
  import moment from "moment";
  import backend from "../server";
  import { onMount } from "svelte";
  import alertify from "alertifyjs";
  import Pagination from "../lib/components/Pagination.svelte";
  import { ICONS } from "../js/icons";

  let filters = { page: 1, xpage: 20 };
  let showNewDirectPayment = false;
  let types = ["BET", "WIN", "REFUND"];
  let transations = { list: [] };
  let categories = [];
  let platforms = [];

  onMount(() => {
    let actualDate = moment();
    let dateRest = actualDate.subtract(0, "days");
    filters.from = dateRest.format("YYYY-MM-DD");
    filters.to = moment().format("YYYY-MM-DD");
    listCategories();
    listPlatforms();
    list();
  });

  const list = async () => {
    transations.list = [];
    let params = { ...filters, mode: "M" };
    for (const key in params) {
      if (params[key] == "") delete params[key];
    }
    try {
      let data = await backend.trx.list(params);
      transations = data.data;
    } catch (error) {
      
        
    }
    filters.page = 1;
  };

  const listCategories = async () => {
    let data = await backend.games.listCategories();
    categories = data.data.sort();
  };
  const listPlatforms = async () => {
    let params = { platform: 1, xpage: 50, page: 1 };
    let response = await backend.client.list(params);
    platforms = response.data.list;
    console.log("platforms: ", platforms);
  };

  const onShowNewDirectPayment = () => {
    showNewDirectPayment = true;
  };
  const filterEnter = (e) => {
    if (e.charCode === 13) list();
  };

  const onPageClick = (page) => {
    filters.page = page;
    list();
  };

  const searchEnter = (e) => {
    if (e.charCode === 13) listGames();
  };
</script>

<div class="wrapp">
  <div class="header-title">
    <h4><b>TRANSACCIONES MANUALES</b></h4>
    <button on:click={onShowNewDirectPayment} class="btn btn-sm btn-primary" >{@html ICONS.addCircle} Nuevo</button>
  </div>
  <div class="filters">
    <div class="header-filter">
      <div class="bo-header-filter">
        <div class="filter-payments">
          <span>Reference (Trx ID)</span>
          <input
            bind:value={filters.trxid}
            on:keypress={filterEnter}
            class="form-control"
          />
        </div>
        <div class="filter-payments">
          <span>Username_Origin</span>
          <input
            bind:value={filters.username_origin}
            on:keypress={filterEnter}
            class="form-control"
          />
        </div>
        <div class="filter-payments">
          <span>Desde:</span>
          <input class="form-control" type="date" bind:value={filters.from} />
        </div>
        <div class="filter-payments">
          <span>Hasta:</span>
          <input class="form-control" type="date" bind:value={filters.to} />
        </div>
      </div>
      <div class="bo-header-filter">
        <div class="filter-payments">
          <span>Categoria</span>
          <select bind:value={filters.category} class="form-control">
            <option value="">Todos</option>
            {#each categories as category}
              <option>{category}</option>
            {/each}
          </select>
        </div>
        <div class="filter-payments">
          <span>Tipos:</span>
          <select bind:value={filters.movement} class="form-control">
            <option value="">Todos</option>
            {#each types as type}
              <option>{type}</option>
            {/each}
          </select>
        </div>
        <div class="filter-payments">
          <span>Plataforma</span><!--namesite-->
          <select bind:value={filters.client_id} class="form-control">
            <option value="">Todos</option>
            {#each platforms as platform}
              <option value={platform.id}>{platform.namesite}</option>
            {/each}
          </select>
        </div>
        <div class="filter-search">
          <input
            bind:value={filters.search}
            class="form-control"
            type="text"
            placeholder="Buscar"
            on:keypress={searchEnter}
          />
          <button class="btn btn-primary btn-sm" title="Buscar" on:click={list}
            ><i class="bi bi-search" /></button
          >
        </div>
      </div>
    </div>
  </div>
  <div style="overflow-x: auto;">
    <table id="myTable" class="table table-striped table-sm">
      <thead class="table-dark">
        <tr class="bo-table-title">
          <th title="transaction.Id">ID</th>
          <th title="trxId">Reference (Trx Id)</th>
          <th title="trxId">Trx Asociado</th>
          <th>Serial</th>
          <th>Fecha</th>
          <th>Username (UserId)</th>
          <th>Username_Origen</th>
          <th>Juego</th>
          <th>Sitio</th>
          <th>Tipo</th>
          <th>Moneda</th>
          <th>Monto</th>
          <th>Nuevo Balance</th>
        </tr>
      </thead>
      <tbody>
        {#if transations.list.length}
          {#each transations.list as trx}
            <tr class="bo-table-data">
              <td>{trx.id}</td>
              <td>{trx.trxid}</td>
              <td>{trx.referencebet || ""}</td>
              <td>{trx.serial}</td>
              <td>{moment(trx.date).format("DD/MM/YYYY HH:mm:ss")}</td>
              <td>{trx.user.username} ({trx.user.id})</td>
              <td>{trx.user.username_origin}</td>
              {#if trx.game != null}
                <td
                  >{trx.game.name} ({trx.game.gameid}) - {trx.game.category}</td
                >
              {:else}
                <td style="color: red;">FALTA INFORMACIÓN</td>
              {/if}
              <td>{trx.user.client.namesite}</td>
              <td>{trx.movement}</td>
              <td>{trx.user.currency}</td>
              <td>
                <p class={trx.amount < 0 ? "text-red" : "text-green"}>
                  {trx.amount.toFixed(2)}
                </p>
              </td>
              <td class="colum-currency">{trx.balanceaftertrx?.toFixed(2)}</td>
              <td class="btn-options"> </td>
            </tr>
          {/each}
        {:else}
          <tr class="bo-table-data">
            <td colspan="14">No se encontraron registros</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
  {#if transations.list.length}
    <Pagination
      bind:total={transations.total}
      bind:xpage={transations.xpage}
      bind:current={transations.page}
      {onPageClick}
    />
  {/if}
</div>

{#if showNewDirectPayment}
  <NewDirectPayments bind:showNewDirectPayment></NewDirectPayments>
{/if}

<style>
  .wrapp {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .header-title {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }
  .filters {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.8rem;
  }
  .header-filter {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    text-align: end;
    gap: 0.5rem;
  }
  .bo-header-filter {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
  }
  .filter-payments {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    gap: 0.3rem;
  }
  .filter-search {
    display: flex;
    flex-direction: row;
    align-items: end;
    width: 100%;
    gap: 0.3rem;
  }
  .text-red {
    color: red;
  }
  .text-green {
    color: green;
  }
</style>
