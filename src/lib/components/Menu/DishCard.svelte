<script>
  export let dish;
</script>

<div class="dish-card">
  <img src="/placeholder-dish.png" alt={dish.name} />
  <h3>{dish.name}</h3>
  <p>${dish.price.toFixed(2)}</p>
  <small>{dish.available} Bowls available</small>
</div>

<style>
  .dish-card {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  h3 {
    font-size: 1.1rem;
  }
  p {
    font-size: 1rem;
    color: #5e5ef0;
  }
  small {
    color: #aaa;
  }
</style>
