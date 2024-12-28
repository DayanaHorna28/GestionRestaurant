<script>
  //import //alertify from "//alertifyjs";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import backend from "../../../../server";

  export let user;
  export let showModalNew;
  export let list;

  let status = [
    { value: 1, name: "Activo" },
    { value: 2, name: "Desactivo" },
  ];

  const save = async () => {
    if (!user.username) return; //alertify.error("Es obligatorio el usuario");
    if (!user.password) return; //alertify.error("Es obligatorio el usuario");
    if (!user.confirmPassword) return; //alertify.error("Es obligatorio el usuario");
    if (!user.name) return; //alertify.error("Es obligatorio el usuario");
    if (!user.lastname) return; //alertify.error("Es obligatorio el usuario");
    if (user.confirmPassword != user.password) return; //alertify.error("Las contraseñas deben ser iguales");
    try {
      await backend.adminusers.save(user);
    } catch (error) {
      //alertify.error("No se puede crear un nuevo Admin");
    }
    showModalNew = false;
    list();
  };

  const onshowModalNew = () => (showModalNew = !showModalNew);
</script>

<Modal isOpen={showModalNew} toggle={onshowModalNew} size={"xl"}>
  <ModalHeader toggle={onshowModalNew}
    >Admin "{user.name || "Nuevo"}"</ModalHeader
  >
  <ModalBody>
    <div class="row">
      <label class="col"
        >Usuario: <input
          class="form-control"
          bind:value={user.username}
        /></label
      >
      <label class="col"
        >Contraseña: <input
          class="form-control"
          bind:value={user.password}
          type="password"
        /></label
      >
      <label class="col"
        >Confirmar Contraseña: <input
          class="form-control"
          bind:value={user.confirmPassword}
          type="password"
        /></label
      >
    </div>
    <div class="row">
      <label class="col"
        >Nombre <input class="form-control" bind:value={user.name} /></label
      >
      <label class="col"
        >Apellido <input
          class="form-control"
          bind:value={user.lastname}
        /></label
      >
      <label class="col"
        >Estado:
        <select class="form-control" bind:value={user.status}>
          {#each status as statu}
            <option value={statu.value}>{statu.name}</option>
          {/each}
        </select>
      </label>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-primary btn-sm" on:click={save}>Guardar</button>
  </ModalFooter>
</Modal>
