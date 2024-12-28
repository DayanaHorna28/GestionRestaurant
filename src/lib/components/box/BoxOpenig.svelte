<script>
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { onMount } from "svelte";
  import alertify from "alertifyjs";
  import moment from "moment";
  import backend from "../../../server";
  export let showModalOpeningBox;
  export let userLoged;
  export let cashBox = { data : []};
  let cashBox_temp = {...cashBox};
  let box = { id: null};
  let now = new Date();
  let params = {};
  let filters = {};
  let movement = {withdrawal_bank_totalmoney:0 ,withdrawal_cash_totalmoney:0, deposit_bank_totalmoney:0 ,deposit_cash_totalmoney:0 };

  onMount(() => {
    prepareApertureOrCloseCashBox(formatDate(),formatHour(),userLoged.currencyISO[0] || null)
  });

  const prepareApertureOrCloseCashBox = async (date , hour , currency)=>{
    let cashBoxOpened = cashBox_temp.data ? cashBox_temp.data.find(item => item.currency === currency) || { }:{}
    box = {...cashBoxOpened}
    box.amountOpen = userLoged.balance.REAL.find(e => e.currencyISO === currency ).amount
    box.currency = currency
    let dateFormt =  moment.utc(box.openDateCashBox).format('YYYY-MM-DD')
    let hourFormt =  moment.utc(box.openDateCashBox).format('HH:mm:ss')
    box.openDateCashBox = box.id ? dateFormt : date
    box.houropendate = box.id ? hourFormt : hour
    if(box.id) prepareCashBoxOpen(date,hour)
    else rewriteCalculationMovement()
  }
  
  const prepareCashBoxOpen = async (date, hour) =>{
        try {
            box.closeDateCashBox = date;
            box.hourClosedate = hour;
            filters.from = box.openDateCashBox
            filters.to =  box.closeDateCashBox
            params = {
                ...filters,
                receptionUserId: userLoged.userId,
                platformId: userLoged.platformId,
                fromHour: box.houropendate,
                toHour: box.hourClosedate,
                currencyISO: box.currency,
            };
            let {data} = await backend.movements.reportSales(params)
            movement = {...data}
            box.amountClose = calculateCashBoxClose(movement)
        } catch (error) {
            alertify.error("ERROR! "+ error);
        }
  }

  const rewriteCalculationMovement = () =>{ 
        let movementRewrite = {
            withdrawal_bank_totalmoney: 0,
            withdrawal_cash_totalmoney: 0,
            deposit_bank_totalmoney:0, 
            deposit_cash_totalmoney:0   
        }
    movement = { ... movementRewrite}
    box.amountClose = 0
  }

  const changeCashBoxByCurrency= async (currency)=>{
        prepareApertureOrCloseCashBox(formatDate(),formatHour(),currency)
  }

  const formatHour = ()=>{
    return (now.getHours()< 10 ? '0' : '')+now.getHours() + ":" +  (now.getMinutes()< 10 ? '0' : '') + now.getMinutes()+ ":" + (now.getSeconds()< 10 ? '0' : '')+now.getSeconds()
  }

  const formatDate = ()=>{
    return moment().format("YYYY-MM-DD")
  }
  
  const cashBoxOpen = async ()=>{
    try {
        box.userId = userLoged.userId;
        box.platformId = userLoged.platformId;
        let {data} = await backend.cashBox.save(box)
        alertify.success("Caja Aperturada!");
        showModalOpeningBox=false;
        location.reload()
    } catch (error) {
        alertify.error("ERROR! "+ error);
    }
  }

  const cashBoxClose = async ()=>{
    try {
        box.userId = userLoged.userId;
        box.platformId = userLoged.platformId;
        let {data} = await backend.cashBox.update(box)
        alertify.success("Caja Cerrada!");
        showModalOpeningBox=false;
        location.reload()
    } catch (error) {
        alertify.error("ERROR! "+ error);
    }
  }

  const calculateCashBoxClose = (movement) => {
    let amountClose =(movement.withdrawal_bank_totalmoney + movement.withdrawal_cash_totalmoney+box.amountOpen)-(movement.deposit_bank_totalmoney + movement.deposit_cash_totalmoney);
    return amountClose;
  };

  const toggle = () => (showModalOpeningBox = !showModalOpeningBox);

</script>

