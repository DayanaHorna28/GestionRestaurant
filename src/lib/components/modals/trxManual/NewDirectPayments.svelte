<script>
  import alertify from "alertifyjs";
  import backend from "../../../../server";
  import { ModalBody, ModalFooter, ModalHeader, Modal } from "sveltestrap";
  export let showNewDirectPayment;

  let types = ["BET", "WIN", "REFUND"];
  let transaction = resetTransaction();
  let isSaving = false;

  function resetTransaction() {
    return {
      referencebet: "",
      movement: "REFUND", // Default to REFUND
      gameid: "",
      trxid: "",
      saveInternal: 0,
      sendClient: 0,
      amount: 0,
      sessionid: "",
      userNameOrigin: "",
      notValidAmount: false
    };
  }

  function getRequiredFields(movement) {
    const baseFields = ["movement", "saveInternal", "sendClient"];
    const specificFields = {
      WIN: ["referencebet", "gameid", "trxid", "amount", "userNameOrigin"],
      BET: ["trxid", "amount", "userNameOrigin", "gameid", "sessionid", "notValidAmount"],
      REFUND: ["referencebet", "repeated"],
    };
    return [...baseFields, ...specificFields[movement]];
  }

  function filterTransaction(transaction, fields) {
    return Object.keys(transaction)
      .filter((key) => fields.includes(key))
      .reduce((obj, key) => {
        obj[key] = transaction[key];
        return obj;
      }, {});
  }

  const save = async () => {
    if (!transaction.movement) return alertify.error("Movimiento Obligatorio");
    if (transaction.movement === "BET") {
      if (!transaction.gameid) return alertify.error("Game ID Obligatorio");
      else if (!transaction.trxid) return alertify.error("TRXID Obligatorio");
      else if (transaction.amount < 0) return alertify.error("Monto Obligatorio");
      else if (!transaction.userNameOrigin) return alertify.error("Nombre del usuario Obligatorio");
      else if (!transaction.sessionid) return alertify.error("Session ID Obligatorio");
    }
    else if (transaction.movement === "REFUND") {
      if (transaction.repeated == "") delete transaction.repeated;
      else if (!transaction.referencebet) return alertify.error("Reference Bet Obligatorio");
    }
    else if (transaction.movement === "WIN") {
      if (!transaction.gameid) return alertify.error("Game ID Obligatorio");
      else if (!transaction.trxid) return alertify.error("TRXID Obligatorio");
      else if (transaction.amount <= 0) return alertify.error("Monto Obligatorio");
      else if (!transaction.userNameOrigin) return alertify.error("Nombre del usuario Obligatorio");
    }
    if (transaction.saveInternal === 0 && transaction.sendClient === 0) return alertify.error("saveInternal y sendClient no pueden ser ambos 0");
    
    const requiredFields = getRequiredFields(transaction.movement);
    const filteredTransaction = filterTransaction(transaction, requiredFields);
    isSaving = true;
    try {
      await backend.trx.paymentDirect(filteredTransaction);
      alertify.success("Transacción guardada con éxito");
      showNewDirectPayment = false;
    } catch (error) {
      console.log("Error: ", error);
      isSaving = true;
      if (error.response.data.message == "TRANSACTION_NOT_FOUND") return alertify.error("LA TRANSACCIÓN NO FUE ENCONTRADA");
      else if (error.response.data.message == "GAME_NOT_FOUND") return alertify.error("EL JUEGO NO FUE ENCONTRADO");
      else alertify.error("Error al guardar la transacción");
    }
  };

  const onShowNewDirectPayment = () => {
    showNewDirectPayment = !showNewDirectPayment;
    if (!showNewDirectPayment) {
      transaction = resetTransaction();
    }
  };
</script>

<Modal isOpen={showNewDirectPayment} toggle={onShowNewDirectPayment} size={"m"}>
  <ModalHeader toggle={onShowNewDirectPayment}>Pago Directo</ModalHeader>
  <ModalBody>
    <div class="data-modulo">
      <label class="col"
        >Movimiento
        <select bind:value={transaction.movement} class="form-control">
          {#each types as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </label>
      {#if transaction.movement === "WIN"}
        <div>
          <span>Reference Bet</span>
          <input bind:value={transaction.referencebet} class="form-control" />
        </div>
        <div>
          <span>Game ID</span>
          <input bind:value={transaction.gameid} class="form-control" />
        </div>
        <div>
          <span>TRXID</span>
          <input bind:value={transaction.trxid} class="form-control" />
        </div>
        <div>
          <span>Amount</span>
          <input
            type="number"
            bind:value={transaction.amount}
            class="form-control"
          />
        </div>
        <div>
          <span>User Name Origin</span>
          <input bind:value={transaction.userNameOrigin} class="form-control" />
        </div>
        <div>
          <span>Save Internal</span>
          <input
            type="number"
            bind:value={transaction.saveInternal}
            class="form-control"
            min="0"
            max="1"
          />
        </div>
        <div>
          <span>Send Client</span>
          <input
            type="number"
            bind:value={transaction.sendClient}
            class="form-control"
            min="0"
            max="1"
          />
        </div>
      {/if}
      {#if transaction.movement === "BET"}
        <div>
          <span>TRXID</span>
          <input bind:value={transaction.trxid} class="form-control" />
        </div>
        <div>
          <span><b>¿ESTE ES UN FREE BET?</b></span>
        </div>
        <div>
          <input type="checkbox" bind:checked={transaction.notValidAmount}>
        </div>
        <div>
          <span>SESSION ID</span>
          <input bind:value={transaction.sessionid} class="form-control" />
        </div>
        <div>
          <span>Amount</span>
          <input
            type="number"
            bind:value={transaction.amount}
            class="form-control"
          />
        </div>
        <div>
          <span>Game ID</span>
          <input bind:value={transaction.gameid} class="form-control" />
        </div>
        <div>
          <span>User Name Origin</span>
          <input bind:value={transaction.userNameOrigin} class="form-control" />
        </div>
        <div>
          <span>Save Internal</span>
          <input
            type="number"
            bind:value={transaction.saveInternal}
            class="form-control"
            min="0"
            max="1"
          />
        </div>
        <div>
          <span>Send Client</span>
          <input
            type="number"
            bind:value={transaction.sendClient}
            class="form-control"
            min="0"
            max="1"
          />
        </div>
      {/if}

      {#if transaction.movement === "REFUND"}
        <div>
          <span>Reference Bet</span>
          <input bind:value={transaction.referencebet} class="form-control" />
        </div>
        <div>
          <span>Save Internal</span>
          <input
            type="number"
            bind:value={transaction.saveInternal}
            class="form-control"
            min="0"
            max="1"
          />
        </div>
        <div>
          <span>Send Client</span>
          <input
            type="number"
            bind:value={transaction.sendClient}
            class="form-control"
            min="0"
            max="1"
          />
        </div>
        <div>
          <span>Numero de repetidos</span>
          <input
            type="number"
            bind:value={transaction.repeated}
            class="form-control"
            min="0"
            max="3"
          />
        </div>
      {/if}
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-sm btn-success" on:click={save} disabled={isSaving}>Guardar</button>
  </ModalFooter>
</Modal>

<style>
  .data-modulo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  label {
    margin-bottom: 5px;
    color: #333;
  }
</style>
