<script>
  let insumos = [
    { codigo: "#0323", nombre: "AGUA MINERAL - 600ML", cantidad: 32 },
    { codigo: "#0323", nombre: "COCA COLA - 600ML", cantidad: 9 },
    { codigo: "#0323", nombre: "COCA COLA - 1500ML", cantidad: 10 },
    { codigo: "#0323", nombre: "COCA COLA - 2500ML", cantidad: 15 },
    { codigo: "#0323", nombre: "INKA COLA - 800ML", cantidad: 25 },
    { codigo: "#0323", nombre: "CEBOLLA - UNI", cantidad: 85 },
  ];
</script>
<div class="container-insumos">
  <main class="main">
    <header class="header">INSUMOS</header>

    <!-- Statistics Cards -->
    <div class="stats">
      <div class="card green">
        <h3>$10,243.00</h3>
        <p>Total Salido</p>
      </div>
      <div class="card red">
        <h3>23,456</h3>
        <p>Total Entrada</p>
      </div>
      <div class="card blue">
        <h3>1,234</h3>
        <p>Total Perdido</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input type="text" placeholder="Buscar..." class="search" />
      <button class="add-btn">+ AGREGAR</button>
    </div>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th>CÓDIGO</th>
          <th>NOMBRE</th>
          <th>CANTIDAD</th>
          <th>ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {#each insumos as insumo}
          <tr>
            <td>{insumo.codigo}</td>
            <td>{insumo.nombre}</td>
            <td>{insumo.cantidad}</td>
            <td>
              <button class="edit-btn">EDITAR</button>
              <button class="delete-btn">ELIMINAR</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </main>
</div>

<style>
  /* General Layout */
  .container-insumos {
    display: flex;
    height: 100vh;
    background-color: #1a1a2e;
    color: #fff;
  }

  .main {
    flex: 1;
    padding: 20px;
  }

  .header {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .card {
    flex: 1;
    padding: 20px;
    border-radius: 8px;
    background: #333;
    text-align: center;
  }

  .card.green {
    background-color: #28a745;
  }

  .card.red {
    background-color: #dc3545;
  }

  .card.blue {
    background-color: #007bff;
  }

  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .filters .search {
    flex: 1;
    margin-right: 10px;
    padding: 10px;
    border-radius: 4px;
    border: none;
  }

  .filters .add-btn {
    padding: 10px 20px;
    border: none;
    background: #007bff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #222;
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 10px;
    text-align: left;
  }

  th {
    background: #333;
  }

  td {
    border-bottom: 1px solid #444;
  }

  .edit-btn {
    background: #ffc107;
    border: none;
    padding: 5px 10px;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 4px;
  }

  .delete-btn {
    background: #dc3545;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }
</style>