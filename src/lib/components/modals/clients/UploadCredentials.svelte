<script>
  import { onMount } from "svelte";
  import { ModalBody, ModalFooter, ModalHeader, Modal } from "sveltestrap";
  import backend from "../../../../server";

  export let client;
  export let showModalUploadCredentials;
  let providers = [];
  let isSaving = false;
  let filters = {};
  let credentials = [{ clave: "", valor: "" }]; // Inicializar con un objeto vacío
  let editMode = false; // Variable para controlar el modo de edición
  let selectedProvider = ""; // Variable para almacenar el proveedor seleccionado

  onMount(() => {
    listProvider();
  });

  const listProvider = async () => {
    let response = await backend.games.listProvider();
    providers = response.data.sort();
    filters.provider = "";
  };

  const onChangeProvider = async (provider, isfilter) => {
    selectedProvider = provider; // Guardar el proveedor seleccionado
    if (!editMode) {
      // Si no está en modo de edición, resetear las credenciales
      credentials = [{ clave: "", valor: "" }];
    }
    let params = {
      provider: provider,
    };
    try {
      let { data } = await backend.games.listBrandsByClient(params);
    } catch (error) {
      //alertify.error("No se pudo mostrar marcas");
    }
  };

  const toggleEditMode = () => {
    editMode = !editMode; // Cambiar el modo de edición
    if (!editMode) {
      // Si el modo de edición se desactiva, resetear las credenciales
      credentials = [{ clave: "", valor: "" }];
    }
  };

  const onSave = () => {
    // Validar que las credenciales estén completas antes de guardar
    if (
      credentials.some(
        (cred) => cred.clave.trim() === "" || cred.valor.trim() === ""
      )
    ) {
      alert("Por favor complete todas las credenciales antes de guardar.");
      return;
    }

    // Formatear las credenciales en la estructura requerida
    const formattedCredentials = credentials.map((cred) => {
      return { clave: cred.clave.trim(), valor: cred.valor.trim() };
    });

    // Realizar la lógica de guardado aquí
    console.log("Guardando credenciales:", formattedCredentials);

    // Restablecer el modo de edición y las credenciales después de guardar
    toggleEditMode();
  };

  const onShowModalUploadCredentials = () =>
    (showModalUploadCredentials = !showModalUploadCredentials);
</script>

<Modal
  isOpen={showModalUploadCredentials}
  toggle={onShowModalUploadCredentials}
  size={"xl"}
>
  <ModalHeader toggle={onShowModalUploadCredentials}
    >CLIENTE {client.businessname}</ModalHeader
  >
  <ModalBody>
    <div class="container">
      <label class="col"
        >Proveedor:
        <select
          class="form-control"
          bind:value={filters.provider}
          on:change={() => onChangeProvider(filters.provider, "xfilter")}
        >
          <option value="">Todos</option>
          {#each providers as provider}
            <option>{provider}</option>
          {/each}
        </select>
      </label>
      {#if editMode}
        <!-- Mostrar credenciales solo en modo de edición -->
        <label class="show-data-credentials">
          <span>CREDENCIALES ACTUALES</span>
          <div>
            {#each credentials as cred, index}
              <input
                class="text-credentials"
                bind:value={cred.clave}
                placeholder="Clave"
              />
              <input
                class="text-credentials"
                bind:value={cred.valor}
                placeholder="Valor"
              />
              <button
                class="btn btn-danger btn-sm"
                on:click={() => credentials.splice(index, 1)}>Eliminar</button
              >
            {/each}
            <button
              class="btn btn-primary btn-sm"
              on:click={() => credentials.push({ clave: "", valor: "" })}
              >Agregar</button
            >
          </div>
        </label>
        <label>
          <input class="text-credentials" bind:value={credentials} />
          <button class="btn btn-primary btn-sm">Guardar</button>
        </label>
      {:else}
        <p>No hay credenciales disponibles.</p>
        <input
          class="text-credentials"
          bind:value={credentials.clave}
          placeholder="Clave"
        />
        <input
          class="text-credentials"
          bind:value={credentials.valor}
          placeholder="Valor"
        />
        <div>
          <button
            class="btn btn-primary btn-sm"
            on:click={() => credentials.push({ clave: "", valor: "" })}
            >Agregar</button
          >
        </div>
      {/if}
    </div>
  </ModalBody>
  <ModalFooter>
    <button
      class="btn btn-primary btn-sm"
      disabled={isSaving}
      on:click={editMode ? onSave : toggleEditMode}
      >{editMode ? "Guardar" : "Editar"} <i class="bi bi-pencil" /></button
    >
  </ModalFooter>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .show-data-credentials {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .text-credentials {
    width: 50%;
    height: 80%;
    border-radius: 0.3rem;
    padding: 0.5rem;
  }
</style>
