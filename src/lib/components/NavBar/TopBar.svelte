<script>
  import alertify from "alertifyjs";
  import Profile from "./profile.svelte";
  import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "sveltestrap";
  import EventManager from "../../../js/EventManager";
  import AlertTokenExpired from "./alertTokenExpired.svelte";
  import backend from "../../../server";
  import moment from "moment";
  import { onMount } from "svelte";
  export let userLoged;
  export let onLogout;
  let account=0;
  let filters = {};
  let showProfile = false;
  let event={};
  let arrowMovement=false;
  let movements = { list:[]};

  onMount(() => {
    filters = {
      status: 1,
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    };
  });

  const onShowProfile = () => {
    showProfile = true;
  };

  const onNewEvent =(type)=>{
    EventManager.publish(type,event);
  }

  EventManager.subscribe("DEPOSIT-BANK",()=>{ 
     arrowMovement=true;
     account++;
     const root = document.documentElement;
     root.style.setProperty('--arrow-top', '20%');
  });

  EventManager.subscribe("WITHDRAW-BANK",()=>{ 
     arrowMovement=true;
     account++;
     const root = document.documentElement;
     root.style.setProperty('--arrow-top', '56%');
  });

  EventManager.subscribe("WITHDRAW-CASH",()=>{ 
     arrowMovement=true;
     account++;
     const root = document.documentElement;
     root.style.setProperty('--arrow-top', '83%');
  });


  const listMovement = async () =>{ 
    let params = { ...filters };
    let {data} = await backend.movements.list(params);
    let movements = data;

    console.log("movements",movements);
  }

  
</script>

<div class="row-bo navbar">
  <div class="content-logo">
    <img
      class="img-retail"
      src="https://ret.universalhorse.club/img/rweb_universal_horse/retails.png"
      alt=""
    />
    <div class="content-universal">
      <img
        class="center login-pic"
        src="https://assetsapiusoft.s3.us-west-2.amazonaws.com/bo_fontend/logo_small.png"
        alt=""
      />
      <b>Retail Cashier</b>
    </div>
  </div>
  <div style="display: flex; gap: 2rem; position: relative; ">
    <div style="margin-top: 14px;">
      <div class="circule">{account}</div>
      <Dropdown>
        <DropdownToggle nav caret on:click={() => listMovement()} ><i class="bi bi-bell-fill"></i></DropdownToggle>
        <DropdownMenu end style="top: 100%;">       
           <DropdownItem on:click={() => onNewEvent('deposit-bank')}>
              Nuevos Depositos Bancarios
              <div class="arrow-container { !arrowMovement ? 'show-arrow' : '' }">
                 <div class="arrow"></div>
              </div>
           </DropdownItem>
           <DropdownItem divider />
           <DropdownItem on:click={() => onNewEvent('withdraw-bank')}>
              Nuevos Retiros Bancarios
              <div class="arrow-container { !arrowMovement ? 'show-arrow' : '' }">
                 <div class="arrow"></div>
              </div>
           </DropdownItem>
           <DropdownItem on:click={() => onNewEvent('withdraw-cash')}>
              Nuevos Retiros Efectivo
              <div class="arrow-container { !arrowMovement ? 'show-arrow' : '' }">
                 <div class="arrow"></div>
              </div>
           </DropdownItem>
        </DropdownMenu>
     </Dropdown>
     
    </div>
    <button on:click={onShowProfile} class="btn-sm profile-btn" style="display: flex; gap: 0.25rem;">
      <img class="usericon1" src="https://d2zzz5z45zl95g.cloudfront.net/latinosport21/usericon1.png" />
    </button>
</div>

</div>

{#if showProfile}
  <Profile bind:showProfile bind:userLoged bind:onLogout />
{/if}

<AlertTokenExpired  bind:user={userLoged}/>

<style>

  :root {
    --arrow-top: 20%;
}

  .usericon1 {
    width: 1.8rem;
    border-radius: 0.25rem;
  }

  .circule {
    background: red;
    border: none;
    text-align: center;
    margin: 2px;
    border-radius: 50%;
    width: 15px;
    height: 15px; 
    line-height: 15px; 
    color: white;
    font-weight: bold; 
    font-size: 10px;
    margin-left: 10px;
  }


  .arrow-container.show-arrow {
    opacity: -1;
  }

  .arrow-container {
    position: absolute;
    top:var(--arrow-top); 
    left: 95%;
    transform: translate(-50%, -50%);
    animation: blink 1s infinite alternate;
  }

  .arrow {
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: red;
    position: relative;
    animation: moveArrow 2s infinite;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }

  @keyframes moveArrow {
    0%, 100% {
      transform: translateX(10);
    }
    50% {
      transform: translateX(3px);
    }
  }

  .content-logo {
    display: flex;
    flex-direction: row;
  }
  .content-universal {
    display: flex;
    flex-direction: column;
  }
  @media only screen and (max-width: 1025px) {
    .navbar {
      justify-content: space-between;
      color: white;
      background-color: rgb(64, 64, 64);
      padding: 0.5rem;
    }
    .profile-btn {
      background-color: transparent;
      border: none;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .img-retail {
      max-width: 50px;
      max-height: 40px;
    }
    .login-pic {
      width: 116px;
    }
  }
  @media only screen and (min-width: 1024px) {
    .navbar {
      padding: 0.5rem;
      justify-content: space-between;
      color: white;
    }
    .profile-btn {
      background-color: transparent;
      border: none;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .usericon1 {
      width: 2.8rem;
      border-radius: 0.25rem;
    }
    .img-retail {
      max-width: 80px;  
      max-height: 80px;
    }
    .login-pic {
      width: 216px;
    }
  }
</style>
