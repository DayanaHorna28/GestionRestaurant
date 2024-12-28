<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../server";
  import { onMount } from "svelte";
  import NewDeposit from "./NewDeposit.svelte";
  import Loading from "../Loading.svelte";
  import moment from "moment";
  import Pagination from "../pagination/Pagination.svelte";

  export let showModalDepositCash;
  export let userLoged;

  let user = {};
  let deposits = { list: [] };
  let filters = {};
  let deposit = [];
  let showModalNewDeposit = false;
  let promise;

  

  onMount(() => {
    filters = {
      status: "",
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    };
    promise = list();
  });

  const list = async () => {
    let params = { ...filters, type: '1', paymentMethod: 'CASH', status: filters.status, filter: filters.filter, mode:'R'};
    if (params.status === '') delete params.status;
    if (params.filter === undefined || params.filter === '' ) delete params.filter;
    let data = await backend.movements.list(params);
    deposits = data.data;
    // Convertir la propiedad 'custom' a un objeto
    deposits.list.forEach(deposit => {
      if (deposit.custom) {
        try {
          deposit.customObject = JSON.parse(deposit.custom);
        } catch (error) {
          deposit.customObject = {};
        }
      } else {
        deposit.customObject = {};
      }
    });
  };

  const onShowModalNewDesposit = () => {
    showModalNewDeposit = true;
  };

  const anull = async (depositCash__) => {
    alertify.confirm(
      "Cuidado",
      `Seguro de eliminar el deposito:<b>${depositCash__.code}</b>?`,
      async () => {
        try {
          const u = sessionStorage.getItem("user");
          let user_ = JSON.parse(u);
          let params = {
            movementId: depositCash__.movementId,
            playerId: depositCash__.parentId,
            trxType: "DEPOSIT",
            userId: user_.userId,
          };
          await backend.movements.depositBankAnull(params);
          alertify.success("Procesado!");
          list();
        } catch (error) {
          alertify.error("Error al eliminar");
        }
      },
      () => {}
    );
  };

  const onPageClick = async (page) => {
    filters.page = page;
    list();
  };

  const toggleDeposit = () => (showModalDepositCash = !showModalDepositCash);
</script>

<Modal isOpen={showModalDepositCash} toggle={toggleDeposit} size={"xl"}>
  <ModalHeader toggle={toggleDeposit}>
    <span class="title">Recargas Efectivo</span>
    <button class="btn btn-sm btn-primary" on:click={onShowModalNewDesposit}>Nuevo</button>
  </ModalHeader>
  <ModalBody>
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
      <div class="search">
        <label for="" style="color: black;">Buscar:
          <input class="form-control" type="text" bind:value={filters.filter}/>
        </label>
        <button
          class="btn btn-primary btn-sm"
          title="Filtrar"
          on:click={() => {
            promise = list();
          }}><i class="bi bi-search" /></button
        >
      </div>
    </div>
    <div style="overflow-x: auto;">
      <table class="table table-striped table-hover responsive">
        <thead class="thead-dark">
          <tr>
            <th>Cod</th>
            <th>Fecha</th>
            <th>Plataforma</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>-</th>
          </tr>
        </thead>
        {#await promise}
          <tbody style="min-height: 80px;">
            <tr><td colspan="11" style="position:relative"><Loading loading /></td></tr>
          </tbody>
        {:then l}
          {#if deposits.list.length > 0}
            <tbody>
              {#each deposits.list as deposit}
                <tr>
                  <td>{deposit.code}</td>
                  <td>{moment(deposit.created, "ddd MMM DD HH:mm:ss ZZ YYYY").format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td>{deposit.platform[0].name}</td>
                  <td>{deposit.custom?deposit.custom.username:'En espera'}</td>
                  <td>{deposit.custom?deposit.custom.name:'En espera'}</td>
                  <td>{deposit.totalMoney} {deposit.currencyISO}</td>
                  <td
                    >{#if deposit.status == 1}
                      <span style="color: red;">PENDIENTE</span>
                    {:else if deposit.status == 2}
                      <span style="color: orange;">EN PROCESO</span>
                    {:else if deposit.status==3}
                      <span style="color: green;">COMPLETADO</span>
                    {:else}
                    <span style="color: #808080;">ANULADO</span>
                    {/if}</td
                  >
                  <td>
                    <button  disabled={deposit.status === 3 || deposit.status === 4} on:click={() => anull(deposit)} class="btn btn-sm btn-danger"><i class="bi bi-trash" /></button>
                  </td>
                </tr>
              {/each}
            </tbody>
          {:else}
            <tr>
              <td class="bg-secondary" style="color: white; text-align:center" colspan="8">NO SE ENCONTRARON RESULTADOS</td>
            </tr>
          {/if}
        {/await}
      </table>
    </div>

    <Pagination
      bind:total={deposits.total}
      bind:xpage={deposits.xpage}
      bind:current={deposits.page}
      {onPageClick}
    />
  </ModalBody>
  <ModalFooter />
</Modal>

{#if showModalNewDeposit}
  <NewDeposit  bind:userLoged bind:showModalNewDeposit />
{/if}

<style>
  .search{
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 0.5rem;
  }
  .table{
    color: #000;
  }

  @media only screen and (max-width: 1024px) {
    .navbar-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: end;
    align-items: end;
    gap: 0.5rem;
    width: 100%;
  }
  }
  @media only screen and (min-width: 1025px) {
    .navbar-filters {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 0.5rem;
    width: 100%;
  }
  }
</style>
