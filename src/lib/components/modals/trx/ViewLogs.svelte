<script>
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import alertify from "alertifyjs";
  import server from "../../../../server";
  import moment from "moment";
  import Loading from "../../Loading.svelte";
  import { ICONS } from "../../../../js/icons";

  export let showTrxLogs;
  export let logfilter;

  let logs = [];
  let params = {};
  let loading = true;
  let viewMoreParams = {};
  let showMore = false;

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
    params.nextTokenJava = "";
    params.nextTokenNode = "";
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
      params_.isAll = false;
      let data = await server.trx.logs(params_);
      loading = false;
      let logs_ = [];
      viewMoreParams.nextTokenJava = data.data.nextTokenJava;
      viewMoreParams.nextTokenNode = data.data.nextTokenNode;
      logs = await formatLogs(logs_, data.data.events, params_.search);
    } catch (error) {
      console.log(error);
      alertify.error("Error No se listo");
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
    try {
      showMore = true;

      const { data } = await server.trx.logs({ ...viewMoreParams });
      viewMoreParams.nextTokenJava = data.nextTokenJava;
      viewMoreParams.nextTokenNode = data.nextTokenNode;

      let logs_ = await formatLogs(logs, data.events, "");
      logs = logs.concat(logs_);
    } catch (error) {
      console.error("Error in viewMore function:", error);
    } finally {
      showMore = false;
    }
  };

  const onShowTrxLogs = () => (showTrxLogs = !showTrxLogs);
</script>

<Modal isOpen={showTrxLogs} toggle={onShowTrxLogs} size={"xl"}>
  <ModalHeader toggle={onShowTrxLogs}>Rastreo de Transacciones</ModalHeader>
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

        <button on:click={listLogs} class="btn btn-primary btn-sm" title="Buscar" disabled={loading} ><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: {loading ? 'inline-block' : 'none'};"></span>{@html ICONS.search}</button>
      </div>

      <div class="cont-data-log">
        {#if logs.length > 0}
          {#if loading}
            <Loading bind:loading />
          {:else}
            {#each logs as log}
              <p>{@html log}</p>
            {/each}
            <div class="btn-view-more">
              <button
                on:click={viewMore}
                class="btn btn-primary btn-sm right"
                disabled={showMore}
              >
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                  style="display: {showMore ? 'inline-block' : 'none'};"
                ></span>
                {showMore ? "Cargando..." : "Ver más"}
              </button>
            </div>
          {/if}
        {:else}
          <p>No se encontraron registros</p>
        {/if}
        <!--<div class="btn-view-more">
          <button on:click={viewMore} class="btn btn-primary btn-sm rigth"
            >Ver más</button >

        </div>-->
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
  .cont-data-log p {
    word-wrap: break-word;
  }
  .filter-logs {
    display: grid;
    grid-template-columns: 33% 20% 20% 20% 3%;
    align-items: center;
    width: 100%;
    gap: 0.3rem;
  }
  .cont-data-log p:nth-child(even) {
    background-color: rgba(242, 242, 242);
  }
  .cont-data-log p:hover {
    background-color: rgba(156, 164, 164);
    cursor: pointer;
  }
  .btn-view-more {
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 0.5rem;
  }
</style>
