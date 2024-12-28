<script>
  import { onMount } from "svelte";
  import backend from "../server";
  import alertify from "alertifyjs";
  import * as XLSX from "xlsx";
  import GenericTrxReportByType from "../lib/GenericTrxReportByType.svelte";
  import moment from "moment";
  import { ICONS } from "../js/icons";

  let filters = {};
  let filter = {};
  let providers = [];
  let data = [];
  let type = "provider";
  let showModalBrandsList = false;
  let totalBetAmount = 0;
  let totalWinAmount = 0;
  let totalRefundAmount = 0;
  let totalUtility = 0;
  let selectedDayFrom;
  let selectedDayTo;
  let currencies = ["USD", "EUR", "PEN", "COP", "CLP", "ARS"];

  onMount(() => {
    filters = {
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      currency: "",
      groupby: "provider",
    };
    const fromDate = new Date(filters.from + "T00:00:00");
    selectedDayFrom = fromDate.getDate();
    const ToDate = new Date(filters.to + "T00:00:00");
    selectedDayTo = ToDate.getDate();
    listProvider();
    list();
  });

  const list = async () => {
    
    let params = { ...filters };
    if (params.provider === "") delete params.provider;
    if (params.currency === "") delete params.currency;
    try {
      const response = await backend.reports.list(params);
      const rawData = response.data;
      // Verificar si rawData es un objeto en lugar de una cadena JSON
      const rawReports =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      // Verificar si rawReports es un array o si hay un campo específico que contiene los informes
      const reportsArray = Array.isArray(rawReports)
        ? rawReports
        : rawReports.data || [];
      const transformedReports = transformReportData(reportsArray);
      data = transformedReports;
      data.forEach((e) => {
        e.bet_amount = e.bet_amount * -1;
        e.win_amount = e.win_amount * -1;
        e.refund_amount = e.refund_amount * -1;
        e.utility = e.utility * -1;
      });
      totalAmountsMovements();
    } catch (error) {
      alertify.error("Error al obtener el informe:", error);
    }
  };

  const totalAmountsMovements = () => {
    totalBetAmount = data
      .reduce((sum, e) => sum + (e.bet_amount || 0), 0)
      .toFixed(2);
    totalWinAmount = data
      .reduce((sum, e) => sum + (e.win_amount || 0), 0)
      .toFixed(2);
    totalRefundAmount = data
      .reduce((sum, e) => sum + (e.refund_amount || 0), 0)
      .toFixed(2);
    totalUtility = data
      .reduce((sum, e) => sum + (e.utility || 0), 0)
      .toFixed(2);
  };

  const listProvider = async () => {
    try {
      let response = await backend.games.listProvider();
      providers = response.data.sort();
      filters.provider = "";
      list();
    } catch (error) {
      alertify.error("Error al obtener la lista de proveedores:", error);
    }
  };

  const transformReportData = (rawReports) => {
    const reportsArray = Array.isArray(rawReports)
      ? rawReports
      : rawReports.data || [];
    const transformedData = {};
    for (const report of reportsArray) {
      const { provider, year, month, currency, movement, summary, count } =
        report;
      const key = `${provider}-${year}-${month}-${currency}`;

      if (!transformedData[key]) {
        transformedData[key] = {
          provider: provider,
          year: year,
          month: month,
          currency: currency,
          bet_count: 0,
          bet_amount: 0,
          win_count: 0,
          win_amount: 0,
          refund_count: 0,
          refund_amount: 0,
          utility: 0,
        };
      }

      switch (movement) {
        case "BET":
          transformedData[key].bet_count += count;
          transformedData[key].bet_amount += summary;
          break;
        case "WIN":
          transformedData[key].win_count += count;
          transformedData[key].win_amount += summary;
          break;
        case "REFUND":
          transformedData[key].refund_count += count;
          transformedData[key].refund_amount += summary;
          break;
        default:
          break;
      }
      transformedData[key].utility =
        transformedData[key].bet_amount +
        transformedData[key].win_amount +
        transformedData[key].refund_amount;
    }
    const transformedArray = Object.values(transformedData);
    return transformedArray;
  };

  const exportToExcel = () => {
    if (data.length === 0) alertify.warning("No hay datos para exportar.");
    try {
      const fileName = "informe_proveedor.xlsx";
      const excelData = data.map((item) => ({
        Proveedor: item.provider,
        Año: item.year,
        Mes: item.month,
        Moneda: item.currency,
        "Cantidad de Apuestas": item.bet_count,
        "Monto de Apuestas": item.bet_amount,
        "Cantidad de Ganancias": item.win_count,
        "Monto de Ganancias": item.win_amount,
        "Cantidad de Reembolsos": item.refund_count,
        "Monto de Reembolsos": item.refund_amount,
        "Utilidad Total": item.utility,
        "Total Bet": totalBetAmount,
        "Total Refund": totalRefundAmount,
        "Total Win": totalWinAmount,
        "total Utilidad": totalUtility,
      }));
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Informe");
      XLSX.writeFile(wb, fileName);
      alertify.success("Datos exportados correctamente.");
    } catch (error) {
      alertify.error("Error al exportar", error);
    }
  };

  const onDayFromChange = (event) => {
    const selectedDate = event.target.value;
    const localDate = new Date(selectedDate + "T00:00:00");
    selectedDayFrom = localDate.getDate();
  };

  const onDayToChange = (event) => {
    const selectedDate = event.target.value;
    const localDate = new Date(selectedDate + "T00:00:00");
    selectedDayTo = localDate.getDate();
  };

  const onShowBrandsList = (items) => {
    filter = items;
    showModalBrandsList = true;
  };