<Modal isOpen={showModalOpeningBox} {toggle} size={box.id?'lg':'md'} class="black">
    <ModalBody>
        <div class="modal-header-close"> <span on:click={toggle}>X</span></div>
        <div class="modal-header-title">
            <h3>Caja: Apertura </h3>
        </div>
        <div class="container">
            <div class="{box.id? 'row' :''}">
                <div class="{box.id?'col-12':'col-24'}">
                  <strong>Colaborador :</strong> 
                  {#if !box.id}
                      <label style="font-weight: 510; font-size: 16px;" for="">{userLoged.username}</label>
                  {/if}
                    <div style="margin-top: 6px;">
                        <h5 style="font-size: 18px;text-align: center;margin-bottom: 20px;">Apertura</h5>
                        <div class="d-flex">
                            <label for="    icEmail" class="col-sm-5 col-form-label">Fecha de Apertura</label>
                            <div class="col-sm-7">
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1"><i class="bi bi-calendar-event"></i></span>
                                    <input type="date" class="form-control" bind:value={box.openDateCashBox} disabled>
                                </div>
                            </div>
                          </div>
                        
                          <div class="d-flex">
                            <label for="staticEmail" class="col-sm-4 col-form-label">Hora Apertura</label>
                            <div class="col-sm-8">
                                <div class="input-group mb-3 mr-2">
                                    <input type="text" class="form-control" bind:value={box.houropendate} disabled>
                                </div>
                            </div>
                          </div>

                          <div class="d-flex">  
                            <label for="staticEmail" class="col-sm-4 col-form-label">currency</label>
                            <div class="col-sm-8">
                                <div class="input-group mb-3 mr-2">
                                 
                                    <select bind:value={box.currency} class="form-control" on:change={() => changeCashBoxByCurrency(box.currency)}>
                                        {#each userLoged.currencyISO as currencyISO}
                                                <option value={currencyISO}  >{currencyISO}  </option>
                                        {/each}
                                    </select>
                                </div>
                            </div>
                          </div>
                                          
                          <div class="d-flex">
                            <label for="staticEmail" class="col-sm-5 col-form-label">Monto de Apertura</label>
                            <div class="col-sm-7">
                                <div class="input-group mb-3 mr-2">
                                    <input type="number" class="form-control" bind:value={box.amountOpen} disabled={box.id}>
                                </div>
                            </div>
                          </div>
                    </div>
                </div>
                {#if box.id}
                    <div class="col-lg-12">
                        <label style="font-weight: 510; font-size: 16px;" for="">{userLoged.username}</label>
                        <div style="margin-top: 6px;">
                            <h5 style="font-size: 18px;text-align: center;margin-bottom: 20px;">Cierre</h5>
                            <div class="d-flex">
                                <label for="staticEmail" class="col-sm-4 col-form-label">Fecha de Cierre</label>
                                <div class="col-sm-8">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1"><i class="bi bi-calendar-event"></i></span>
                                        <input type="date" class="form-control" bind:value={box.closeDateCashBox} disabled>
                                    </div>
                                </div>
                                </div>
                                <div class="d-flex">
                                <label for="staticEmail" class="col-sm-3 col-form-label">Hora Cierre</label>
                                <div class="col-sm-8">
                                    <div class="input-group mb-3 mr-2">
                                        <input type="text" class="form-control" bind:value={box.hourClosedate}  disabled>
                                    </div>
                                </div>
                                </div>
                                <div class="container-movement" style="width: 60%;">  
                                <div class="movement">
                                    <label>Monto de Apertura:</label>
                                    <span>{box.amountOpen.toFixed(2)}</span>
                                </div>
                                <div class="movement">
                                    <label>Deposito Bancario:</label>
                                    <span>{movement.deposit_bank_totalmoney.toFixed(2)}</span>
                                </div>
                                <div class="movement">
                                    <label>Recarga:</label>
                                    <span>{movement.deposit_cash_totalmoney.toFixed(2)}</span>
                                </div>
                                <div class="movement">
                                    <label>Retiro Bancario:</label>
                                    <span>{movement.withdrawal_bank_totalmoney.toFixed(2)}</span>
                                </div>
                                <div class="movement">
                                    <label>Retiro Efectivo:</label>
                                    <span>{movement.withdrawal_cash_totalmoney.toFixed(2)}</span>
                                </div>
                                <div class="movement box-openig">
                                    <label>Monto de Cierre:</label>
                                    <span>{box.amountClose?box.amountClose:0}.00</span>
                                </div>
                            </div>
    
                        </div>
                     </div>
                {/if}
            </div>
        </div>
    </ModalBody>
    <ModalFooter>
        <button class="btn btn-success btn-sm" on:click={ box.id? cashBoxClose : cashBoxOpen }> <i class="bi bi-save"/> Guardar</button>
        <button class="btn btn-light btn-sm " on:click={toggle}><i class="bi bi-close" /> Cerrar</button>
    </ModalFooter>
</Modal>
  
<style>

    .modal-header-close{
        text-align: right;
    }
    
    .modal-header-close span{
        cursor: pointer;
        color: #999;
    }

    .modal-header-title{
        text-align: center;
        font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
    }

    .modal-header-title h3{
        font-size: 24px;
        color: #333;
    }
    .container{
        color: black;
    }

    strong{
        font-size: 16px;
    }

    label{
        font-weight: 600;
        font-size: 13.5px;
    }

    .container-movement {
        display: flex;
        flex-direction: column;
    }

    .movement {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .movement label {
        flex: 1;
    }

    .movement span {
        text-align: right;
        margin-left: 5px;
    }
    
    .container-movement .box-openig{
        background: #e9ecef;
        padding: 0px;
        padding-top: 5px;
        padding-bottom: 5px;
        border-radius: 5PX;
    }

    @media only screen and (max-width: 1024px) {
    .row {
        
    }
  }

  @media only screen and (min-width: 1025px) {
    .row {
        display: grid;
        grid-template-columns: 50% 50%;
        gap: 0.8rem;
        padding: 0.5rem;
    }
  }
</style>