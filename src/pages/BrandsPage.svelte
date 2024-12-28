<script>
  import EditBrand from "../lib/components/modals/brands/EditBrand.svelte";
  import backend from "../server";
  import { onMount } from "svelte";
  import Pagination from "../lib/components/Pagination.svelte";
  import Loading from "../lib/components/Loading.svelte";
  import Configuration from "../config";
	import { ICONS } from './../js/icons.js';
  import alertify from "alertifyjs";

  let openEditBrand = false;
  let brands = { list: [] };
  let brand;
  let providers = [];
  let filters = { page: 1, xpage: 20 };
  let promise;
  const conf = Configuration.getConfiguration();

  const getImgUrl = (brand) => {
    return `${conf.ASSETS}/us_img_brands/${brand.brand}.png`;
  };

  const editBrand = (item) => {
    brand = item;
    openEditBrand = true;
  };

  const searchEnter = (e) => {
    if (e.charCode === 13) list();
  };

  onMount(() => {
    listProvider();
    promise = list();
  });

  const list = async () => {
    let params = { ...filters };
    if (params.provider == "") delete params.provider;
    if (params.search == "") delete params.search;
    try {
      let response = await backend.brands.list(params);
      brands = response.data;
    } catch (error) {
      alertify.error("No se puede listar");
    }
    filters.page = 1;
  };

  const listProvider = async () => {
    try {
      let response = await backend.games.listProvider();
      providers = response.data.sort();
      list();
    } catch (error) {
      alertify.error("No se puede listar proveedores");
    }
  };

  const onPageClick = (page) => {
    filters.page = page;
    list();
  };
</script>

<div class="wrapp">
  <div class="content-filters">
    <div>
      <span>Proveedor:</span>
      <select bind:value={filters.provider} class="form-control">
        <option value="">Todos</option>
        {#each providers as provider}
          <option>{provider}</option>
        {/each}
      </select>
    </div>
    <div>
      <span>Buscar:</span>
      <div class="search">
        <input
          bind:value={filters.search}
          on:keypress={searchEnter}
          class="form-control"
          placeholder="Buscar"
        />
        <button on:click={list} class="btn btn-primary btn-sm" title="Buscar">{@html ICONS.search}</button>
      </div>
    </div>
  </div>

  <div style="overflow-x: auto;">
    <table class="table table-striped table-sm responsive">
      <thead class="table-dark">
        <tr>
          <th>CCC</th>
          <th>PROVEEDOR</th>
          <th>NOMBRE</th>
          <th class="center">-</th>
        </tr>
      </thead>
      {#await promise}
        <tbody style="height: 180px;"><tr><td colspan="4" style="position:relative"><Loading loading /></td></tr></tbody>
      {:then l}
        <tfoot>
          <tr>
            <td colspan="4">
              <div class="bo-modal-games-pagination">
                {#if brands.list.length}
                  <Pagination
                    bind:total={brands.total}
                    bind:xpage={brands.xpage}
                    bind:current={brands.page}
                    {onPageClick}
                  />
                {/if}
              </div>
            </td>
          </tr>
        </tfoot>
      {/await}
      <tbody>
        {#each brands.list as brand}
          <tr>
            <td class="sticky-column"><img class="img_game" src={getImgUrl(brand)} alt=""/></td>
            <td>{brand.provider}</td>
            <td>{brand.brand}</td>
            <td class="center"><button class="btn btn-warning btn-sm" on:click={() => editBrand(brand)}>{@html ICONS.edit}</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if openEditBrand}
  <EditBrand {list} bind:brand bind:openEditBrand></EditBrand>
{/if}

<style>
  .wrapp {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .content-filters {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 1rem;
    padding: 0.5rem;
  }
  .img_game {
    max-width: 160px;
    max-height: 80px;
    background-color: rgb(105, 105, 105);
  }
  .search {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  }
</style>
