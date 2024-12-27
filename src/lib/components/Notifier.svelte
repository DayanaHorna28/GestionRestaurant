<script>
  import EventManager from "../../js/EventManager";
  let display = false;
  let message;
  let type;

  EventManager.subscribe("notify", (event) => {
    message = event.msg;
    type = event.mode || "success";
    display = true;
    setTimeout(() => {
      display = false;
    }, 4000);
  });

  function toggleDisplay() {
    display = false;
  }
</script>

{#if display}
  <div class="u-wrapp">
    <div class="u-notify u-notify-{type}">
      <div class="notify-content">{message}</div>
      <button class="u-close-notify" on:click={toggleDisplay}>x</button>
    </div>
  </div>
{/if}

<style>
  .u-notify-success::before {
    content: "✔";
  }
  .u-notify-error::before {
    content: "❗";
  }
  .u-notify-warning::before {
    content: "⚠";
  }
  .u-notify::before {
    position: absolute;
    left: 5px;
    top: 8px;
  }
  .u-notify {
    position: relative;
  }
  .notify-content {
    margin-left: 10px;
  }
  @media only screen and (max-width: 768px) {
    .u-wrapp {
      margin: 0 auto;
      width: 99vw;
      position: absolute;
      top: 1rem;
      height: auto;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .u-notify {
        padding: 10px;
        font-size: 1rem;
        background: #fafafa;
        color: #333;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        box-shadow: 1px 1px 5px #000;
        border-radius: 5px;
    }
    .u-close-notify {
      font-weight: bold;
      margin: 0 0 0 10px;
      border-radius: 50%;
      background: #bd352a;
      padding: 1px 5px;
    }
  }
  @media only screen and (max-width: 768px) and (orientation: landscape) {
    .u-wrapp {
      margin: 0 auto;
      width: 99vw;
      position: absolute;
      top: 1rem;
      height: auto;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .u-notify {
        padding: 10px;
        font-size: 1rem;
        background: #fafafa;
        color: #333;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        box-shadow: 1px 1px 5px #000;
        border-radius: 5px;
    }
    .u-close-notify {
      font-weight: bold;
      margin: 0 0 0 10px;
      border-radius: 50%;
      background: #bd352a;
      padding: 1px 5px;
    }
  }
  @media only screen and (min-width: 768px) {
    .u-wrapp {
      margin: 0 auto;
      width: 99vw;
      position: absolute;
      top: 1rem;
      height: auto;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .u-notify {
        padding: 10px;
        font-size: 1rem;
        background: #fafafa;
        color: #333;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        box-shadow: 1px 1px 5px #000;
        border-radius: 5px;
    }
    .u-close-notify {
      font-weight: bold;
      margin: 0 0 0 10px;
      border-radius: 50%;
      background: #bd352a;
      padding: 1px 5px;
    }
  }
</style>
