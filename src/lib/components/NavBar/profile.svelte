<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";

  export let userLoged;
  export let onLogout;
  export let showProfile;
  const toggle = () => (showProfile = !showProfile);
</script>

<Modal isOpen={showProfile} {toggle} class="black" size={"lg"}>
  <ModalHeader {toggle}>
    Usuario: {userLoged.username}
  </ModalHeader>
  <ModalBody>
    <table class="table table-striped responsive table-hover table-sm">
      <thead class="thead-dark">
        <tr>
          <th class="info">COD. AGENTE :</th>
          <th class="info">Usuario #83 </th>
          {#if userLoged.balance["REAL"]}
            {#each userLoged.balance["REAL"] as balance}
            <th class="info">Saldo {balance.currencyISO}:</th>
            {/each}
          {/if}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="info">{userLoged.code?userLoged.code:"000-0000000"}</td>
          <td class="info">{userLoged.username}</td>
          {#if userLoged.balance["REAL"]}
            {#each userLoged.balance["REAL"] as balance}
              <td class="info">  {balance.amount.toFixed(2)}</td>
            {/each}
          {/if}
        </tr>
      </tbody>
    </table>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-danger btn-sm" on:click={onLogout}>
      <i class="bi bi-person-square" />
      Cerrar sesión
    </button>
  </ModalFooter>
</Modal>
