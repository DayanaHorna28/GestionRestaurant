<script>
  import {Button, Modal, ModalBody, ModalFooter, ModalHeader, } from "sveltestrap";
  import alertify from "alertifyjs";
  export let showChangePassword;
  import backend from "../../../server";
  export let playerId;
  let size = "lg";
  let user ={};

  const ChangePassword = async ()=>{
    if(!user.oldPassword) return alertify.error("Ingrese la antigua contraseña")
    if(!user.newPassword) return alertify.error("Ingrese la nueva contraseña")
    if(user.newPassword != user.confirmPassword) return alertify.error("Revisar contraseñas")
    try {
      let {data} = await backend.players.changePassword(playerId,user)
      showChangePassword = false;
      alertify.success("Proceso completado");
    } catch (error) {
      alertify.error("Error :", error)
    } 
  }
  const togglePassword = () => (showChangePassword = !showChangePassword);
</script>

<Modal isOpen={showChangePassword} toggle={togglePassword} {size}>
  <ModalHeader toggle={togglePassword}>
    <span class="title">Cambiar Contraseña</span>
  </ModalHeader>
  <ModalBody>
    <div class="container col black">
      <div class="col">
        <div class="col black">
          <span>Contraseña actual:</span>
          <input bind:value={user.oldPassword} type="password" class="form-control" />
        </div>
        <div class="col">
          <span class="black">Nueva Contraseña:</span>
          <input bind:value={user.newPassword} type="password" class="form-control" />
        </div>
        <div class="col">
          <span class="black">Confirmar Contraseña:</span>
          <input bind:value={user.confirmPassword} type="password" class="form-control" />
        </div>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" on:click={ChangePassword}>Cambiar</Button>
  </ModalFooter>
</Modal>

