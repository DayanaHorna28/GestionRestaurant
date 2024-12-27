<script>
  // @ts-nocheck

  import { DuplicatedSessionListener } from "u-library-sass";
  // @ts-nocheck
  import backend from "./server.js";
  import HomePage from "./pages/HomePage.svelte";
  import TopBar from "./lib/components/NavBar/TopBar.svelte";
  import MenuCategoryPage from "../src/lib/components/Menu/MenuCategoryPage.svelte";
  import util from "./js/util";
  import Configuration from "./config";
  import ServerConnector from "./js/server-connector.js";
  import EventManager from "./js/EventManager.js";
  import { onMount } from "svelte";
  import { watchResize } from "svelte-watch-resize";

  import { t, Modal as Modalv2, Modal } from "u-library-sass";

  const conf = Configuration.getConfiguration();
  const urlParams = new URLSearchParams(window.location.search);
  const defaultView = urlParams.get("v") || "home";

  let userState = "logout";
  let user;
  let usertoken = null;
  let agregatorToken = null;
  let horseGameUrl = "";
  let esportsGameUrl = "";
  let sportbookGameUrl = "";
  let showLoginModal = false;
  let showMainLoading = true;
  let active_view = defaultView;
  let sectionActive;
  let url_game = "";
  let searchValue;
  let searchGames = [];
  let topGames = [];
  let popGames = [];
  let newGames = [];
  let dropGames = [];
  let otherGames = [];
  let slotFavGames = [];
  let slotliveFavGames = [];
  let virtualFavGames = [];
  let scratchFavGames = [];
  let slotAutoSelected = null;
  let slotliveAutoSelected = null;
  let virtualAutoselected = null;
  let scratchAutoSelected = null;
  let crashAutoSelected = null;
  let mainLoadingMessage = "";
  let GAMEAPI_URL = conf.GAMEAPI_URL;
  let sportbookOptions;
  let typegame;
  let CLIENT_CODE = conf.CLIENT_CODE;

  let activeNotification = false;
  let params = "";
  // let subModalOpened = "";

  onMount(async () => {});

  const onLogin = async () => {
    getFavGames();
    console.log(user, conf);
    await UserHelper.connectToLobbySocket(user, conf);
    let currentUrl = window.location.href;
    let url = new URL(currentUrl);
    let urlOriginal = url.origin;
    window.location.href = urlOriginal;
    //location.reload();
  };

  const onCloseGameModal = async () => {
    let data = await backend.getBalance(user.agregatorToken);
    user.balance = data.balance;
  };

  let loginModalOpen = false;
  let signupModalOpen = false;
  let modalOpened = "login";

  const onOpenLogin = () => {
    loginModalOpen = true;
    signupModalOpen = false;
    modalOpened = "login";
    setTimeout(() => {
      document.body.removeAttribute("style");
    }, 100);
  };
</script>

<div class="main-wrapper" use:watchResize={resizeIframe}>
  <TopBar
    bind:loginModalOpen
    bind:signupModalOpen
    bind:modalOpened
    bind:userState
    bind:active_view
    bind:user
    bind:showLoginModal
    bind:showMainLoading
    {openChatLive}
    {onLogin}
    {onOpenLogin}
    {onOpenSignup}
    {onCategoryChange}
    {onOpenPromotions}
  />

  <div class="main-content">
    {#if active_view == "home"}
      <HomePage
        bind:loginModalOpen
        bind:GAMEAPI_URL
        bind:active_view
        bind:userState
        onOpenGame={(game) => openGame(game)}
        bind:topGames
        bind:popGames
        bind:newGames
        bind:dropGames
        bind:otherGames
        bind:user
        bind:favGames={slotFavGames}
        {onCategoryChange}
        {onOpenPromotions}
        {onOpenProviders}
      />
    {/if}
  </div>
</div>

<style>
  @media only screen and (max-width: 1200px) {
  }
  @media only screen and (min-width: 1200px) {
    .main-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .main-content {
      width: 100%;
    }
  }
</style>
