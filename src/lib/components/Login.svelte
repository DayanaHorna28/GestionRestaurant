<script>
  import Configuration from "../../config";
  import backend from "../../server";
  import alertify from "alertifyjs";

  export let onLogin;

  let username = "";
  let password = "";

  const conf = Configuration.getConfiguration();

  const loginEnter = (e) => {
    if (e.charCode === 13) login();
  };

  const login = async () => {
    try {
      const { data } = await backend.login(username, password);
      let loginData = { username, access_token: data.access_token };
      onLogin(loginData);
      alertify.success("BIENVENIDO, " + username);
    } catch (error) {
      alertify.error("CREDENCIALES INCORRECTAS")
    }
  };
</script>

<div class="auth">
  <img
    width="100px"
    src="https://assetsapiusoft.s3.us-west-2.amazonaws.com/bo_fontend/logo_small.png"
    alt=""
  />
  <h3>Bienvenido a BO-Universal</h3>
  <input
    class="form-control"
    type="text"
    on:keypress={loginEnter}
    bind:value={username}
    placeholder="Usuario"
  />
  <input
    class="form-control"
    type="password"
    on:keypress={loginEnter}
    bind:value={password}
    placeholder="Password"
  />
  <button class="btn" on:click={login}>Login</button>
</div>

<style>
  .auth {
    position: absolute;
    top: 30%;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: rgb(0, 0, 0);
    border-radius: 0.3rem;
    background: white;
    text-align: center;
  }
  button {
    width: 200px;
    margin: 0 auto;
    background: #ff007b;
    color: white;
  }

  button:hover {
    background-color: #ff007b;
    box-shadow: 1px 1px 3px #000020;
  }
</style>
