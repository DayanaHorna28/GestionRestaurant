<script>
	import { ICONS } from './../../../../../js/icons.js';
	import alertify from 'alertifyjs';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import backend from "../../../../../server";
  import { onMount } from "svelte";
  import moment from "moment";
  import CarruselForm from "./CarruselForm.svelte";

  export let showModalEditCarrusel;
  export let onNewCarrusel;
  export let client = {};

  let showModalEditBanner = false;

  const onShowEditCarrusel = () =>(showModalEditCarrusel = !showModalEditCarrusel);
  let carrusels = [];
  let carrusel= {};
  let filters = { page: 1, xpage: 20 };
  let categories = [];
  let isNew;
  let devices = [
    { value: "", label: "Todos" },
    { value: "1", label: "Sitios" },
    { value: "2", label: "API" }
  ];
  let status = [
    { value: "", label: "Todos" },
    { value: "0", label: "Desactivo" },
    { value: "1", label: "Activo" }
  ];
  let sections = [
    { value: "top-center", label: "Top Center" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
    { value: "center", label: "Center" },
    { value: "left-center", label: "Left Center" },
    { value: "right-center", label: "Right Center" },
    { value: "sidebar-left", label: "Sidebar Left" },
    { value: "sidebar-right", label: "Sidebar Right" },
    { value: "header", label: "Header" },
    { value: "footer", label: "Footer" }
  ];

  const searchEnter = (e) => {
    if (e.charCode === 13) list();
  };

  onMount(() => {
    list();
  });

  const list = async () => {
    let params = { client_id: client.id, ...filters };
    if (filters.startTime) params.startTime = filters.startTime;
    if (filters.endTime) params.endTime = filters.endTime;
    try {
      let response = await backend.client.listCarrusels(params);
      let list = response?.data?.data || [];  // Aseguramos que list sea un arreglo
      list.forEach((e) => {
          e.start_time = e.startTime ? moment(e.startTime).format("DD/MM/YYYY") : "";
          e.end_time = e.endTime ? moment(e.endTime).format("DD/MM/YYYY") : "";
      });
      carrusels = list;
    } catch (error) {
      console.log("Error al obtener los carruseles:", error);
    }
  };

  const listCategories = async () => {
    try {
      let data = await backend.games.listCategories(params);
      categories = data.data.sort();
    } catch (error) {
      alertify.error("Error:", error, "No se pudo listar las categorias");
    }
  };

  const editBanner = (item) => {
    showModalEditBanner = true;
    carrusel = { ...item };
    isNew = false;
  };

  const deleteCarrusel = (item) => {
    let params = { client_id: client.id, carousel_id: item.index}
    alertify.confirm("Cuidado",`Seguro de <b>Eliminar  ${item.title}</b>?`,async () => {
      try{
        await backend.client.deleteCarrusel(params);
        alertify.success("Carrusel eliminado exitosamente!");
        list();
      } catch (error) {
        alertify.error("Error al eliminar el Carrusel.");
      }
    },() => {});
  }
</script>

<Modal isOpen={showModalEditCarrusel} toggle={onShowEditCarrusel} class="modal-fullscreen">
  <ModalHeader toggle={onShowEditCarrusel}>Carruseles de: {client.namesite} </ModalHeader>
  <ModalBody>
    <div class="wrapp-carruseles">
      <div class="bo-header-filter">
        <button on:click={onNewCarrusel} class="btn btn-sm btn-primary">{@html ICONS.addCircle} Nuevo</button>
        <button class="btn btn-primary btn-sm" title="Buscar" on:click={list}>{@html ICONS.reload}</button>

        <!--<div class="filters-section">
          <span><b>Dispositivo:</b></span>
          <select class="form-control" bind:value={filters.device}>
            {#each devices as device}
              <option value={device.value}>{device.label}</option>
            {/each}
          </select>
        </div>
        <div class="filters-section">
          <span><b>Estado:</b></span>
          <select class="form-control" bind:value={filters.status}>
            {#each status as status}
              <option value={status.value}>{status.label}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-header">
          <span><b>Categoria:</b></span>
          <select class="form-control" bind:value={filters.category}>
            <option value="">Todos</option>
            {#each categories as category}
              <option>{category}</option>
            {/each}
          </select>
        </div>
        <div class="filters-section">
          <span><b>Sección del Banner:</b></span>
          <select class="form-control" bind:value={filters.section}>
            {#each sections as section}
              <option value={section.value}>{section.label}</option>
            {/each}
          </select>
        </div>
        <div class="filters-section">
          <span><b>Fecha Desde:</b></span>
          <input type="datetime-local" class="form-control" bind:value={filters.startTime} placeholder="Seleccione fecha y hora" />
        </div>
        <div class="filters-section">
          <span><b>Fecha Hasta:</b></span>
          <input type="datetime-local" class="form-control" bind:value={filters.endTime} placeholder="Seleccione fecha y hora" />
        </div>
        <div class="filters-search">
          <input on:keypress={searchEnter} bind:value={filters.search} class="form-control" placeholder="Buscar"/>
          </div>-->
      </div>
      <div style="overflow-x: auto;">
        <table size="sm" class="table table-striped table-sm">
          <thead class="table-dark">
            <tr>
              <th>Index</th>
              <th>Pagina</th>
              <th>Sección</th>
              <th>Nombre</th>
              <th style="text-align: center;">Dispositivo</th>
              <th>Idioma</th>
              <th>Fecha Inicio</th>
              <th>Fecha Final</th>
              <th style="text-align: center;">Estado</th>
              <th style="text-align: center;" class="center">-</th>
            </tr>
          </thead>
          <tbody>
            {#each carrusels as carrusel}
              <tr class="tr-sm {carrusel.status == 0 ? 'disabled' : ''}">
                <td class="sm">{carrusel.index}</td>
                <td class="sm">{carrusel.category}</td>
                <td class="sm">{carrusel.section}</td>
                <td class="sm">{carrusel.title}</td>
                <td style="text-align: center;" class="sm">{@html carrusel.device === 'Desktop' ? ICONS.desktop : ICONS.mobile}</td>
                <td class="sm">{carrusel.language}</td>
                <td class="sm">{carrusel.start_time}</td>
                <td class="sm">{carrusel.end_time}</td>
                <td style="text-align: center;" title={carrusel.status == 1 ? 'activo' : 'desactivo'}> <span class="status-circle {carrusel.status == 1 ? 'status-active' : 'status-inactive'}"></span></td>
                <td style="text-align: center;" class="center sm">
                  <button class="btn btn-warning btn-sm" title="Banners" on:click={() => editBanner(carrusel)} >{@html ICONS.edit}</button>
                  <button class="btn btn-danger btn-sm" title="Eliminar carrusel" on:click={()=> deleteCarrusel(carrusel)}> {@html ICONS.delete} </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </ModalBody>
  <ModalFooter></ModalFooter>
</Modal>

{#if showModalEditBanner}
  <CarruselForm bind:showModalEditBanner bind:carruselInfo={carrusel} {client} {isNew} {list}></CarruselForm>
{/if}

<style>
  .status-circle {
    width: 16px; /* Tamaño del círculo */
    height: 16px; /* Tamaño del círculo */
    border-radius: 50%; /* Hace que el elemento sea un círculo */
    display: inline-block;
    vertical-align: middle;
    align-items: center;
  }
  .status-active {
    background-color: green; /* Color para el estado activo */
  }
  .status-inactive {
    background-color: red; /* Color para el estado inactivo */
  }
  .wrapp-carruseles{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

  }
</style>
