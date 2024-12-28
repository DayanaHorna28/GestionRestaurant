<script>
  import Configuration from "../../../config";
  export let menuVisible;
  export let active_view
  export let onCategoryChange;
  export let hideMenu;
  export let onLogout;

  const conf = Configuration.getConfiguration();
</script>
<div class="side-menu" id="menu">
  <div class="container-logo" on:click={hideMenu}>
      <img class="{menuVisible ? 'logo-img' : 'logo'}" src="{conf.ASSETS}/casinoPlatform/logo-icon.png"  alt="logo">
  </div>
  <ul class="nav-links">
    <li>
      <div class="icon-link">
        <button on:click={() => onCategoryChange("reports")} class="btn-link {active_view == 'reports'? 'u-category-select' : ''}" >
          <i class={`bi bi-grid-fill icon`}></i>
          <span class="link_name">Reportes</span>
        </button>
      </div>
    </li>
    <li>
      <div class="icon-link">
        <button on:click={() => onCategoryChange("clients")} class="btn-link {active_view == 'clients'? 'u-category-select' : ''}">
          <i class={`bi bi-people-fill icon`}></i>
          <span class="link_name">Clientes</span>
        </button>
      </div>
    </li>
    <li>
      <div class="icon-link">
        <button on:click={() => onCategoryChange("Insumos")} class="btn-link {active_view == 'Insumos'? 'u-category-select' : ''}">
          <i class={`bi bi-collection-fill icon`}></i>
          <span class="link_name">Insumos</span>
        </button>
      </div>
    </li>
    <li>
      <div class="icon-link">
        <button on:click={() => onCategoryChange("calendar")} class="btn-link {active_view == 'calendar'? 'u-category-select' : ''}">
          <i class={`bi bi-chat icon`}></i>
          <span class="link_name">Asistencia</span>
        </button>
      </div>
    </li>
    <li>
      <div class="icon-link">
        <button on:click={() => onCategoryChange("Pedidos")} class="btn-link {active_view == 'Pedidos'? 'u-category-select' : ''}">
          <i class={`bi bi-gear icon`}></i>
          <span class="link_name">Configuración</span>
        </button>
      </div>
    </li>
  </ul>
  <div class="footer">
    <ul class="nav-links">
    <li>
      <div class="icon-link">
        <button on:click={() => onCategoryChange("notifications")} class="btn-link {active_view == 'notifications'? 'u-category-select' : ''}" >
          <i class="bi bi-chat-text"></i>
          <span class="link_name">Notificaciones</span>
        </button>
      </div>
    </li>
    <li>
      <div class="icon-link">
        <button on:click={onLogout} class="btn-link">
          <i class="bi bi-box-arrow-right"></i>
          <span class="link_name">Cerrar Sesión</span>
        </button>
      </div>
    </li>
    </ul>
  </div>
</div>

<style>
  .side-menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 15.625rem;
    transition: all 0.4s ease;
    background-color: #1F1D2B;
  }
  .side-menu .nav-links {
    height: 78%;
    padding-top: 30px;
    padding-left: 0;
  }
  .side-menu .nav-links li {
    list-style: none;
    transition: all 0.4s ease;
  }
  .btn-link{
    border: none;
    background-color: transparent;
    width: 100%;
  }
  .side-menu .nav-links li .icon-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .side-menu .nav-links li i {
    height: 3.125rem;
    min-width: 4.875rem;
    text-align: center;
    line-height: 3.125rem;
    font-size: 1.5rem;
    color: #7D8592;
  }
  .side-menu .nav-links li .btn-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0;
  }
  .side-menu .nav-links li .btn-link:hover,  .side-menu .nav-links li .btn-link:hover i, .side-menu .nav-links li .btn-link:hover .link_name{
    background-color: #FFE5F3;
    color: #FF018F;
  }
  .side-menu .nav-links li .btn-link.u-category-select i{
    color: #FF018F;
    background-color: #FFE5F3;

  }
  .side-menu .nav-links li .btn-link .link_name {
    font-size: 18px;
    font-weight: 400;
    color: #7D8592;
    transition: all 0.4s ease;
  }
  .side-menu.close .nav-links li .btn-link .link_name {
    display: none;
    opacity: 0;
    transition: all 0.4s ease;
  }
  .container-logo{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4rem;
    background-color: #fff;
  }
  .logo-img{   
    width: 92%;
    height: 3.5rem;
  }
  .logo{
    text-align: center;
    width: 70%;
    height: 3.5rem;
  }
  .footer{
    display: flex;
    flex-direction: column;
  }
  .footer i{
    font-size: 1.5rem;
    color: #7D8592;
  }
</style>