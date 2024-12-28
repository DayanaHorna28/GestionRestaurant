<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import backend from "../../../server";
  import { onMount } from "svelte";
  import PrintDeposit from "./PrintDeposit.svelte"

  export let showModalNewDeposit;
  export let userLoged;
  let deposit;
  let currencies 
  let user = {};
  let showModalPrintDeposit = false;
  let printData;

  onMount(()=>{
    const u = sessionStorage.getItem("user");
    user = JSON.parse(u);
    currencies = userLoged.currencyISO;
    deposit={
      userId: user.userId,
      amount: 5,
      description: "",
      balanceType: "REAL",
      trxType: "DEPOSIT",
      reference: "",
      currencyISO: user.currencyISO,
    }
    
  })
  
  //currencies = userLoged.currencyISO;
  
  
  function validateNumberNegative(input) {
    if (input.value < 0) {
      input.value = "";
      alertify.error("No se permiten números negativos");
    }
  }

  const OnMappingDepositCash = (item) => {
    return {
      totalMoney: item.amount,
      currencyISO: item.currencyISO,
      platformId: userLoged.platformId,
      description: item.info,
      trxType: "DEPOSIT",
      generateCodeMovement: true,
      userId: userLoged.userId,
      paymentMethod: "CASH",
      mode: 'R',
      phone : item.phone
    };
  };

  const NewDeposit = async (depositCash_) => {
    if (!depositCash_.amount) return alertify.error("Ingrese el Monto a recargar");
    if (depositCash_.amount < 3) return alertify.error("Ingrese el monto minimo");
    if (!depositCash_.phone) return alertify.error("Ingrese el Numero de Telefono");
    try {
      let depositCashgenerate = OnMappingDepositCash(depositCash_)
      let {data} = await backend.movements.generateDeposit(depositCashgenerate);
      printData = data.data
      showModalPrintDeposit = true;
      alertify.success("Procesado!");
    } catch (error) {
      alertify.error("No se puedo realizar la recarga");
    }
 
  };

  const isOnlyNumber = (event) => {
    if (!/\d/.test(event.key)) {
      event.preventDefault();
      alertify.error("Ingrese solo números");
    }
  };

  const toggleDeposit = () => (showModalNewDeposit = !showModalNewDeposit);
</script>

<Modal isOpen={showModalNewDeposit} toggle={toggleDeposit}>
  <ModalHeader toggle={toggleDeposit}>
    <span class="title">RECARGA EFECTIVO </span>
  </ModalHeader>
  <ModalBody>
    <div class="container black">
      <div class="alert alert-warning">Recarga minima de S/. 3.00</div>
      <div class="row">
        <span>Ingrese el monto a recargar<span style="color: red;">*</span></span>
        <input
          type="number"
          class="form-control"
          inputmode="numeric"
          min="3"
          bind:value={deposit.amount}
          on:input={validateNumberNegative}
          on:keypress={isOnlyNumber}
        />
      </div>
      <div class="row black">
        <span>Ingrese el número de teléfono<span style="color: red;">*</span></span>
        <input
          bind:value={deposit.phone}
          type="text"
          class="form-control"
          inputmode="numeric"
          on:keypress={isOnlyNumber}
        />
      </div>
      <div class="row black">
        <span>Moneda<span style="color: red;">*</span></span>
        <select bind:value={deposit.currencyISO} class="form-control">
          {#each currencies as currency}
            <option>{currency}</option>
          {/each}
        </select>
      </div>
      <div class="row black">
        <span>Información</span>
        <input bind:value={deposit.info} type="text" class="form-control" />
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-primary btn-sm" on:click={()=>NewDeposit(deposit)}
      >Generar Codigo</button
    >
  </ModalFooter>
</Modal>

{#if showModalPrintDeposit}
    <PrintDeposit bind:showModalPrintDeposit bind:printData />
{/if}



<style>
  .black {
    color: black;
  }
</style>
