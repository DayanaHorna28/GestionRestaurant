<script>
  import ConfigCampaing from './../lib/components/modals/bonus/ConfigCampaing.svelte';
  import { onMount } from "svelte";
  import { ICONS } from "../js/icons";
  import backend from "../server";
  import CampaingFormat from '../lib/components/modals/bonus/CampaingFormat.svelte';
  import AssignPlatform from '../lib/components/modals/bonus/AssignPlatform.svelte';
  import moment from 'moment';

    let filters = { page: 1, xpage: 50 };
    let platforms = [];
    let campaign = {};
    let showFormCamping = false;
    let showConfCamping = false;
    let showFormAssignPlatform = false;
    let campaigns = {};
    let status = [
        { value: "", label: "Todos" },
        { value: 0, label: "Desactivo" },
        { value: 1, label: "Activo" }
    ];
    onMount(()=>{
        //authcampaign();
        let actualDate = moment();
        let dateRest = actualDate.subtract(0, "days");
        filters.start = dateRest.format("YYYY-MM-DD");
        filters.end = moment().format("YYYY-MM-DD");
        listPlatforms();
        listCampings();
    });

    const authcampaign = async ()=>{
        let response = await backend.freespin.authCampaign();
        console.log("Auth campaign:", response);
    }

    const syncCampaign = async ()=>{
        await backend.freespin.syncCampaign();
        listCampings();
    }

    const listCampings = async()=>{
        let params = {...filters};
        if(params.clientId =="") delete params.clientId;
        if(params.search == "") delete params.search;
        if(params.start) delete params.start;
        if(params.end) delete params.end;
        if(params.status == "") delete params.status;
        let response = await backend.freespin.listCampaigns(params);
        campaigns = response;
    };

    const searchEnter = (e) => {
        if (e.charCode === 13);
    };

    const listPlatforms = async () => {
        let response = await backend.freespin.listPlatforms();
        platforms = response.data;
    };

    const newAssignPlatform = () =>{
        showFormAssignPlatform = true;
    }
   
    const confCampaign = () => {
        showConfCamping = true;
    };
    const onEditCampaign = (item) => {
        campaign = item;
        showFormCamping = true;
    };
</script>
<div class="wrapp">
    <div class="menu-filter">
        <div class="filter-games">
            <span>Plataforma:</span>
            <div style="display: flex; flex-direction: row; gap: 0.5rem;">
                <select bind:value={filters.clientId} class="form-control">
                    <option value="">Todos</option>
                    {#each platforms as platform}
                        <option value={platform.clientId}>{platform.name}</option>
                    {/each}
                </select>
                <button on:click={() => newAssignPlatform()} class="btn btn-pink btn-sm">{@html ICONS.addCircle}</button>
            </div>
        </div>
        <div class="filter-games date-form">
            <span>Desde:</span>
            <input class="form-control" type="date" bind:value={filters.start} />
        </div>
        <div class="filter-games date-form">
            <span>Hasta:</span>
            <input class="form-control" type="date" bind:value={filters.end} />
        </div>
        <div class="filter-games">
            <span>Estado:</span>
            <select bind:value={filters.status} class="form-control">
                {#each status as statu}
                    <option value={statu.value}>{statu.label}</option>
                {/each}
            </select>
        </div>
        <div class="filter-games">
            <div style="display: flex; flex-direction: row; gap: 0.5rem;">
                <input on:keypress={searchEnter} bind:value={filters.search} class="form-control" placeholder="Buscar" />
                <button on:click={listCampings} class="btn btn-pink btn-sm" title="Buscar" >{@html ICONS.search}</button>
            </div>
        </div>
        <div class="filter-games">
            <button on:click={syncCampaign} class="form-control btn-pink">SINCRONIZACIÓN</button>
        </div>
    </div>
    <div class="container-table">
        <div style="overflow-x: auto;">
            <table size="sm" class="table table-striped table-sm">
                <thead>
                    <tr>
                        <th>CODE</th>
                        <th>NOMBRE</th>
                        <th>CLIENTE</th>
                        <th>F. INICIO</th>
                        <th>F. FIN</th>
                        <th>TIPO</th>
                        <th>ESTADO</th>
                        <th class="center">-</th>
                    </tr>
                </thead>
                <tbody style="min-height: 80px;">
                    {#if campaigns.data}
                        {#each campaigns.data as campaign}
                            <tr>
                                <td>{campaign.code}</td>
                                <td>{campaign.name}</td>
                                <td>{platforms.find(platform => platform.clientId === campaign.clientId)?.name || "No asignado"}</td>
                                <td>{campaign.startDate != null ? moment(campaign.startDate).format("DD/MM/YYYY"): "FALTA ASIGNAR FECHA"}</td>
                                <td>{campaign.endDate != null ? moment(campaign.endDate).format("DD/MM/YYYY"): "FALTA ASIGNAR FECHA"}</td>
                                <td>{campaign.type == 1 ? "MANUAL" : "AUTOMATICO"}</td>
                                <td><button class="btn btn-sm {campaign.status == 1 ? "habilitado" : "expirado"}">{campaign.status == 1 ? "HABILITADO" : "EXPIRADO"}</button></td>
                                <td>
                                    <button on:click={confCampaign} class="btn btn-sm btn-ligth" style="border: 1px solid black; color: #FF1493;">{@html ICONS.config}</button>
                                    <button on:click={() => onEditCampaign(campaign)} class="btn btn-light btn-sm" title="Opcion de Juegos" style="border: 1px solid black; color: #FF1493;">{@html ICONS.edit}</button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

{#if showFormCamping}
  <CampaingFormat bind:campaign bind:showFormCamping></CampaingFormat>
{/if}

{#if showFormAssignPlatform}
  <AssignPlatform bind:showFormAssignPlatform></AssignPlatform>
{/if}

{#if showConfCamping}
   <ConfigCampaing bind:showConfCamping></ConfigCampaing>
{/if}
<style>

    .menu-filter{
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.5rem;
    }
    .filter-games {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: end;
        width: 100%;
        gap: 0.3rem;
    }
    .container-table{
        padding: 0.5rem;
    }
    .table {
        border-collapse: collapse;
        width: 100%;
        border-radius: 0.5rem;
        border: 1px solid #fc0074;
    }
    .table thead{
        background: #ffffff;
        font-weight: bold;
        border-radius: 0.5rem;
    }
    .habilitado {
        background-color: green;
        color: white;
    }

    .expirado {
        background-color: gray;
        color: white;
    }
    .btn-pink{
        background-color: #FF1493;
        color: white;
    }
</style>