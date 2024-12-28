<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import { onMount } from "svelte";
  import backend from "../../../server";

  export let showModalPlayer;
  export let player;
  export let listPlayers;
  export let userLoged;

  let showPassword = false;
  let showConfirmPassword = false;

  onMount(() => {
    console.log("userLoged", userLoged);
  });

  const isOnlyNumber = (event) => {
    if (!/\d/.test(event.key)) {
      event.preventDefault();
      alertify.error("Ingrese solo números");
    }
  };

  const validateSpaceKey = (e) => {
    if (e.charCode === 32) {
      e.preventDefault();
      alertify.error("No se permiten espacios en blanco");
    }
  };
  const togglePasswordHide = () => { 
    showPassword = !showPassword;
    const input = document.getElementById('passwordInput');
    if (showPassword) {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }
  const toggleConfirmPasswordHide = () => { 
    showConfirmPassword =! showConfirmPassword 
    const input = document.getElementById('confirmPasswordInput');
    if (showConfirmPassword) {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  const save = async () => {
    if (!player.username) return alertify.error("Ingrese el Usuario");
    if (!player.name) return alertify.error("Ingrese el Nombre");
    if (!player.lastName) return alertify.error("Ingrese el apellido");
    if (!player.email) return alertify.error("Ingrese el Correo Electrónico");
    if (!player.userial) {
      if (!player.password) return alertify.error("Ingrese la contraseña");
      if(player.confirmpassword !== player.password)return alertify.error("Contraseñas diferentes");
    }
    if (player.currency.length === 0) return alertify.error("Seleccione al menos una moneda"); 
    if (!player.phone) return alertify.error("Ingrese el Número de teléfono");
    if (!player.document) return alertify.error("Ingrese el número de DNI");
    if (!player.birthday) return alertify.error("Ingrese su fecha de nacimiento");
    if (!player.currency) return alertify.error("Seleccione una moneda");
    if (!player.country) return alertify.error("Seleccione su país");
    if (!player.maxBet) return alertify.error("Ingrese una apuesta máxima");
    if (!player.minBet) return alertify.error("Ingrese una apuesta mínima");
    if (!player.status) return alertify.error("Seleccione el estado del jugador");
    try {
      player.platformId = JSON.parse(sessionStorage.getItem("user")).platformId;
      player.server = "125.125.125.125";
      let payload = {...player};
      await backend.players.save(payload);
      alertify.success("Procesado!");
    } catch (error) {
      alertify.error("Error al crear jugador");
    }
    toggleplayer();
    listPlayers();
  };

  const toggleCurrency = (currency) => {
    if (player.currency.includes(currency)) {
      player.currency = player.currency.filter(c => c !== currency);
    } else {
      player.currency = [...player.currency, currency];
    }
  };

  const toggleplayer = () => (showModalPlayer = !showModalPlayer);
</script>

<Modal isOpen={showModalPlayer} toggle={toggleplayer} size="xl">
  <ModalHeader toggle={toggleplayer}><span class="title">Usuario {!player.playerId ? "NUEVO" : player.username}</span>
  </ModalHeader>
  <ModalBody>
    <div class="new-player">
      <label>Nombre de usuario:<input class="form-control" placeholder="Nombre de usuario" bind:value={player.username}/></label>
      <label>Nombre: <input class="form-control" placeholder="Nombre" bind:value={player.name}/></label>
      <label>Apellido:<input class="form-control" bind:value={player.lastName} placeholder="Apellido" autocomplete="off"/></label>
      <label>Email:<input type="email" class="form-control" bind:value={player.email} on:keypress={validateSpaceKey} placeholder="Correo electrónico"/></label>
      {#if !player.playerId}
        <label>Contraseña:
          <div style="display: flex;">
            <input id="passwordInput" type='password' class="form-control" bind:value={player.password} on:keypress={validateSpaceKey} placeholder="Contraseña" autocomplete="new-password" />
            <button class="btn" on:click={togglePasswordHide}><i class="bi bi-{showPassword ? 'eye' : 'eye-slash'}-fill"></i></button>
          </div>
        </label>
        <label> Confirmar contraseña:
          <div style="display: flex;">
            <input id="confirmPasswordInput" type='password' class="form-control" bind:value={player.confirmpassword} on:keypress={validateSpaceKey} placeholder="Confirmar contraseña" autocomplete="off" />
            <button class="btn" on:click={toggleConfirmPasswordHide}><i class="bi bi-{showConfirmPassword ? 'eye' : 'eye-slash'}-fill"></i></button>
          </div>
        </label>
      {/if}
      <label>Telefono:<input class="form-control" bind:value={player.phone} on:keypress={isOnlyNumber} on:keypress={validateSpaceKey} placeholder="Teléfono" inputmode="numeric"/></label>
      <label>N° de documento:<input class="form-control" bind:value={player.document} on:keypress={isOnlyNumber} on:keypress={validateSpaceKey} placeholder="N° de documento" inputmode="numeric"/></label>
      <label>Fecha Nacimiento:<input type="date" class="form-control" bind:value={player.birthday} title="Fecha de Nacimiento" placeholder="Fecha Nacimiento"/></label>
      <label> Moneda:
        <!--
        <div class="currency-checkboxes">
          {#each userLoged.currencyISO as currency}
            <label><input type="checkbox" checked={player.currency.includes(currency)} on:change={() => toggleCurrency(currency)} />{currency}</label>
          {/each}
        </div>
        -->
        <select class="form-control" bind:value={player.currency}>
          {#each userLoged.currencyISO as currency}
          <option>{currency}</option>
          {/each}
        </select>
      </label>
      <label>
        Pais:
        <select
          bind:value={player.country}
          class="form-control"
          title="Seleccione su pais"
        >
          <option value="PE">Peru</option>
        </select>
      </label>
      <label>
        Rol de Usuario:
        <select bind:value={player.role} class="form-control" title="Rol">
          <option value="X">Retail</option>
          <option value="W">Web</option>
        </select>
      </label>
      <label>Apuesta Minima:<input class="form-control" bind:value={player.minBet} title="Apuesta Mínima" placeholder="Apuesta Mínima" on:keypress={validateSpaceKey} on:keypress={isOnlyNumber} inputmode="numeric" /></label>
      <label>Apuesta Maxima:<input class="form-control" bind:value={player.maxBet} title="Apuesta Máxima" placeholder="Apuesta Máxima" on:keypress={validateSpaceKey} on:keypress={isOnlyNumber} inputmode="numeric"/></label>
      <label>Estado:
        <select bind:value={player.status} class="form-control" title="Estado del usuario">
          <option value=1>Activo</option>
          <option value=2>Suspendido</option>
          <option value=0>Inactivo</option>
        </select>
      </label>
      <label>Información adicional:<input class="form-control" bind:value={player.info} title="Información adicional" placeholder="Información adicional"/></label>
    </div>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-primary btn-sm" on:click={save}>Guardar</button>
  </ModalFooter>
</Modal>

<style>
  label{
    width: 100%;
    color: black;
  }
  .currency-checkboxes {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .currency-checkboxes label {
    margin-right: 10px;
  }
  .btn{
    border: 1px solid #ccc;
  }
  @media only screen and (max-width: 1024px) {
    .new-player {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }
  }

  @media only screen and (min-width: 1025px) {
    .new-player {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 0.8rem;
      padding: 0.5rem;
    }
  }
</style>