</script>

<div class="bo-wrapp-report-provider">
  <div>
    <div class="row">
      <div class="col">
        <span>Proveedor</span><!--namesite-->
        <select bind:value={filters.provider} class="form-control">
          <option value="">Todos</option>
          {#each providers as provider}
            <option value={provider}>{provider}</option>
          {/each}
        </select>
      </div>
      <div class="col">
        <span>Desde:</span>
        <input
          class="form-control"
          type="date"
          bind:value={filters.from}
          on:change={onDayFromChange}
        />
      </div>
      <div class="col">
        <span>Hasta:</span>
        <input class="form-control" type="date" bind:value={filters.to} on:change={onDayToChange}/>
      </div>
      <div class="col">
        <span>Moneda:</span>
        <select bind:value={filters.currency} class="form-control">
          <option value="">Todos</option>
          {#each currencies as currency}
            <option value={currency}>{currency}</option>
          {/each}
        </select>
      </div>
      <div class="col btn-control">
        <button on:click={list} class="btn btn-primary btn-sm">{@html ICONS.search}</button>
        <button on:click={exportToExcel} class="btn btn-success btn-sm">{@html ICONS.save}</button>
      </div>
    </div>
  </div>
  <div>
    <table class="table table-striped table-sm">
      <thead class="table-dark">
        <tr>
          <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">PROVEEDOR</th>
          <th style="padding-bottom: 1.2%" rowspan="2">AÑO</th>
          <th style="padding-bottom: 1.2%" rowspan="2">MES</th>
          <th style="padding-bottom: 1.2%" rowspan="2">MONEDA</th>
          <th style="text-align: center;" colspan="2">BET</th>
          <th style="text-align: center;" colspan="2">WIN</th>
          <th style="text-align: center;" colspan="2">REFUND</th>
          <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">UTILIDAD</th>
          <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">OPCIONES</th>
        </tr>
        <tr>
          <th style="text-align: center;">Cant.</th>
          <th style="text-align: center;">Monto</th>
          <th style="text-align: center;">Cant.</th>
          <th style="text-align: center;">Monto</th>
          <th style="text-align: center;">Cant.</th>
          <th style="text-align: center;">Monto</th>
        </tr>
      </thead>
      {#if data.length > 0}
        <tbody>
          {#each data as item}
            <tr>
              <td>{item.provider}</td>
              <td>{item.year}</td>
              <td>{item.month}</td>
              <td>{item.currency}</td>
              <td style="text-align: center; ">{item.bet_count}</td>
              <td style="text-align: end; color: {item.bet_amount >= 0 ? 'green' : 'red'}">{item.bet_amount.toFixed(2)}</td>
              <td style="text-align: center;">{item.win_count}</td>
              <td style="text-align: end; color: {item.win_amount >= 0 ? 'green' : 'red'}">{item.win_amount.toFixed(2)}</td>
              <td style="text-align: center;">{item.refund_count}</td>
              <td style="text-align: end; color: {item.refund_amount >= 0 ? 'green' : 'red'}">{item.refund_amount.toFixed(2)}</td>
              <td style="text-align: end; color: {item.utility >= 0 ? 'green' : 'red'}">{item.utility.toFixed(2)}</td>
              <td style="text-align: center;">
                <button on:click={() => onShowBrandsList(item)} class="btn btn-light btn-sm" title="Reporte por marca" >{@html ICONS.clipboard} </button>
              </td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <th style="text-align: end;" colspan="5">Total Bets</th>
            <td style="text-align: end; color: {totalBetAmount >= 0 ? 'green' : 'red'}">{totalBetAmount}</td>
            <th>Total Wins</th>
            <td style="text-align: end; color: {totalWinAmount >= 0 ? 'green' : 'red'}">{totalWinAmount}</td>
            <th>Total Refunds</th>
            <td style="text-align: end; color: {totalRefundAmount >= 0 ? 'green' : 'red'}">{totalRefundAmount}</td>
            <th>Total Utilidad</th>
            <td style="text-align: end; color: {totalUtility >= 0? 'green' : 'red'}">{totalUtility}</td>
          </tr>
        </tfoot>
      {:else}
        <tbody
          ><tr
            ><td colspan="13"
              ><span style="text-align: center;"
                >No se encontraron resultados</span
              ></td
            ></tr
          ></tbody
        >
      {/if}
    </table>
  </div>
</div>

{#if showModalBrandsList}
  <GenericTrxReportByType
    bind:selectedDayTo
    bind:selectedDayFrom
    {filter}
    bind:type
    bind:openModal={showModalBrandsList}
  ></GenericTrxReportByType>
{/if}

<style>
  .bo-wrapp-report-provider {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .btn-control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 1rem;
  }
</style>
