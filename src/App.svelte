<script>
	import alertify from 'alertifyjs';
  import ProvidersReportsPage from "./pages/ProvidersReportsPage.svelte";
  import ClientsReportsPage from "./pages/ClientsReportsPage.svelte";
  import TrxManualPage from "./pages/TrxManualPage.svelte";
  import TrxPage from "./pages/TrxPage.svelte";
  import AdminPage from "./pages/AdminPage.svelte";
  import ClientsPage from "./pages/ClientsPage.svelte";
  import BrandsPage from "./pages/BrandsPage.svelte";
  import PlayersPage from "./pages/PlayersPage.svelte";
  import GamesPage from "./pages/GamesPage.svelte";
  import TopBar from "./lib/TopBar.svelte";
  import { onMount } from "svelte";

  import Login from "./lib/components/Login.svelte";
  import util from "./js/util";
  import HomePage from "./pages/HomePage.svelte";
  import Menu from "./lib/components/menu/Menu.svelte";
  import MondayPage from "./pages/MondayPage.svelte";
  import BonusFirstPage from './pages/BonusFirstPage.svelte';
  import FreeBetFirstPage from './pages/FreeBetFirstPage.svelte';


  let authenticated = false;
  let user = {};
  let mainPromise;
  let active_view = "home";


  onMount(async () => {
    mainPromise = checkUserIsLogged();
  });

  const checkUserIsLogged = async () => {
    return new Promise((resolve, reject) => {
      user = null;
      let now = new Date();
      let userStorage = sessionStorage.getItem("user");
      if (userStorage) {
        userStorage = JSON.parse(userStorage);
        let expireTokenDate = new Date(userStorage.expireToken);
        const diffTime = expireTokenDate - now;
        if (diffTime > 0) {
          user = userStorage;
          authenticated = true;
        } else {
          alertify.warning("ADVERTENCIA su sesión a caducado");
          sessionStorage.removeItem("user");
          authenticated = false;
        }
      }
      resolve(true);
    });
  };

  function onLogin(data) {
    try {
      user = data;
      let token_ = util.parseJwt(user.access_token);
      user.expireToken = new Date(token_.exp * 1000);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", user.access_token);
      authenticated = true;
    } catch (error) {
      alertify.error("Error", error);
    }
  }

  const onLogout = () => {
    alertify.confirm("Cuidado",`Seguro de <b>Cerrar Sesión</b>?`, () => {
      try {
        sessionStorage.removeItem("user");
        authenticated = false;
        alertify.success("Procesado!");
      } catch (error) {
        alertify.error("Error al Cerrar Sesión");
      }
    },() => {});
  };

  const onCategoryChange = async (cat) => {
    active_view = cat;
  };
</script>

<div class="bo-main-wrapp">
  {#await mainPromise}
    Cargando...
  {:then d}
    {#if authenticated}
      <div class="body-wrapp">
        <TopBar userLoged={user} {onLogout} />
        <Menu bind:active_view {onCategoryChange}></Menu>
        {#if active_view == "home"}
          <HomePage></HomePage>
        {:else if active_view == "games"}
          <GamesPage></GamesPage>
        {:else if active_view == "brands"}
          <BrandsPage></BrandsPage>
        {:else if active_view == "clients"}
          <ClientsPage></ClientsPage>
        {:else if active_view == "users"}
          <PlayersPage></PlayersPage>
        {:else if active_view == "admins"}
          <AdminPage></AdminPage>
        {:else if active_view == "transactions"}
          <TrxPage></TrxPage>
        {:else if active_view == "direct_trx"}
          <TrxManualPage></TrxManualPage>
        {:else if active_view == "provider"}
          <ProvidersReportsPage></ProvidersReportsPage>
        {:else if active_view == "client"}
          <ClientsReportsPage></ClientsReportsPage>
        {:else if active_view == "monday"}
          <MondayPage></MondayPage>
        {:else if active_view == "bonus"}
          <BonusFirstPage></BonusFirstPage> 
        {:else if active_view == "freebet"}
          <FreeBetFirstPage></FreeBetFirstPage> 
        {/if}
      </div>
    {:else if mainPromise != undefined}
      <Login {onLogin} />
    {/if}
  {/await}
</div>

<style>
  .bo-main-wrapp {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .body-wrapp {
    width: 100%;
    height: 100%;
  }
</style>
