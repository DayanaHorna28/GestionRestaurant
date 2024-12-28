<script>
    import { fade } from 'svelte/transition';
    import EventManager from '../../js/EventManager';
    export let notify = {};
    let timer;

    const statusNotifier = (isActive) => {
        clearTimeout(timer);
        if(isActive === true) timer = setTimeout(() => { notify.open = false; }, 3000); 
    }
    $: statusNotifier(notify.open);
    EventManager.subscribe("notify", (event) => {
        notify.open = true;
        notify.message = event.msg;
        notify.type = event.mode || "success";
    });
    
</script>
    {#if notify.open}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="notify {notify.type}" on:mouseover={()=> notify.open = false} on:focus={()=> notify.open = false} transition:fade={{ delay: 75, duration: 150 }}  style="top: 1rem; right: 1rem;">
            <div class="notify__message">
                <div class="notify__icon"></div>
                <div class="notify__text">{notify.message}</div>
            </div>
            <div class="notify__timer">
                <div class="notify__progress-bar" transition:fade={{ delay: 0, duration: 0 }}></div>
            </div>
        </div>
    {/if}
<style>

.notify {
    position: fixed;
    z-index: 9999;
    color: white;
    border-radius: 0.5rem;
    margin: 1rem;
    font-size: 16px + 4;
}
.notify.success {
  background: #16a700;
}
.notify.error {
  background: #bd0101;
}
.notify.warning {
  background: #daf701;
}
.notify__message {
  display: grid;
  grid-template-columns: auto 1fr;
  padding: 0.5rem;
  align-items: center;
  gap: 0.75rem;
}
.notify__text {
  margin: 0.35rem 0;
}
.notify__timer {
  width: 100%;
  height: 3px;
  background: transparent;
  overflow: hidden;
}
.notify__progress-bar {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  animation: progress-bar 3s linear forwards;
}
@keyframes progress-bar {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}


</style>

