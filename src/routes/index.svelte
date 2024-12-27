<script>
// @ts-nocheck

    import {Link, Route, Router} from "svelte-navigator";
    import Home from "../pages/Home.svelte";
    import Jackpots from "../pages/JackpotsPage.svelte";
    import ProvidersPage from "src/pages/ProvidersPage.svelte";
    import SportbookPage from "src/pages/SportbookPage.svelte";
    import SlotPage from "../pages/SlotPage.svelte";
    import PromotionsPage from "../pages/PromotionsPage.svelte";
  import SlotLivePage from "src/pages/SlotLivePage.svelte";
  import ESportsPage from "src/pages/ESportsPage.svelte";
  import ScratchWin from "src/pages/ScratchWin.svelte";
  import GameVirtual from "src/pages/GameVirtual.svelte";

    export let url = ""
</script>

<Router {url}>
    <Route path="/home" component="{Home}"/>
    <Route path="/esports" component="{ESportsPage}"/>
    <Route path="/Gamevirtual" component="{GameVirtual}"/>
    <Route path="/Promotions" component="{PromotionsPage}"/>
    <Route path="/slot" component="{SlotPage}"/>
    <Route path="/jackpots" component="{Jackpots}"/>
    <Route path="/Scratch" component="{ScratchWin}"></Route>
    <Route path="/Providers" component="{ProvidersPage}"></Route>
    <Route path="/slotLive" component="{SlotLivePage}"></Route>
</Router>