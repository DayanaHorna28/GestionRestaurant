<script>
	//export let file;
	let  avatar, fileinput;
	export let onFileLoaded;
	
	const onFileSelected =(e)=>{
		console.log("tarjet",e.target);
 		let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
				avatar = e.target.result
				console.log(avatar);
				onFileLoaded(avatar);
            };
}
</script>

<button class="chan" on:click={()=>{fileinput.click();}}>Choose Image</button>
<input style="display:none" type="file" accept=".jpg, .jpeg, .png, .pdf" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >

<style>
	.chan{
		border-radius: 0.5rem;
		background-color: rgb(226, 226, 23);
		color: black;
		height: 2rem;
		width: 100%;
		border: none;
		cursor: pointer;
		
	}
</style>