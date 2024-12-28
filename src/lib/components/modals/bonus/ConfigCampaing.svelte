<script>
    import { ModalBody, ModalFooter, ModalHeader, Modal } from "sveltestrap";

    export let showConfCamping;

    let platform = {};

    const savePlatform = () => {};

    const isOnlyNumber = (event) => {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
        alertify.error("Ingrese solo números positivos");
      }
    };

    const onshowConfigCampaing = () => (showConfCamping = !showConfCamping);


</script>


<Modal isOpen={showConfCamping} toggle={onshowConfigCampaing} size="xs">
  <ModalHeader toggle={onshowConfigCampaing}>CONFIGURACIÓN</ModalHeader>
  <ModalBody>
    <div class="campaing-data">
      <button class="open-link-btn" onClick={() => window.open('https://bo.firstsports.tech', '_blank')}>
        BO FIRST
      </button>
    </div>
  </ModalBody>
</Modal>

<style>
  .campaing-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .open-link-btn {
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .open-link-btn:hover {
    background-color: #0056b3;
  }
</style>
