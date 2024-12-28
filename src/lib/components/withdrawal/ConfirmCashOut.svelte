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
  import moment from "moment";
  export let showModalCashOutConfirm;
  export let withdrawal;
  export let onOk


  let keywithdrawal = "";

  onMount(()=>{
    withdrawal.operationDate = moment().format("YYYY-MM-DD HH:mm:ss");
  })



  const withdrawalKey =async ()=>{
    if(!keywithdrawal) return alertify.error("Ingrese la clave de retiro")

    try {
        const u = sessionStorage.getItem("user");
        let user_ = JSON.parse(u)
        let params={
          movementId:withdrawal.movementId ,
          playerId:withdrawal.parentId,
          userId:user_.userId,
          code:keywithdrawal,
          operationDate:withdrawal.operationDate,
        }

        console.log(withdrawal)
      
      await backend.movements.confirmCashout(params)
      onOk()

    } catch (error) {
      alertify.error("No se pudo confirmar")
    }
    toggleWithdrawal();
  }
  const toggleWithdrawal = () => (showModalCashOutConfirm = !showModalCashOutConfirm);

</script>

<Modal isOpen={showModalCashOutConfirm} toggle={toggleWithdrawal}>
  <ModalHeader toggle={toggleWithdrawal}>
    <span class="title">INGRESE CLAVE DE RETIRO</span>
  </ModalHeader>
  <ModalBody>
    <div class="container">
      <div class="col black">
        <span>Fecha:</span>
        <input bind:value={withdrawal.operationDate} class="form-control" type="date-time" step="1">
      </div>
      <div class="col black">
        <span>Ingrese Clave de Retiro</span>
        <input bind:value={keywithdrawal} type="text" class="form-control" />
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" on:click={withdrawalKey}>Validar codigo</Button>
  </ModalFooter>
</Modal>

<style>
  .black {
    color: #000;
  }
</style>
