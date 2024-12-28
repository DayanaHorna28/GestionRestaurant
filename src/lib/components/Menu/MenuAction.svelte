<script>
  import Devolutions from "../players/Devolutions.svelte";
  import DepositBank from "../deposits/DepositBank.svelte";
  import DepositCash from "../deposits/DepositCash.svelte";
  import WithdrawalBank from "../withdrawal/WithdrawalBank.svelte";
  import WithdrawalCash from "../withdrawal/WithdrawalCash.svelte";
  import BoxOpening from "../box/BoxOpenig.svelte";
  import TableCashbox from "../box/TableCashBox.svelte";
  import alertify from "alertifyjs";
  //import CheckBox from "../players/CheckBox.svelte";
  import History from "../players/History.svelte";
  import { onMount } from "svelte";
  import EventManager from "../../../js/EventManager";
  import backend from "../../../server";
  export let onShowModalPlayer;
  export let userLoged;

  let showModalDepositCash = false;
  let showModalWithdrawalCash = false;
  let showModalCashRegister = false;
  let showModalProcessWithdrawal = false;
  let showModalProcessDeposit = false;
  let showModalTrx = false;
  let showModalDevolucion = false;
  let showModalOpeningBox = false;
  let showAlertCashBox = true;
  let showModalTableCashBox = false;
  let cashBox={};

  onMount(() => {
    findCashBox();
  });


  const findCashBox = async()=>{
    try {
      let {data} = await backend.cashBox.findAllByUserId(userLoged.userId,userLoged.platformId)
      cashBox={...data};
      showAlertCashBox=data.cashBoxOpen;
    } catch (error) {
      alertify.error("ERROR! "+ error);
    }
  }


  EventManager.subscribe("deposit-bank", ()=>{
    onShowModalDepositBank();
  })
  EventManager.subscribe("withdraw-bank", ()=>{
    onShowModalWithdrawalBank();
  } )
  EventManager.subscribe("withdraw-cash", ()=>{
    onShowModalWithdrawalCash();
  } )

  const onShowModalDepositCash = () => {
    showModalDepositCash = true;
  };
  const onShowModalWithdrawalCash = () => {
    showModalWithdrawalCash = true;
  };
  const onShowModalWithdrawalBank = () => {
    showModalProcessWithdrawal = true;
  };
  const onShowModalDepositBank = () => {
    showModalProcessDeposit = true;
  };
  const onShowModalCashRegister = () => {
    showModalCashRegister = true;
  };
  const onShowModalTrx = async () => {
    showModalTrx = true;
  };

  const onShowModalDevolucion = async () => {
    showModalDevolucion = true;
  }

  const onShowModalOpeningBox = async () => {
    showModalOpeningBox = true;
  }

  const onShowModalTableCashBox = async () => {
    showModalTableCashBox=true;
  }

</script>

