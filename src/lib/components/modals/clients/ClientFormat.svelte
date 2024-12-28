<script>
  import { onMount } from "svelte";
  import {
    ModalBody,
    ModalFooter,
    ModalHeader,
    Modal,
  } from "sveltestrap";
  import backend from "../../../../server";
  import moment from "moment";

  export let client;
  export let list;
  export let showFormClient;

  let status = [
    { value: 1, name: "Activo" },
    { value: 2, name: "Desactivo" },
  ];
  let isProd = [
    {value: 1, name: "PRODUCCIÓN"},
    {value: 1, name: "SIGUE EN TESTING"}
  ]
  let isSaving = false;

  onMount(() => {
    if (client.startdate == null) client.startdate = moment().format("YYYY-MM-DD");
    if (client.enddate == null) client.enddate = moment().add(5, "year").calendar();
    client.startdate = moment(client.startdate).add(1, 'day').format("YYYY-MM-DD");
    client.enddate = moment(client.enddate).add(1, 'day').format("YYYY-MM-DD");
    client.status = 1;
    client.isProd = 1;
    client.secret = 123;
  });

  const saveClient = async () => {
    if (!client.code) return alert("Ingrese el código");
    if (!client.identitynumber)  return alert("Ingrese el numero de identificación");
    if (!client.businessname) return alert("Ingrese el business name");
    if (!client.startdate) return alert("Ingrese la fecha de inicio");
    if (isNaN(client.status)) return alert("Ingrese el estado");
    if (!client.home) return alert("Ingrese el Home");
    isSaving = true;
    try {
      let client_ = {
        ...client,
        namesite: client.businessname,
        platform: 1,
      }
      await backend.client.save(client_);
      isSaving = false;
      list();
    } catch (error) {
      alert("Error al Guardar cliente");
    }
    showFormClient = false;
  };

  const validateCode = (e) => {
    const codeField = e.target.name === 'code';
    const identityNumberField = e.target.name === 'identitynumber';
    let validateCode = /^[A-Za-z]*$/.test(e.key);
    let validateIdentityNumber = /^[A-Za-z0-9]*$/.test(e.key);

    if (codeField) {
      if (!validateCode || client.code.length >= 4) {
        e.preventDefault();
        if (client.code.length >= 4) alert('El código no puede tener más de 4 letras.');
      }
    }

    if (identityNumberField) {
      if (!validateIdentityNumber || client.identitynumber.length >= 13) {
        e.preventDefault();
        if (client.identitynumber.length >= 13) alert('El número de identidad no puede tener más de 13 caracteres.');
      }
    }
  };

  const convertToUppercase = (e) => {
    e.target.value = e.target.value.toUpperCase();
  };

  const onshowModalClient = () => (showFormClient = !showFormClient);

  // Concatenate information
  const concatenatedInfo = `${client.code || ''}${client.identitynumber || ''}${client.businessname || ''}${client.secret || ''}`;

  // Check if client is new or existing
  const isNewClient = !client.id;
</script>

<Modal isOpen={showFormClient} toggle={onshowModalClient} size={"xl"}>
  <ModalHeader toggle={onshowModalClient}>CLIENTE "{client.businessname || "Nuevo"}"</ModalHeader>
  <ModalBody>
    <div class="row">
      <label class="col">ID<input class="form-control" bind:value={client.id} disabled/></label>
      <label class="col">Codigo
        <i title="4 caracteres representativos en mayusculas" class="bi bi-info-circle-fill" />
        <input class="form-control" bind:value={client.code} name="code" on:keypress={validateCode} on:input={convertToUppercase} disabled={!isNewClient}/>
      </label>
      <label class="col">Numero de Identidad
        <i title="13 digitos solo mayusculas combinando letras y numeros" class="bi bi-info-circle-fill"/>
        <input class="form-control" bind:value={client.identitynumber} name="identitynumber" on:keypress={validateCode} on:input={convertToUppercase} disabled={!isNewClient}/>
      </label>
      <label class="col">Nombre del Negocio <input class="form-control" bind:value={client.businessname} disabled={!isNewClient}/> </label>
    </div>
    <div class="row">
      <label class="col">Secret <input class="form-control" type="text" bind:value={client.secret} disabled={!isNewClient}/></label>
      <label class="col">Estado
        <select class="form-control" bind:value={client.status} disabled={!isNewClient}>
          {#each status as statu}
            <option value={statu.value}>{statu.name}</option>
          {/each}
        </select>
      </label>
      <label class="col">Fecha Inicio <input class="form-control" type="date" bind:value={client.startdate} placeholder={client.startDate} required disabled={!isNewClient}/></label>
      <label class="col">Fecha Final <input class="form-control" type="date" bind:value={client.enddate} disabled={!isNewClient}/></label>
    </div>
    <div class="row">
      <label class="col">Prod:
        <select class="form-control" bind:value={client.isProd} disabled={!isNewClient}>
          {#each isProd as item}
            <option value={item.value}>{item.name}</option>
          {/each}
        </select>
      </label>
      <label class="col">Dominio URL<input class="form-control" bind:value={client.home} placeholder={client.home} disabled={!isNewClient}/></label>
      <label class="col">Window_Multiple<input class="form-control" bind:value={client.window_multiple} placeholder={client.window_multiple}/></label>
    </div>
    <div class="row">
      <label class="col">Clientauth <input class="form-control" value={concatenatedInfo} disabled/></label>
    </div>
  </ModalBody>
    <ModalFooter>
      <button class="btn btn-primary btn-sm" on:click={saveClient}>Guardar</button>
    </ModalFooter>
</Modal>
