<script>
  import alertify from "alertifyjs";
  import backend from "./../../server";
  import { onMount } from "svelte";
  import SocketConnector from "./../../js/socket";

  export let onLogin;

  let username = "";
  let password = "";
  let loadLogin = false;
  let showPassword = false;

  const dataPassword = (e) => {
    password = e.target.value;
  };
  const togglePasswordHide = () => {
    showPassword = !showPassword;
  };

  onMount(async () => {

  });

  const login = async () => {
    try {
      loadLogin = true;
      let { data } = await backend.login(username, password);
      data.expireToken = data.claims.exp;
      delete data.claims;
      //SocketConnector.connect(data.platformId,data);
      sessionStorage.setItem("user", JSON.stringify(data));
      alertify.success("Bienvenido a Retail BO");
      onLogin(data);
    } catch (error) {
      console.log(error);
      alertify.error("CREDENCIALES INCORRECTAS");
      loadLogin = false;
    }
  };

  const loginEnter = (e) => {
    if (e.charCode === 13) login();
  };
</script>

<div class="bo-login-wrapp">
  <div class="auth">
      <div class="data-fields">
        <h3 class="center"><b>INICIO DE SESIÓN</b></h3>
        <div>
          <span>USUARIO:</span>
          <input
            id='username-txt'
            on:keypress={loginEnter}
            bind:value={username}
            placeholder="Usuario"
            autocorrect="off" 
            autocapitalize="off"
          />
        </div>
        <div>
          <span>CONTRASEÑA:</span>
          <div class="password">
            <input id='pass-txt' type={showPassword ? "text" : "password"} placeholder="Contraseña" on:keypress={loginEnter} on:input={dataPassword} autocorrect="off" autocapitalize="off" />
            <button class="btn {showPassword ? 'no-eye' : 'eye'}" name="passowrd" on:click={togglePasswordHide}/>
          </div>
        </div>

        <button on:click={login} disabled={loadLogin} class="btn btn-sm form-control-border">
          {#if loadLogin}
            <div class="loading">
              Cargando...
              <span />
              <span />
              <span />
            </div>
          {:else}
            <span>Login</span>
          {/if}
        </button>
      </div>
  </div>
</div>

<style>
  input {
    display: block;
    width: 100%;
    padding: 0.375rem 0.55rem;
    border-radius: 0.5rem;
    font-size: rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #ffffff94;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .bo-login-wrapp {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .password {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .eye {
    background-image: url("https://assetsapiusoft.s3.us-west-2.amazonaws.com/casinoPlatform/eye.png");
    background-color: #aaa;
    background-repeat: no-repeat;
    background-position: center;
  }
  .no-eye {
    background-image: url("https://assetsapiusoft.s3.us-west-2.amazonaws.com/casinoPlatform/no-eye.png");
    background-color: #ddd;
    background-repeat: no-repeat;
    background-position: center;
  }
  .auth {
    padding: 1rem;
    gap: 10px;
    max-width: 500px; /* Limita el ancho del contenedor en pantallas grandes */
    color: white;
    border-radius: 0.3rem;
    background: #000000c9;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    color: white;
    background: #A42813;
  }
  button:hover {
    box-shadow: 1px 1px 3px #690c0c;
    background: #690c0c;
  }
  .data-fields {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    justify-content: center;
    align-items: center;
  }
</style>
