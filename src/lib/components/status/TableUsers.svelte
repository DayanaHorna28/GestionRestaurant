<script>
  export let tableData;
</script>

<table class="data-table">
  <thead>
    <tr>
      <th>Referencia</th>
      <th>Nombre</th>
      <th>Horas Laborales</th>
    </tr>
  </thead>
  <tbody>
    {#each tableData as row}
      <tr>
        <td><img src="/placeholder.png" alt={row.name} /></td>
        <td>{row.name} <br /><small>{row.role}</small></td>
        <td>{row.hours}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .data-table {
    width: 100%;
    background: #2e2e3e;
    border-radius: 8px;
    border-collapse: collapse;
    color: #fff;
  }
  th, td {
    padding: 1rem;
    text-align: left;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
</style>
