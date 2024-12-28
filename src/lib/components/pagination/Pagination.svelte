<script>
  import { onMount } from "svelte";
  import { Button, Pagination, PaginationItem } from "sveltestrap";

  export let current;
  export let total;
  export let xpage; // Items per page
  export let onPageClick;

  let pages = [1];


  onMount(() => {
    generatePageRange();
  });

  $:{
    generatePageRange();
    console.log("Info:", current, total, xpage, pages);
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

  .page-link {
    padding: 0.5rem 0.75rem; /* Adjust padding for a more balanced look */
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .page-link:hover {
    background-color: #f1f1f1; /* Subtle hover effect */
  }

  .page-link[disabled] {
    opacity: 0.5;
    cursor: not-allowed; /* Indicate disabled state visually */
  }

  .active .page-link {
    background-color: #ddd; /* Highlight the active page */
  }

  @media (max-width: 768px) {
    .pagination {
      /* Adjust pagination layout for smaller screens (optional) */
      flex-wrap: wrap;
    }
  }
</style>
