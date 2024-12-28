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

  let userState = "";
  let authenticated;
  let user;
  let showMainLoading = false;

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
  
</script>

{#if authenticated}
  <div class="bo-main-wrapp">
    <TopBar {onLogout} bind:userLoged={user} />
    <HomePage bind:userLoged={user} {onLogout}  />
  </div>
{:else}
  <Login {onLogin} />
{/if}

<Notifier />

<NvscoreSplashScreen bind:showMainLoading/>

<style>
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
