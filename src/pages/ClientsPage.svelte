<script>
  import backend from "../server";
  import { onMount } from "svelte";
  import GamesByClient from "../lib/components/modals/clients/GamesByClient.svelte";
  import ClientFormat from "../lib/components/modals/clients/ClientFormat.svelte";
  import BrandsByClient from "../lib/components/modals/clients/BrandsByClient.svelte";
  import AddBrands from "../lib/components/modals/clients/AddBrands.svelte";
  import Pagination from "../lib/components/Pagination.svelte";
  import Loading from "../lib/components/Loading.svelte";
  import AddGames from "../lib/components/modals/clients/AddGames.svelte";
  import Credentials from "../lib/components/modals/clients/Credentials.svelte";
  import {ICONS} from "../js/icons"
  import CarruselForm from '../lib/components/modals/clients/carrusels/CarruselForm.svelte';
  import CarruselList from '../lib/components/modals/clients/carrusels/CarruselList.svelte';
  import alertify from 'alertifyjs';
  import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "sveltestrap";
  import EditGamePosition from "../lib/components/modals/clients/gamesTops/EditGamePosition.svelte";

  let client = {};
  let promise;
  let clientSelected = {};
  let clients = { list: [] };
  let filters = { page: 1, xpage: 20 };
  let showModalGames = false;
  let showFormClient = false;
  let showModalAddBrand = false;
  let showModalConfigurationClient = false;
  let showModalUploadCredentials = false;
  let showModalNewBanner = false;
  let showModalEditCarrusel = false;
  let showModalAddGames = false;
  let showModalEditGamePosition = false;
  let filter;
  let isNew;

  onMount(() => {
    list();
  });

  const list = async () => {
    let params = { ...filters };
    if (params.platform === "") delete params.platform;
    if (params.status === "") delete params.status;
    if (params.search === "") delete params.search;
    let response = await backend.client.list(params);
    clients = response.data;
    clients.list.sort((a, b) => a.id - b.id); // Ordenar por ID de menor a mayor
    filters.page = 1;
  };

  const listCategories = async () => {
    try {
      let data = await backend.games.listCategories();
      categories = data.data.sort();
    } catch (error) {
      alertify.error("Error:", error, "No se pudo listar las categorias");
    }
  };


  const newClient = () => {
    client = {
      server: "35.90.151.37",
      endpoint: "http://51.222.218.97/api_casino",
    };
    showFormClient = true;
  };

  const onEditClient = (item) => {
    client = item;
    showFormClient = true;
  };

  const onEditGamePosition = (item) => {
    client = item;
    showModalEditGamePosition = true;
  };

  const uploadCredentials = (item) =>{
    client = item;
    showModalUploadCredentials = true;
  }

  const editCarrusel = (item) =>{
    client = item;
    showModalEditCarrusel = true;
  }

  function onDeleteClient(item) {
    client = item;
    async () => {
        try {
          let response = await backend.client.remove(client.id);
          console.log(response);
          list();
          //alertify.success("Procesado!");
        } catch (error) {
          //alertify.error("Error al eliminar");
        }
    // //alertify.confirm(
    //   "Cuidado",
    //   `Seguro de eliminar <b>${client.businessname}</b>?`,
      
    //   },
    //   () => {}
    // );
      }
  }

  function onGamesByClient(item) {
    client = item;
    showModalGames = true;
  }
  const onAddGames = () => {
    showModalGames = false;
    showModalAddGames = true;
  };

  const onConfigClient = async (item) => {
    try {
      client = item;
      showModalConfigurationClient = true;
    } catch (error) {
      //alertify.error("Contactese con soporte");
    }
  };

  const onAddBrand = () => {
    try {
      clientSelected = client;
      showModalAddBrand = true;
      showModalConfigurationClient = false;
    } catch (error) {
      //alertify.error("Contactese con soporte");
    }
  };
  const onNewCarrusel= () => {
    showModalNewBanner = true;
    isNew = true;
  }
  const onPageClick = (page) => {
    filters.page = page;
    list();
  };

  const searchEnter = (e) => {
    if (e.charCode === 13) list();
  };
</script>

