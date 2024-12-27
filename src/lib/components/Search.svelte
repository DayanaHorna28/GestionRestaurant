<script>
  import backend from "../../server";

  export let searchValue="";
  export let searchGames;
  export let active_view;
  export let category;
  export let sectionActive;
  export let onlyGames;

  
  const onKeyUp = async (event) => {
    searchGames = [];
    if(searchValue.length>0){
      sectionActive = "search";
      let filter = onlyGames? {search:searchValue}: {searchAll:searchValue};
      const data=await backend.getGameList(category, filter)
      searchGames = data;
      if(!onlyGames) active_view = 'search';
    }else{
      sectionActive = "";
      active_view = onlyGames ? active_view : "home";
    }
  };


</script>
<form on:submit={(e)=>{e.preventDefault()}} style="width: 100%;">
<button class="u-search">
  <svg width="30" fill="rgb(164, 82, 255)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/>
  </svg>
  <input type="text" class="search" placeholder="Buscar" bind:value={searchValue} on:keyup={onKeyUp}/>
</button>
</form>
<style>
  @media only screen and (max-width: 1023px) {
    input:focus-visible{
        outline: 0;
    }
    input{
      font-size: 14px;
    width: 92%;
    padding: 0.2rem;
    border-radius: 0 0.2rem 0.2rem 0;
    height: 95%;
    background: #353940;
    color: white;
    border-left: 0;
    border: none;
    }
    .u-search{
      padding-left: 0.5rem;
      width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.15rem;
    padding: 0;
    height: 40px;
    background: #353940;
    border: none;
    border-radius: 0.2rem;
    cursor: pointer;
    border: 1px solid rgb(164, 82, 255);
    }
  }
  @media only screen and (min-width: 1024px) {
    input:focus-visible{
        outline: 0;
    }
    input{
      border: none;
      padding: 0.2rem;
      border-radius: 0 0.2rem  0.2rem 0;
      background: #353940;
      padding: 0.7rem;
      height: 100%;
      color: white;
      width: 100%;
    }
    .u-search{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 0.25rem;
      padding: 0;
      border-radius: 0.2rem;
      cursor: pointer;
      height: 40px;
      width: 100%;
      background: #353940;

    border: 1px solid rgb(164, 82, 255);
    }
    svg{
      padding: 0 0.2rem;
    }
    
  }

</style>