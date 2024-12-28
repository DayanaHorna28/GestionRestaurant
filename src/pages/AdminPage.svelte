<script>
  import ChangePassword from "../lib/components/modals/admins/ChangePassword.svelte";
  import backend from "../server";
  import { onMount } from "svelte";
  //import //alertify from "//alertifyjs";
  import NewAdmin from "../lib/components/modals/admins/NewAdmin.svelte";
  import Pagination from "../lib/components/Pagination.svelte";
  import Loading from "../lib/components/Loading.svelte";
  import { ICONS } from "../js/icons";

  let promise;
  let filters = { page: 1, xpage: 20 };
  let users = { list: [] };
  let user;
  let showModalNew = false;
  let showChangePassword = false;

  onMount(() => {
    list();
  });

  const list = async () => {
    let params = { ...filters };
    let response = await backend.adminusers.list(params);
    users = response.data;
    filters.page = 1;
  };

  const NewAdminUser = () => {
    user = { status: 1, role: "ADMIN" };
    showModalNew = true;
  };

  const onChangePassword = (item) => {
    user = item;
    showChangePassword = true;
  };

  const onDelete = (item) => {
    user = item;
    async () => {
        try {
          let response = await backend.adminusers.remove(user.id);
          //alertify.success("Procesado!");
        } catch (error) {
          //alertify.error("Error al eliminar");
        }
    // //alertify.confirm(
    //   "Cuidado",
    //   `Seguro de eliminar <b>${user.name}</b>?`,
      
    //   },
    //   () => {}
    // );
      }
  };

  const onPageClick = (page) => {
    filters.page = page;
    list();
  };

  const searchEnter = (e) => {
    if (e.charCode === 13) list();
  };
</script>

<div class="wrapp">
  <div class="filter-games">
    <button class="btn btn-primary btn-sm" on:click={() => NewAdminUser()}>{@html ICONS.addCircle} Nuevo</button>
    <input bind:value={filters.search} class="form-control" placeholder="Buscar"  on:keypress={searchEnter} />
    <button class="btn btn-primary btn-sm" title="Buscar" on:click={list}>{@html ICONS.search}</button>
  </div>
  <div class="container-table">
    <div style="overflow-x: auto;">
      <table size="sm" class="table table-striped table-sm">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Estado</th>
            <th class="center">-</th>
          </tr>
        </thead>
        {#await promise}
          <tbody style="min-height: 80px;">
            <tr><td colspan="6" style="position:relative"><Loading loading /></td></tr>
          </tbody>
        {:then l}
          <tfoot>
            <tr
              ><td colspan="9">
                <div class="bo-modal-games-pagination">
                  {#if users.list.length}
                    <Pagination
                      bind:total={users.total}
                      bind:xpage={users.xpage}
                      bind:current={users.page}
                      {onPageClick}
                    />
                  {/if}
                </div>
              </td>
            </tr>
          </tfoot>
        {/await}
        <tbody>
          {#each users.list as user}
            <tr class="tr-sm">
              <td class="sm">{user.id}</td>
              <td class="sm">{user.username}</td>
              <td class="sm"> {user.name}</td>
              <td class="sm">{user.lastname}</td>
              <td class="sm" style="color: {user.status == 0 ? 'red' : 'green'};">{user.status == 0 ? "Desactivo" : "Activo"}</td>
              <td class="center sm">
                <button on:click={() => onChangePassword(user)} class="btn btn-warning btn-sm" title="Cambiar contraseña" >{@html ICONS.protect}</button>
                <button on:click={() => onDelete(user)} class="btn btn-danger btn-sm" title="Eliminar Admin">{@html ICONS.delete}</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

{#if showModalNew}
  <NewAdmin {list} bind:user showModalNew></NewAdmin>
{/if}

{#if showChangePassword}
  <ChangePassword bind:user bind:showChangePassword></ChangePassword>
{/if}

<style>
  @media (max-width: 1024px) {
    .wrapp {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  @media (min-width: 1025px) {
    .wrapp {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .filter-games {
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: flex-end;

    width: 100%;
    gap: 0.3rem;
  }
  .form-control {
    width: auto;
  }
</style>
