<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../server";
  import { onMount } from "svelte";
  import moment from "moment";
  import Pagination from "../pagination/Pagination.svelte";
  import Loading from "../Loading.svelte";

  export let userLoged;
  export let showModalTrx;

  onMount(() => {
    filters = {
      status: "",
      mode: "",
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      paymentMethod: "",
    };
    promise = list();
  });

  let transactions = { list: [] };
  let promise;
  let filters = {};
  let total = 0; // Nueva variable para la sumatoria
  let modo;

  const toggleTrx = () => (showModalTrx = !showModalTrx);
  let typeTrx = [
    { value: 1, label: "Deposito", id: 1 },
    { value: -1, label: "Retiro", id: 2 },
  ];
  let typeTrxValue = "";

  const onPageClick = async (page) => {
    filters.page = page;
    list();
  };

  const list = async () => {
    let params = { 
      paymentMethod: 'CASH',
      modo:filters.modo,
      status: filters.status,
      //paymentMethod : filters.paymentMethod,
      type: typeTrxValue,
      platformId: userLoged.platformId,
      ...filters
    };
    if (params.status == "") delete params.status;
    //if (params.paymentMethod == "") delete params.paymentMethod;
    if (params.mode == "") delete params.mode;
    if (params.type == "") delete params.type;

    let data = await backend.movements.list(params);
    transactions = data.data;
    if (transactions.list) {
      transactions.list.forEach(trx => { // Utiliza forEach para acceder a cada transacción
        let modo = trx.mode; // Accede a trx.mode para obtener el modo de la transacción
        switch (modo) {
          case 'D': modo = 'Transferencia Directa'; break;
          case 'R': modo = 'Recarga'; break;
          case 'C': modo = 'Con Código'; break;
        }
        trx.mode = modo; // Actualiza el modo en el objeto de transacción
      });
    }
    // Calcular la sumatoria
    total = transactions.list.reduce((acc, trx) => {
      if (trx.type === 1) {
        // Depósito (sumar positivamente)
        acc += parseFloat(trx.totalMoney);
      } else if (trx.type === -1) {
        // Retiro (restar negativamente)
        acc -= parseFloat(trx.totalMoney);
      }
      return acc;
    }, 0);
  };

  const onTypeTransactionClick = async (trxType) => {
    filters.txType = trxType;
    list();
  };

  const formatCustomData = (data) => {
    let str = "-";
    console.log("data", data);
    if (data && data.indexOf(":") > 0) {
      let json_ = JSON.parse(data);
      str = json_.name + " (" + json_.username + ")";
    }
    return str;
  };
</script>

<Modal isOpen={showModalTrx} toggle={toggleTrx} size={"xl"}>
  <ModalHeader toggle={toggleTrx}>
    <span class="title"><b>HISTORIAL DE MOVIMIENTOS</b></span>
  </ModalHeader>
  <ModalBody>
    <div class="container">
      <div class="navbar-filters">
        <div class="col">
          <span style="color: black;">Desde:</span>
          <input class="form-control" type="date" bind:value={filters.from} />
        </div>
        <div class="col">
          <span style="color: black;">Hasta:</span>
          <input class="form-control" type="date" bind:value={filters.to} />
        </div>
        <div>
          <span style="color: black;">Estado:</span>
          <select bind:value={filters.status} class="form-control">
            <option value="">TODOS</option>
            <option value="1">PENDIENTE</option>
            <option value="2">PROCESO</option>
            <option value="3">COMPLETADO</option>
            <option value="4">ANULADO</option>
          </select>
        </div>
        <div class="col black">
          <span>Tipo</span>
          <select class="form-control" bind:value={typeTrxValue}>
            <option value="">Todos</option>
            {#each typeTrx as trx}
              <option value={trx.value}>{trx.label}</option>
            {/each}
          </select>
        </div>
        <!--<div class="col black">
          <span>Metodo</span>
          <select class="form-control" bind:value={filters.paymentMethod}>
            <option value="">Todos</option>
            <option value="CASH">Efectivo</option>
            <option value="BANK">Bancario</option>
          </select>
        </div>-->
        <div class="col black">
          <span>Modo</span>
          <select class="form-control" bind:value={filters.mode}>
            <option value="">Todos</option>
            <option value="D">Transferencia</option>
            <option value="R">Recarga</option>
            <option value="C">Con codigo</option>
          </select>
        </div>
        <div class="search">
          <label for="" style="color: black; width: 100%">Buscar:
            <input class="form-control" type="text" bind:value={filters.filter} />
          </label>
          <button class="btn btn-primary btn-sm" title="Filtrar" on:click={() => { promise = list(); }}><i class="bi bi-search" /></button>
        </div>
      </div>
      <div style="overflow-x: auto;">
        <table class="table table-striped table-hover responsive">
          <thead>
            <tr>
              <th>COD</th>
              <th>PLATAFORMA</th>
              <th>USUARIO</th>
              <th>FECHA</th>
              <th>TIPO</th>
              <th>MODO</th>
              <th>MONTO</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          {#await promise}
            <tbody style="min-height: 80px;">
              <tr><td colspan="8" style="position:relative"><Loading loading /></td></tr>
            </tbody>
          {:then l}
            {#if transactions.list.length > 0}
              <tbody>
                {#each transactions.list as trx}
                  <tr>
                    <th scope="row">{trx.serial}</th>
                    <td>{trx.platform[0].name}</td>
                    <td>{trx.custom?trx.custom.username:"En espera"}</td>
                    <td>{moment(trx.completedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>{trx.type == 1 ? "DEPOSITO" : "RETIRO"}</td>
                    <!--<td>{trx.paymentMethod}</td>-->
                    <td>{trx.mode}</td>
                    <td style="color: {trx.totalMoney >= 1 ? 'green': 'red' };">{trx.totalMoney.toFixed(2)} {trx.currencyISO}</td>
                    <td>
                      {#if trx.status == 1} <span style="color: red;" title="Pendiente">PENDIENTE</span>
                      {:else if trx.status == 2} <span style="color: orange;" title="En proceso">EN PROCESO</span>
                      {:else if trx.status} <span style="color: green;" title="Completado">COMPLETADO</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
              <tfoot>
                <tr>
                  <td style="background-color: green;" colspan="6" class="white money">Total</td>
                  <td style="color: {total >= 1 ? 'green' : 'red' };">{transactions.totalMoney.toFixed(2)}</td>
                </tr>
              </tfoot>
            {:else}
              <tr>
                <td class="bg-secondary" style="color: white; text-align:center" colspan="8">NO SE ENCONTRARON RESULTADOS</td>
              </tr>
            {/if}
          {/await}
        </table>
        <Pagination
          bind:total={transactions.total}
          bind:xpage={transactions.xpage}
          bind:current={transactions.page}
          {onPageClick}
        />
      </div>
    </div>
  </ModalBody>
  <ModalFooter />
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .search{
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 0.5rem;
  }
  @media only screen and (max-width: 1024px) {
    .navbar-filters {
      display: grid;
      flex-direction: row;
      gap: 0.3rem;
      align-items: end;
    }
  }
  @media only screen and (min-width: 1025px) {
    .navbar-filters {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.3rem;
      align-items: end;
    }
  }
</style>
