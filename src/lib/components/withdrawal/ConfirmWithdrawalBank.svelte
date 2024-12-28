<script>
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import alertify from "alertifyjs";
  
  import backend from "../../../server";
  import { onMount } from "svelte";
  import moment from "moment";

  export let showModalBankConfirm;
  export let withdrawal;
  export let onOk;

  let withdrawalConfirm = {};


onMount(()=>{
    const u = sessionStorage.getItem("user");
    let user_ = JSON.parse(u)

    withdrawalConfirm={
        operationDate: moment().format("YYYY-MM-DD"),
        movementId: withdrawal.movementId,
        trxType: 'WITHDRAW',
        code: withdrawal.code,
        playerId: withdrawal.parentId,
        userId: user_.userId,
    }
     
})
  const confirmWithdrawalBank =  () => {
    alertify.confirm(
      "Cuidado",
      `Seguro de <b>confirmar retiro ${withdrawalConfirm.code}</b>?`,
      async() => {
    try {
      
        await backend.wallet.withdrawalBankConfirm(withdrawalConfirm);
        toggleWithdrawal();
        onOk();
    } catch (error) {
      if( error.errorCode=='LOW_BALANCE') return alertify.error("BALANCE INSUFICIENTE");
        alertify.error("Error")
    }
    },
      () => {}
    );
  };



  const toggleWithdrawal = () => (showModalBankConfirm = !showModalBankConfirm);

</script>

<Modal isOpen={showModalBankConfirm} toggle={toggleWithdrawal}>
  <ModalHeader toggle={toggleWithdrawal}>
    <span class="title">CONFIRMAR RETIRO BANCARIO</span>
  </ModalHeader>
  <ModalBody>
    <div class="container col black">
      <span>Fecha</span>
      <input type="date" class="form-control" bind:value={withdrawalConfirm.operationDate} />
    </div>
    <div class="container col black">
      <span>Datos Operacion</span>
      <input type="text" class="form-control" bind:value={withdrawalConfirm.reference}/>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-sm btn-primary" on:click={confirmWithdrawalBank}>Confirmar</button>
  </ModalFooter>
</Modal>

<style>
  .black {
    color: #000;
  }
</style>
