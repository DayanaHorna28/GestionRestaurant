<script>
  let insumos = [
    { codigo: "#0323", nombre: "AGUA MINERAL - 600ML", cantidad: 32 },
    { codigo: "#0323", nombre: "COCA COLA - 600ML", cantidad: 9 },
    { codigo: "#0323", nombre: "COCA COLA - 1500ML", cantidad: 10 },
    { codigo: "#0323", nombre: "COCA COLA - 2500ML", cantidad: 15 },
    { codigo: "#0323", nombre: "INKA COLA - 800ML", cantidad: 25 },
    { codigo: "#0323", nombre: "CEBOLLA - UNI", cantidad: 85 },
  ];

  let showAddProductForm = false;

  function toggleAddProductForm() {
    showAddProductForm = !showAddProductForm;
  }
</script>
<div class="container-insumos">
  <main class="main">
    <header class="header">INSUMOS</header>
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
      <input placeholder="Buscar..." class="search" />
      <button on:click={toggleAddProductForm} class="add-btn">+ AGREGAR</button>
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

    <!-- Add Product Form -->
    {#if showAddProductForm}
        <div class="add-product-overlay">
        <div class="add-product-form">
            <h2>Agregar Productos</h2>
            <div class="barcode">📠 Escanee el QR del Producto</div>
            <form>
            <div class="form-group">
              <div class="col">
                <span>ID PRODUCTO</span>
                <input placeholder="ID PRODUCTO" />
              </div>
              <div class="col">
                <span>CANTIDAD</span>
                <input placeholder="CANTIDAD" />
              </div>
            </div>
            <div class="form-group">
              <div class="col">
                <span>TITULO PRODUCTO</span>
                <input placeholder="TÍTULO PRODUCTO" />
              </div>
              <div class="col">
                <span>UNIDAD</span>
                <input placeholder="UNIDAD" />
              </div>
            </div>
            <div class="form-group">
              <div class="col">
                <span>COSTE PRODUCTO</span>
                <input placeholder="COSTE PRODUCTO" />
              </div>
              <div class="col">
                <span>SECCIÓN</span>
                <select>
                <option>SELECCIONAR SECCIÓN</option>
                <!-- Agregar más opciones -->
                </select>
              </div>
            </div>
            <button type="submit" class="submit-btn">AGREGAR</button>
            <button type="button" class="cancel-btn" on:click={toggleAddProductForm}>CANCELAR</button>
            </form>
        </div>
        </div>
    {/if}
  </main>
</div>

<style>
  /* General Layout */
  input{
    width: 100%;
  }
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
    font-size: 2.5rem;
    font-weight: bolder;
    margin-bottom: 1rem;
  }

  .stats {
    display: flex;
    gap: 20px;
    padding: 1rem 7rem;
  }

  .card {
    flex: 1;
    padding: 20px;
    border-radius: 8px;
    background: #333;
    text-align: center;
  }

  .card.green {
    background-color: #1F1D2B;
  }

  .card.red {
    background-color: #1F1D2B;
  }

  .card.blue {
    background-color: #1F1D2B;
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
    background: #1F1D2B;
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 10px;
    text-align: left;
  }

  th {
    background: #1F1D2B;
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
  .add-product-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .add-product-form {
    background: #222;
    padding: 20px;
    border-radius: 8px;
    width: 700px;
  }

  .form-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .form-group input, .form-group select {
    width: 48%;
    padding: 10px;
    border: none;
    border-radius: 4px;
  }

  .submit-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    margin-right: 10px;
  }

  .cancel-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
  }
</style>