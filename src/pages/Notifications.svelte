<script>
  let notifications = [
    { user: "Eren Jaegar", message: "Descripción del mensaje", time: "3:56pm", icon: "🟢" },
    { user: "Reiner Braun", message: "Descripción del mensaje", time: "3:56pm", icon: "🔵" },
    { user: "Levi Ackerman", message: "Descripción del mensaje", time: "3:56pm", icon: "🟣" },
    { user: "Mikasa Ackerman", message: "Descripción del mensaje", time: "3:56pm", icon: "🟡" },
    { user: "Historia Reiss", message: "Descripción del mensaje", time: "3:56pm", icon: "🔴" },
    { user: "Alerta", message: "Stock Bajo", time: "3:56pm", icon: "⚠️", isAlert: true },
    { user: "Notificación", message: "500 kg tocino del Bueno agregado", time: "3:56pm", icon: "ℹ️" },
  ];
</script>

<div class="container-notification">
  <h1>NOTIFICACIONES</h1>

  <!-- Info Box -->
  <div class="info-box">
    <span>ℹ️</span>
    <p>Las notificaciones tienen duración de 24 horas</p>
  </div>

  <!-- Filters -->
  <div class="filters">
    <button class="filter-btn">⚙️ Filter</button>
    <input type="text" placeholder="Buscar" />
  </div>

  <!-- Notifications Table -->
  <table>
    <thead>
      <tr>
        <th>Notificaciones</th>
        <th>Título</th>
        <th>Hora</th>
      </tr>
    </thead>
    <tbody>
      {#each notifications as notification}
        <tr class:alert={notification.isAlert}>
          <td><span>{notification.icon}</span> {notification.user}</td>
          <td>{notification.message}</td>
          <td>{notification.time}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container-notification {
    padding: 20px;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .info-box {
    display: flex;
    align-items: center;
    background: #2a2a4a;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .info-box span {
    margin-right: 10px;
    font-size: 1.5rem;
  }

  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .filter-btn {
    background: #333;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
  }

  input {
    padding: 10px;
    width: 200px;
    border: none;
    border-radius: 5px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 10px;
    border-bottom: 1px solid #444;
  }

  th {
    background: #333;
  }

  .alert {
    color: #ff4d4d;
  }

  tr.alert td:nth-child(2) {
    font-weight: bold;
  }
</style>