<div class="wrapp">
  <div class="bo-header-filter">
    <div class="filter-games">
      <span><b>Plataforma:</b></span>
      <select class="form-control" bind:value={filters.platform}>
        <option value="">Todos</option>
        <option value="1">Sitios</option>
        <option value="2">API</option>
      </select>
    </div>
    <div class="filter-games">
      <span><b>Estado:</b></span>
      <select class="form-control" bind:value={filters.status}>
        <option value="">Todos</option>
        <option value="0">Desactivo</option>
        <option value="1">Activo</option>
      </select>
    </div>
    <div class="filter-games">
      <input
        on:keypress={searchEnter}
        bind:value={filters.search}
        class="form-control"
        placeholder="Buscar"
      />
      <button class="btn btn-primary btn-sm" title="Buscar" on:click={list}>{@html ICONS.search}</button>
    </div>
    <button style="display: flex; align-items: center; gap: 0.5rem;" class="btn btn-primary btn-sm" on:click={() => newClient()}>{@html ICONS.addCircle}Nuevo</button>
    <button class="btn btn-warning btn-sm" on:click={() => uploadCredentials(client)}>Credenciales</button>
  </div>
  <div style="overflow-x: auto;">
    <table size="sm" class="table table-striped table-sm">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Plataforma</th>
          <th>Ruta<i title="Es la url a donde se envian los bet win y las consulta de balance" class="bi bi-info-circle" /></th>
          <th>Estado </th>
          <th class="center">Opciones</th>
        </tr>
      </thead>
      {#await promise}
        <tbody style="min-height: 80px;"><tr><td colspan="6" style="position:relative"><Loading loading /></td></tr></tbody>
      {:then l}
        <tfoot>
          <tr>
            <td colspan="9">
              <div class="bo-modal-games-pagination">
                {#if clients.list.length}
                  <Pagination
                    bind:total={clients.total}
                    bind:xpage={clients.xpage}
                    bind:current={clients.page}
                    {onPageClick}
                  />
                {/if}
              </div>
            </td>
          </tr>
        </tfoot>
      {/await}
      <tbody>
        {#each clients.list as client}
          <tr class="tr-sm {client.status == 0 ? 'disabled' : ''}">
            <td class="sm">{client.id}</td>
            <td class="sm">{client.code}</td>
            <td class="sm">
              {#if client.logo}
                <img class="bo-cliente-logo" src={client.logo} alt="" />
              {/if}{client.namesite}</td>
            <td class="sm">{client.platform == 1 ? "SITIOS" : "API"}</td>
            <td class="sm">{client.home}</td>
            <td class="sm"  style="color: {client.status == 0 ? 'red' : 'green'};">{client.status == 0 ? "Desactivo" : "Activo"}</td>
            <td class="center sm" style="display: flex; flex-direction: row; gap:0.5rem">
              <button on:click={() => onGamesByClient(client)} class="btn btn-light btn-sm" title="Opcion de Juegos" style="border: 1px solid black;">{@html ICONS.games}</button>
              <button on:click={() => onConfigClient(client)} class="btn btn-light btn-sm" title="Opcion de Marcas" style="border: 1px solid black;">{@html ICONS.config}</button>
              <Dropdown style="width:15%">
                <DropdownToggle class="btn btn-light btn-sm" style="border: 1px solid black;">
                  &#x22EE; <!-- Icono de tres puntos -->
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem on:click={() => onEditClient(client)}>
                    <span>{@html ICONS.edit}</span> Editar datos del cliente
                  </DropdownItem>
                  <DropdownItem on:click={() => editCarrusel(client)}>
                    <span>{@html ICONS.image}</span> Editar Banner
                  </DropdownItem>
                  <DropdownItem on:click={() => onEditGamePosition(client)}>
                    <span>{@html ICONS.list}</span> Editar Listado de Juegos
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem on:click={() => onDeleteClient(client)} class="text-danger">
                    <span>{@html ICONS.delete}</span> Eliminar cliente
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<!--Modales de Clientes-->
{#if showFormClient}
  <ClientFormat bind:client bind:showFormClient {list}></ClientFormat>
{/if}
{#if showModalNewBanner}
  <CarruselForm bind:showModalEditBanner={showModalNewBanner} {client} {isNew}></CarruselForm>
{/if}
{#if showModalEditCarrusel}
  <CarruselList bind:showModalEditCarrusel {onNewCarrusel} {client}></CarruselList>
{/if}
<!--Modales de Games-->
{#if showModalGames}
  <GamesByClient bind:showModalGames {onAddGames} {client} />
{/if}
{#if showModalAddGames}
  <AddGames bind:showModalAddGames {client} />
{/if}
<!--Modales de Brands-->
{#if showModalConfigurationClient}
  <BrandsByClient bind:showModalConfigurationClient {client} {onAddBrand} />
{/if}
{#if showModalAddBrand}
  <AddBrands bind:showModalAddBrand {client} />
{/if}
{#if showModalUploadCredentials}
  <Credentials bind:showModalUploadCredentials></Credentials>
{/if}
{#if showModalEditGamePosition}
  <EditGamePosition bind:showModalEditGamePosition {client}></EditGamePosition>
{/if}

<style>
  .wrapp {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .bo-cliente-logo {
    max-width: 50px;
    max-height: 30px;
  }
  .disabled {
    cursor: none;
    opacity: 0.5;
    pointer-events: none;
  }
  @media (max-width: 1024px) {
    .bo-header-filter {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      flex-direction: row;
      gap: 0.3rem;
    }
    .filter-games {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      gap: 0.3rem;
    }
  }
  @media (min-width: 1025px) {
    .bo-header-filter {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem;
    }
    .filter-games {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      gap: 0.3rem;
    }
  }
</style>
