<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import backend from "../server";

  let users = { list: [] };
  let groups = [];
  let workitems = [];
  let workitems_ = [];
  let startDate = moment().format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");
  let statusFilter = "";
  let priorityFilter = "";
  let loading = false;
  let urlMonday = 'https://lobbyuniversalsoft.monday.com';

  onMount(async () => {
    await listUsers();
    listGroups();
  });

  const listUsers = async () => {
    let data = await backend.work.listUsers();
    let response = data.data.data;
    users.list = response.users.filter(e => e.id == "35332462" || e.id == "39796613" || e.id == "39846442" || e.id == "55540801" || e.id == "57169071");
    console.log("users:", users.list);
  };

  const listGroups = async () => {
    loading = true;
    let { data } = await backend.work.listGroups();
    let response = data.data;
    groups = response.boards[0].groups.filter(e =>
      e.id !== "grupo_nuevo32802" &&
      e.id !== "grupo_nuevo17967" &&
      e.id !== "grupo_nuevo86176" &&
      e.id !== "grupo_nuevo23026" &&
      e.id !== "grupo_nuevo90413" &&
      e.id !== "lobby"            &&
      e.id !== "new_group"
    );
    for (let i = 0; i < groups.length; i++) {
      await listItemsByGroup(groups[i]);
    }
    loading = false;
  };

  const listItemsByGroup = async (group) => {
    console.log("Fetching items for group:", group);
    let { data } = await backend.work.listItemsByGroup(group.id);
    let items = data.data.boards[0].items_page.items;
    items.forEach((item) => {
      item.subitems.forEach((subitem) => {
        workitems_.push(formatSubItem(group, item, subitem));
      });
    });
    console.log("work items:", workitems_);

    workitems = workitems_;
  };

  const formatSubItem = (group, item, subitem) => {
    let priority = "";
    let status = "";
    let date_at = "";
    let person = "";

    for (let i = 0; i < subitem.column_values.length; i++) {
      let info = subitem.column_values[i];
      if (info.id == 'status') priority = info.text;
      if (info.id == 'person') person = info.text;
      if (info.id == 'estado8' && info.value) {
        status = info.text;
        date_at = moment(JSON.parse(info.value).changed_at).format("YYYY-MM-DD");
      }
    }

    return {
      id: subitem.id,
      group: group.title,
      item: item.name,
      subitem: subitem.name,
      link_: `${urlMonday}${subitem.relative_link}`,
      priority,
      status,
      date_at,
      person,
      info: subitem.column_values
    };
  };

  const filterWorkItems = (items, user, startDate, endDate, statusFilter, priorityFilter) => {
    return items.filter(item =>
      item.person === user.name &&
      ((item.date_at >= startDate && item.date_at <= endDate) || item.status != "Hecho") &&
      (!statusFilter || item.status === statusFilter) &&
      (!priorityFilter || item.priority === priorityFilter)
      );
    };


  const onStartDateChange = () => {
    console.log("Fecha de inicio cambiada:", startDate);
    // Aquí puedes realizar otras acciones si es necesario
  };

  const onEndDateChange = () => {
    console.log("Fecha de fin cambiada:", endDate);
    // Aquí puedes realizar otras acciones si es necesario
  };
</script>

<div class="wrapp">
  <span class="title">REPORTE DE PRIORIDADES DIARIAS</span>
  <br />

  <div class="filters">
    <div>
      <span>Desde:</span>
      <input class="form-control" type="date" bind:value={startDate} on:change={onStartDateChange} />
    </div>
    <div>
      <span>Hasta:</span>
      <input class="form-control" type="date" bind:value={endDate} on:change={onEndDateChange} />
    </div>
    <div>
      <span>Prioridad:</span>
      <select bind:value={priorityFilter} class="form-control">
        <option value="">Todas las prioridades</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
    </div>
    <div>
      <span>Estado:</span>
      <select bind:value={statusFilter} class="form-control">
        <option value="">Todos los estados</option>
        <option value="En Cola">En Cola</option>
        <option value="Trabajando">En progreso</option>
        <option value="Hecho">Completado</option>
      </select>
    </div>
  </div>
  <div class="container-tables">
    {#each users.list as user}
    <div>
      <div class="info-user">
        <span>Actividades de: <b>{user.name}</b></span>
        <img src={user.photo_tiny} alt="">
      </div>
      <div style="overflow-x: auto;">
        <table class="table table-striped table-sm responsive">
          <thead class="table-dark">
            <tr>
              <th>Grupo</th>
              <th>Item</th>
              <th>SubItem</th>
              <th style="text-align: center;">Prioridad</th>
              <th style="text-align: center;">Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {#if loading}
            <tr>
              <td colspan="6" style="align-items: center; text-align:center;">Cargando...</td>
            </tr>
            {:else if filterWorkItems(workitems, user, startDate, endDate, statusFilter, priorityFilter).length === 0}
            <tr>
              <td colspan="6" style="align-items: center; text-align:center;">No hay información disponible para mostrar.</td>
            </tr>
            {:else}
              {#each filterWorkItems(workitems, user, startDate, endDate, statusFilter, priorityFilter) as item}
                <tr>
                  <td>{item.group}</td>
                  <td>{item.item}</td>
                  <td><a href={item.link_} target="_blank">{item.subitem}</a></td>
                  <td style="background-color: {item.priority == 'Alta'? '#FB275D':''}; color: {item.priority == 'Alta'? 'white':''}; text-align: center">{item.priority}</td>
                  {#if item.status == 'Hecho'}
                  <td style="background-color: #00C875; color:white; text-align:center;">{item.status}</td>
                  {:else if item.status == 'Trabajando'}
                  <td style="background-color: #FDAB3D; color:white; text-align:center;">{item.status}</td>
                  {:else if item.status == 'En Cola'}
                  <td style="background-color: #784BD1; color:white; text-align:center;">{item.status}</td>
                  {:else}
                  <td style="text-align: center">{item.status}</td>
                  {/if}
                  <td>{item.date_at}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
    {/each}
  </div>
</div>


<style>
  .wrapp{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .filters{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
  .info-user{
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
  .container-tables{
    align-items: center;
    width: 100%;
    height: 100%;
  }
  @media (max-width: 1199px) {
    .filters{
    display: grid;
    grid-template-columns: 48% 48%;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
  }
</style>
