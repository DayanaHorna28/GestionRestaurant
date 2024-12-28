<script>
  // Variables para el calendario
  let days = Array.from({ length: 31 }, (_, i) => i + 1);
  let selectedDate = 19;

  // Datos para los eventos
  let today = "Viernes, 19, 2024";
  let events = [
    { title: "Semana regional de Papa", author: "Jorge" },
    { title: "Se agregó semana de Procesión", author: "Jorge" },
    { title: "Se agregó semana de Procesión", author: "Jorge" }
  ];
</script>

<div class="calendar-app">
  <!-- Header -->
  <header class="header">
    <h1>Calendario de Eventos</h1>
    <p>{today}</p>
  </header>

  <!-- Contenido principal -->
  <section class="content">
    <!-- Calendario -->
    <div class="calendar">
      <header>
        <h2>May 2023</h2>
        <div>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </header>
      <div class="grid">
        {#each days as day}
          <div class="day {day === selectedDate ? 'selected' : ''}">
            {day}
          </div>
        {/each}
      </div>
    </div>

    <!-- Panel derecho -->
    <aside class="right-panel">
      <!-- Lista de eventos -->
      <div class="event-list">
        <h3>Eventos próximos</h3>
        {#each events as event}
          <div class="event-item">
            <img src="/placeholder-avatar.png" alt="Avatar" />
            <div>
              <p>{event.title}</p>
              <small>{event.author} agregó un nuevo evento</small>
            </div>
          </div>
        {/each}
      </div>

      <!-- Imagen destacada -->
      <div class="featured-image">
        <img src="/placeholder-potato.png" alt="Featured" />
        <p>Potato: Gourmet entertainment</p>
      </div>
    </aside>
  </section>
</div>

<style>
  /* General */
  .calendar-app {
    font-family: Arial, sans-serif;
    color: #fff;
    background-color: #1e1e2e;
    padding: 1rem;
  }

  /* Header */
  .header h1 {
    margin: 0;
    font-size: 2rem;
  }
  .header p {
    color: #aaa;
  }

  /* Layout */
  .content {
    display: flex;
    gap: 1.5rem;
  }
  .right-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Calendario */
  .calendar {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
    flex: 1;
  }
  .calendar header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
  }
  .day {
    padding: 0.5rem;
    text-align: center;
    border-radius: 4px;
    background: #3e3e4e;
  }
  .day.selected {
    background: #5e5ef0;
    color: white;
  }

  /* Lista de eventos */
  .event-list {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
  }
  .event-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  small {
    color: #aaa;
  }

  /* Imagen destacada */
  .featured-image {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }
  .featured-image img {
    width: 100%;
    border-radius: 8px;
  }
  .featured-image p {
    margin-top: 1rem;
    color: #fff;
  }
</style>
