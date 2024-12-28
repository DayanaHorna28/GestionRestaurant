<script>
  // @ts-nocheck
  import HomePage from "./pages/HomePage.svelte";
  import { onMount } from "svelte";
  import "alertifyjs/build/css/alertify.css";
  import "alertifyjs/build/css/themes/default.min.css";
  import alertify from "alertifyjs";
  import backend from "./server.js";
  import Login from "./lib/components/Login.svelte";
  import TopBar from "./lib/components/NavBar/TopBar.svelte";
  //import SocketConnector from "./js/socket";
  import EventManager from "./js/EventManager";
  import NvscoreSplashScreen from "./lib/components/NvscoreSplashScreen.svelte";
  import Notifier from "./lib/components/Notify.svelte";
  import Menu from "./lib/components/Menu/Menu.svelte";
  import Insumos from "./pages/Insumos.svelte";
  import Notifications from "./pages/Notifications.svelte";
  import Calendar from "./pages/Calendar.svelte";

  let userState = "";
  let authenticated;
  let user;
  let showMainLoading = false;
  let menuVisible = true;
  let active_view = "Insumos";

  onMount(async () => {
    checkUserIsLogged();
  });

  const checkUserIsLogged = async () => {
    user = null;
    const u = sessionStorage.getItem("user");
    if (u) {
      let user_ = JSON.parse(u);
      let expireTokenDate = new Date(user_.tokenExp);
      authenticated = true;
      user = user_;
      console.log("authenticated", user);
      let balanceUser = await backend.wallet.balance(user_.userId);
      //SocketConnector.connect(user_.platformId,user_);
      user.balance = balanceUser.data.balance;
      userState = "loggedIn";
    } else {
      sessionStorage.removeItem("user");
    }
  };

  const onLogout = () => {
    alertify.confirm(
      "Cuidado",
      `Seguro de <b>Cerrar Sesión</b>?`,
      () => {
        try {
          sessionStorage.removeItem("user");
          authenticated = false;
          alertify.success("Procesado!");
        } catch (error) {
          alertify.error("Error al Cerrar Sesión");
        }
      },
      () => {}
    );
  };

  EventManager.subscribe("duplicated_session", () => {
    console.log("Sesssion duplicada");
    showMainLoading = true;
    EventManager.publish("notify", {
      mode: "error",
      msg: "SESION DUPLICADA!",
    });
    sessionStorage.removeItem("user");
    setTimeout(() => {
      location.reload();
    }, 3000);
  });

  const onLogin = async (data) => {
    try {
      user = data;
      let balanceUser = await backend.wallet.balance(data.userId);
      user.balance = balanceUser.data.balance;
      console.log("balance",balanceUser.data.balance);
      authenticated = true;
      //econta a socket
      //SocketConnector.connect(user.username)
    } catch (error) {
      alertify.error("Error", error);
    }
  };

  const hideMenu = () =>{
		let sidebar = document.querySelectorAll(".side-menu")
		sidebar[0].classList.toggle("close")

		let navbar = document.querySelectorAll(".customNavBar")
		navbar[0].classList.toggle("close")
		menuVisible = !menuVisible
  }

  const logout = ()=>{
		location.reload();
	}

  const onCategoryChange = async (cat) => {
    console.log("category", cat);
    active_view = cat;
    console.log("active_view", active_view);
    
  };
  
</script>

{#if !authenticated}
  <div class="bo-main-wrapp">
    <Menu bind:menuVisible bind:active_view {onCategoryChange} {hideMenu} {onLogout}></Menu>
    <div class="customNavBar wrapp-home">
      {#if active_view == "reports"}
        <HomePage bind:userLoged={user} {onLogout}  />
      {:else if active_view == "Insumos"}
        <Insumos></Insumos>
      {:else if active_view == "notifications"}
        <Notifications></Notifications>
      {:else if active_view == "calendar"}
       <Calendar></Calendar>
      {/if}
    </div>
  </div>
{:else}
  <Login {onLogin} />
{/if}

<Notifier />


<style>
  .wrapp-home{
    background-color: #2b283b;
    height: 100vh;
  }
  .customNavBar{
		position: relative;
		left: 15.625rem;
		width: calc(100% - 15.625rem);
		transition: all 0.5s ease;
	}
  @media (max-width: 1199px) {
    .bo-main-wrapp {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  }
  @media (min-width: 1200px) {
    .bo-main-wrapp {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  }
</style>
