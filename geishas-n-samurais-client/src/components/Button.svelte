<script>
    export let title = "";
    export let disabled = false;
    export let onClick = () => {};

</script>

<button class="samurai-button" disabled={disabled} on:click={(e) => onClick && onClick(e)}> {title} </button>

<style>
    button {
        border: 0;
    }

    .samurai-button {
        border-radius: 5px;
        background-color: cadetblue;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 8px;
        cursor: pointer;
        
        &:disabled {
            color: lightgray;
            background-color: gray;
            opacity: 0.5;
        }
    }
</style>