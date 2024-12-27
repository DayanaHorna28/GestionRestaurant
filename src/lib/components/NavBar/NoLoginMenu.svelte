<script>
  import { onMount } from "svelte";

  export let onShowLoginModal;
  export let onShowUserCreation;
  export let onSubmitted;
  export let onOpenLogin;
  export let onOpenSignup;
  export let user = {};

  let username = user && user.usernme;
  let password = user && user.password;

  const loginEnter = (e) => {
    if (e.charCode === 13) onLoginClick();
  };

  const onLoginClick = async () => {
    if (!username && user.username) username = user.username;
    if (!password && user.password) password = user.password;

    if( !username || !password ){ onShowLoginModal(); return;}
    let info = {username, password}
    onSubmitted(info)
  };

  onMount(() => {
    if (user == null) {
      user = {};
    }
  });

</script>

<div class="u-main-no-login">
 <div class="Ganawin" style="    display: flex;
 gap: 10px;">
  <!--img class="imgss2" src="https://assets.apiusoft.com/generic_imgs/flags/chl.png" alt=""-->
  <button class="btn login" on:click={onOpenLogin}>Acceso</button>
  <button class="btn signup" on:click={onOpenSignup}>Registro</button>
 </div>
</div>

<style>
.Ganawin  .btn.signup{
            background: #f5c20a;
            box-shadow: 0 0 6px #f5c20a, inset 0 -6px 10px #f5c20a, inset 0 6px 10px hsla(0deg, 0%, 100%, 0.45), inset 0 0 11px #f5c20a;
            font-size: 16px;
            font-weight: 600;
        }
.Ganawin{
  background: transparent;
}
.Ganawin .btn.login {
    background: #562d76;
    box-shadow: 0 0 6px #562d76, inset 0 -6px 10px #562d76, inset 0 6px 10px hsla(0, 0%, 100%, 0.45), inset 0 0 11px #562d76;
}
.Ganawin .imgss2{
  width: 2.75rem;
  border-radius: 100%;
  border: 4px solid #f54b00;
}
  button{
    font-family: inherit;
  }
  body{
    font-family: Roboto,sans-serif;
  }
  @media only screen and (max-width: 999px) {
    .imgss2{
      display: none;
    }
    .u-main-no-login {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      background-color: transparent;
      padding-right: 0.2rem;
      height: 2rem;
      gap: 1.5rem;
      margin-left: 0.5rem;
    }
    .u-second {
      display: none;
    }
    .u-buttons {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      justify-content: space-between;
      align-items: center;
      height: 80%;
    }

  }

  @media only screen and (min-width: 1000px) {
    .Ganawin .btn.login,.Ganawin .btn.signup{
      width: 6rem;
    }
    .u-main-no-login {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      background-color: transparent;
      margin-right: 1rem;
      height: 2rem;
      gap: 1.5rem;
    }
    .u-input-second {
      height: 1.6rem;
      border-radius: 0.4rem;
      background-color: #000;
      border: 1px solid #3d3d4c;
      color: white;
      padding-left: 0.5rem;
    }
    .u-input-third {
      height: 1.6rem;
      border-radius: 0.4rem;
      background-color: #000;
      border: 1px solid #3d3d4c;
      color: white;
      padding-left: 0.5rem;
    }
    .u-second {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      height: 2rem;
    }
    .u-buttons {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      justify-content: space-between;
      align-items: center;
      height: 1.8rem;
    }
    
  }
  .button-star {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.45rem;
      border: none;
      color: black;
      background-color: #f54b00;
      font-size: 0.8rem;
      width: max-content;
    }
    .button-check-in {
      display: flex;
      color: white;
      border: none;
      padding: 0.45rem;
      background-color: #004a14;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
</style>
