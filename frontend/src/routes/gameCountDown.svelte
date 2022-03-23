<script>
    import { goto } from "$app/navigation";

    var countDown = 10;

    async function beginGame() {
        goto("./gameQuestion");
    }


</script>

    <div class="count_down">
        <h1>{countDown}<h1>
    </div>
    <div class="count_down">
        <button on:click={beginGame}>Next</button>
    </div>


<style>

    .count_down {
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-radius: auto;
        justify-content: center;
    }

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">