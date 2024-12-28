<script>
  import alertify from "alertifyjs";
  import ChangePassword from "../players/ChangePassword.svelte";
  import backend from "../../../server";
  import DirectWithdrawal from "../withdrawal/DirectWithdrawal.svelte";
  import Pagination from "../pagination/Pagination.svelte";
  import { onMount } from "svelte";
  import BonusPlayer from "../players/BonusPlayer.svelte";

  export let onShowModalPlayer;
  export let refreshList = false;
  export let userLoged;

  let players = { list: [] };
  let filter = {};
  let amount = "";
  let showChangePassword;
  let showModalDirectWithdrawal = false;
  let trxWithdrawal = {};
  let realBalance = 0; // Variable para almacenar el saldo real
  let bonusModalVisible = false;
  let player_  = [];
  let playerId;

  const TRANSACTION_TYPE_DEPOSIT = "DEPOSIT";
  const TRANSACTION_TYPE_WITHDRAW = "WITHDRAW";
  const BALANCE_TYPE_REAL = "REAL";

  $: refreshUsers(refreshList);

  const refreshUsers = (refreshList_) => {
    console.log("regreslist", refreshList_);
    if (refreshList) {
      refreshList = false;
      listPlayers();
    }
  };

  onMount(() => {
    listPlayers();
  });

  const onShowChangePassword = (id) => {
    showChangePassword = true;
    playerId = id;

  };

  const listPlayers = async () => {
    let players_ = await backend.players.list(filter);
    players = players_.data;
  };

  const onPageClick = async (page) => {
    filter.page = page;
    listPlayers();
  };

  const onDeletePlayer = async (item) => {
    alertify.confirm(
      "Cuidado",
      `Seguro de eliminar <b>${item.name}</b>?`,
      async () => {
        try {
          await backend.players.destroy(item.playerId)
          listPlayers();
          alertify.success("Procesado!");
        } catch (error) {
          alertify.error("Error al eliminar");
        }
      },
      () => {}
    );
  };

  const recharge = (item) => {
    if (item.amount == "") return alertify.error("Ingrese el monto a transferir");
    alertify.confirm(
      "Cuidado",
      `Seguro de Realizar una transferencia de <b>${item.amount}</b> a ${item.name}`,
      async () => {
        try {
          await backend.wallet.deposit(mappingTransactionDeposit(item));
          listPlayers();
          alertify.success("Procesado!");
        } catch (error) {
          alertify.error("Error al realizar transferencia");
        }
      },
      () => {}
    );
    amount;
  };

  const withdrawal = (item) => {
    if (item.amount == "") return alertify.error("Ingrese el monto a transferir");
    alertify.confirm(
      "Cuidado",
      `Seguro de Realizar un Retiro de <b>${item.amount}</b> a ${item.name}`,
      async () => {
        try {
          await backend.wallet.withdrawal(mappingTransactionWithdrawal(item));
          listPlayers();
          alertify.success("Procesado!");
        } catch (error) {
          alertify.error("Error al realizar transferencia");
        }
      },
      () => {}
    );
    amount;
  };

  const mappingTransactionDeposit = (player_) => {
    let { playerId, username, platformId } = player_;
    let transaction = { playerId, username, platformId };
    transaction.trxType = TRANSACTION_TYPE_DEPOSIT;
    transaction.balanceType = BALANCE_TYPE_REAL;
    transaction.totalMoney = player_.amount;
    transaction.bankAccountId = 823574823548;
    transaction.originalTrxId = "";
    transaction.parentId = JSON.parse(sessionStorage.getItem("user")).userId;
    transaction.userId = JSON.parse(sessionStorage.getItem("user")).userId;
    transaction.platformType = player_.role;
    transaction.currencyISO = player_.currency;
    transaction.paymentMethod = 'CASH';
    transaction.mode='D';
    return transaction;
  };

  const mappingTransactionWithdrawal = (player_) => {
    let { playerId, username, platformId } = player_;
    let transaction = { playerId, username, platformId };
    transaction.trxType = TRANSACTION_TYPE_WITHDRAW;
    transaction.balanceType = BALANCE_TYPE_REAL;
    transaction.totalMoney = player_.amount;
    transaction.bankAccountId = 823574823548;
    transaction.originalTrxId = "";
    transaction.parentId = JSON.parse(sessionStorage.getItem("user")).userId;
    transaction.userId = JSON.parse(sessionStorage.getItem("user")).userId;
    transaction.platformType = player_.role;
    transaction.currencyISO = player_.currency;
    transaction.paymentMethod = 'CASH';
    transaction.mode='D';
    return transaction;
  };

  const showDirectWithdrawal = (player_) => {
    let user_ = JSON.parse(sessionStorage.getItem("user"));
    trxWithdrawal = {
      player: player_,
      trxType: TRANSACTION_TYPE_WITHDRAW,
      balanceType: BALANCE_TYPE_REAL,
      totalMoney: 5,
      playerId: player_.playerId, //jugador
      userId: user_.userId, //cajero
      platformType: player_.role,
      currencyISO: player_.currency,
      paymentMethod: 'CASH'
    };
    showModalDirectWithdrawal = true;
  };

  const SearchPlayer = (e) => {
    if (e.charCode === 13) listPlayers();
  };

  const isOnlyNumber = (event) => {
    if (!/\d/.test(event.key)) {
      event.preventDefault();
      alertify.error("Ingrese solo números");
    }
  };

  const showBonusModal = (player) => {
    player_ = player;
    bonusModalVisible = true;
  };
