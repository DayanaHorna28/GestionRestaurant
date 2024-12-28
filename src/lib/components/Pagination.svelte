<script>
  import { onMount } from "svelte";
  import { Button, Pagination, PaginationItem } from "sveltestrap";

  export let current;
  export let total;
  export let xpage; // Items per page
  export let onPageClick;

  let pages = [1];


  onMount(() => {
    console.log("totalPage:", total)
    generatePageRange();
  });

  $:{
    generatePageRange();
  }

  function generatePageRange() {
    if(total > 0){
      const visiblePages = 5;
      const totalPages = Math.ceil(total / xpage);
      const middlePage = Math.ceil(visiblePages / 2);
  
      let startPage = Math.max(1, current - middlePage + 1);
      let endPage = Math.min(totalPages, current + middlePage - 1);
  
      const range = [];
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
        pages = range;
      }
    }


  }

</script>

<nav class="pagination">
  <span class="total-info">Total {total} items.</span>

  <Pagination>
    <PaginationItem disabled={current === 1}>
      <Button class="page-link" on:click={() => onPageClick(current - 1)}>
        <span aria-hidden="true">&laquo;</span>
      </Button>
    </PaginationItem>

    {#each pages as page}
      <PaginationItem active={current === page}>
        <Button class="page-link" on:click={() => onPageClick(page)}>
          {page}
        </Button>
      </PaginationItem>
    {/each}


    <PaginationItem disabled={current === Math.ceil(total / xpage)}>
      <Button class="page-link" on:click={() => onPageClick(current + 1)}>
        <span aria-hidden="true">&raquo;</span>
      </Button>
    </PaginationItem>
  </Pagination>
</nav>

<style>
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1em 0; /* Add some margin for better visual separation */
  }

  .total-info {
    color: black;
    margin-right: 1em; /* Separate the total information from the pagination buttons */
  }
  @media (max-width: 768px) {
    .pagination {
      /* Adjust pagination layout for smaller screens (optional) */
      flex-wrap: wrap;
    }
  }
</style>
