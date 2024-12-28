<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import moment from "moment";
  import Menu from "../lib/components/Menu/Menu.svelte";

  export let userLoged;


  let showModalPlayer = false;
  let refreshList = false;
  let player;
  
  let showTableUsers = true;


  onMount(() => {});

  

  const onShowModalPlayer = (item) => {
    if (!item)
      item = {
        role: "X",
        currency: "PEN",
        country: "PE",
        status: "1",
        birthday: "1990-01-01",
        minBet: 1,
        maxBet: 1000,
      };
    else {
      item.status = item.status + "";
      let date_ = item.birthday.split('T');
      item.birthday =date_[0];
    }
    player = { ...item };

    console.log("item", item);
    showModalPlayer = true;
  };
 

  
</script>

<div class="home-page">
</div>

<style>

  @media only screen and (max-width: 1024px) {
    .home-page {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
    }
  }
  @media only screen and (min-width: 1025px) {
    .home-page {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
