<script>
  export let orders;
</script>

<div class="order-list">
  <header>
    <h3>Orders #34562</h3>
    <div class="order-types">
      <button>Dine In</button>
      <button>To Go</button>
      <button>Delivery</button>
    </div>
  </header>

  <div class="order-items">
    {#each orders as order}
      <div class="order-item">
        <p>{order.name}</p>
        <div class="order-details">
          <input type="number" min="1" value={order.qty} />
          <span>${(order.price * order.qty).toFixed(2)}</span>
          <textarea placeholder="Order Note...">{order.note}</textarea>
          <button>❌</button>
        </div>
      </div>
    {/each}
  </div>

  <footer>
    <p>Subtotal: $21.03</p>
    <button>CONTINUAR CON EL PEDIDO</button>
  </footer>
</div>

<style>
  .order-list {
    background: #2e2e3e;
    padding: 1rem;
    border-radius: 8px;
    flex: 1;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .order-types button {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
    background: #3e3e4e;
    color: white;
    border: none;
    border-radius: 4px;
  }
  .order-item {
    margin-bottom: 1rem;
  }
  footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
  }
</style>
