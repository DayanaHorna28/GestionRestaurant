<script>
    export let showMainLoading;
</script>
  
  {#if showMainLoading }
    <div id="nvscore-splash-screen">
      <div class="container">
        <div class="loader"></div>
      </div>
    </div>
  {/if}
  <style>
  
  @keyframes splashScreen-spin {
    from {
      transform: rotate(0);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  #nvscore-splash-screen {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #00000085;
    z-index: 99999;
    pointer-events: none;
    overflow: hidden;
  }
  #nvscore-splash-screen .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #nvscore-splash-screen .container .loader {
    position: relative;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #0aa1cf;
    animation: 2s splashScreen-spin linear infinite;
  }
  #nvscore-splash-screen .container .loader:before, #nvscore-splash-screen .container .loader:after {
    content: '';
    position: absolute;
    border-radius: 50%;
    border: 3px solid transparent;
  }
  #nvscore-splash-screen .container .loader:before {
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-top-color: #D8D8D8;
    animation: splashScreen-spin 2s linear infinite;
  }
  #nvscore-splash-screen .container .loader:after {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-top-color: #c72491;
    animation: splashScreen-spin 1s linear infinite;
  }
  
  </style>