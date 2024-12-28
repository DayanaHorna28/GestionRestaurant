<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../server";
  import { onMount } from "svelte";
  const TRANSACTION_TYPE_WITHDRAW = "WITHDRAW";
  export let showModalDirectWithdrawal;
  export let trxWithdrawal;
  export let onOk;

  onMount(() => {});
  let size = "sm";

  const cashOut = () => {
    if (trxWithdrawal.totalMoney <= 0)
      return alertify.error("Ingrese el monto correcto a retirar");
    alertify.confirm(
      "Cuidado",
      `Seguro de Realizar retiro de <b>${trxWithdrawal.totalMoney}</b>`,
      async () => {
        try {
          const u = sessionStorage.getItem("user");
          let user_ = JSON.parse(u);
          trxWithdrawal.trxType = TRANSACTION_TYPE_WITHDRAW;
          //informacion del player
          trxWithdrawal.username = trxWithdrawal.player.username;
          trxWithdrawal.name = trxWithdrawal.player.name;
          trxWithdrawal.lastname = trxWithdrawal.player.lastName;
          trxWithdrawal.platformId = trxWithdrawal.player.platformId;

          let trx_ = { ...trxWithdrawal };
          delete trx_.player;
          await backend.wallet.withdrawal(trx_);
          alertify.success("Procesado!");
          toggle();
          onOk();
        } catch (error) {
          console.log(error);
          if (error.response && error.response.data.erroCode == "LOW_BALANCE")
            return alertify.error("Balance insuficiente del jugador");
          alertify.error("Error al realizar transferencia");
        }
      },
      () => {}
    );
  };

  const toggle = () => (showModalDirectWithdrawal = !showModalDirectWithdrawal);
</script>

<Modal isOpen={showModalDirectWithdrawal} {toggle} {size}>
  <ModalHeader {toggle}>
    <span class="title">Retiro Directo</span>
  </ModalHeader>
  <ModalBody>
    <div>
      <div>
        <span class="black"
          >Destino: <b
            >{trxWithdrawal.player.name}
            {trxWithdrawal.player.lastName} ({trxWithdrawal.player.username})</b
          ></span
        >
      </div>
      <div class="col">
        <span class="black">Monto:</span>
        <input
          bind:value={trxWithdrawal.totalMoney}
          type="text"
          class="form-control"
        />
      </div>
      <div class="col">
        <span class="black">Operacion:</span>
        <input
          bind:value={trxWithdrawal.operation}
          type="text"
          class="form-control"
        />
      </div>
      <div>
        <span class="black">Tipo:</span>
        <select bind:value={trxWithdrawal.paymentMethod} class="form-control">
          <option value="CASH">Efectivo</option>
          <option value="BANK">Bancario</option>
        </select>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-sm btn-primary" on:click={cashOut}>Guardar</button>
  </ModalFooter>
</Modal>
