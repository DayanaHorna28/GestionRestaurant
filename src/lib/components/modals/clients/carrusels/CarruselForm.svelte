<script>
  import alertify from "alertifyjs";
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import backend from "../../../../../server";
  import {events} from "../../../../../js/events";
  import {sections, languages, status} from "../../../../../js/constants";
  import Configuration from "../../../../../config";


  export let showModalEditBanner;
  export let client;
  export let isNew = true;
  export let list;
  export let carruselInfo = {
    items: [],
    device: "Desktop",
    title: "",
    section: "top_full",
    language: "ES",
    interval: 1,
    startTime: "",
    endTime: "",
    status: 1,
    client_id: client.id,
  };

  const conf = Configuration.getConfiguration();


  const modalTitle = () => {
    return isNew ? "Carrusel Nuevo" : `Carrusel ${carruselInfo.title}`;
  };

  let categories = [
    "slot", "slot_live", "crash", "virtual"
  ];
  let isSaving = false;
  let brands =[];
  let filteredBrands; // Variable para almacenar las marcas filtradas
  let searchData = ""; // Término de búsqueda
  let isDropdownOpen = false; // Control para mostrar/ocultar el dropdown


  onMount(() => {
    //listCategories();
    listBrandsByCategory();
    if (isNew) resetCarrusel();
  });

  const onShowEditBanner = () => (showModalEditBanner = !showModalEditBanner);
  // Restablecer el carrusel y agregar un banner por defecto
  const resetCarrusel = () => {
    carruselInfo = {
      ...carruselInfo,
      titulo: "",
      items: [],
    };
    addItem(); // Agregar un banner por defecto
  };

  const addItem = () => {
    if (!carruselInfo.items) {
      carruselInfo.items = [];
    }
    const newItem = {
      imageName: "",
      title: "",
      timeInterval: 1,
      serial: "",
      startTime: "",
      endTime: "",
      orderView: carruselInfo.items.length + 1,
      status: 1,
      eventClick: "onCategoryChange('Home')",
      sizeView: "full width",
      imagen: null,
      gameId: '',
      externalUrl: '',
      brandName: '',
      customCategory: "slot"
    };
    carruselInfo.items = [...carruselInfo.items, newItem];
  };

  /*const listCategories = async () => {
    try {
      let data = await backend.games.listCategories();
      categories = data.data.sort();
    } catch (error) {
      alertify.error("Error:", error, "No se pudo listar las categorias");
    }
  };*/

  const listBrandsByCategory = async () => {
    try {
      let data = await backend.brands.listBrandsByCategory(); // Pasamos el valor de la categoría
      brands = data.data.sort();// Actualizamos la variable temporal con las marcas de la categoría seleccionada
      console.log("Brands", brands);
    } catch (error) {
      console.error("Error al listar las marcas por categoría", error);
    }
  };

  function filterBrands() {
    filteredBrands = brands.filter(brand =>
      brand.toLowerCase().includes(searchData.toLowerCase())
    );
  }

  function selectBrand(brand) {
    banner.brandName = brand;
    isDropdownOpen = false;
  }

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    if (isDropdownOpen) {
      searchData = "";
      filterBrands(); // Restablece la lista filtrada al abrir el dropdown
    }
  }

  const save = async () => {
    if (!validateForm()) return;
    carruselInfo.client_id = client.id;
    const formData = new FormData();
    formData.append(
      "carousel",
      new Blob([JSON.stringify(carruselInfo)], { type: "application/json" })
    );
    carruselInfo.items.forEach((banner) => {
      if (banner.file) {
        formData.append(`files`, banner.file);
      }
      switch (banner.eventClick) {
        case 'openGame':
          if (banner.gameId) {
            formData.append(`banners[${banner.id}][gameId]`, banner.gameId);
          }
          break;
        case 'openExternalUrl':
          if (banner.externalUrl) {
            formData.append(`banners[${banner.id}][externalUrl]`, banner.externalUrl);
          }
          break;
        case 'openBrand':
          if (banner.brandName) {
            formData.append(`banners[${banner.id}][brandName]`, banner.brandName);
          }
          break;
        default:
          console.warn(`Evento no soportado: ${banner.eventClick}`);
      }
    });
    try {
      isSaving = true;
      console.log("formData", formData);
      await backend.client.saveCarrusel(formData);
      showModalEditBanner = false;
      alertify.success("El carrusel se guardó correctamente.");
      list();
      isSaving = false;
    } catch (error) {
    }
  };

  // Validar los campos obligatorios
  const validateForm = () => {
    if (!carruselInfo.title.trim()) alertify.error("El título es obligatorio.");
    if (!carruselInfo.category) alertify.error("La categoría es obligatoria.");
    if (!carruselInfo.section) alertify.error("La sección es obligatoria.");
    if (!carruselInfo.language) alertify.error("El idioma es obligatorio.");
    if (carruselInfo.items.length === 0)
      alertify.error("Debe agregar al menos un banner.");
    return true;
  };

  // Manejo de la subida de imágenes
  const handleUploadBannerImage = (event, index) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      carruselInfo.items[index].file = file; // Asignamos el archivo cargado
      const reader = new FileReader();
      reader.onload = () => {
        carruselInfo.items[index].previewUrl = reader.result;
        carruselInfo.items[index].fileType = file.type; // Solo para uso interno
      };
      reader.readAsDataURL(file); // Convertimos el archivo a Base64 para la vista previa
    } else {
      carruselInfo.items[index].previewUrl = `${conf.ASSETS}/${carruselInfo.items[index].imgUrl}`;
    }
  };


  carruselInfo.items.forEach((item, index) => {
    if (!item.previewUrl && item.imgUrl) { 
      item.previewUrl = `${conf.ASSETS}/${item.imgUrl}`;
      console.log('previeURL', item.previewUrl);
    }
  });

  const isOnlyNumber = (event) => {
    // Permitir números y el carácter de punto
    if (!/[\d.]/.test(event.key)) {
      event.preventDefault();
      alertify.error("Ingrese solo números o un punto decimal");
    }
  };

  const removeArticulo = (index) => {
    try {
      alertify.confirm(
        "Eliminar Banner", 
        "¿Está seguro de que desea eliminar este banner?", 
        () => {
          carruselInfo.items.splice(index, 1);
          carruselInfo.items = [...carruselInfo.items]; 
          alertify.success("Banner eliminado"); 
        },
        () => {});
    } catch (error) {
      alertify.error("Error al intentar eliminar el banner");
    }
  };

