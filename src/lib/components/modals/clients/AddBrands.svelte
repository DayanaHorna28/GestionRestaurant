<script>
  import backend from "../../../../server";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { onMount } from "svelte";

  export let client;
  export let showModalAddBrand;

  let providers = [];
  let brands = [];
  let filters = {};
  let brandsSelected = [];
  let brands_original = [];
  let brandswithoutclient = null;
  let allowAddBrands = true;
  let categories = [];
  let typesGames = [];
  let origen = [
    { value: 1, name: "Original" },
    { value: 2, name: "Replica" },
  ];
  let direct = [
    { value: 1, name: "Yes" },
    { value: 2, name: "No" },
  ];

  onMount(async () => {
    let params = {
      ...filters,
      clientid: client.id,
    };
    await listBrandsWithoutClient(params);
    listCategories();
    if (providers.length > 0) {
      filters.provider = providers[0];
      await listBrandsNotByClient();
    }
  });

  const listCategories = async () => {
    try {
      let data = await backend.games.listCategories();
      categories = data.data.sort();
    } catch (error) {
      // //alertify.error("Error", "No se puede listar las categorias");
    }
  };

  const listBrandsWithoutClient = async () => {
    let params = {
      clientid: client.id,
      category: filters.category,
      type: filters.type,
      original: filters.original,
      direct: filters.direct,
    };
    if (!params.category) delete params.category;
    if (!params.type) delete params.type;
    if (!params.original) delete params.original;
    if (!params.direct) delete params.direct;
    try {
      brandswithoutclient =
        await backend.provider.listBrandsWithoutClient(params);
      providers = getUniqueProviders(brandswithoutclient.data).sort();
      brands_original = brandswithoutclient.data;
      brands_original.forEach((e) => {
        e.code = e.brand;
        e.checked = false;
      });
      brands =
        providers.length > 0
          ? brands_original.filter((e) => e.provider == providers[0])
          : [];
    } catch (error) {
      // //alertify.error("Error", "No se puede listar las marcas");
    }
  };

  const getUniqueProviders = (data) => {
    try {
      if (data.length === 0) {
        // //alertify.error("No hay proveedor que cumpla el requisito");
        return [];
      }
      let providerUnique = [];
      for (let i = 0; i < data.length; i++) {
        let exit = providerUnique.find((e) => e == data[i].provider);
        if (!exit) providerUnique.push(data[i].provider);
      }
      return providerUnique;
    } catch (error) {
      // //alertify.error("Error", error, "No se logro listar los proveedores");
    }
  };

  const listBrandsNotByClient = async () => {
    try {
      let params = {
        ...filters,
        clientid: client.id,
      };
      if (params.category == "") delete params.category;
      if (params.type == "") delete params.type;
      if (params.original == "") delete params.original;
      if (params.direct == "") delete params.direct;
      //checkProviderCredential();
      let { data } = await backend.games.listBrandsNotByClient(params);
      brands = data.map((e) => ({ code: e, checked: false }));
      brandsSelected = [];
    } catch (error) {
      // //alertify.error("No se logro listar las marca");
    }
  };

  const list = () => {
    listBrandsNotByClient();
  };

  const checkProviderCredential = async (params = {}) => {
    try {
      params.provider = filters.provider;
      params.client_id = client.id;
      params.currency = "USD" || client.currency;
      const { data } = await backend.client.checkClientCredential(params);
      if (data.credential == false) {
        allowAddBrands = false;
        // //alertify.warning("<b>El cliente aun no tiene credenciales para este proveedor   " + params.provider);
      }
    } catch (error) {
      // //alertify.error("Error al verificar credenciales");
    }
  };

  const activeBrand = async () => {
    if (filters.category == "") delete filters.category;
    if (filters.type == "") delete filters.type;
    if (filters.original == "") delete filters.original;
    if (filters.direct == "") delete filters.direct;
    try {
      let payload = {
        ...filters,
        clientId: client.id,
        brands: brandsSelected,
        action: "addbrands",
      };
      await backend.provider.addBrands(payload);
      // //alertify.success(`Procesado!+${brandsSelected}`);
      showModalAddBrand = false;
    } catch (error) {
      // //alertify.error("Error", error, "No se puede activar la marca");
    }
    listBrandsWithoutClient();
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
      // //alertify.error("Error", error, "No se puede seleccionar esta marca");
    }
  };

  const onChangeCategory = async () => {
    try {
      let { data } = await backend.games.listTypes(filters.category);
      typesGames = data.filter((game) => {
        return (
          game &&
          game !== game.toLowerCase() &&
          game !== "undefined" &&
          game !== "0" &&
          game !== "scratch"
        );
      });
      await listBrandsWithoutClient();
    } catch (error) {
      // //alertify.error("No se pudo mostrar los tipos de juegos");
    }
  };

  const onChangeType = async () => {
    await listBrandsWithoutClient();
  };

  const onChangeOriginal = async () => {
    await listBrandsWithoutClient();
  };

  const onChangeDirect = async () => {
    await listBrandsWithoutClient();
  };

  const onShowAddBrand = () => (showModalAddBrand = !showModalAddBrand);