</script>

<div class="panel-filter">
  <input class="form-control" placeholder="Buscar ..." on:keypress={SearchPlayer} bind:value={filter.filter}/>
  <button class="btn btn-secondary btn-sm" on:click={() => listPlayers()}><i class="bi bi-search" /></button>
</div>
<div class="container-bo-table" style="overflow-x: auto;">
  <table class="table table-sm table-striped responsive table-hover">
    <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Usuario</th>
        <th style="text-align: right;">Balance</th>
        <th>Bonos</th>
        <th>Et</th>
        <th>Transferencia Directa</th>
        <th class="center">Opciones</th>
      </tr>
    </thead>
    <tbody>
      {#each players.list as player}
        <tr>
          <td><span class="white">#{player.playerId}</span></td>
          <td><span class="white">({player.username}) {player.name}</span></td>
          {#if player.balance != null}
            <td class="money"><span class="white" style="padding-right: 0.8rem;">{player.balance.amount.toFixed(2)}</span></td>
            {:else}
            <td>No llego balance</td>
          {/if}
          <td><button on:click={() => showBonusModal(player)} class="btn btn-sm btn-info">Bonos</button></td>
          <td><i style="background:{player.status == 1 ? "green":"red"}; border-radius:50%;" class="bi bi-{player.status==1 ? "check2-circle" : "dash-circle"}" /></td>
          <td class="row-bo check">
            <input style="min-width: 100px;width: 55%;" bind:value={player.amount} disabled={!userLoged.currencyISO.includes(player.currency)} class="u-form-control" on:keypress={isOnlyNumber} placeholder={`0.00 ${player.currency}`}/>
            <button class="btn btn-sm btn-success" on:click={() => recharge(player)} disabled={!player.amount} title="Generar desposito directo"><i class="bi bi-plus-circle" /></button>
            <button class="btn btn-sm btn-danger" on:click={() => withdrawal(player)} disabled={!player.amount} title="Generar desposito directo"><i class="bi bi-dash-circle" /></button>
          </td>
          <td>
            <div class="center">
              <button on:click={ () => onShowModalPlayer(player)} class="btn btn-sm btn-secondary" title="Perfil del usuario"><i class="bi bi-tools" /></button>
              <button on:click={ () => onShowChangePassword(player.playerId)} class="btn btn-sm btn-warning" title="Cambiar contraseña"><i class="bi bi-shield-fill-check" /></button>
              <button on:click={ () => onDeletePlayer(player)} class="btn btn-sm btn-danger"><i class="bi bi-person-fill-slash" /></button>
              <button disabled on:click={() => showDirectWithdrawal(player)} class="btn btn-sm btn-primary" title="Perfil del usuario"><i class="bi bi-cash" /></button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot />
  </table>
</div>
<Pagination
  bind:total={players.total}
  bind:xpage={players.xpage}
  bind:current={players.page}
  {onPageClick}
/>

{#if showChangePassword}
  <ChangePassword bind:showChangePassword {playerId} />
{/if}
{#if bonusModalVisible}
  <BonusPlayer bind:player_ bind:bonusModalVisible></BonusPlayer>
{/if}




<style>
  input:disabled {
    background-color: #ccc;
  }

  @media only screen and (max-width: 1024px) {
    td {
      color: white;
    }
    .table {
      border-bottom: transparent;
    }
    .check {
      gap: 0;
      padding-right: 1.5rem;
    }
  }

  @media only screen and (min-width: 1024px) {
    .container-bo-table {
      padding: 0.8rem;
    }
    .white {
      color: white;
    }
    .table {
      border-bottom: transparent;
    }
  }

  .panel-filter {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .form-control {
    max-width: 200px;
  }
</style>
