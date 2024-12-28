<script>
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";
  import moment from "moment";

  export let showTrxInfo;
  export let transactionInfo;

  let transactionDetails = [];

  onMount(() => {
    transactionDetails = JSON.parse(transactionInfo);
  });

  const baseURL = 'https://admin-bo-frontend.pages.dev/';
  const transactionInfoURL = {
    // Aquí coloca la información que deseas compartir
    betType: 'Tipo de apuesta',
    betDate: 'Fecha de la apuesta',
    // Otros datos
  };

  // Codificar los datos en la URL
  function encodeData(data) {
    return encodeURIComponent(JSON.stringify(data));
  }

  // Construir la URL con la información codificada
  function generateUniqueURL(baseURL, data) {
    const encodedData = encodeData(data);
    return `${baseURL}?data=${encodedData}`;
  }

  // Generar la URL única
  const uniqueURL = generateUniqueURL(baseURL, transactionInfoURL);

  console.log('URL única:', uniqueURL);


  const onShowTrxInfo = () => (showTrxInfo = !showTrxInfo);
</script>

<Modal isOpen={showTrxInfo} toggle={onShowTrxInfo} size={"x"}>
  <ModalBody>
    <div class="ticket">
      <div class="ticket-header">
        <h2 class="ticket-title">Detalles de la apuesta</h2>
      </div>
      <div class="ticket-body">
        <div class="ticket-item">
          <div class="ticket-key">Tipo de apuesta:</div>
          <div class="ticket-value">{transactionDetails.betType}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Fecha de la apuesta:</div>
          <div class="ticket-value">{moment(transactionDetails.betDate).format("DD/MM/YYYY HH:mm:ss")}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Moneda:</div>
          <div class="ticket-value">{transactionDetails.currency}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Monto apostado:</div>
          <div class="ticket-value">{transactionDetails.amount}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Posible ganancia:</div>
          <div class="ticket-value">{transactionDetails.possibleWin}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Estado:</div>
          <div class="ticket-value">{(transactionDetails.isWinner == false? 'No ganador':'Ganador')}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Ganancia:</div>
          <div class="ticket-value">{transactionDetails.winAmount}</div>
        </div>
        <span>----------------------------------------------------------------------------</span>
        <div class="ticket-item">
          <div class="ticket-key">Evento:</div>
          <div class="ticket-value">{transactionDetails.bets[0].eventDate}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Nombre del Torneo:</div>
          <div class="ticket-value">{transactionDetails.bets[0].tournamentName}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Factor:</div>
          <div class="ticket-value">{transactionDetails.bets[0].factor}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-key">Categoria:</div>
          <div class="ticket-value">{(transactionDetails.bets[0].isLive == false? 'Deportiva':'Deportiva En Vivo')}</div>
        </div>
      </div>
    </div>
    
  </ModalBody>
</Modal>

<style>
  .ticket {
    border: 2px solid #28a745;
    border-radius: 10px;
    padding: 1rem;
    background-color: #f9f9f9;
    max-width: 100%;
    margin: auto;
    box-shadow: 0 4px 8px rgba(85, 79, 79, 0.87);
  }

  .ticket-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .ticket-title {
    font-size: 1.5rem;
    color: #28a745;
    margin: 0;
  }

  .ticket-body {
    display: flex;
    flex-direction: column;
  }

  .ticket-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .ticket-key {
    font-weight: bold;
    margin-right: 10px;
    color: #28a745;
  }

  .ticket-value {
    overflow-wrap: break-word;
    flex: 1;
  }
</style>
