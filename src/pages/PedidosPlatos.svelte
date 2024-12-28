<script>
  import MenuCategories from "../lib/components/Menu/MenuCategories.svelte";
  import NavBar from "../lib/components/Menu/NavBar.svelte";
  import DishCard from "../lib/components/Menu/DishCard.svelte";
  import OrderList from "../lib/components/Menu/OrderList.svelte";



  let dishes = [
    { name: "Spicy seasoned seafood noodles", price: 2.29, available: 20 },
    { name: "Salted Pasta with mushroom sauce", price: 2.69, available: 11 },
    { name: "Beef dumpling in hot and sour soup", price: 2.99, available: 16 },
    { name: "Healthy noodle with spinach leaf", price: 3.29, available: 22 },
    { name: "Hot spicy fried rice with omelet", price: 3.48, available: 13 },
    { name: "Spicy instant noodle with omelette", price: 3.59, available: 17 }
  ];

  let orders = [
    { name: "Spicy seasoned seafood noodles", price: 2.29, qty: 2, note: "Please, just a little bit spicy." },
    { name: "Salted Pasta with mushroom sauce", price: 2.69, qty: 1 },
    { name: "Spicy instant noodle with omelette", price: 3.49, qty: 3 },
    { name: "Healthy noodle with spinach leaf", price: 3.29, qty: 1 }
  ];
</script>

<div class="app">
  <NavBar />
  <main class="main-content">
    <section class="menu-section">
      <MenuCategories />
      <div class="dishes">
        {#each dishes as dish}
          <DishCard {dish} />
        {/each}
      </div>
    </section>
    <OrderList {orders} />
  </main>
</div>

<style>
  .app {
    font-family: Arial, sans-serif;
    background-color: #1e1e2e;
    color: #fff;
    padding: 1rem;
  }
  .main-content {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
  }
  .menu-section {
    flex: 2;
  }
  .dishes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
