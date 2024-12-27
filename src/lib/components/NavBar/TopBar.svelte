<script>
  // @ts-nocheck
  import backend from "../../../server";
  import ProfileMobile from "../user_modales/mobile/ProfileMobile.svelte";
  import Modal from "../Modal/Modal.svelte";
  import NoLoginMenu from "./NoLoginMenu.svelte";
  import ProfileDesktop from "../user_modales/desktop/ProfileDesktop.svelte";
  import RegisterUserEmail from "../Modal_login/RegisterUserEmail.svelte";
  import UserMenuDesktop from "../user_modales/desktop/UserMenuDesktop.svelte";
  import UserMenuMobile from "../user_modales/mobile/UserMenuMobile.svelte";
  import HamburguerMenu from "../Menu/HamburguerMenu.svelte";
  import Configuration from "../../../config";
  import ModalProfileMobile from "../Modal/ModalProfileMobile.svelte";
  import ModalProfileDesktop from "../Modal/ModalProfileDesktop.svelte";
  import ModalEstadistic from "../Modal/ModalEstadistic.svelte";
  import {UserRegisterStepbyStep, ServerConnection, Depositx, Withdrawalw} from "u-library";
  import {t,locale,Promotions,Profile,Login,Modal as Modalv2,Utils as utils, Notifier,ServerConnection as ServerConnectionSass,Deposit,Signup, WithdrawalW, RecoverPassword, WithdrawalX} from 'u-library-sass';
  import { onMount } from 'svelte';

  import ModalPay from "../Modal/ModalPay.svelte";
  import WithdrawalSMS from "../Modal/WithdrawalSMS.svelte";



  export let userState;
  export let active_view;
  export let user = {};
  export let showLoginModal = false;
  export let onLogin;
  export let showMainLoading;
  export let category
  export let username =""
  export let password =""
  export let onCategoryChange;
  export let loginModalOpen;
  export let openChatLive;
  category = "slot";
  
  export let onOpenPromotions

  let showUserCreation = false;
  let showRegisterModal = false;
  let showProfileModalMobile = false;
  let showProfileModalDesktop = false;
  let showPasswordChangeModal = false;
  let resetpassModalOpen=false;
  let showRstadistic = false;
  let countryCodes=["51","1","113", "593", "57", "58"];
  
  
  //notify.setEM(EventManager);
  const conf = Configuration.getConfiguration();
  let logoUrl= conf.ASSETS+"/Ganawin/logo.png";

  ServerConnection.setConfig(conf);
  ServerConnectionSass.setConfig(conf);


  const onOpenRecoverPassword = () => { 
    loginModalOpen=false; 
    resetpassModalOpen=true;  
    modalOpened = "recoverPassword";
  }
  
  const onShowUserCreation = () => {
    user = {};
    showUserCreation = true;
  };



  const onShowRegisterModal = (ev) => {
    showRegisterModal = true;
  };

  const onShowLoginModal = () => {
    showLoginModal = true;
  };

  //const onDepositOk = (data) => {
  //  console.log("data",data);
  //  notify.success("Deposito Correcto");
  //};

  //const onDepositError = (e) => {
  //  console.log(e);
  //  notify.error("Código incorrecto");
  //};

  //const onCategoryChange=(cat)=>{
  //  if ( /horses|esports/.test(cat) && userState == "logout") { showLoginModal = true; return; }
  //  active_view=cat
  //  util.setUrlPage(active_view)
  //};

  const onWithdrawalError = async (error)=>{
        notify = {};
        notify = await utils.showNotify("error",error);
       
    }
    const onWithdrawalOk = async (data)=>{
        notify = await utils.showNotify("success",data);
        depositModalOpen = false;
    }

  const onProfileModalMobile = async () => {
    try {
      showProfileModalMobile = true;
      const data = await backend.getMyAccount(user.token);
      let serial_api_casino = user.serial_api_casino;
      let token = user.token;
      let agregatorToken = user.agregatorToken;
      user = { ...user, ...data };
      user.serial_api_casino = serial_api_casino;
      user.token = token;
      user.agregatorToken= agregatorToken;
    } catch (error) {
     // notify.error("Oops! ocurrió un error");
    }
  };

  const onLogout = () => {
    userState = "logout";
    active_view = "home";
    sessionStorage.removeItem("user");
    showProfileModalMobile = false;
    location.reload();
  };
  


  const onOpenMyAccount = async () => {
    showProfileModalDesktop = true;
    document.body.style.overflow="hidden";
    const data = await backend.getMyAccount(user.token);
    let serial_api_casino = user.serial_api_casino;
    let token = user.token;
    let agregatorToken = user.agregatorToken;
    user = { ...user, ...data };
    user.serial_api_casino=serial_api_casino;
    user.token=token;
    user.agregatorToken= agregatorToken;
  };

  const onPasswordChangeModal = () => {
    showPasswordChangeModal = true;
  };
  let scrollPosition = 0;
  let divClass = '';  
  const handleScroll = () => {
    scrollPosition = window.scrollY;
  
    if (scrollPosition < 60) {
      divClass = 'class-a';
    } else {
      divClass = 'class-b';
    }
  };
  onMount(() => {

    let currentUrl = window.location.href;
    console.log("domain",currentUrl);
    if(/resetPassword/.test(currentUrl)) {
      resetpassModalOpen=true;
      modalOpened = "recoverPassword";
    }else if (/afiliados/.test(currentUrl)) {//afiliado
            onOpenSignup();
        }
        
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  

//
let depositModalOpen = false;
export let signupModalOpen;
let withdrawalModalOpen = false;
export let modalOpened;
let platform = "Ganawin";
let notify = {};
 //Deposit Modal
export let amountsFav = [5000, 10000, 30000, 50000];
let assetsUrl="https://assets.apiusoft.com"+"";

export let onOpenLogin;
export let onOpenSignup;

const configWithdrawal = {
        dataType : "static",
        messageOptional : "",
        formVerification : "https://docs.google.com/forms/d/e/1FAIpQLSdavkfXrBSGXI6glFExbZ3HWWMBnbeXlu8Hcc935upcP-3WeA/viewform?usp=sf_link",
        platform,
        banksNames: [
          
        ],
        typeAccount: [
           
        ], 
        linksChats: [
        //  {name: "Whatssap", url:"https://wa.me/525632540205"}
        ]
    };


    //let countries  = [
    //  {prefix:"+56",flag:"chl"}
    //];
    ////operatorId BO  = code agent - type W
    //let currencies  = [
    //  {name:"Peso chileno", code:7 , agent:4675},//este codigo se toma como el id_operado en caso el tipo sea W
    //];
  
  const configSignup = conf.configSignup;

const onOpenDeposit = () => { 
  depositModalOpen = true; 
  modalOpened = "deposit";  
  showProfileModalDesktop = false; 
  setTimeout(() => {
    document.body.removeAttribute('style');
  }, 100);
}

const onOpenWithdrawal = () => { 
    console.log("ola");
    withdrawalModalOpen = true; 
    modalOpened = "withdrawal" ;
    setTimeout(() => {
      document.body.removeAttribute('style');
    }, 100); 
  }
const onLoginOk = async (user_)=>{
        user = user_;
        notify = await utils.showNotify("success","Bienvenido a Ganawin");
        loginModalOpen = false;
        userState = "loggedIn";
        active_view = "home";
        let data = await backend.getBalance(user.agregatorToken);
        console.log("dataUpdate",data);
        user.balance = data.balance;
        user.bonus_cab = data.bo_general;
        onLogin();
    }
    const onLoginError = async (error)=>{
        notify = {};
        notify = await utils.showNotify("error",error);
    }

    const onSignupOk = async (user_) => {
    if (typeof user_ === "string") {
      notify = await utils.showNotify("success",user_);
    } else {
      user = user_;
      notify = await utils.showNotify("success","Registro exitoso, bienvenido a "+platform);
     
      signupModalOpen = false;
      const { data } = await ServerConnectionSass.users.login(
        user.username,
        user.password
      );
      if (data.username == "") throw "USER_NOT_FOUND";
      let date = new Date();
      date.setDate(date.getDate() + 1);
      data.expireToken = date.getTime();
      sessionStorage.setItem("user", JSON.stringify(data));
      onLoginOk(data);
    }
  };

  const onSignupError = async (error) => {
    notify = {};
        notify = await utils.showNotify("error",error);
  };

    const onDepositError = async (error)=>{
        notify = {};
        notify = await utils.showNotify("error",error);
      
    }
    const onDepositOk = async (data)=>{
       notify = await utils.showNotify("success",data);
        depositModalOpen = false;

      
    }
    const onRecoverPasswordOk = async (data)=>{
        notify = await utils.showNotify("success",data);
      
    }
    const onRecoverPasswordError = async (error)=>{
        notify = {};
        notify = await utils.showNotify("error",error);
    }

    function openPrivacyPolicies() {
      let enlace = `${assetsUrl}/Ganawin/politica.pdf`;
      let nuevaVentana = window.open('about:blank');
      if (nuevaVentana) {
        nuevaVentana.location.href = enlace;
      } else {
        window.location.href = enlace;
      }
    }
    function openTermsConditions() {
      let enlace = `${assetsUrl}/Ganawin/t&cofD&W.pdf`;
      let nuevaVentana = window.open('about:blank');
      if (nuevaVentana) {
        nuevaVentana.location.href = enlace;
      } else {
        window.location.href = enlace;
      }
    }

    const onShowEstadisticnModal = () => {
    if (userState !== 'loggedIn') {
      onOpenLogin();
    }else{

      showRstadistic = true;
    }

  };
let showWithdrawalModalSMS = false;
  const onShowWithdrawalSMS = ()=>{
    showWithdrawalModalSMS = true;
    showProfileModalDesktop = false;
    showProfileModalMobile = false;
  }
  let profileModalOpen = false;

  const onProfileOk = async (data)=>{
        notify = await utils.showNotify("success",data);
    }
  const onProfileError = async (error)=>{
      notify = {};
      notify = await utils.showNotify("error",error);
      if (error == t("msg.duplicatedSession")){
          onLogout();
          profileModalOpen = false;
      }
  }

  const onOpenProfile = () => {
      profileModalOpen = true;
      modalOpened = "profile";
      setTimeout(() => {
    document.body.removeAttribute('style');
  }, 100);
  }

  let chatLiveUrl = "https://tawk.to/chat/6699381abecc2fed692732aa/1i3386aal";
  const configProfile = {
        id_banca: [] ,//disitribidor - almacena otros cajeros
        id_ca: [],//caja dentro de un distribuidor principal
        doctype:[],
        timezone:"America/Mexico_City",//for movementes
        activePromotions: false,
        chatLiveUrl,
    };


</script>

<div class="user-header {divClass} {active_view=='virtual' && userState != 'logout'?'virtual':''}" id="user-header">  
  <div class="user-header-principal">
      <HamburguerMenu 
      bind:active_view
      bind:userState
     {onOpenLogin}
     {onOpenPromotions}
     {onShowEstadisticnModal}
      onCategoryChange={onCategoryChange}>
    </HamburguerMenu>
  
      <button class="content-logo" on:click={() => (active_view = "home")}>
        <img class="smll_lg logo" src="{conf.ASSETS}/Ganawin/logo.png" alt="" />
        <img class="tall_lg logo" src="{conf.ASSETS}/Ganawin/logo_mb.png" alt="" />
        
          
      </button>
      <div style="margin-right: 2rem;" >
        <!-- <svg width="1.25rem" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 271.692v192c0 17.664 14.368 32 32 32h160v-224H32zM480 143.692H378.752c7.264-4.96 13.504-9.888 17.856-14.304 25.824-25.952 25.824-68.192 0-94.144-25.088-25.28-68.8-25.216-93.856 0-13.888 13.92-50.688 70.592-45.6 108.448h-2.304c5.056-37.856-31.744-94.528-45.6-108.448-25.088-25.216-68.8-25.216-93.856 0-25.792 25.952-25.792 68.192-.032 94.144 4.384 4.416 10.624 9.344 17.888 14.304H32c-17.632 0-32 14.368-32 32v48c0 8.832 7.168 16 16 16h208v-64h64v64h208c8.832 0 16-7.168 16-16v-48c0-17.632-14.336-32-32-32zm-257.888-1.056s-1.344 1.056-5.92 1.056c-22.112 0-64.32-22.976-78.112-36.864-13.408-13.504-13.408-35.52 0-49.024 6.496-6.528 15.104-10.112 24.256-10.112 9.12 0 17.728 3.584 24.224 10.112 21.568 21.696 43.008 77.12 35.552 84.832zm73.664 1.056c-4.544 0-5.888-1.024-5.888-1.056-7.456-7.712 13.984-63.136 35.552-84.832 12.896-13.024 35.456-13.088 48.48 0 13.44 13.504 13.44 35.52 0 49.024-13.792 13.888-56 36.864-78.144 36.864zM288 271.692v224h160c17.664 0 32-14.336 32-32v-192H288z"></path></svg>
        <span class="game_txt">Promociones</span> -->
      </div>

        <div class="estuditc" on:click={onShowEstadisticnModal}>
          <img width="25" src="https://universalrace.net/new/img/uweb_universal_horse/iconos/icon2.png" alt="">
          <p class="game_txt"> Estadisticas y resultados</p>
           <div class="estanew">Nuevo</div></div>
        <div class="games_top">
          <div class="game_img aviator" on:click={onCategoryChange("crash_Aviator")}>
            <span class="game_txt">Aviator</span>
            <img src="https://images.virtualsoft.tech/m/msjT1695306094.gif" alt="">
          </div>
          <div class="game_img studio" on:click={onCategoryChange("slotlive_Football Studio")}>
            <span class="game_txt">Football Studio</span>
            <img src="https://images.virtualsoft.tech/m/msj0212T1705529369.gif" alt="">
          </div>
        </div>
      <!--Search
        bind:active_view
        bind:searchGames
        bind:searchValue
        bind:category
        bind:onlyGames
      /-->
  </div>
  <div class="u-control">
    {#if userState == "loggedIn"}
      <div class="in-mobile">
        <UserMenuMobile bind:user  {onOpenProfile} {onLogout}/>
      </div>
      <div class="balance in-desktop">
        <UserMenuDesktop
          bind:active_view
          bind:user
          {onOpenProfile}
          {onLogout}
        />
      </div>
    {:else}
      <div class="buttons">
        <NoLoginMenu
          {onShowLoginModal}
          {onShowRegisterModal}
          {onShowUserCreation}
          {onOpenLogin}
          {onOpenSignup}
          bind:showMainLoading
          bind:user
          bind:username
          bind:password
        />
      </div>
    {/if}
  </div>
</div>

<!--Modal bind:open={showLoginModal} modalSize="small">
  <Login
    onSubmitted={(data)=>onLogingClic(data, 'modal')}
    {onForgotPassword}
    bind:showMainLoading
  />
</Modal-->
<div class="Ganawin">
  <Modalv2 bind:open={loginModalOpen} bind:modalOpened >
    <Login onOk={onLoginOk} onError={onLoginError} {assetsUrl} {onOpenRecoverPassword} {onOpenSignup} bind:platform t={$t}/>
  </Modalv2>

  <Modalv2 bind:open={resetpassModalOpen} bind:modalOpened title={$t("recoverPassword.title")}>
    <RecoverPassword onOk={onRecoverPasswordOk} onError={onRecoverPasswordError} bind:open={resetpassModalOpen} t={$t}/>
  </Modalv2>

  <Modalv2 bind:open={signupModalOpen} bind:modalOpened title="Registrate Aquí">
    <Signup {configSignup} {openPrivacyPolicies} onOk={onSignupOk} onError={onSignupError}  {onOpenLogin} t={$t}/>
  </Modalv2>


    <Modalv2 bind:open={profileModalOpen} bind:modalOpened title="Mi cuenta">
      <Profile {configProfile} {onLogout} {openChatLive} {onOpenDeposit} onError={onProfileError} onOk={onProfileOk} bind:user t={$t}/>
  </Modalv2>

  <Notifier bind:notify/>




</div>


<Modal bind:open={showRegisterModal}>
  <RegisterUserEmail bind:userState 
  {onPasswordChangeModal}
  />
</Modal>


<ModalEstadistic bind:open={showRstadistic}>
</ModalEstadistic>

<!--ModalRegister  bind:open={showUserCreation} bind:user>
  <UserRegisterStepbyStep {logoUrl} bind:open={showUserCreation} bind:user userType={"X"} {countryCodes} {currencies} onOk={onRegisterOk} platform={"Ganawin"} />
</ModalRegister-->

<!--ModalPayments bind:open={showDeposit}>
  <Depositx bind:user bind:open={showDeposit} onOk={onDepositOk} onError={onDepositError} />
</ModalPayments-->
<!-- ESTO NO SIRVE FALTA HACER VALIDACIONES ERROR  -->
<!--Modal bind:open={showWithdrawal} showCloseButton={false}>
  <Withdrawalw
    bind:user
    bind:open={showWithdrawal}
    bind:pendingWhitdrawall 
    onOk={onWithdrawalOk}
    onError={onWithdrawalError}
  />
</Modal-->

<style>
.content-logo{
  position: relative;
}
.smll_lg{

  width: 9rem;
}
@media (min-width:401px){
        .smll_lg{
          display:block;
        }
        .tall_lg{
          display:none;
        }

      }
      @media (max-width:400px){
        .smll_lg{
          display:none;
        }
        .tall_lg{
          width: 3.5rem !important;
          display:block;
        }

      }
.estanew{
    position: absolute;
    top: -5px;
    right: 0;
    background: red;
    font-weight: 500;
    font-size: 14px;
    font-family: system-ui;
    border-radius: 0.25rem;
    padding: 0 0.25rem;
  }
  @media (max-width:1440px){
    .game_txt{
      display: none;
    }
  }
.games_top{
  display: flex;
    width: 8rem;
    gap: 0.5rem;
}
.game_img{
  cursor: pointer;
  border-radius: 10px;
    display: flex;
    align-items: center;
    font-weight: 600;
   padding: 0.25rem 1rem;
  }
.game_img img{
  width: 3rem;
   
  }
  .game_img.studio{
    background: linear-gradient(to right, rgb(28, 30, 43), rgb(2, 2, 117));
  }
  .game_img.aviator{
    background: linear-gradient(to right, rgb(28, 30, 43), rgb(180, 8, 48));
  }
.estuditc.prom {
    margin-right: 0;
    margin-left: 1rem;
    display: flex;
    justify-content: center;
    gap: 5px;
    align-items: center;
}
.estuditc {
    margin: 1rem;
    margin-left: 0;
    background: rgb(65 32 91);
    padding: .5rem;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
}

  .class-b{
    background-color: #2f103dbf!important;
    position: fixed;
    z-index: 6;
    top: 0;
  }
  /*.user-header.virtual{
    position: fixed;
    z-index: 101;
    top: 0;
  }*/
  .user-header {
    background-color: #2f103d;
  }
  @media only screen and (max-width: 1022px) {

    .estuditc, .estuditc.prom, .in-desktop,.games_top {
    display: none;
}
    .user-header {
      width: 100%;
      /*background-color: #050505;*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3.5rem;
    }
    .user-header-principal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0.5rem;
      gap: 0.5rem;
    }
    .content-logo{
      max-width: 7.5rem;
      height: 50px;
      padding: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .logo {
      width: 6.5rem;
      top: 0;
      height: auto;
    }
  }
  @media only screen and (min-width: 1024px) {
    .in-mobile {
      display: none;
    }
    .user-header {
      width: 100%;
      /*background-color: #050505;*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3.5rem;
    }
    .user-header-principal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0.5rem;
      gap: 0.25rem;
    }
    .content-logo{
      background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 0;
    width: 8rem;
    }
    .logo{
      width: 9rem;
      
    }
  }
  .user-header *{
    font-size: 13px;
  }
</style>
