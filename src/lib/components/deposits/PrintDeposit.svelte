<script>
    import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
    import moment from "moment";
    import { onMount } from "svelte";
    import backend from "../../../server";
    import alertify from "alertifyjs";
    export let showModalPrintDeposit;
    export let printData = {};
    let movement = {}
    let platform = {}
    let now = new Date();
    let dateCurrent;
    let hourCurrent;
    onMount(() => {
        dateCurrent= moment().format("YYYY-MM-DD");
        hourCurrent=  (now.getHours()< 10 ? '0' : '')+now.getHours() + ":" +  (now.getMinutes()< 10 ? '0' : '') + now.getMinutes()+ ":" + (now.getSeconds()< 10 ? '0' : '')+now.getSeconds();
        findByMovementId()
    });

    const findByMovementId = async () => {
      try {
        let {data} =  await backend.movements.findByMovementId(printData.movementId)
        movement = data
        findByPlaformId(movement)
      } catch (error) {
        
      }
    }

    const findByPlaformId = async (item) => {
      try {
        let {data} =  await backend.platform.findByPlatformId(item.platformId)
        platform = data
      } catch (error) {
        
      }
    }
    
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

const toggle = () => (showModalPrintDeposit = !showModalPrintDeposit);

</script>
<Modal isOpen={showModalPrintDeposit}  size={"sm"} class="black">
<ModalHeader {toggle}>IMPRIMIR TICKET</ModalHeader>
<ModalBody>
    <div id="typeDocumentPrint" class="ticket-print" style="-webkit-transform:scale(0.99);">
        <div class="row" style="margin: 3px;">
            <div style="padding: 0; display: flex; justify-content: center; align-items: center;">
                <img src='https://assetsapiusoft.s3.us-west-2.amazonaws.com/bo_fontend/logo_small.png' alt='Google' style="max-width: 70%; height: 50px;">
            </div>
            <div  style="padding: 0">
               <p style="margin:0;font-size:100%;text-align: center;">TICKET DEPOSITO</p>
               <p style="margin:0;font-size:80%;text-align: center;">Mov. {movement.serial} </p>
               <p style="margin:0;font-size:80%;">PLATAFORMA. {platform.name}</p>
               <p style="margin:0;font-size:80%;">CODIGO: {printData.code} </p>
               <p style="margin:0;font-size:80%;">FECHA: {dateCurrent} {hourCurrent}</p>
            </div>

            <div  style="padding: 0">
                <p style="margin:0;font-size:80%;border-top: 1.5px dashed #000; margin-top: 5px;margin-bottom: 5px;"></p>
                <table>
                  <tbody>
                    <tr>
                      <td style="width: 10%;">
                          <p style="margin:0;font-size:90%;"><strong>MONTO </strong></p>
                      </td>
                      <td style="width: 14%;text-align: right"><strong>{movement.totalMoney} {movement.currencyISO}</strong></td>
                    </tr>
                  </tbody>
                </table>
                <div style="text-align: center;">
                    <p style="font-size:70%">Gracias por tu preferencia!. </p>
                </div>
            </div>
            
            <div class="watermark" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.5; z-index: 999; pointer-events: none;">
                <p style="font-size: 50px; font-family: 'Arial', sans-serif; color: #ccc; transform: rotate(-45deg); margin: 0;">Cancelado</p>
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