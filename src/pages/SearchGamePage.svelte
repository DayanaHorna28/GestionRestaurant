<script>
  // @ts-nocheck
  import GameList from "../lib/components/Lists/GameList.svelte";

  export let user
  export let searchValue = '';
  export let userState;
  export let onOpenGame;
  export let searchGames;
  export let favGames;

</script>

<div class="u-search-page">
  <GameList
    category = 'searchAll'
    bind:userState
    title= {searchValue.toUpperCase()}
    prefix = "RESULTADO DE "
    games={searchGames}
    bind:favGames
    {onOpenGame}
    bind:user
  />
</div>

<style>

@media only screen and (max-width: 1200px) {
   
}
@media only screen and (min-width: 1200px) {
   
}
</style>