<div class="nav-bar">
  <div class="bar-principal">
    <div class="btn-option">
      <div class="cont-btn">
        <span><b>Crear Usuario</b></span>
        <button class="btn btn-primary btn-sm" on:click={()=>onShowModalPlayer()}>Nuevo Usuario</button>
      </div>
      <icon class="bi bi-person-fill-add icon" />
    </div>
    <!--<div class="btn-option">
      <div class="cont-btn">
        <span><b>Devoluciones</b></span>
        <button on:click={onShowModalDevolucion} disabled class="btn btn-warning btn-sm">Devoluciones</button>
      </div>
      <i class="bi bi-repeat icon" />
    </div>-->
    <div class="btn-option">
      <div class="cont-btn">
        <span><b>Historial</b></span>
        <button on:click={onShowModalTrx} class="btn btn-info btn-sm">Transacciones</button>
      </div>
      <i class="bi bi-clock-history icon" />
    </div>
    <div class="btn-option">
      <div class="cont-btn">
        <span><b>Cuadre de Caja</b></span>
        <div class="conteiner-buttom-box">
          <button on:click={onShowModalOpeningBox} class="btn btn-primary btn-sm"><i class="bi bi-{!showAlertCashBox?'unlock':'lock'} icon-small"></i></button>
          <button on:click={onShowModalTableCashBox} class="btn btn-warning btn-sm"><i class="bi bi-cash-stack icon-small"></i></button>
          <button on:click={onShowModalCashRegister} class="btn btn-secondary btn-sm">Cuadre de Caja</button>
        </div>
      </div>
      <i class="bi bi-folder-check icon" />
    </div>
  </div>
  <div class="bar-secondary">
    <!--<div class="btn-option">
      <div class="cont-btn">
        <span><b>Deposito</b></span>
        <button disabled class="btn btn-success btn-sm" on:click={onShowModalDepositBank}>Bancario</button>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-cash-stack icon" viewBox="5 1 6 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/></svg>
    </div>
    <div class="btn-option">
      <div class="cont-btn">
        <span><b>Retiro</b></span>
        <button disabled class="btn btn-danger btn-sm" on:click={onShowModalWithdrawalBank}>Bancario</button>
      </div>
      <i class="bi bi-cash icon" />
    </div>-->
    <div class="btn-option">
      <div class="cont-btn">
        <span><b> Deposito Efectivo</b></span>
        <button class="btn btn-success btn-sm" on:click={onShowModalDepositCash}>Recargas</button>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="53" height="50" fill="currentColor" class="bi bi-cash-coin icon" viewBox="6 -1 6 17"><path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/><path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/><path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/><path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/></svg>
    </div>
    <div class="btn-option">
      <div class="cont-btn">
        <span><b>Retiro Efectivo</b></span>
        <button
          class="btn btn-danger btn-sm"
          on:click={onShowModalWithdrawalCash}>Retiros</button>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        fill="currentColor"
        class="bi bi-cash-stack icon"
        viewBox="5 1 6 16"
      >
        <path
          d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
        />
        <path
          d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"
        />
      </svg>
    </div>
  </div>
</div>

{#if !showAlertCashBox}
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Advertencia!</strong>: Cerrar Caja del Dia Anterior y/o Aperturar Caja para realizar ventas.
  </div>
{/if}

{#if showModalDepositCash}
  <DepositCash bind:userLoged bind:showModalDepositCash />
{/if}

{#if showModalWithdrawalCash}
  <WithdrawalCash bind:showModalWithdrawalCash />
{/if}

{#if showModalProcessWithdrawal}
  <WithdrawalBank bind:showModalProcessWithdrawal />
{/if}

{#if showModalTrx}
  <History bind:showModalTrx  bind:userLoged/>
{/if}

{#if showModalProcessDeposit}
  <DepositBank bind:userLoged bind:showModalProcessDeposit />
{/if}

<!--
{#if showModalCashRegister}
  <CheckBox bind:showModalCashRegister bind:userLoged/>
{/if}
-->
{#if showModalDevolucion}
  <Devolutions bind:showModalDevolucion></Devolutions>
{/if}

<!--
{#if showModalOpeningBox}
  <BoxOpening bind:showModalOpeningBox bind:userLoged bind:cashBox></BoxOpening>
{/if}
-->
{#if showModalTableCashBox}
  <TableCashbox bind:showModalTableCashBox bind:userLoged ></TableCashbox>
{/if}

<style>

.alert.alert-danger {
    padding: 6px; 
    border-radius: 5px;
    background-color: #f8d7da; 
    color: #721c24;
    font-size: 14px;
  }

  .icon-small {
    font-size: 0.5em; /* Ajusta el tamaño según tus necesidades */
  }
  @media only screen and (max-width: 1024px) {
    .nav-bar {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 1rem;
      margin-top: 0.2rem;
    }
    .bar-principal,
    .bar-secondary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem;
    }
    .btn-option {
      border-radius: 0.3rem;
      background-color: #00000049;
      padding: 0.5rem;
    }
    .cont-btn {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      text-align: center;
    }
    .icon {
      display: none;
    }
  }

  .conteiner-buttom-box{
    display: flex;
  }

  .conteiner-buttom-box button{
    margin: 2px;
  }

  @media only screen and (min-width: 1025px) {
    .nav-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bar-principal,
    .bar-secondary {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.5rem;
      justify-content: space-between;
      width: 100%;
      padding: 0.5rem;
    }
    .btn-option {
      border-radius: 0.3rem;
      background-color: var(--backgroud-btn-option);
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
    }
    .cont-btn {
      display: flex;
      flex-direction: column;
    }
    .bi::before {
      font-size: 2.8em;
    }
  }
</style>
