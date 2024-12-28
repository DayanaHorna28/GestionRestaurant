<script>
  import OrderList from "../lib/components/Menu/OrderList.svelte";
  import Dropdown from "../lib/components/status/Dropdown.svelte";
  import FilterButton from "../lib/components/status/FilterButton.svelte";
  import HeaderCard from "../lib/components/status/HeaderCard.svelte";
  import PieChart from "../lib/components/status/PieChart.svelte";
  import TableUsers from "../lib/components/status/TableUsers.svelte";



  let cards = [
    { title: "Lucia Canales", value: "+32.40%", description: "Satisfacción al cliente" },
    { title: "Sebastian", value: "-12.40%", description: "Rendimiento Personal" },
    { title: "Lucia Canales", value: "+2.40%", description: "Puntualidad" },
  ];

  let tableData = [
    { name: "Sebastian Mondongo", role: "Cocinero", hours: "5hrs" },
    { name: "Lucia Canales", role: "Camareri", hours: "5hrs" },
    { name: "Fin el humano", role: "Almacén", hours: "5hrs" },
    { name: "Tiana Maria Aguerrida", role: "Cocinero", hours: "5hrs" },
    { name: "Rimuru Tempest", role: "Almacén", hours: "5hrs" },
  ];

  let orders = [
    { name: "Maria Canales", time: "5:30 pm" },
    { name: "Fin el Humano", time: "5:30 pm" },
    { name: "Tiana Maria Aguerrida", time: "5:30 pm" },
  ];
</script>

<div class="app">
  <h1>ESTADO DEL PERSONAL</h1>
  <section class="header-cards">
    {#each cards as card}
      <HeaderCard {card} />
    {/each}
  </section>

  <section class="main-content">
    <div class="table-section">
      <h2>REGISTRO</h2>
      <FilterButton />
      <TableUsers {tableData} />
    </div>

    <div class="side-section">
      <div class="orders">
        <h2>Orden de llegada</h2>
        <!--
        <Dropdown options={["Hoy", "Semana", "Mes"]} />-->
        <OrderList {orders} />
      </div>
      <div class="chart">
        <h2>Tipo de Orden</h2>
        <!--
        <Dropdown options={["Camarero", "Cocinero", "Almacén"]} />-->
        <PieChart />
      </div>
    </div>
  </section>
</div>

<style>
  .app {
    font-family: Arial, sans-serif;
    background-color: #1e1e2e;
    color: #fff;
    padding: 1rem;
  }

  .header-cards {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
  }

  .table-section {
    flex: 2;
  }

  .side-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>
