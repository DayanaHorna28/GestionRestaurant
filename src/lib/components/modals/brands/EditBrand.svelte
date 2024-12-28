<script>
 
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";
  import backend from "../../../../server";
  import Configuration from "../../../../config";
  import { onMount } from "svelte";
  import alertify from "alertifyjs";
  const conf = Configuration.getConfiguration();

  export let openEditBrand;
  export let list;
  export let brand;

  let dataFile = null;
  let files;
  let data;
  let image = null;
  let showImage = false;

  onMount(() => {
    data = brand;
  });

  const getImgUrl = (brand) => {
    return `${conf.ASSETS}/us_img_brands/${data.brand}.png`;
  };

  function onChangeImage() {
    let file = files[0];
    if (file) {
      showImage = true;
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
    }
  }

  async function saveBrand() {
    //Cargar envio de imagen
    const formData = new FormData();
    if (files && files.length) {
      formData.append("file", files[0]);
    }
    let params = {
      brand: data.brand,
    };
    try {
      await backend.brands.saveBrand(params, formData);
      alertify.success("Procesado correctamente");
      openEditBrand = false;
      loading = true;
      list();
      loading = false;
    } catch (error) {
      alertify.error("Error al cargar imagen");
    }
  }

  const onShowBrandModal = () => (openEditBrand = !openEditBrand);
</script>

<Modal isOpen={openEditBrand} toggle={onShowBrandModal} size={"xl"}>
  <ModalHeader toggle={onShowBrandModal} ><b>Marca:</b> {brand.brand || ""}</ModalHeader>
  <ModalBody>
    <div>
      <span>Nombre:</span>
      <input bind:value={data.brand} class="form-control" />
    </div>
    <div>
      <span class="text-danger">Solo se permiten archivos .PNG</span>
    </div>
    <div class="wrapp-image">
      {#if brand.brand}
        <div>
          <td class="center"
            ><img
              class="img_game"
              src={getImgUrl()}
              alt=""
              on:error={(e) =>
                (e.target.src = `${conf.ASSETS}/us_img_games/_no_game1.png`)}
            /></td
          >
        </div>
      {/if}
      <div class="new-image">
        <input
          accept="image/png"
          id="fileUpload"
          type="file"
          bind:files
          on:change={onChangeImage}
        />
        {#if showImage}
          <img bind:this={image} src="" alt="Preview" />
        {/if}
        {#if dataFile && files[0]}
          <p>{files[0].name}</p>
        {/if}
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-primary btn-sm" on:click={saveBrand}>Guardar</button>
  </ModalFooter>
</Modal>

<style>
  @media (max-width: 1024px) {
    .wrapp-image {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      gap: 0.5rem;
    }
    input {
      cursor: pointer;
    }
  }
  @media (min-width: 1025px) {
    input {
      cursor: pointer;
    }
    .wrapp-image {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      gap: 0.5rem;
      background-color: #959595;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .new-image {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
