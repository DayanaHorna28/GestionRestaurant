<script>
  //import //alertify from "//alertifyjs";
  import backend from "../../../../server";
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";

  export let user;
  export let showChangePassword;

  let password = "";
  let confirmPassword = "";
  let showPassword = false;

  onMount(() => {
    password = "";
  });

  const changePassword = async () => {
    if (password !== confirmPassword) return; //alertify.error("Las dos contraseñas deben ser iguales");
    let params = {
      userId: user.id,
      newPassword: password,
    };
    try {
      await backend.adminusers.changePassword(params);
      //alertify.success("Contraseña cambiada exitosamente");
      onShowChangePassword();
    } catch (error) {
      console.log(error);
      //alertify.error("No se pudo cambiar la clave");
    }
  };

  const toggleShowPassword = () => {
    showPassword = !showPassword;
  };

  const onShowChangePassword = () => (showChangePassword = !showChangePassword);
</script>

<Modal isOpen={showChangePassword} toggle={onShowChangePassword} size={"s"}>
  <ModalHeader toggle={onShowChangePassword}>Admin {user.name}</ModalHeader>
  <ModalBody>
    <div class="col">
      <div class="row">
        <span>Contraseña:</span>
        <input
          class="form-control"
          bind:value={password}
          type="text"
          on:input={() => {}}
          autocomplete="off"
        />
        <button class="toggle-password" on:click={toggleShowPassword}>
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <div class="row">
        <span>Confirmar Contraseña:</span>
        <input
          class="form-control"
          bind:value={confirmPassword}
          type="password"
        />
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-primary btn-sm" on:click={changePassword}
      >Guardar</button
    >
  </ModalFooter>
</Modal>

<style>
  .col {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  .toggle-password {
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
  }
</style>
