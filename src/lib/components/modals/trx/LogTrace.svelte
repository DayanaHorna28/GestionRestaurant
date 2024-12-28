<script>
	import {ICONS} from './../../../../js/icons.js';
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  //import //alertify from "//alertifyjs";
  import server from "../../../../server";
  import moment from "moment";

  export let showLogTrace;
  export let logfilter;

  let logs = [];
  let params = {};
  let loading = true;
  let viewMoreParams = {};

  onMount(async () => {
    if (typeof logfilter == "object") {
      params.search = logfilter.search;
      params.from = moment(logfilter.from).format("YYYY-MM-DD HH:mm");
      params.to = moment(logfilter.to).format("YYYY-MM-DD HH:mm");
    } else {
      let actualDate = moment();
      params.search = "";
      let dateRest = actualDate.startOf("day");
      params.from = dateRest.format("YYYY-MM-DD HH:mm");
      params.to = moment().format("YYYY-MM-DD HH:mm");
    }
    const loadingPromise = listLogs();
    await loadingPromise;
    loading = false;
  });

  const listLogs = async () => {
    try {
      loading = true;
      var params_ = { ...params };
      params_.from = params_.from.replace("T", " ") + ":00";
      params_.to = params_.to.replace("T", " ") + ":59";
      let data = await server.trx.logs(params_);
      loading = false;
      let logs_ = [];
      viewMoreParams.nextTokenJava = data.data.nextTokenJava;
      viewMoreParams.nextTokenNode = data.data.nextTokenNode;
      logs = await formatLogs(logs_, data.data.events, params_.search);
    } catch (error) {
      console.log(error);
      //alertify.error("Error No se listo");
    }
  };

  const formatLogs = async (logs_, new_logs, search) => {
    var list = [...logs_];
    if (search == "") {
      list = new_logs;
    } else {
      var regex = new RegExp(search, "g");
      list = new_logs.map((l) => {
        l = l.replace(
          regex,
          `<span style="background:#E9AD00;padding: 1px 0 0 1px">${search}</span>`
        );
        return l;
      });
    }
    var cleanLogs = list.map((l) => {
      l = l.replace(
        /^.*(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}).*\[nio-5000-exec-\d+] .+ :/,
        "<b>$1:</b>"
      );
      return l;
    });
    return cleanLogs;
  };

  const viewMore = async () => {
    const { data } = await server.trx.logs({ ...viewMoreParams });
    viewMoreParams.nextTokenJava = data.nextTokenJava;
    viewMoreParams.nextTokenNode = data.nextTokenNode;
    let logs_ = await formatLogs(logs, data.events, "");
    logs = logs.concat(logs_);
    console.log(logs);
  };

  const onshowLogTrace = () => (showLogTrace = !showLogTrace);
</script>

<Modal isOpen={showLogTrace} toggle={onshowLogTrace} size={"xl"}>
  <ModalHeader toggle={onshowLogTrace}>Seguimiento a la Transacción</ModalHeader
  >
  <ModalBody>
    <div class="wrapp">
      <div class="filter-logs">
        <div>
          <span>Buscar:</span>
          <input
            class="form-control"
            type="text"
            placeholder="Buscar"
            bind:value={params.search}
          />
        </div>
        <div class="col">
          <span>Desde:</span>
          <input
            class="form-control"
            type="datetime-local"
            bind:value={params.from}
            step="1"
          />
        </div>
        <div class="col">
          <span>Hasta:</span>
          <input
            class="form-control"
            type="datetime-local"
            bind:value={params.to}
            step="1"
          />
        </div>
        <button
          class="btn btn-primary btn-sm"
          title="Buscar"
          on:click={listLogs}
        >
          {@html ICONS.search}
        </button>
      </div>

      <div class="cont-data-log">
        <div class="log-container">
          <div class="log-header">Bet Logs</div>
          <!--{#each logs.filter(log => log.type === 'bet') as log}
              <div class="log-step bet-step">
                <p>Date: {formatDate(log.date)}</p>
                <p>Status: {log.status}</p>
                <p>Details: {log.details}</p>
              </div>
            {/each}-->
        </div>

        <div class="log-container">
          <div class="log-header">Win Logs</div>
          {#each logs.filter((log) => log.type === "win") as log}
            <div class="log-step win-step">
              <p>Status: {log.status}</p>
              <p>Details: {log.details}</p>
            </div>
          {/each}
        </div>

        <div class="log-container">
          <div class="log-header">Refund Logs</div>
          {#each logs.filter((log) => log.type === "refund") as log}
            <div class="log-step refund-step">
              <p>Status: {log.status}</p>
              <p>Details: {log.details}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </ModalBody>
</Modal>

<style>
  .wrapp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .cont-data-log {
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-radius: 0.5rem;
    border: 1px solid black;
    padding: 1rem;
    overflow: auto;
    min-height: 3.5rem;
    max-height: 65vh;
    position: relative;
  }

  .filter-logs {
    display: grid;
    grid-template-columns: 33% 20% 20% 20% 3%;
    align-items: center;
    width: 100%;
    gap: 0.3rem;
  }

  .cont-data-log {
    border: none;
    box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .log-container {
    margin-bottom: 20px;
  }

  .log-header {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .log-step {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .log-step p {
    margin: 5px 0;
  }

  .win-step {
    background-color: #f6f6f6;
  }

  .refund-step {
    background-color: #fff3e6;
  }
</style>
