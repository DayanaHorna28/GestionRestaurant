<script>
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { onMount } from "svelte";
  import alertify from "alertifyjs";
  import backend from "../server";
  import util from "../js/util";
  import * as XLSX from "xlsx";
  import { ICONS } from "../js/icons";

  let UTIL = util.getUtilities();

  export let openModal;
  export let type;
  export let filter;
  export let selectedDayTo;
  export let selectedDayFrom;

  let data = [];
  let totalBetAmount = 0;
  let totalWinAmount = 0;
  let totalRefundAmount = 0;
  let totalUtility = 0;
  let filters = {};
  let brands = [];
  let providers = [];
  let months = [
    { name: "Enero", number: "01" },
    { name: "Febrero", number: "02" },
    { name: "Marzo", number: "03" },
    { name: "Abril", number: "04" },
    { name: "Mayo", number: "05" },
    { name: "Junio", number: "06" },
    { name: "Julio", number: "07" },
    { name: "Agosto", number: "08" },
    { name: "Septiembre", number: "09" },
    { name: "Octubre", number: "10" },
    { name: "Noviembre", number: "11" },
    { name: "Diciembre", number: "12" },
  ];

  let openChildModal = false;
  let typeChild;
  let filterChild;

  let groupBy;

  onMount(() => {
    groupBy = groupbyType(type);
    filters = {
      from:
        filter.month !== undefined
          ? getMonthName(parseInt(filter.month, 10))
          : "",
      to:
        filter.month !== undefined
          ? getMonthName(parseInt(filter.month, 10))
          : "",
      groupby: groupBy,
      currency: filter.currency,
      client: filter.client,
      provider: filter.provider,
      brand: filter.brand,
    };
    console.log("From:", selectedDayFrom);
    console.log("To:", selectedDayTo);

    list();
  });

  const getMonthName = (monthNumber) =>
    months.find((month) => month.number === monthNumber.toString())?.name || "";

  //La variable Type es de que vista llega la solicitud (reporte)
  const groupbyType = (type) => {
    let grouped = "";
    switch (type) {
      case "client":
        grouped = UTIL.provider;
        break;
      case "provider":
        grouped = UTIL.brand;
        break;
      case "brand":
        grouped = UTIL.game;
        break;
    }
    return grouped;
  };

  const asignedArrayType = () => {
    let arr = [];
    if (type == "client") {
      arr = providers;
    } else if (type == "provider") {
      arr = brands;
    }
    return arr;
  };
  const asignedTitle = () => {
    let titleFilter_ = "";
    if (type == "client") {
      titleFilter_ = "Proveedor";
    } else if (type == "provider") {
      titleFilter_ = "Marca";
    } else {
      titleFilter_ = "Juego";
    }
    return titleFilter_;
  };

  const list = async () => {
    let params = { ...filters };
    if (params.client == "" || !params.client) delete params.client;
    if (params.provider == "" || !params.provider) delete params.provider;
    if (params.brand == "" || !params.brand) delete params.brand;
    if (params.from && params.to) {
      params.from = `${filter.year}-${filter.month}-${selectedDayTo}`;
      params.to = `${filter.year}-${filter.month}-${selectedDayFrom}`;
    }
    try {
      const response = await backend.reports.list(params);
      const rawData = response.data;
      const transformedArray = transformReportData(rawData);
      data = transformedArray;
      data.forEach((e) => {
        e.bet_amount = e.bet_amount * -1;
        e.win_amount = e.win_amount * -1;
        e.refund_amount = e.refund_amount * -1;
        e.utility = e.utility * -1;
      });

      totalAmountsMovements();
      //await listBrands();
      //await listProviders();
      //arrType = asignedArrayType();
    } catch (error) {
      alertify.error("Error al obtener el informe:", error);
    }
  };

  const transformReportData = (rawData) => {
    const reportArray = rawData.data;
    const transformedData = {};
    for (const item of reportArray) {
      const {
        provider,
        brand,
        game,
        year,
        month,
        currency,
        movement,
        summary,
        count,
      } = item;
      const key = `${provider || brand || game}-${year}-${month}`;

      if (!transformedData[key]) {
        transformedData[key] = {
          provider,
          brand,
          game,
          year,
          month,
          currency,
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

  /*const listBrands = async()=>{
        let params = {
        provider: filter.provider
        }
        let response = await backend.brands.list(params);
        brands = response.data;
    }*/

  /*const listProviders = async()=>{
        let params = {
            clientName: filter.client
        }
        console.log(params.clientName);
        let response = await backend.provider.listByClientByName(params);
        providers = response.data;
        console.log("providers: " + providers);
    }*/

  const exportToExcel = () => {
    if (data.length === 0) {
      alertify.warning("No hay datos para exportar.");
    } else {
      try {
        const fileName = "informe_proveedor.xlsx";
        const excelData = data.map((item) => ({
          Group: item[groupBy],
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
        alertify.error("Error: " + error);
      }
    }
  };

  const showChildModal = (item) => {
    if (item.provider) filter.provider = item.provider;
    if (item.brand) filter.brand = item.brand;
    if (item.game) filter.game = item.game;
    switch (type) {
      case "client":
        typeChild = "provider";
        break;
      case "provider":
        typeChild = "brand";
        break;
      case "brand":
        typeChild = "game";
        break;
    }
    filterChild = { ...filter };
    openChildModal = true;
  };

  const changeFilter = () => {
    filters[groupBy] = filters.search;
    console.log("filters", filters);
  };

  const onShowDataModal = () => (openModal = !openModal);
</script>

<Modal isOpen={openModal} toggle={onShowDataModal} size={"xl"}>
  <ModalHeader toggle={onShowDataModal}>
    Reporte {type}
    {filter.client} agrupado por {groupbyType(type)}
  </ModalHeader>
  <ModalBody>
    <div class="container">
      <div class="row-bo">
        <!--div class="col">
          <span>{asignedTitle()}:</span>
          <select class="form-control" bind:value={filters.search} on:change={changeFilter}>
            <option value="">Todos</option>
            {#each arrType as item}
              <option value={item}>{item}</option>
            {/each}
          </select>
        </!--div-->
        <div class="col">
          <span>Desde:</span>
          <input class="form-control" type="date" bind:value={filters.from} on:change={onDayFromChange}/>
        </div>
        <div class="col">
          <span>Hasta:</span>
          <input class="form-control" type="date" bind:value={filters.to} on:change={onDayToChange}/>
        </div>
        <div class="col btn-control">
          <button class="btn btn-primary btn-sm" on:click={list}>{@html ICONS.search}</button>
          <button class="btn btn-success btn-sm" on:click={exportToExcel}>{@html ICONS.save}</button>
        </div>
      </div>
      <div>
        <table class="table table-striped table-sm">
          <thead class="table-dark">
            <tr class="bo-table-title">
              <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">{asignedTitle()}</th>
              <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">Fecha</th>
              <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">Moneda</th>
              <th style="text-align: center;" colspan="2">BET</th>
              <th style="text-align: center;" colspan="2">WIN</th>
              <th style="text-align: center;" colspan="2">REFUND</th>
              <th style="text-align: center; padding-bottom: 1.2%" rowspan="2">Utilidad</th>
              <th rowspan="2">-</th>
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
                  <td>{item[groupBy]}</td>
                  <td>{item.year}-{item.month}</td>
                  <td>{item.currency}</td>
                  <td style="text-align: center; ">{item.bet_count}</td>
                  <td style="text-align: end; color: {item.bet_amount >= 0 ? 'green' : 'red'}">{item.bet_amount.toFixed(2)}</td>
                  <td style="text-align: center;">{item.win_count}</td>
                  <td style="text-align: end; color: {item.win_amount >= 0 ? 'green' : 'red'}">{item.win_amount.toFixed(2)}</td>
                  <td style="text-align: center;">{item.refund_count}</td>
                  <td style="text-align: end; color: {item.refund_amount >= 0 ? 'green' : 'red'}">{item.refund_amount.toFixed(2)}</td>
                  <td tyle="text-align: end; color: {item.utility >= 0 ? 'green' : 'red'}">{item.utility.toFixed(2)}</td>
                  <td style="text-align: center;"><button class="btn btn-light btn-sm" on:click={() => showChildModal(item)}>{@html ICONS.clipboard}</button></td>
                </tr>
              {/each}
            </tbody>
            <tfoot>
              <tr>
                <th style="text-align: end;" colspan="4">Total Bets</th>
                <td style="text-align: end; color: {totalBetAmount >= 0 ? 'green' : 'red'}">{totalBetAmount}</td>
                <th>Total Wins</th>
                <td
                  style="text-align: end; color: {totalWinAmount >= 0
                    ? 'green'
                    : 'red'}"
                >
                  {totalWinAmount}
                </td>
                <th>Total Refunds</th>
                <td
                  style="text-align: end; color: {totalRefundAmount >= 0
                    ? 'green'
                    : 'red'}"
                >
                  {totalRefundAmount}
                </td>
                <th>Total Utilidad</th>
                <td
                  style="text-align: end; color: {totalUtility >= 0
                    ? 'green'
                    : 'red'}"
                >
                  {totalUtility}
                </td>
              </tr>
            </tfoot>
          {:else}
            <tbody>
              <tr>
                <td colspan="13">
                  <span style="text-align: center;"
                    >No se encontraron resultados</span
                  >
                </td>
              </tr>
            </tbody>
          {/if}
        </table>
      </div>
    </div>
  </ModalBody>
</Modal>

{#if openChildModal}
  <svelte:self
    bind:openModal={openChildModal}
    type={typeChild}
    filter={filterChild}
  />
{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .btn-control {
    text-align: end;
  }
</style>
