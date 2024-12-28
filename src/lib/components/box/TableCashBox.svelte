<script>
import PrintCashBox from "../box/PrintCashBox.svelte";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
import Pagination from "../pagination/Pagination.svelte";
import alertify from "alertifyjs";
import moment from "moment";
import { onMount } from "svelte";
import backend from "../../../server";
export let showModalTableCashBox;
export let userLoged;

let filters = {};
let cashBox = {list: []};
let showModalPrintCashBox = false;
let cashBox_print = {};
let CASH_BOX_STATUS_OPEN = 1
let CURRENCY_SHIFT= 0
let currency = [...userLoged.currencyISO]

onMount(() => {
    filters = {
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      currency: '',
      status: ''
    };
    listCashBox();
  });   

const onchangeModalPrintCashbox = (item)=> {
    showModalPrintCashBox = true
    cashBox_print = {... item}
}

const listCashBox= async (params = {}) => {
    try {
        params= { ... filters}
        params.userId = userLoged.userId
        params.platformId=userLoged.platformId
        if (params.currency == "") delete params.currency;
        if (params.status == "") delete params.status;
        console.log("params", params);
        let {data} = await backend.cashBox.list(params);
        cashBox = data
        console.log("cashBox", cashBox);
        cashBox.list.map( (e) => {
                e.openDateCashBox = moment.utc(e.openDateCashBox).format('YYYY-MM-DD HH:mm');
                e.closeDateCashBox = e.closeDateCashBox ? moment.utc(e.closeDateCashBox).format('YYYY-MM-DD HH:mm') : null;
        });

    } catch (error) {
        alertify.error("ERROR! "+ error);
    }
}

const onPageClick = async (page) => {
    filters.page = page;
    listCashBox();
  };

const toggle = () => (showModalTableCashBox = !showModalTableCashBox);

</script>

<Modal isOpen={showModalTableCashBox} {toggle} size={"xl"} class="black">
    <ModalHeader {toggle}><span class="title">Listado de Caja</span> </ModalHeader>
    <ModalBody>
        <div class="navbar-filters">
            <div class="col">
             <span style="color: black;">Desde:</span>
             <input class="form-control" type="date" bind:value={filters.from} />
            </div>
            <div class="col">
             <span style="color: black;">Hasta:</span>
             <input class="form-control" type="date" bind:value={filters.to} />
            </div>
            <div class="col">
                <span style="color: black;">Moneda:</span>
                <select bind:value={filters.currency} class="form-control">
                    <option value=''>TODOS</option>
                    {#each currency as currencyISO}
                        <option value={currencyISO}  >{currencyISO}  </option>
                    {/each}
                </select>
            </div>
            <div class="col">
                <span style="color: black;">Estado:</span>
                <select bind:value={filters.status} class="form-control">
                    <option value=''>TODOS</option>
                    <option value=1>APERTURA</option>
                    <option value=0>CIERRE</option>
                </select>
            </div>
            <div class="search"><button on:click={listCashBox} class="btn btn-primary btn-sm" title="Filtrar"><i class="bi bi-search" /></button></div>
        </div>
        <div class="container-bo-table mt-4" style="overflow-x: auto;">
            <table class="table table-sm responsive table-hover">
                <thead class="table-dark">
                    <tr>
                        <th class="centered">Cajero</th>
                        <th class="centered">Moneda</th>
                        <th class="centered">Fecha de apertura</th>
                        <th class="centered">Cantidad Inicial</th>
                        <th class="centered">Fecha Cierre</th>
                        <th class="centered">Cantidad final</th>
                        <th class="centered">Estado</th>
                        <th class="center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each cashBox.list as value}
                    
                        <tr>
                            <td>{value.user[0].username}</td>
                            <td class="centered">{value.currency}</td>
                            <td class="centered">{value.openDateCashBox}</td>
                            <td class="rigth">{value.amountOpen.toFixed(2)}</td>
                            <td class="centered">{value.closeDateCashBox?value.closeDateCashBox:""}</td>
                            <td class="rigth">{value.amountClose.toFixed(2)}</td>
                            <td class="centered">{value.status==CASH_BOX_STATUS_OPEN? 'Apertura':'Cierre'}</td>
                            <div class="centered"><button class="btn btn-ligth btn-sm" on:click={()=> onchangeModalPrintCashbox(value)}><i class="bi bi-printer icon-small" title="Imprimir Caja"></i></button></div>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        
        {#if cashBox.total != undefined}
            
        <Pagination
            bind:total={cashBox.total}
            bind:xpage={cashBox.xpage}
            bind:current={cashBox.page}
            {onPageClick}/>
        {/if}
        
       

    </ModalBody>
</Modal>

{#if showModalPrintCashBox}
  <PrintCashBox  bind:showModalPrintCashBox  bind:userLoged  bind:cashBox_print/>
{/if}


<style>
    .search{
        display: flex;
        flex-direction: row;
        align-items: end;
        gap: 0.5rem;
    }
    .table{
        color: #000;
    }

    .centered {
        text-align: center;
    }

    .rigth{
        text-align: right;
    }

    @media only screen and (max-width: 1024px) {
        .navbar-filters {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: end;
        align-items: end;
        gap: 0.5rem;
        width: 100%;
    }
    }
    @media only screen and (min-width: 1025px) {
        .navbar-filters {
        display: flex;
        flex-direction: row;
        justify-content: end;
        gap: 0.5rem;
        width: 100%;
    }
    }
</style>