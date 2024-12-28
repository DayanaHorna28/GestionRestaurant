<script>
      import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
      import moment from "moment";
      import { onMount } from "svelte";
      import backend from "../../../server";
      import alertify from "alertifyjs";
      export let showModalPrintCashBox;
      export let userLoged;
      export let cashBox_print;
      let now = new Date();
      let date;
      let hour;
      let dateCurrent;
      let hourCurrent;
      let params = {};
      let filters = {};
      let movement = {
          deposit_bank_totalmoney:0,
          deposit_cash_totalmoney:0,
          withdrawal_bank_totalmoney:0,
          withdrawal_cash_totalmoney:0
        };
      let totalMoney = 0;
      let CASH_BOX_STATUS_OPEN = 1
      onMount(() => {
        dateCurrent= moment().format("YYYY-MM-DD");
        hourCurrent=  (now.getHours()< 10 ? '0' : '')+now.getHours() + ":" +  (now.getMinutes()< 10 ? '0' : '') + now.getMinutes()+ ":" + (now.getSeconds()< 10 ? '0' : '')+now.getSeconds();
        let fechaMoment = moment.utc(cashBox_print.openDateCashBox);
        date = fechaMoment.format('YYYY-MM-DD');
        hour = fechaMoment.format('HH:mm:ss');
        reportSales();
      });

      const reportSales = async ()=> {
        try {
          filters.from = date
          filters.to =  dateCurrent
          params = {...filters}
          params.receptionUserId = userLoged.userId;
          params.platformId=userLoged.platformId;
          params.fromHour=hour;
          params.toHour=hourCurrent;
          params.currencyISO = cashBox_print.currency
          let {data} = await backend.movements.reportSales(params);
          movement = {...data};
          calculateCashBoxClose(movement)
        } catch (error) {
          alertify.error("ERROR! "+ error);
        }
      }

      const calculateCashBoxClose = (movement) => {
        totalMoney =  (movement.withdrawal_bank_totalmoney + movement.withdrawal_cash_totalmoney)-(movement.deposit_bank_totalmoney + movement.deposit_cash_totalmoney);
      };

      function printing() {
        var ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Imprimir Documento</title>
            </head>
            <body>
                ${document.getElementById('typeDocumentPrint').outerHTML}
            </body>
            </html>
        `);
        ventanaImpresion.document.close();
        ventanaImpresion.print();
        ventanaImpresion.close();
    }

  const toggle = () => (showModalPrintCashBox = !showModalPrintCashBox);

</script>
<Modal isOpen={showModalPrintCashBox}  size={"sm"} class="black">
  <ModalHeader {toggle}>Imprimir Documento</ModalHeader>
  <ModalBody>
      <div id="typeDocumentPrint" class="ticket-print" style="-webkit-transform:scale(0.99);">
          <div class="row" style="margin: 3px;">
            <div style="padding: 0; display: flex; justify-content: center; align-items: center;">
              <img src='https://assetsapiusoft.s3.us-west-2.amazonaws.com/bo_fontend/logo_small.png' alt='Google' style="max-width: 70%; height: 50px;">
          </div>

              <div class="col-lg-12" style="padding: 0">
                 <p style="margin:0;font-size:100%;text-align: center;">CIERRE MOVIMIENTO DE CAJA</p>
                 <p style="margin:0;font-size:80%;text-align: center;">Mov. {date} {userLoged.username}</p>
                 <p style="margin:0;font-size:80%;">INICIO. {date} {hour}</p>
                 <p style="margin:0;font-size:80%;">FIN:  {dateCurrent} {hourCurrent}</p>
                 <p style="margin:0;font-size:80%;f">Estado Caja: {cashBox_print.status == CASH_BOX_STATUS_OPEN?"Apertura":"Cierre"}</p>
                 <p style="margin:0;font-size:80%;">Fecha/Hora Impres: {dateCurrent} {hourCurrent}</p>
              </div>
              <div class="col-lg-12" style="padding: 0;'margin-top: -160px'}">
                      <p style="margin:0;font-size:80%;border-top: 1.5px dashed #000; margin-top: 5px;margin-bottom: 5px;"></p>
                      <p  style="margin:0;font-size:65%;"><strong>MONTO DE APERTURA:</strong> <span style="float: right;"><strong>{cashBox_print.amountOpen.toFixed(2)} {cashBox_print.currency}</strong></span></p><br>
              </div>
              <div class="col-lg-12" style="padding: 0">
                <p  style="margin:0;font-size:90%;text-align: center;">TOTAL DEPOSITO Y RETIRO</p>
                <p style="margin:0;font-size:80%;border-top: 1.5px dashed #000; margin-top: 5px;margin-bottom: 5px;"></p>
                <div style="text-align: left;">
                      <table class="table table-hover table-xs">
                          <thead>
                             <tr>
                                <td>Tipo mov.</td>
                                <td>(s/.) Total</td>
                             </tr>
                          </thead>
                          <tbody>
                              <tr>
                                <td style="width: 80%;">Deposito Bancario</td>
                                <td style="text-align: right;">{movement.deposit_bank_totalmoney.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td style="width: 80%;">Deposito Efectivo</td>
                                <td style="text-align: right;">{movement.deposit_cash_totalmoney.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td style="width: 80%;">Retiro Bancario</td>
                                <td style="text-align: right;">{movement.withdrawal_bank_totalmoney.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td style="width: 80%;">Retiro Efectivo</td>
                                <td style="text-align: right;">{movement.withdrawal_cash_totalmoney.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td style="width: 80%;"><strong>EF. SOLES (S/)</strong></td>
                                <td style="text-align: right;"><strong>{totalMoney.toFixed(2)} </strong></td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <p style="margin:0;font-size:80%;font-family:Verdana, Geneva, sans-serif;border-top: 1.5px dashed #000; margin-top: 5px;margin-bottom: 5px;"></p>
                  <table>
                    <tbody>
                      <tr>
                        <td style="width: 75%;">
                            <p style="margin:0;font-size:60%;font-family:Verdana, Geneva, sans-serif;"><strong>MONTO APERTURA + RET. BANCARIO + RET. EFECITVO - DEP. BANCARIO - DEP. EFECTIVO</strong></p>
                        </td>
                        <td style="width: 25%;text-align: right"><strong>{(totalMoney+cashBox_print.amountOpen).toFixed(2)} {cashBox_print.currency}</strong></td>
                      </tr>
                    </tbody>
                  </table>
              </div>
              <div class="col-lg-12" style="padding: 0">
              </div>
              <div class="watermark" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.5; z-index: 999; pointer-events: none;">
                  <p style="font-size: 50px; font-family: 'Arial', sans-serif; color: #ccc; transform: rotate(-45deg); margin: 0;">{cashBox_print.status==CASH_BOX_STATUS_OPEN? 'Aperturado':'Cerrado'}</p>
              </div>
          </div>
      </div>
  </ModalBody>
  <ModalFooter >
      <center class="center">
          <button class="btn btn-success btn-xs" data-bs-dismiss="modal" data-dismiss="modal" id="order_default_ticket" on:click={()=>printing("typeDocumentPrint")}><i class="fa fa-print"></i> Imprimir</button>
          <button class="btn btn-ligth btn-xs" on:click={toggle} data-bs-dismiss="modal" data-dismiss="modal"><i class="fa fa-close"></i>Cerrar</button>
      </center>
  </ModalFooter>
</Modal>

<style>
   #typeDocumentPrint{
        font-size: 12PX;
    }

    .btn-xs {
        padding: 1px 5px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 3px;
    }
    .center{
        width: 100%;
        text-align: center;
    }

    .table-xs th {
        padding: 2px;
        border: 0;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
    }
      
    .table-xs tbody {
        border-top: 0;
    }
      
    .table> :not(:first-child) {
        border-top: 0;
    }
      
    .table-xs td {
        padding: 1px 1px;
        font-size: 11px;
    }
      
  
    .table-xs tr {
        height: 20px !important;
    }

</style>