<script>
	import alertify from 'alertifyjs';
  import {
    ModalBody,
    ModalFooter,
    ModalHeader,
    Modal,
  } from "sveltestrap";
  import backend from "../../../../server";
  import { onMount } from "svelte";

  export let client = {};
  export let onAddBrand;
  export let showModalConfigurationClient;

  let brands = [];
  let providers = [];
  let filters = {};
  let brandsSelected = [];
  let categories = [];
  let typesGames=[];
  let origen = [
    { value: 1, name: "Original" },
    { value: 2, name: "Replica" },
  ];

  onMount(async () => {
    await listProviderByCliente();
    listCategories();
    if (providers.length > 0) {
      filters.provider = providers[0];
      await onChangeProvider();
    }
  });

  const list = async () => {
    if (filters.category == "") delete filters.category;
    if (filters.type == "") delete filters.type;
    if (filters.original == "") delete filters.type;
    try {
      let params = { ...filters, clientid: client.id };
      let brands_ = await backend.games.listBrandsByClient(params);
      brands = brands_.data.map((e) => ({ code: e, checked: true }));
    } catch (error) {
      alertify.error("Error:", error, "No se pudo listar");
    }
    filters.page = 1;
  };

  const listProviderByCliente = async () => {
    if (filters.category == '') delete filters.category;
    if (filters.type == '') delete filters.type;
    if (filters.original == '') delete filters.original;
    let params = {...filters, clientid: client.id}
    try {
      let response = await backend.provider.listByClient(params);
      providers = response.data.sort();
    } catch (error) {
      alertify.error("Error:", error, "No se pudo listar los proveedores");
    }
  };

  const listCategories = async () => {
    try {
      let params ={clientId: client.id}
      let data = await backend.games.listCategories(params);
      categories = data.data.sort();
    } catch (error) {
      alertify.error("Error:", error, "No se pudo listar las categorias");
    }
  };

  const onChangeProvider = async () => {
    let params = {
      provider: filters.provider,
      clientid: client.id,
    };
    try {
      let { data } = await backend.games.listBrandsByClient(params);
      console.log("Brands", data);
      if (!filters.provider) {
        brands = data;
      } else {
        brands = data.map((e) => ({ code: e, checked: true }));
      }
      brandsSelected = [];
    } catch (error) {
      alert("Error");
    }
  };

  const onChangeCategory = async (isfilter) => {
    let category = isfilter;
    try {
      if (category) {
        let { data } = await backend.games.listTypes(category);
        typesGames = data.filter(game => {
          return game && game !== game.toLowerCase() && game !== 'undefined' && game !== '0' && game !== 'scratch';
        });
      } else {
        typesGames = []; // Limpiar los tipos de juegos si no hay categoría seleccionada
      }
    } catch (error) {
      alertify.error("No se pudo mostrar los tipos de juegos");
    }
  };

  const onBrandSelectedChange = (brand) => {
    try {
      let brand_ = brandsSelected.findIndex((e) => e == brand.code);
      if (!brand.checked && brand_ == -1) {
        brandsSelected.push(brand.code);
      } else if (brand.checked && brand_ > -1) {
        brandsSelected.splice(brand_, 1);
      }
    } catch (error) {
      alertify.error("Error", error, "No se pudo seleccionar la marca");
    }
  };

  const removeBrands = async () => {
    if (!filters.category) delete filters.category;
    if (!filters.type) delete filters.type;
    if (!filters.original) delete filters.original;

    let payload = {
      ...filters,
      clientId: client.id,
      brands: brandsSelected,
      action: "disabledbrands"
    };

    try {
      await backend.provider.removeBrands(payload);
      listProviderByCliente();

      brands = brands.filter(brand => !brandsSelected.includes(brand.code));
      brandsSelected = [];

      if (brands.length === 0 && providers.length > 1) {
        providers = providers.filter(provider => provider !== filters.provider);
        filters.provider = providers.length > 0 ? providers[0] : '';
        await onChangeProvider();
      }

      alertify.success("Procesado!");
    } catch (error) {
      alertify.error(`No se pudo deshabilitar <b>${brandsSelected}</b> `);
    }
  };

  const onShowConfigClient = () => (showModalConfigurationClient = !showModalConfigurationClient);
</script>

<Modal isOpen={showModalConfigurationClient} toggle={onShowConfigClient} size={"xl"}>
  <ModalHeader toggle={onShowConfigClient} >Configuración de Marcas <button class="btn btn-primary btn-sm" on:click={onAddBrand} ><i class="bi bi-plus-circle-fill" /> AGREGAR</button></ModalHeader>
  <ModalBody>
    <section class="provider">
      <div class="filters">
        <div class="bo-concept-header">
          <span><b>Categoria:</b></span>
          <select
            class="form-control"
            bind:value={filters.category}
            on:change={() => onChangeCategory(filters.category, "xfilter")}
          >
            <option value="">Todos</option>
            {#each categories as category}
              <option>{category}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-header">
          <span><b>Tipo:</b></span>
          <select class="form-control" bind:value={filters.type}>
            <option value="">Selecciona un tipo</option>
            {#each typesGames as typesGame}
              <option value={typesGame}>{typesGame}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="filters">
        <div class="bo-concept-header">
          <span><b>Original</b></span>
          <select class="form-control" bind:value={filters.original}>
            <option value="">Todos</option>
            {#each origen as origen}
              <option value={origen.value}>{origen.name}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-header">
          <span><b>Proveedor</b></span>
          <div class="provider-list">
            {#if providers.length <= 0}
              <input
                class="form-control"
                placeholder="Este cliente todavia no tiene proveedores"
                disabled
              />
            {:else}
              <select
                class="form-control"
                bind:value={filters.provider}
                on:change={onChangeProvider}
              >
                {#each providers as provider}
                  <option>{provider}</option>
                {/each}
              </select>
            {/if}
            <button
              disabled={providers.length <= 0}
              class="btn btn-primary btn-sm"
              title="Buscar"
              on:click={list}><i class="bi bi-search" /></button
            >
          </div>
        </div>
      </div>
      <div class="bo-concept-body">
        <span><b>Marca</b></span>
        <div id="checkbox-list" class="bo-content-brand-general">
          {#each brands as brand}
            <label class="bo-content-brand">
              <input
                type="checkbox"
                bind:checked={brand.checked}
                on:change={onBrandSelectedChange(brand)}
              />
              <span>{brand && brand.code ? brand.code : brand}</span>
            </label>
          {/each}
        </div>
      </div>
    </section>
  </ModalBody>
  <ModalFooter>
    <button
      disabled={providers.length <= 0}
      on:click={removeBrands}
      class="btn btn-primary btn-sm"
      title="Eliminar seleccionados">Guardar</button
    >
  </ModalFooter>
</Modal>

<style>
  .provider {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .provider-list {
    display: flex;
    width: 100%;
    gap: 0.5rem;
  }
  .bo-concept-header {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.5rem;
  }
  .bo-content-brand-general {
    display: grid;
    grid-template-columns: 24% 24% 24% 23%;
    gap: 1rem;
  }
  .bo-content-brand {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    background-color: antiquewhite;
    padding: 0.5rem;
    border-radius: 0.3rem;
  }
  input {
    cursor: pointer;
  }

  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 0.5rem;
  }
</style>
