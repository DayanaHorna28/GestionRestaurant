<script>
    import { ModalBody, ModalFooter, ModalHeader, Modal } from "sveltestrap";

    export let showFormAssignPlatform;

    let platform = {};

    const savePlatform = () => {};

    const isOnlyNumber = (event) => {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
        alertify.error("Ingrese solo números positivos");
      }
    };

    const onshowAssignPlatform = () => (showFormAssignPlatform = !showFormAssignPlatform);


</script>


<Modal isOpen={showFormAssignPlatform} toggle={onshowAssignPlatform} size="xl">
  <ModalHeader toggle={onshowAssignPlatform}>VINCULAR PLATAFORMA</ModalHeader>
  <ModalBody>
    <div class="campaing-data">
      <label>ID<input class="form-control" bind:value={platform.id} disabled /></label>
      <label>Nombre<input class="form-control" bind:value={platform.name} disabled={!!platform.id}/></label>
      <label>SiteId<input on:keypress={isOnlyNumber} class="form-control" bind:value={platform.name} disabled={!!platform.id}/></label>
      <label>DomainId<input on:keypress={isOnlyNumber} class="form-control" bind:value={platform.domainId} disabled={!!platform.id}/></label>
      
      <button class="btn btn-primary btn-sm" on:click={savePlatform} disabled={!!platform.id}>Vincular</button>
    </div>

  </ModalBody>
</Modal>
<style></style>