</script>

<Modal isOpen={showModalAddBrand} toggle={onShowAddBrand} size={"xl"}>
  <ModalHeader toggle={onShowAddBrand}>Agregar Marcas</ModalHeader>
  <ModalBody>
    <div class="bo-add-brands">
      <div class="filters1">
        <div class="bo-concept-header">
          <span><b>Categoria:</b></span>
          <select
            class="form-control"
            bind:value={filters.category}
            on:change={onChangeCategory}
          >
            <option value="">Todos</option>
            {#each categories as category}
              <option>{category}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-header">
          <span><b>Tipo:</b></span>
          <select
            class="form-control"
            bind:value={filters.type}
            on:change={onChangeType}
          >
            <option value="">Selecciona un tipo</option>
            {#each typesGames as typesGame}
              <option value={typesGame}>{typesGame}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-header">
          <span><b>Original:</b></span>
          <select
            class="form-control"
            bind:value={filters.original}
            on:change={onChangeOriginal}
          >
            <option value="">Todos</option>
            {#each origen as origen}
              <option value={origen.value}>{origen.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="filters">
        <div class="bo-concept-header">
          <span><b>Direct:</b></span>
          <select
            class="form-control"
            bind:value={filters.direct}
            on:change={onChangeDirect}
          >
            <option value="">Todos</option>
            {#each direct as dir}
              <option value={dir.value}>{dir.name}</option>
            {/each}
          </select>
        </div>
        <div class="bo-concept-header">
          <span><b>Proveedor:</b></span>
          <select
            class="form-control"
            bind:value={filters.provider}
            on:change={listBrandsNotByClient}
            disabled={providers.length === 0}
          >
            {#each providers as provider}
              <option>{provider}</option>
            {/each}
          </select>
          <button class="btn btn-primary btn-sm" title="Buscar" on:click={list}
            ><i class="bi bi-search" /></button
          >
        </div>
      </div>
      <div class="bo-concept-body">
        <span><b>Marca:</b></span>
        <div class="bo-content-brand-general">
          {#each brands as brand}
            <label class="bo-content-brand">
              <input
                type="checkbox"
                bind:checked={brand.checked}
                on:click={() => onBrandSelectedChange({ ...brand })}
              />
              <span>{brand.code}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <div>
      <button
        on:click={activeBrand}
        disabled={!allowAddBrands}
        class="btn btn-primary btn-sm"
        title="Agregar seleccionados"
        >Guardar
      </button>
    </div>
  </ModalFooter>
</Modal>

<style>
  .bo-add-brands {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filters1 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 0.5rem;
  }
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 0.5rem;
  }
  .bo-concept-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  .bo-content-brand-general {
    display: grid;
    grid-template-columns: 24% 24% 24% 23%;
    gap: 1rem;
  }
  .bo-content-brand {
    display: flex;
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
</style>
