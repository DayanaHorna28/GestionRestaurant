<script>
    import {removeLink, setActiveLink} from "../linkStore.js";

    export let link
</script>


    <a href="{link.link}" on:click={() => setActiveLink(link.link)}>
        <div class="holder {(link.active ? 'active' : 'non-active')}">
            <span>{link.linkName}</span>
            <button on:click={() => removeLink(link.link)}>x</button>
        </div>
    </a>


<style>
    a {
        position: relative;
        text-decoration: none;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-top: solid rgb(198, 198, 198) 1px;
        border-right: solid rgb(198, 198, 198) 1px;
        border-left: solid rgb(198, 198, 198) 1px;
    }

    .holder {
        padding: 7px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        font-weight: bold;
    }

    .active {
        background: linear-gradient(#f1f1f1, #dcdcdc 50%, #eeeeee 3%, #e5e5e5);
        color: black;
        box-shadow: 0 1px whitesmoke;
    }

    .non-active {
        color: #414144;
        background: rgb(215, 215, 215);
        background: linear-gradient(#d3d3d3, #b4b4b4 50%, #818181 3%, #e5e5e5);
    }

    span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
    }

    button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        color: inherit;
        position: relative;
        top: -10px;
        left: 5px;
        font-weight: bold;
    }

</style>
