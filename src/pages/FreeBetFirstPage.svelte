<script>
  import ConfigCampaing from '../lib/components/modals/bonus/ConfigCampaing.svelte';
  import { onMount } from "svelte";
  import { ICONS } from "../js/icons";
  import backend from "../server";
  import CampaingFormat from '../lib/components/modals/bonus/CampaingFormat.svelte';
  import AssignPlatform from '../lib/components/modals/bonus/AssignPlatform.svelte';
  import moment from 'moment';
  import FreeBetFormat from '../lib/components/modals/freebets/FreeBetFormat.svelte';

    let filters = { page: 1, xpage: 50 };
    let platforms = [];
    let platform = {};
    let showFormFreeBet = false;
    
    onMount(()=>{
        listPlatforms();
    });

    const searchEnter = (e) => {
        if (e.charCode === 13);
    };

    const listPlatforms = async () => {
        let params = { ...filters };
        if (params.status === "") delete params.status;
        if (params.search === "") delete params.search;
        let response = await backend.freespin.listPlatforms(params);
        platforms = response.data;
        console.log("platforms: ", platforms);
        
    };

    const onEditFreeBet = (item) => {
        platform = item;
        showFormFreeBet = true;
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
            </div>
        </div>
        <div class="filter-games">
            <div style="display: flex; flex-direction: row; gap: 0.5rem;">
                <input on:keypress={searchEnter} bind:value={filters.search} class="form-control" placeholder="Buscar" />
                <button on:click={listPlatforms} class="btn btn-pink btn-sm" title="Buscar" >{@html ICONS.search}</button>
            </div>
        </div>
    </div>
    <div class="container-table">
        <div style="overflow-x: auto;">
            <table size="sm" class="table table-striped table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CODE</th>
                        <th>HOME</th>
                        <th>NOMBRE</th>
                        <th class="center">-</th>
                    </tr>
                </thead>
                <tbody style="min-height: 80px;">
                    {#if platforms}
                        {#each platforms as platform}
                            <tr>
                                <td class="sm">{platform.siteId}</td>
                                <td class="sm">{platform.clientId}</td>
                                <td class="sm">{platform.name}</td>
                                <td>
                                    <button on:click={() => onEditFreeBet(platform)} class="btn btn-light btn-sm" title="Opcion de Juegos" style="border: 1px solid black; color: #FF1493;">{@html ICONS.edit}</button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

{#if showFormFreeBet}
  <FreeBetFormat bind:platform bind:showFormFreeBet></FreeBetFormat>
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