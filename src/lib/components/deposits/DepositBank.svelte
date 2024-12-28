<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../server";
  import { onMount } from "svelte";
  import Pagination from "../pagination/Pagination.svelte";
  import Loading from "../Loading.svelte";
  import moment from "moment";

  export let showModalProcessDeposit;
  export let userLoged;

  let user = {};
  let deposits = { list: [] };
  let filters = {};
  let deposit={};
  let promise;
  let showModalBankConfirm = false;

  onMount(() => {
    filters = {
      status: "",
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    };
    promise = list();
  });

  const list = async () => {
    let params = { ...filters };
    params.type = "1"; //ingreso
    params.paymentMethod = "BANK";
    params.xpage = 50;
    console.log(params.status, "status");
    if (params.status == "") delete params.status;
    let data = await backend.movements.list(params);
    deposits = data.data;
  };

  const OnMappingDepositBank = (item) => {
    return (deposit = {
      movementId: item.movementId,
      playerId: item.parentId,
      trxType: "DEPOSIT",
      userId: userLoged.userId,
      platformId: item.platformId,
    });
  };

  const OnConfirmDepositBank = (depositBank_) => {
    alertify.confirm(
      "Cuidado",
      `Seguro de confirmar deposito: <b>${depositBank_.serial}</b>?`,
      async () => {
        try {
          let depositBankConfirm = OnMappingDepositBank(depositBank_);
          await backend.movements.movementBankConfirm(depositBankConfirm);
          list();
        } catch (error) {}
      },
      () => {}
    );
  };

  

  const anull = async (depositBank_) => {
    alertify.confirm(
      "Cuidado",
      `Seguro de eliminar <b>${depositBank_.serial}</b>?`,
      async () => {
        try {
          let depositBankAnull = OnMappingDepositBank(depositBank_);
          await backend.movements.depositBankAnull(depositBankAnull);
        } catch (error) {}
      },
      () => {}
    );
  };

  const onPageClick = async (page) => {
    filters.page = page;
    list();
  };

  const toggleDeposit = () =>
    (showModalProcessDeposit = !showModalProcessDeposit);
</script>

<Modal isOpen={showModalProcessDeposit} toggle={toggleDeposit} size={"xl"}>
  <ModalHeader toggle={toggleDeposit}>
    <span class="title">Depositos Bancarios</span>
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
            <th>COD</th>
            <th>Plataforma</th>
            <th>Usuario</th>
            <th>Cuenta</th>
            <th>Cod.Ope</th>
            <th>Monto</th>
            <th>Est.</th>
            <th>F. Operacion</th>
            <th>Procesado</th>
            <th>-</th>
          </tr>
        </thead>
        {#await promise}
          <tbody style="min-height: 80px;">
            <tr><td colspan="10" style="position:relative"><Loading loading /></td></tr>
          </tbody>
        {:then l}
          {#if deposits.list.length > 0}
            <tbody>
              {#each deposits.list as deposit}
                <tr>
                  <td>{deposit.serial}</td>
                  <td>{deposit.platform[0]?.name}</td>
                  <td>{deposit.custom?deposit.custom.username:"-"}</td>
                  <td>{deposit.bankAccount[0]?.number}<br>({deposit.bankAccount[0]?.name})</td>
                  <td>{deposit.operation}</td>
                  <td
                    >{deposit.totalMoney.toFixed(2)}
                    {deposit.currencyISO}</td>
                  <td
                    >{#if deposit.status == 1}
                      <span style="color: red;" title="Pendiente">P</span>
                    {:else if deposit.status == 2}
                      <span style="color: orange;" title="En proceso">O</span>
                    {:else if deposit.status}
                      <span style="color: green;" title="Completado">C</span>
                    {/if}
                  </td>
                  <td>{moment(deposit.operationDate).format("YYYY-MM-DD HH:mm")}</td>
                  <td> {moment(deposit.lastModified).format("YYYY-MM-DD HH:mm")} </td>
                  <td class="btn-options">
                    <button
                      disabled={deposit.status == 3}
                      on:click={()=>OnConfirmDepositBank(deposit)}
                      class="btn btn-sm btn-primary"
                      ><i class="bi bi-check" /></button
                    >
                    <button
                      disabled={deposit.status == 3}
                      on:click={() => anull(deposit)}
                      class="btn btn-sm btn-danger"
                      ><i class="bi bi-trash" /></button
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          {:else}
            <tr>
              <td
                class="bg-secondary"
                style="color: white; text-align:center"
                colspan="10">NO SE ENCONTRARON RESULTADOS</td
              >
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



<style>
  
  .btn-options {
    width: 6rem;
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
    grid-template-columns: 1fr 1fr;
    justify-content: end;
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
