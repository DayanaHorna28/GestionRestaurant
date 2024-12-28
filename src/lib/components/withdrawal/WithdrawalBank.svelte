<script>
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../server";
  import { onMount } from "svelte";
  import Loading from "../Loading.svelte";
  import moment from "moment";
  import { empty } from "svelte/internal";
  import Pagination from "../pagination/Pagination.svelte";
  import ConfirmBank from "./ConfirmWithdrawalBank.svelte";

  export let showModalProcessWithdrawal;

  let withdrawals = { list: [] };
  let filters = {};
  let showModalBankConfirm = false;
  let withdrawal = {};

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
    let params = { ...filters };
    params.type = "-1"; //ingreso
    params.paymentMethod = "BANK";
    if (params.status == "") delete params.status;
    let data = await backend.movements.list(params);
    withdrawals = data.data;
    console.log(withdrawals);
  };

  const anull = async (withdrawalBank_) => {
    alertify.confirm(
      "Cuidado",
      `Seguro de eliminar <b>${withdrawalBank_.code}</b>?`,
      async () => {
        try {
          const u = sessionStorage.getItem("user");
          let user_ = JSON.parse(u);
          let params = {
            movementId: withdrawalBank_.movementId,
            playerId: withdrawalBank_.parentId,
            trxType: "WITHDRAW",
            userId: user_.userId,
          };
          await backend.movements.withdrawalBankAnull(params);
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

  const OnConfirmWithdrawalBank = (data) => {
    withdrawal = data;
    showModalBankConfirm = true;
  };


  const formatCustomData = (item) => {
    let str = "-";
    str = item.name + " ("+item.username+") <br />Cta: " + item.bankName + " " + item.accountNumber;  
    return str;
  };

  const toggleWithdrawal = () =>
    (showModalProcessWithdrawal = !showModalProcessWithdrawal);
</script>

<Modal
  isOpen={showModalProcessWithdrawal}
  toggle={toggleWithdrawal}
  size={"xl"}
>
  <ModalHeader toggle={toggleWithdrawal}>
    <span class="title">RETIRO POR BANCO</span>
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
        <label for="" style="color: black;"
          >Buscar:
          <input class="form-control" type="text" />
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
            <th>Plataforma</th>
            <th>Destino</th>
            <th>Monto</th>
            <th>Creado</th>
            <th>Procesado</th>
            <th>Estado</th>
            <th>-</th>
          </tr>
        </thead>
        {#await promise}
          <tbody style="min-height: 80px;">
            <tr
              ><td colspan="9" style="position:relative"><Loading loading /></td
              ></tr>
          </tbody>
        {:then l}
          {#if withdrawals.list.length > 0}
            <tbody>
              {#each withdrawals.list as withdrawal}
                <tr>
                  <td>{withdrawal.serial}</td>
                  <td>{withdrawal.platform[0].name}</td>
                  <td>{@html formatCustomData(withdrawal.custom)}</td>
                  <td>{withdrawal.totalMoney} {withdrawal.currencyISO}</td>
                  <td>{moment(withdrawal.created).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{withdrawal.operationDate?moment(withdrawal.operationDate).format("YYYY-MM-DD HH:mm"):'-' }</td>
                  <td
                    >{#if withdrawal.status == 1}
                      <span style="color: red;">PENDIENTE</span>
                    {:else if withdrawal.status == 2}
                      <span style="color: orange;">EN PROCESO</span>
                    {:else if withdrawal.status == 3}
                      <span style="color: green;">COMPLETADO</span>
                    {:else}
                      <span style="color: gray;">ANULADO</span>
                    {/if}</td
                  >
                  <td>
                    <button
                      disabled={withdrawal.status == 3 || withdrawal.status ==4}
                      class="btn btn-sm btn-primary"
                      on:click={() => OnConfirmWithdrawalBank(withdrawal)}
                      ><i class="bi bi-check" /></button
                    >
                    <button
                      disabled={withdrawal.status == 3 || withdrawal.status ==4}
                      on:click={() => anull(withdrawal)}
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
                colspan="9">NO SE ENCONTRARON RESULTADOS</td
              >
            </tr>
          {/if}
        {/await}
      </table>
    </div>
    <Pagination
      bind:total={withdrawals.total}
      bind:xpage={withdrawals.xpage}
      bind:current={withdrawals.page}
      {onPageClick}
    />
  </ModalBody>
  <ModalFooter />
</Modal>

{#if showModalBankConfirm}
  <ConfirmBank onOk={list} bind:withdrawal bind:showModalBankConfirm />
{/if}

<style>
  .search {
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