</script>

<Modal isOpen={showModalEditBanner} toggle={onShowEditBanner} class="modal-fullscreen">
  <ModalHeader toggle={onShowEditBanner}>
    <b>{modalTitle()}</b>
  </ModalHeader>
  <ModalBody>
    <div class="container-carrusel">
      <div class="data-carrusel">
        <div class="form-group">
          <span><b>Nombre:</b></span>
          <input type="text" bind:value={carruselInfo.title} required />
        </div>
        <div class="form-group">
          <span><b>Dispositivo:</b></span>
          <select bind:value={carruselInfo.device}>
            <option value="Desktop">Desktop</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>
        <div class="form-group">
          <span><b>Pagina:</b></span>
          <select class="form-control" bind:value={carruselInfo.category}>
            <option value="Home">Home</option>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>
        <div class="form-group">
          <span><b>Sección del Banner:</b></span>
          <select class="form-control" bind:value={carruselInfo.section}>
            {#each sections as section}
              <option value={section.value}>{section.label}</option>
            {/each}
          </select>
        </div>
        <div class="form-group">
          <span><b>Idioma:</b></span>
          <select bind:value={carruselInfo.language}>
            {#each languages as language}
              <option value={language.value}>{language.label}</option>
            {/each}
          </select>
        </div>
        <div class="form-group">
          <span><b>Intervalo (segundos):</b></span>
          <input bind:value={carruselInfo.interval} on:keypress={isOnlyNumber} disabled/>
        </div>
        <div class="form-group">
          <span><b>Estado:</b></span>
          <select class="form-control" bind:value={carruselInfo.status}>
            {#each status as status}
              <option value={status.value}>{status.label}</option>
            {/each}
          </select>
        </div>
        <div class="form-group">
          <span><b>Hora de inicio:</b></span>
          <input type="datetime-local" bind:value={carruselInfo.startTime} />
        </div>
        <div class="form-group">
          <span><b>Hora final:</b></span>
          <input type="datetime-local" bind:value={carruselInfo.endTime} />
        </div>
      </div>
      <div class="articulos-container">
        <span class="title-banner"><b>Items de Carrusel</b></span>
        <div class="grid-articulos">
          {#if carruselInfo.items.length > 0}
            {#each carruselInfo.items as banner, index}
              <div class="articulo">
                <div class="form-group">
                  <span>Titulo:</span>
                  <input type="text" bind:value={banner.title} />
                </div>
                <div class="form-group">
                  <span>Nombre de la Imagen:</span>
                  <input type="text" bind:value={banner.imageName} disabled={banner.serial !== ""}/>
                </div>
                <div class="form-group">
                  <span>Intervalo (en segundos)</span>
                  <input bind:value={banner.timeInterval} on:keypress={isOnlyNumber} disabled/>
                </div>
                <div class="form-group">
                  <span>Enlace:</span>
                  <input type="text" bind:value={banner.imgUrl} disabled />
                </div>
                <div class="form-group">
                  <span>Fecha de inicio</span>
                  <input type="datetime-local" bind:value={banner.startTime} />
                </div>
                <div class="form-group">
                  <span>Fecha final</span>
                  <input type="datetime-local" bind:value={banner.endTime} />
                </div>
                <div class="form-group">
                  <span>Orden vizualización</span>
                  <input type="number" bind:value={banner.orderView} />
                </div>
                <div class="form-group">
                  <span>Redirecionar a:</span>
                  <select bind:value={banner.eventClick}>
                    {#each events as event}
                      <option value={event.value}>{event.label}</option>
                    {/each}
                  </select>
                  {#if banner.eventClick === "openGame"}
                    <div class="form-group">
                      <span>Ingrese Game ID:</span>
                      <input bind:value={banner.gameId} placeholder="ID del juego" class="form-control"/>
                    </div>
                  {/if}

                  {#if banner.eventClick === "openExternalUrl"}
                    <div class="form-group">
                      <span>Ingrese URL externa:</span>
                      <input bind:value={banner.externalUrl} placeholder="https://ejemplo.com" class="form-control"/>
                    </div>
                  {/if}

                  {#if banner.eventClick === "openBrand"}
                    <div class="form-group">
                      <span>Seleccione la categoria:</span>
                      <br>
                      <span>{banner.customCategory}</span>
                      <select class="form-control" bind:value={banner.customCategory}>
                        {#each categories as category}
                          <option>{category}</option>
                        {/each}
                      </select>
                    </div>
                    <div class="form-group">
                      <span>Ingrese el nombre de la marca:</span>
                      <select class="form-control" bind:value={banner.brandName}>
                        <option value="" disabled selected>Seleccione una marca</option>
                        {#each brands as brand}
                          <option>{brand}</option>
                        {/each}
                      </select>
                    </div>
                  {/if}
                </div>
                <div class="form-group">
                  <span>Tamaño</span>
                  <select bind:value={banner.sizeView}>
                    <option value="full width">Full width</option>
                    <option value="half width">Half width</option>
                  </select>
                </div>
                <div class="form-group">
                  <span>Estado</span>
                  <select bind:value={banner.status}>
                    {#each status as status}
                      <option value={status.value}>{status.label}</option>
                    {/each}
                  </select>
                </div>
                <div class="form-group">
                  <span>Imagen/Video</span>
                  <input type="file" on:change={(e) => handleUploadBannerImage(e, index)}/>
                  {#if banner.previewUrl}
                    {#if /\.(jpg|jpeg|png|gif|webp)$/i.test(banner.imgUrl) || banner.file?.type.startsWith('image/')}
                      <img
                        src={banner.previewUrl || `${conf.ASSETS}/${banner.imgUrl}`}
                        alt="Vista previa"
                        class="img-preview"
                      />
                    {:else if banner.file?.type.startsWith('video/') || /\.(mp4|webm)$/i.test(banner.imgUrl)}
                      <video controls class="video-preview">
                        <source src={banner.previewUrl || `${conf.ASSETS}/${banner.imgUrl}`} />
                        Tu navegador no soporta la vista previa de videos MP4.
                      </video>
                    {/if}
                  {/if}
                </div>
                <button class="btn btn-danger" on:click={() => removeArticulo(index)}>Borrar</button>
              </div>
            {/each}
          {:else}
            <p>No hay artículos en el carrusel.</p>
          {/if}
          <div style="display: flex; align-items: start;">
            <button style="width: 100%; margin: 0;" class="btn btn-primary btn-sm" on:click={addItem}>Añadir</button>
          </div>
        </div>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button on:click={save} disabled={isSaving} class="btn btn-primary">Guardar Todo</button>
  </ModalFooter>
</Modal>

<style>
  .container-carrusel {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .data-carrusel,
  .grid-articulos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .grid-articulos {
    background-color: #bdbcbc;
  }

  .articulo {
    border: 1px solid #dee2e6;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
  }

  .title-banner {
    font-size: 1rem;
  }
  

  input,
  select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }

  .btn {
    margin-top: 10px;
    padding: 10px 20px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-danger {
    background-color: #dc3545;
  }

  .btn-primary {
    background-color: #007bff;
  }

  .btn:hover {
    opacity: 0.8;
  }

  .img-preview, .video-preview {
    max-width: 100%;
    height: auto;
    margin-top: 1rem;
  }
</style>
