<script>
  // @ts-nocheck
  import GameList from "../lib/components/Lists/GameList.svelte";
  import BannerCarrusel from "../lib/BannerCarrusel.svelte";
  import Configuration from "../config";
  import MenuCategoryPage from "../../src/lib/components/Menu/MenuCategoryPage.svelte";
  import util from "../js/util";
  import Widgets from "../lib/components/Widgets.svelte";


  import {
    t,
    ProviderList,
    DigtainWidget,
    Banners
  } from "u-library-sass";

  export let userState;
  export let user;
  export let onOpenGame;
  export let topGames = [];
  export let popGames = [];
  export let newGames = [];
  export let dropGames = [];
  export let otherGames = [];
  export let favGames
  export let active_view
  export let onCategoryChange;
  export let onOpenPromotions;
  export let onOpenProviders;
  export let loginModalOpen;

  const DEFAULT_CATEGORY = "slot";
  const conf = Configuration.getConfiguration();
  let assets = conf.ASSETS;
  let clientCode = conf.CLIENT_CODE;
  let imageName = "fuego.svg";
  
  
  let banners = [
    //{ id: 1, src: `${conf.ASSETS}/Coliseosport/bn_w_apuesta.png`, srcmb: `${conf.ASSETS}/Coliseosport/bn_m_apuesta.png`, category:""},
   // { id: 2, src: `${conf.ASSETS}/Coliseosport/banner_recharge_4.png`, srcmb: `${conf.ASSETS}/Coliseosport/banner_recharge_4_mb.png`, category:""},
   { id: 2, src: `${conf.ASSETS}/Ganawin/banner_ganawin.png`, srcmb: `${conf.ASSETS}/Ganawin/banner_ganawin_mb.png`, category:""},
   { id: 5, src: `${conf.ASSETS}/Latinsport21/bn_w_caballos2.png`, srcmb: `${conf.ASSETS}/Latinsport21/bn_m_caballos.png`, category: "horses" },
   { id: 4, src: `${conf.ASSETS}/Ganawin/banner_sport_v2.png`, srcmb: `${conf.ASSETS}/Ganawin/banner_sport_v2_mb.png`, category:"sportbook"},
   { id: 4, src: `${conf.ASSETS}/Latinsport21/bn_w_sportlive.png`, srcmb: `${conf.ASSETS}/Latinsport21/bn_m_sportlive.png`, category: "sportbooklive" },
   { id: 1, src: `${conf.ASSETS}/Latinsport21/bn_w_virtuales.png`, srcmb: `${conf.ASSETS}/Latinsport21/bn_m_virtuales.png`, category: "virtual" },
    { id: 5, src: `${conf.ASSETS}/Coliseosport/bn_w_crash.png`, srcmb: `${conf.ASSETS}/Coliseosport/bn_m_crash.png`, category:"crash"},
    { id: 6, src: `${conf.ASSETS}/generic_imgs/banners/prom1.png`, srcmb: `${conf.ASSETS}/generic_imgs/banners/prom1_mb.png`, category:"amigo_gaming"},
    { id: 7, src: `${conf.ASSETS}/generic_imgs/banners/prom2.png`, srcmb: `${conf.ASSETS}/generic_imgs/banners/prom2_mb.png`, category:"wild_gaming"},
    { id: 8, src: `${conf.ASSETS}/Coliseosport/bn_m_slot.png`, srcmb: `${conf.ASSETS}/Coliseosport/bn_w_slot.png`, category:"slot"},
    { id: 9, src: `${conf.ASSETS}/Coliseosport/bn_w_slotlive.png`, srcmb: `${conf.ASSETS}/Coliseosport/bn_m_slotlive.png`, category:"slotlive"},
    { id: 10, src: `${conf.ASSETS}/Latinsport21/bn_w_cashout.png`, srcmb: `${conf.ASSETS}/Latinsport21/bn_m_cashout.png`, category: "sportbook" },
    { id: 11, src: `${conf.ASSETS}/Ganawin/w_promo_mxn.png`, srcmb: `${conf.ASSETS}/Ganawin/m_promo_mxn.png`, category: "slot" },
    { id: 12, src: `${conf.ASSETS}/Ganawin/w_promo2_mxn.png`, srcmb: `${conf.ASSETS}/Ganawin/m_promo2_mxn.png`, category: "slot" },
    { id: 13, src: `${conf.ASSETS}/Ganawin/w_promo3_mxn.png`, srcmb: `${conf.ASSETS}/Ganawin/m_promo3_mxn.png`, category: "crash" },
    { id: 14, src: `${conf.ASSETS}/Ganawin/w_promo4_mxn.png`, srcmb: `${conf.ASSETS}/Ganawin/m_promo4_mxn.png`, category: "slotlive" },
    // { id: 10, src: `${conf.ASSETS}/Ganawin/w_promo2_mxn.png`, srcmb: `${conf.ASSETS}/Ganawin/m_promo2_mxn.png`, category: "slot" },
  ];
  let banner_video = true;
  let category = "home";
  category = category=="home"?DEFAULT_CATEGORY:category;

  const openGame = (game) => {
    onOpenGame(game);
  };
  //10136.54
  let topSGames = [
    {  "id": 50726,    "gameid": "7546_ADM",    "provider": "adm",    "name": "Sweet Bonanza",    "description": "",    "type": "DROP",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-09-25T12:18:32.685+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {  "id": 50592,    "gameid": "7877_ADM",    "provider": "adm",    "name": "Buffalo King Megaways",    "description": "",    "type": "MEGAW",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-09-30T12:32:54.578+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {  "id": 50732,  "gameid": "7525_ADM",  "provider": "adm",  "name": "Wolf Gold",  "description": "",  "type": "DROP",  "urlimage": ".png",  "mode": "wb",  "brand": "Pragmatic Play",  "status": 1,  "position": 1,  "category": "slot",  "reg_date": "2024-06-22T15:02:34.068+00:00",  "currency": null,  "isNew": 0,  "min_bet": 0,  "max_bet": 0,  "jackpot": 0},   
    {  "id": 92224,  "gameid": "1075158-NBC",  "provider": "nvbc",  "name": "Majestic King",  "description": "",  "type": "CLAS",  "urlimage": ".png",  "mode": "wb",  "brand": "SPINOMENAL",  "status": 1,  "position": 0,  "category": "slot",  "reg_date": "2024-09-25T20:24:35.502+00:00",  "currency": null,  "isNew": 0,  "min_bet": 0,  "max_bet": 0,  "jackpot": 0},   
    {  "id": 92266,  "gameid": "1075221-NBC",  "provider": "nvbc",  "name": "Demi Gods II",  "description": "",  "type": "CLAS",  "urlimage": "",  "mode": "wb",  "brand": "SPINOMENAL",  "status": 1,  "position": 0,  "category": "slot",  "reg_date": "2024-10-09T14:52:17.104+00:00",  "currency": null,  "isNew": 0,  "min_bet": 0,  "max_bet": 0,  "jackpot": 0},
    {   "id": 92248,   "gameid": "1075194-NBC",   "provider": "nvbc",   "name": "Book of Rebirth",   "description": "",   "type": "CLAS",   "urlimage": "",   "mode": "wb",   "brand": "SPINOMENAL",   "status": 1,   "position": 0,   "category": "slot",   "reg_date": "2024-09-25T16:54:36.682+00:00",   "currency": null,   "isNew": 0,   "min_bet": 0,   "max_bet": 0,   "jackpot": 0},
    {    "id": 76975,    "gameid": "38_pokop",    "provider": "pkg",    "name": "Vikings Mystery",    "description": "",    "type": "CLAS",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pop Ok Gaming",    "status": 1,    "position": 0,    "category": "slot",    "reg_date": "2024-10-01T15:33:25.712+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 82971,    "gameid": "125_pokop",    "provider": "pkg",    "name": "Royal Flash",    "description": "New game",    "type": "CLAS",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pop Ok Gaming",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-10-30T12:24:31.744+00:00",    "currency": null,    "isNew": 1,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 77019,    "gameid": "109_pokop",    "provider": "pkg",    "name": "Akn of Providence",    "description": "",    "type": "CLAS",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pop Ok Gaming",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-10-01T15:34:12.001+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 34990,    "gameid": "endorphina2_Buffalo50@ENDORPHINA",    "provider": "ed",    "name": "Buffalo 50",    "description": "",    "type": "CLAS",    "urlimage": ".gif",    "mode": "wb",    "brand": "Endorphina",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-09-26T11:24:01.397+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 34834,    "gameid": "endorphina_TheEmirate@ENDORPHINA",    "provider": "ed",    "name": "The Emirate",    "description": "",    "type": "CLAS",    "urlimage": ".gif",    "mode": "wb",    "brand": "Endorphina",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-09-26T11:54:55.448+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 34842,    "gameid": "endorphina_Gladiators@ENDORPHINA",    "provider": "ed",    "name": "Gladiators",    "description": "",    "type": "CLAS",    "urlimage": ".png",    "mode": "wb",    "brand": "Endorphina",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2020-09-25T16:20:06.000+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},


  ];
  let topSlotLive = [
    {    "id": 77021,    "gameid": "500_pokop",    "provider": "pkg",    "name": "Roulette",    "description": "",    "type": "RLIV",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pop Ok Gaming",    "status": 1,    "position": 0,    "category": "slot_live",    "reg_date": "2023-10-30T17:04:56.266+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 77023,    "gameid": "501_pokop",    "provider": "pkg",    "name": "Multi Fruit",    "description": "",    "type": "RLIV",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pop Ok Gaming",    "status": 1,    "position": 0,    "category": "slot_live",    "reg_date": "2024-01-03T21:50:46.941+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 77025,    "gameid": "502_pokop",    "provider": "pkg",    "name": "Diamond Fruits",    "description": "",    "type": "RLIV",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pop Ok Gaming",    "status": 1,    "position": 0,    "category": "slot_live",    "reg_date": "2024-01-03T21:50:53.493+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 36242,    "gameid": "225",    "provider": "pg",    "name": "Auto-Roulette 1",    "description": "",    "type": "RLIV",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot_live",    "reg_date": "2024-11-07T09:49:00.302+00:00",    "currency": null,    "isNew": 1,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 36251,    "gameid": "801",    "provider": "pg",    "name": "Mega Wheel",    "description": "",    "type": "MWLIV",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot_live",    "reg_date": "2021-02-04T04:35:18.000+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 36280,    "gameid": "206",    "provider": "pg",    "name": "Roulette Macao",    "description": "",    "type": "RLIV",    "urlimage": ".png",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot_live",    "reg_date": "2021-02-04T04:34:38.000+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 36273,    "gameid": "222",    "provider": "pg",    "name": "Roulette Germany - Deutsches Roulette",    "description": "",    "type": "RLIV",    "urlimage": ".png",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot_live",    "reg_date": "2021-02-04T04:34:38.000+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    {    "id": 36269,    "gameid": "227",    "provider": "pg",    "name": "Roulette Azure",    "description": "",    "type": "RLIV",    "urlimage": ".png",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot_live",    "reg_date": "2021-02-04T04:34:38.000+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
  ];

  let topCrashgames = [
    { "id": 69852,    "gameid": "1020986-NBC",    "provider": "nvbc",    "name": "Aviator",    "description": "",    "type": "FAST",    "urlimage": ".png",    "mode": "wb",    "brand": "AVIAX",    "status": 1,    "position": 0,    "category": "crash",    "reg_date": "2023-08-30T21:06:06.229+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    { "id": 50474,    "gameid": "1301",    "provider": "pg",    "name": "Spaceman",    "description": "",    "type": "FAST",    "urlimage": ".png",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 200010,    "category": "crash",    "reg_date": "2023-11-11T00:56:59.848+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    { "id": 52854,    "gameid": "SCRATCHCARDMULTINIVEL6F4",    "provider": "vbrg",    "name": "Tesoro del mono",    "description": "",    "type": "FAST",    "urlimage": ".png",    "mode": "wb",    "brand": "Vibra Gaming",    "status": 1,    "position": 100000,    "category": "crash",    "reg_date": "2023-11-11T01:01:09.721+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0},
    { "id": 77620, "gameid": "614_pokop", "provider": "pkg", "name": "Ninja Fruit Cubes", "description": "New game", "type": "CLAS", "urlimage": ".gif", "mode": "wb", "brand": "Pop Ok Gaming", "status": 1, "position": 1, "category": "slot", "reg_date": "2024-01-13T19:31:48.135+00:00", "currency": null, "isNew": 0, "min_bet": 0, "max_bet": 0, "jackpot": 0 },

  ];
  const topProviders = ["EVOLUTION","Ortiz Gaming","Pragmatic Play","Vibra Gaming","Endorphina"];


  let mobile = window.innerWidth <= 1023;

  let olympus = {    "id": 50626,    "gameid": "7760_ADM",    "provider": "adm",    "name": "Gates of Olympus",    "description": "",    "type": "CLAS",    "urlimage": ".gif",    "mode": "wb",    "brand": "Pragmatic Play",    "status": 1,    "position": 1,    "category": "slot",    "reg_date": "2024-10-11T18:06:36.110+00:00",    "currency": null,    "isNew": 0,    "min_bet": 0,    "max_bet": 0,    "jackpot": 0};
 let aviatrix = {  "id": 77048,  "gameid": "nft-aviatrix",  "provider": "avt",  "name": "Aviatrix",  "description": "New game",  "type": "FAST",  "urlimage": null,  "mode": "wb",  "brand": "AVIATRIX",  "status": 1,  "position": 1,  "category": "crash",  "reg_date": "2023-12-15T20:11:13.417+00:00",  "currency": null,  "isNew": 0,  "min_bet": 0,  "max_bet": 0,  "jackpot": 0};
  let potgold = {  "id": 50742,  "gameid": "7057_ADM",  "provider": "adm",  "name": "9 Pots of Gold",  "description": "",  "type": "CLAS",  "urlimage": "",  "mode": "wb",  "brand": "Microgaming",  "status": 1,  "position": 100000,  "category": "slot",  "reg_date": "2022-11-08T23:21:46.761+00:00",  "currency": null,  "isNew": 0,  "min_bet": 0,  "max_bet": 0,  "jackpot": 0};
  let platform = "Ganawin";
</script>

<div class="home-page">
  <div class="Ganawin">
    <Banners bind:platform {onCategoryChange}/>
   </div>
  <MenuCategoryPage bind:active_view bind:onCategoryChange   {onOpenPromotions} />
     
  <div class="cat-top-games">
  <div class="Ganawin">
    <ProviderList {onOpenProviders} {topProviders} t={$t}/>



  </div>
  <div class="Ganawin" style="padding: 1.5rem 0;">
    <DigtainWidget
    {user}
    bind:loginModalOpen
    {clientCode}
    {onCategoryChange}
  />
  </div>
  

   <div style="position:relative;cursor:pointer;">
      {#if mobile}
      <div  class="no-btn"  on:click={() =>    onOpenProviders({ code: "DROPS & WINS", name: "DROPS & WINS" })}>
      <img style="width: 100%;padding: 0 1rem;" src="https://assets.apiusoft.com/Ganawin/dp_mb.webp" alt="" loading="lazy" />
      </div>
      {:else}
      <div  class="no-btn"  on:click={() =>    onOpenProviders({ code: "DROPS & WINS", name: "DROPS & WINS" })}>
      <img style="width: 100%;" src="https://assets.apiusoft.com/Ganawin/dp_pc.webp" alt="" loading="lazy" />
      </div>
    {/if}
   </div>
   <div class="Ganawin">
      <div class="providerlist">
        <div class="providerlist__provider">
                <button class="providerlist__slide" on:click={onOpenGame(potgold)}>
                    <img class="providerlist__img" src="https://assets.apiusoft.com/Ganawin/game_5.webp">
                    <div class="providerlist__parallax">
                        <div class="providerlist__playnow">Juega ahora</div>
                    </div>
                </button>
                <button class="providerlist__slide"  on:click={onOpenGame(aviatrix)} >
                    <img class="providerlist__img" src="https://assets.apiusoft.com/Ganawin/game_2.webp">
                    <div class="providerlist__parallax">
                        <div class="providerlist__playnow">Juega ahora</div>
                    </div>
                </button>
                <button class="providerlist__slide" on:click={() => onOpenProviders({code:"JUEGOS POPULARES",name:"JUEGOS POPULARES"},"slot")}>
                    <img class="providerlist__img" src="https://assets.apiusoft.com/Ganawin/game_pop.webp">
                    <div class="providerlist__parallax">
                        <div class="providerlist__playnow">Juega ahora</div>
                    </div>
                </button>
                <button class="providerlist__slide" on:click={onOpenGame(olympus)}  >
                    <img class="providerlist__img" src="https://assets.apiusoft.com/Ganawin/game_3.webp">
                    <div class="providerlist__parallax">
                        <div class="providerlist__playnow">Juega ahora</div>
                    </div>
                </button>
                <button class="providerlist__slide" on:click={onCategoryChange("horses")} >
                    <img class="providerlist__img" src="https://assets.apiusoft.com/Ganawin/game_4.webp">
                    <div class="providerlist__parallax">
                        <div class="providerlist__playnow">Juega ahora</div>
                    </div>
                </button>
        </div>
    </div>
   </div>
  <div class="helppe_2">
    <img on:click={() => onOpenProviders({code:"Amigo Gaming",name:"Amigo Gaming"})} width="100%" src="https://assets.apiusoft.com/us_img_brands/Amigo Gaming.png" alt="">
    <img on:click={() => onOpenProviders({code:"Redrake Gaming",name:"Redrake Gaming"})} width="100%" src="https://assets.apiusoft.com/us_img_brands/Redrake Gaming.png" alt="">
    <img on:click={() => onOpenProviders({code:"Microgaming",name:"Microgaming"})} width="100%" src="https://assets.apiusoft.com/us_img_brands/Microgaming.png" alt="">
    <img on:click={() => onOpenProviders({code:"Rubyplay",name:"Rubyplay"})} width="100%" src="https://assets.apiusoft.com/us_img_brands/Rubyplay.png" alt="">
    <img on:click={() => onOpenProviders({code:"Red Tiger",name:"Red Tiger"})} width="100%" src="https://assets.apiusoft.com/us_img_brands/Red Tiger.png" alt="">
    <img on:click={() => onOpenProviders({code:"Tom Horn Gaming",name:"Tom Horn Gaming"})} width="100%" src="https://assets.apiusoft.com/us_img_brands/Tom Horn Gaming.png" alt="">
  </div>
  
</div>
    {#if userState !== "logout"}
      <GameList id="favs"
        bind:category
        bind:userState
        title= "FAVORITOS"
        games={favGames}
        bind:favGames
        onOpenGame={(game) => openGame(game)}
        bind:user
      />
    {/if}
    
    <GameList
      bind:category
      section="TOP"
      bind:userState
      bind:user
      prefix="Casino"
      title=""
      games={topSGames}
      bind:favGames
      onOpenGame={(game) => openGame(game)}
    />


    <GameList
    bind:category
    section="TOP"
    bind:userState
    bind:user
    prefix="Crash Games"
    title=""
    games={topCrashgames}
    bind:favGames
    onOpenGame={(game) => openGame(game)}
  />
    <GameList
    bind:category
    section="TOP"
    bind:userState
    bind:user
    prefix="Casino en Vivo"
    title=""
    games={topSlotLive}
    bind:favGames
    onOpenGame={(game) => openGame(game)}
  />
  <!--div style="padding-bottom: 5rem;"></div-->
    <!--GameList
      bind:category
      section="POP"
      bind:userState
      bind:user
      prefix="Juegos"
      title="Populares"
      games={popGames}
      bind:favGames
      onOpenGame={(game) => openGame(game)}
    />
    <GameList
      bind:category
      section="NEW"
      bind:userState
      bind:user
      prefix="Juegos"
      title="Nuevos"
      games={newGames}
      bind:favGames
      onOpenGame={(game) => openGame(game)}
    />
    <GameList
      bind:category
      section="DROP"
      bind:userState
      bind:user
      prefix="Drops"
      title="& Wins"
      games={dropGames}
      bind:favGames
      onOpenGame={(game) => openGame(game)}
    />
    <GameList
      bind:category
      section="CLAS"
      bind:userState
      bind:user
      prefix="Otros"
      title="Juegos"
      games={otherGames}
      bind:favGames
      onOpenGame={(game) => openGame(game)}
    /-->
  </div>

<style>

  .helppe_2{
    position: relative;
    display: grid;
    grid-template-columns: repeat(6,1fr);
    padding: 2rem 0;
    gap: 1.5rem;
  }
  @media (max-width: 1023px){
    .helppe_2{
      
      grid-template-columns: repeat(2,1fr);
      padding: 2rem;
    }
  }
  .helppe_2 img{
    height: 3rem;
    cursor: pointer;
  }

.cat-top-games {
    padding-left: 20px;
    padding-right: 20px;
}

  @media only screen and (min-width: 1800px) {

.cat-top-games{
  padding-left: 12rem;
  padding-right: 12rem;
  }
}

@media only screen and (max-width: 1023px) {
  .cat-top-games {
    padding-left: 0px;
    padding-right: 0px;
}
}
  .container_top{
    
  }
  .number_top{
    /*position: absolute;*/
  }
  .slideddd{
    position: relative;
    width: 90%;
    overflow: auto;
    margin: 0 auto;
  }
  .test_ing{
    width: 350%;
    margin: 2rem auto;
    height: 250px;
    display: flex;
  }
  .test_ing img{
    width: 0px;
    flex-grow: 1;
    object-fit: cover;
    opacity: 0.8;
    /*transition: .5s ease;*/
    
    animation: slideBack .5s linear normal forwards;
  }
  .test_ing img:hover{
    cursor: pointer;
    /*width: 300px;*/
    opacity: 1;
    filter: contrast(120%);
  }

 
    @keyframes slideOut {
        0% {
            transform:perspective(100rem) rotateY(-40deg) translateZ(0);
            z-index: var(--z)
        }

        30% {
            transform: perspective(100rem) rotateY(-40deg) translate3d(5rem,0,0);
            z-index: var(--z)
        }

        to {
            transform: perspective(100rem) rotateY(0deg) translate3d(-5rem,0,10rem);
            z-index: 100
        }
    }

    @keyframes slideBack {
        0% {
            transform: perspective(100rem) rotateY(0deg) translate3d(-5rem,0,10rem);
            z-index: 100
        }

        60% {
            transform: perspective(100rem) rotateY(-40deg) translate3d(5rem,0,0);
            z-index: var(--z)
        }

        to {
            transform: perspective(100rem) rotateY(-40deg) translateZ(0);
            z-index: var(--z)
        }
    }

    .TrendingListWrapper.GamesList.MsnRow .SlideOut {
        animation: slideOut .5s linear normal forwards
    }

    .TrendingListWrapper.GamesList.MsnRow .SlideBack {
        /* animation:slideBack .5s linear normal forwards; */
    }


</style>
