<script>
  import { onMount } from "svelte";
  import { ModalBody, Modal, ModalHeader } from "sveltestrap";
  import backend from "../../../../server";
  import { ICONS } from "../../../../js/icons";
  import alertify from "alertifyjs";

  export let showModalUploadCredentials;

  let credentials = [];
  let clientFilter = "";
  let providerFilter = "";
  let sectionFilter = ""; // Filtro para node o java
  let filteredCredentials = [];
  let platforms = [];
  let newCredential = { keyId: "", value: "", section: ""};
  let isEditing = [];
  let isSaving = false; // Control para bloquear el botón de guardar

  onMount(() => {
    listCredentials();
    listPlatforms();
  });

  const listCredentials = async () => {
    try {
      const response = await backend.client.listCredentialsGames();
      // Filtrar según la sección seleccionada (node o java)
      let allCredentials = Object.entries(response.data).flatMap(([section, credentials]) =>
        Object.entries(credentials).map(([key, value]) => ({
          keyId: key,
          value,
          section,
        }))
      );
      credentials = allCredentials;
      isEditing = credentials.map(() => false);
      filterCredentials();
    } catch (error) {
      alertify.error("Error al listar las credenciales");
    }
  };

  const filterCredentials = () => {
    filteredCredentials = credentials.filter((cred) => {
      const clientMatch = clientFilter ? cred.keyId.includes(clientFilter) : true;
      const providerMatch = providerFilter ? cred.keyId.includes(providerFilter) : true;
      const sectionMatch = sectionFilter ? cred.section === sectionFilter : true;
      return clientMatch && providerMatch && sectionMatch;
    });
  };

  const listPlatforms = async () => {
    let params = { platform: 1, xpage: 100, page: 1 };
    let response = await backend.client.list(params);
    
    // Ordenar según el atributo 'namesite'
    platforms = response.data.list.sort((a, b) => {
      if (a.namesite.toLowerCase() < b.namesite.toLowerCase()) {
        return -1;
      }
      if (a.namesite.toLowerCase() > b.namesite.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    
    console.log("Platforms: ", platforms);
  };


  const addCredential = async () => {
    if (newCredential.keyId && newCredential.value && newCredential.section) {
      const keyExists = credentials.some(
        (cred) => cred.keyId === newCredential.keyId && cred.section === newCredential.section
      );
      if (!keyExists) {
        const credentialToSend = {
          secretName: newCredential.keyId,
          secretValue: newCredential.value,
        };
        await saveCredentials(credentialToSend, newCredential.section);
        newCredential = { keyId: "", value: "", section: "" };
      } else {
        alertify.error("La clave ya existe en la sección seleccionada. Por favor, ingrese una clave única");
      }
    }
  };

  const toggleEdit = async (index) => {
    if (isEditing[index]) {
      await saveCredentials();
    }
    isEditing[index] = !isEditing[index];
  };

  const saveCredentials = async (credential, section) => {
    isSaving = true; // Bloquea el botón
    try {
      await backend.client.saveCredentials(credential, section);
      alertify.success("Credenciales guardadas exitosamente");
      console.log("Credenciales guardadas exitosamente");
      listCredentials();
      isSaving = false;
    } catch (error) {
      alertify.error("Error al guardar las credenciales");
    }
  };

  const deleteCredentials = async (index) =>{
    const cred = filteredCredentials[index]; // Obtener la credencial a eliminar
    alertify.confirm("Cuidado",`Seguro de <b>Eliminar</b>?`,async () => {
      try {
        await backend.client.deleteCredentials(cred);
        alertify.success("Credencial eliminada exitosamente");
        list();
      } catch (error) {
        alertify.error("Error al eliminar las credenciales");
      }
    },() => {});
  }

  $: filterCredentials();

  const onShowModalUploadCredentials = () => (showModalUploadCredentials = !showModalUploadCredentials);
</script>

<Modal isOpen={showModalUploadCredentials} toggle={onShowModalUploadCredentials} size={"xl"}>
  <ModalHeader toggle={onShowModalUploadCredentials}>CREDENCIALES:</ModalHeader>
  <ModalBody>
    <div class="filter-section">
      <div>
        <span>Plataforma:</span>
        <select bind:value={clientFilter} class="form-control" on:change={filterCredentials}>
          <option value="">Todos</option>
          {#each platforms as platform}
            <option value={platform.code}>{platform.namesite}</option>
          {/each}
        </select>
      </div>
      <div>
        <span>Proveedor:</span>
        <input class="form-control" placeholder="Ingrese Nombre del Proveedor" bind:value={providerFilter} on:input={filterCredentials}/>
      </div>
      <div>
        <span>Sección:</span>
        <select bind:value={sectionFilter} class="form-control" on:change={filterCredentials}>
          <option value="">Todas</option>
          <option value="node">Node</option>
          <option value="java">Java</option>
        </select>
      </div>
    </div>
    <div class="credentials-section">
      <h3>Credenciales Existentes</h3>
      <div class="table-container">
        <table size="sm" class="table table-striped table-sm">
          <thead class="table-dark">
            <tr>
              <th>CLAVE</th>
              <th>VALOR</th>
              <th>SECCIÓN</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredCredentials as cred, index}
              <tr>
                <td><input class="form-control" disabled={!isEditing[index]} bind:value={cred.keyId}/></td>
                <td><input class="form-control" disabled={!isEditing[index]} bind:value={cred.value}/></td>
                <td>{cred.section == 1 ? 'NODE': 'JAVA'}</td>
                <td>
                  <button disabled class="btn btn-sm btn-{!isEditing[index] ? 'light' : 'primary'}" on:click={() => toggleEdit(index)} >{@html isEditing ? ICONS.edit : ICONS.save}</button>
                  <button class="btn btn-sm btn-danger" on:click={() => deleteCredentials(index)} >{@html ICONS.delete}</button>
                </td>
                
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <!-- Fila para agregar nuevas credenciales, siempre visible -->
    <div class="new-credential-section">
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>
              <input
                on:keypress={(event) => {
                  if (event.key === ' ') {
                    event.preventDefault();
                  }
                }}
                on:input={(event) => {
                  newCredential.keyId = event.target.keyId.replace(/\s+/g, ''); // Elimina todos los espacios al pegar
                }} 
                class="form-control" 
                bind:value={newCredential.keyId} 
                placeholder="Nueva Clave"/>
            </td>
            <td>
              <input
                class="form-control" 
                bind:value={newCredential.value} 
                placeholder="Nuevo Valor"/>
            </td>
            <td>
              <select bind:value={newCredential.section} class="form-control">
                <option value="">Seleccione Sección</option>
                <option value=1>Node</option>
                <option value=2>Java</option>
              </select>
            </td>
            <td>
              <button class="btn btn-primary btn-sm" on:click={addCredential} disabled={isSaving}>
                {@html ICONS.save}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </ModalBody>
</Modal>

<style>
  * {
    font-size: 1.2rem;
  }
  input:disabled {
    outline: none;
    border: none;
    font-size: 1.2rem;
    width: 90%;
  }
  input:enabled {
    border: 1px solid #c2bcbc;
    width: 100%;
    font-size: 1.2rem;
  }
  .filter-section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
  }
  .credentials-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .table-container {
    max-height: 300px;
    overflow-y: auto;
  }
  .new-credential-section {
    margin-top: 1rem;
  }
</style>
