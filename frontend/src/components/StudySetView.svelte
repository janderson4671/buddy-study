<script>
    export let subject;
    export let id;
    
    import { goto } from "$app/navigation"
    import { selectedStudySet } from "../stores/stores.js"

    function gotoStudySetEdit() {
        // Set the selected studyset globally so it can be edited
        $selectedStudySet = id;
        goto("/editStudySet");
    }
</script>

<div class="study_set_box" on:click={gotoStudySetEdit}>
    <h3>{subject}</h3>
</div>

<style>
    .study_set_box{
        width: 321px;
        height: 104px;
        margin: 5px;
        background-color: #799BF4;
        border-radius: 9px;
        text-align: center;
        align-self: center;

        font-family: Fira Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 18px;
		line-height: 22px;

		color: #FFFFFF;
    }
</style>