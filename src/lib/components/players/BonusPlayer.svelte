<script>
  import { Modal, ModalBody, ModalHeader} from "sveltestrap";
  import alertify from "alertifyjs";
  import { onMount } from "svelte";
  export let bonusModalVisible;
  export let player_ ;

  let bonus;

  let size = "lg";

  onMount(()=>{
    bonus = player_.bonus;
    console.log("bonusData:", player_);
  });



  const toggle = () => (bonusModalVisible = !bonusModalVisible);

</script>

<Modal isOpen={bonusModalVisible} {toggle} {size}>
  <ModalHeader {toggle}>
    <span class="title">Bono de: {player_.username} </span>
  </ModalHeader>
  <ModalBody>
    <div class="bonus-content">
      {#each bonus as bono}
        <div class="bonus u-form-control">
          <span>{bono.name}</span>
          <span>{bono.amount}</span>
        </div>
      {/each}
    </div>
  </ModalBody>
</Modal>

<style>
  .bonus-content{
    color: black;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem; 
  }
  .bonus{
    background-color: bisque;
    width: auto;

  }
</style>