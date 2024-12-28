<script>
	import { ICONS } from './../js/icons.js';
  import Pagination from "../lib/components/Pagination.svelte";
  import { onMount } from "svelte";
  import moment from "moment";
  import backend from "../server";
  import Loading from "../lib/components/Loading.svelte";
  import ViewLogs from "../lib/components/modals/trx/ViewLogs.svelte";
  import alertify from "alertifyjs";
  import Information from "../lib/components/modals/trx/Information.svelte";
  import { utils, writeFileXLSX } from "xlsx";
  import LogTrace from "../lib/components/modals/trx/LogTrace.svelte";

  let transations = { list: [] };
  let filters = { page: 1, xpage: 50 };
  let loading = false;
  let showTrxLogs = false;
  let showTrxInfo = false;
  let showLogTrace = false;
  let logfilter;
  let tracking = false;
  let trackingAmount = 0; // Valor por defecto
  let onliveTracking = false;
  let liveIntervalId;
  const liveInterval = 10000;
  let timerSeconds = "";
  let timerId;
  let platforms = [];
  let providers = [];
  let brands = [];
  let categories = [];
  let typesGames=[];
  let transactionInfo;

  onMount(async () => {
    let actualDate = moment();
    let dateRest = actualDate.subtract(0, "days");
    filters.from = dateRest.format("YYYY-MM-DD");
    filters.to = moment().format("YYYY-MM-DD");
    listProvider();
    listCategories();
    listPlatforms();
    list();
  });

  

  const isOnlyNumber = (event) => {
    // Permitir números y el carácter de punto
    if (!/[\d.]/.test(event.key)) {
      event.preventDefault();
      alertify.error("Ingrese solo números o un punto decimal");
    }
  };


  const listPlatforms = async () => {
    let params = { platform: 1, xpage: 50, page: 1 };
    let response = await backend.client.list(params);
    platforms = response.data.list;
    console.log("platforms: ", platforms);
  };

  const listProvider = async () => {
    let response = await backend.games.listProvider();
    providers = response.data.sort();
    filters.provider = "";
    list();
  };

  const listCategories = async () => {
    let data = await backend.games.listCategories();
    categories = data.data.sort();
  };

  const onChangeCategory = async (isfilter) => {
    let category = isfilter;
    try {
      let { data } = await backend.games.listTypes(category);
      typesGames = data.filter(game => {
        return game && game !== game.toLowerCase() && game !== 'undefined' && game !== '0' && game !== 'scratch';
      });
      console.log("typesGames:", typesGames);
    } catch (error) {
      alertify.error("No se pudo mostrar los tipos de juegos");
    }
  };

  const onChangeProvider = async (provider, isfilter) => {
    try {
      let { data } = await backend.games.listBrands(provider);
      console.log("data y isfilter", data, provider, isfilter);
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

  function performTracking() {
    if (tracking && trackingAmount > 0) {
      transations.list.forEach((transaction) => {
        if (transaction.amount > trackingAmount) {
         console.log("Tracking");
        }
      });
    }
  }

  function onLogsByTrx(filter = "") {
    logfilter = filter;
    if (typeof filter == "object")
      logfilter = { search: filter.trxid, from: filter.date, to: filter.date };
    showTrxLogs = true;
  }
  
  function onLogsTrace(filter = "") {
    logfilter = filter;
    if (typeof filter == "object")
      logfilter = { search: filter.trxid, from: filter.date, to: filter.date };
    showLogTrace = true;
  }

  function onInfoByTrx(trx) {
    console.log("transa:", trx);
    if (trx.info) {
      showTrxInfo = true;
      transactionInfo = trx.info;
    } else {
      alertify.error("No hay información detallada de la transacción disponible.");
    }
  }


  const activeTracking = () => {
    if (onliveTracking) {
      timerSeconds = "esperando...";
      let { amount, amountType } = filters;
      filters = {};
      filters.from = moment().format("YYYY-MM-DD");
      filters.to = moment().format("YYYY-MM-DD");
      filters.amount = amount;
      filters.amountType = amountType;
      liveIntervalId = setInterval(() => {
        list();
        timerSeconds = liveInterval / 1000;
        timerId && clearInterval(timerId);
        timerId = timer();
      }, liveInterval);
    } else {
      timerId && clearInterval(timerId);
      timerSeconds = "";
      clearInterval(liveIntervalId);
    }
  };
  const timer = () => {
    return setInterval(() => {
      timerSeconds--;
    }, 1000);
  };

  const list = async () => {
    transations.list = [];
    let params = { ...filters };
    for (const key in params) {
      if (params[key] == "") delete params[key];
    }
    loading = true;
    try {
      let data = await backend.trx.list(params);
      loading = false;
      transations = data.data;
      if (transations.info) {
        try {
          transactionInfo  = transations.info;
        } catch (error) {
          console.error("Error al convertir info de JSON a objeto:", error);
        }
      }
      console.log("Transations:", transations);
    } catch (error) {
      alertify.error("Error al listar");
      if (transations.list.game == null) return alertify.error("Error el campo Game es NULL");
    }
    filters.page = 1;
  };

  const filterEnter = (e) => {
    if (e.charCode === 13) list();
  };

  const onPageClick = (page) => {
    filters.page = page;
    list();
  };
</script>

<div class="bo-main">
  <div class="menu-filter">
    <div class="row-bo">
      <div>
        <span>Reference (Trx ID)</span>
        <input bind:value={filters.trxid} on:keypress={filterEnter} class="form-control"/>
      </div>
      <div>
        <span>Reference Bet</span>
        <input bind:value={filters.referencebet} on:keypress={filterEnter} class="form-control" />
      </div>
      <div>
        <span>Serial</span>
        <input bind:value={filters.serial} on:keypress={filterEnter} class="form-control"/>
      </div>
      <div>
        <span>Plataforma</span>
        <select bind:value={filters.client_id} class="form-control">
          <option value="">Todos</option>
          {#each platforms as platform}
            <option value={platform.id}>{platform.namesite}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="row-bo">
      <div>
        <span>Desde:</span>
        <input class="form-control" type="date" bind:value={filters.from} />
      </div>
      <div>
        <span>Hasta:</span>
        <input class="form-control" type="date" bind:value={filters.to} />
      </div>
      <div>
        <span>Username_Origin</span>
        <input bind:value={filters.username_origin} on:keypress={filterEnter} class="form-control"/>
      </div>
      <div>
        <span>Username</span>
        <input bind:value={filters.userName} on:keypress={filterEnter} class="form-control"/>
      </div>
    </div>
    <div class="row-bo">
      <div>
        <span>Proveedor</span>
        <select bind:value={filters.provider} on:change={() => onChangeProvider(filters.provider, "xfilter")} class="form-control" >
          <option value="">Todos</option>
          {#each providers as provider}
            <option value={provider}>{provider}</option>
          {/each}
        </select>
      </div>
      <div>
        <span>Marca</span>
        <select class="form-control" bind:value={filters.brand}>
          <option value="">Todos</option>
          {#each brands as brand}
            <option>{brand.brand}</option>
          {/each}
        </select>
      </div>
      <div>
        <span>Categoria</span>
        <select bind:value={filters.category} on:change={() => onChangeCategory(filters.category)} class="form-control">
          <option value="">Todos</option>
          {#each categories as category}
            <option>{category}</option>
          {/each}
        </select>
      </div>
      <div>
        <span>Movimiento</span>
        <select bind:value={filters.movement} class="form-control" on:keypress={filterEnter}>
          <option value="">Todos</option>
          <option value="BET">Bet</option>
          <option value="WIN">Win</option>
          <option value="REFUND">Refund</option>
        </select>
      </div>
      <div>
        <span>Moneda</span>
        <select bind:value={filters.currency} class="form-control">
          <option value="">Todos</option>
          <option>USD</option>
          <option>PEN</option>
          <option>COP</option>
          <option>CLP</option>
          <option>TND</option>
          <option>ARS</option>
        </select>
      </div>
      <div>
        <span>Monto</span>
        <div class="input-group">
          <select bind:value={filters.amountType} class="btn btn-outline-secondary dropdown-toggle">
            <option value="eq">Igual</option>
            <option value="lt">Menor</option>
            <option value="gt">Mayor</option>
          </select>
          <input on:keypress={isOnlyNumber} bind:value={filters.amount} class="form-control"  aria-label="Text input with dropdown button" />
        </div>
      </div>
      <div>
        <input id="live-toggle" type="checkbox" bind:checked={onliveTracking} on:change={() => activeTracking()} />
        <label for="live-toggle"> Automatico ({timerSeconds}) </label>
      </div>
      <div class="col btn-control">
        <button on:click={list} class="btn btn-primary btn-sm">{@html ICONS.search}</button>
        <button on:click={() => onLogsByTrx()} class="btn btn-secondary btn-sm">{@html ICONS.eye}</button>
        <button on:click={() => onLogsTrace()} class="btn btn-info btn-sm" title="Seguimiento de Registros">{@html ICONS.bug}</button>
      </div>
    </div>
  </div>
  <div class="bo-body-table-trx">
    <Loading bind:loading />
    {#if !loading}
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
              <th>Opciones</th>
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
                    <td>{trx.game.name} ({trx.game.gameid}) - {trx.game.category}</td>
                  {:else}<td style="color: red;">FALTA INFORMACIÓN</td>
                  {/if}
                  <td >{trx.user.client.namesite != null ? trx.user.client.namesite : "FALTA INFORMACIÓN"}</td>
                  <td><p class={trx.movement == "BET" ? "text-red" : "text-green"}>{trx.movement}</p></td>
                  <td>{trx.user.currency}</td>
                  <td><p class={trx.amount < 0 ? "text-red" : "text-green"}>{trx.amount.toFixed(2)}</p></td>
                  <td class="colum-currency">{trx.balanceaftertrx?.toFixed(2)}</td>
                  <td class="btn-options">
                    <button on:click={onLogsByTrx(trx)} class="btn btn-secondary btn-sm" title="Registros">{@html ICONS.eye}</button>
                    {#if trx.game.category === "sportbook"}
                      <button on:click={onInfoByTrx(trx)} class="btn btn-light btn-sm" title="Información de deportivas">{@html ICONS.clipboard}</button>
                    {/if}
                  </td>
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
    {/if}
  </div>
</div>

{#if showTrxLogs}
  <ViewLogs bind:showTrxLogs bind:logfilter />
{/if}

{#if showTrxInfo}
  <Information bind:showTrxInfo bind:transactionInfo />
{/if}

{#if showLogTrace}
  <LogTrace bind:showLogTrace bind:logfilter />
{/if}

<style>
  .bo-table-title {
    text-align: center;
    font-size: 0.8rem;
    background-color: rgb(158, 93, 80);
    color: white;
    border: 1px solid black;
  }
  .bo-table-data {
    text-align: center;
    font-size: 0.8rem;
  }
  .text-red {
    color: red;
  }
  .text-green {
    color: green;
  }
  .btn-options {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 1.1rem;
  }
  @media (max-width: 1024px) {
    .bo-main {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .menu-filter {
      display: flex;
      flex-direction: column;
    }
    .btn-control {
      display: flex;
      align-items: end;
      justify-content: center;
    }
    .bo-body-table-trx {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }
    .row-bo {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 1025px) {
    .bo-main {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .menu-filter {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .btn-control {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      gap: 1rem;
    }
    .bo-body-table-trx {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }
    .row-bo {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
  }
</style>
