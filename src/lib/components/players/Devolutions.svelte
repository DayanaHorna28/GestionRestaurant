<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { onMount } from "svelte";

  export let showModalDevolucion;
  
  let idMovimiento = "";
  let tipoTransaccion = "";
  let codigoVerificacion = "";

  const processDevolucion = () => {
    // Aquí puedes implementar la lógica para procesar la devolución
    // Utiliza las variables idMovimiento, tipoTransaccion y codigoVerificacion
    // Puedes enviar esta información al servidor o realizar cualquier otra acción necesaria.
    // Luego, cierra el modal.
    showModalDevolucion = false;
  };

  const toggle = () => (showModalDevolucion = !showModalDevolucion);
</script>

<Modal isOpen={showModalDevolucion} {toggle} class="black">
  <ModalHeader {toggle}>Devolución de Transacción</ModalHeader>
  <ModalBody>
    <div class="form-group">
      <label for="idMovimiento">ID del Movimiento</label>
      <input type="text" class="form-control" id="idMovimiento" bind:value={idMovimiento} />
    </div>
    <div class="form-group">
      <label for="tipoTransaccion">Tipo de Transacción</label>
      <select bind:value={tipoTransaccion}  class="form-control">
        <option value="">Retiro</option>
        <option value="">Deposito</option>
      </select>
    </div>
    <div class="form-group">
      <label for="codigoVerificacion">Código de Verificación</label>
      <input type="text" class="form-control" id="codigoVerificacion" bind:value={codigoVerificacion} />
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-primary" on:click={processDevolucion}>Procesar</button>
  </ModalFooter>
</Modal>
