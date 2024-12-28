<script>
  export let card;
</script>

<div class="header-card">
  <p class="title">{card.title}</p>
  <p class="value">{card.value}</p>
  <p class="description">{card.description}</p>
</div>

<style>
  .header-card {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }
  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .value {
    color: #5e5ef0;
    font-size: 1.5rem;
  }
  .description {
    color: #aaa;
    font-size: 0.9rem;
  }
</style>
