<script lang="ts">
  import { Modal, ModalBody, ModalFooter, ModalHeader, TabContent, TabPane } from "sveltestrap";
  import { onMount } from "svelte";
  import moment from "moment";
  import backend from "./../../../server";

  export let showModalCashRegister;
  export let userLoged;

  let size = "lg";
  let activeTab = "retail"; // Pestaña activa inicial
  let filters = {
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
  };
  let report = {
    deposit_bank_totalmoney: 0,
    deposit_cash_totalmoney: 0,
    withdrawal_bank_totalmoney: 0,
    withdrawal_cash_totalmoney: 0,
  };

  let categoriesData = [
    {
      categoryName: "Caballos",
      ventaBruta: 100.50,
      devoluciones: 10.20,
      ventaNeta: 90.30,
      premios: 5.50,
      saldo: 84.80
    },
    {
      categoryName: "Casino",
      ventaBruta: 50.25,
      devoluciones: 5.10,
      ventaNeta: 45.15,
      premios: 3.00,
      saldo: 42.15
    }
  ];

  onMount(() => {
    reportSales();
  });

  const reportSales = async (params = {}) => {
    params = { ...filters, ...{ receptionUserId: userLoged.userId, platformId: userLoged.platformId } };
    let { data } = await backend.movements.reportSales(params);
    report = { ...data };
    console.log("reportSales:", report);
    
  };

  const toggleCheckBox = () => (showModalCashRegister = !showModalCashRegister);
  //const handleTabChange = (e) => (activeTab = e.detail.id);
</script>

<Modal isOpen={showModalCashRegister} toggle={toggleCheckBox} size={size}>
  <ModalHeader toggle={toggleCheckBox}>
    <span class="title">INFORMES DE VENTAS 
      <br>Usuario: {userLoged.username}</span>
  </ModalHeader>

  <ModalBody>
    <div class="content-total">
      <div class="filters">
        <div class="col-xl black">
          <span>Desde:</span>
          <input bind:value={filters.from} type="date" class="form-control" style="width: 100%;" placeholder="Fecha de incio" />
        </div>
        <div class="col-xl black">
          <span>Hasta:</span>
          <input bind:value={filters.to} type="date" class="form-control" />
        </div>
        <div class="col search"><button class="btn btn-primary" on:click={reportSales}><i class="bi bi-search"></i></button></div>
      </div>

      <TabContent>
        <TabPane tabId="retail" tab="Retail" active>
          <div class="container col black">
            <div class="container-table" style="overflow-x: auto;">
              <table class="table table-sm table-bordered responsive table-striped">
                <thead>
                  <tr class=" bg-dark text-white ">
                    <th>VENTA RETAIL</th>
                    <th>MONTO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td>DEPOSITO EFECTIVO</td>
                    <td class="money">{(report.deposit_cash_totalmoney).toFixed(2)}</td>
                  </tr>
                  <tr >
                    <td>PREPAGADOS</td>
                    <td class="money">0.00</td>
                  </tr>
                  <tr>
                    <td>RETIRO EFECTIVO</td>
                    <td class="money">{(report.withdrawal_cash_totalmoney).toFixed(2)}</td>
                  </tr>
                  <tr class="bg-success white">
                    <td>TOTAL:</td>
                    <td class="money">{(report.deposit_cash_totalmoney + report.withdrawal_cash_totalmoney).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPane>

        <TabPane tabId="web" tab="Web">
          <div class="container col black">
            {#each categoriesData as category}
              <div class="table-responsive" style="overflow-x: auto;">
                <div class="category-title">{category.categoryName}</div>
                <table class="table table-sm table-bordered responsive table-striped">
                  <thead>
                    <tr class=" bg-dark text-white">
                      <th>Venta Bruta</th>
                      <th>Devoluciones</th>
                      <th>Venta Neta</th>
                      <th>Premios</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="money">{category.ventaBruta.toFixed(2)}</td>
                      <td class="money">{category.devoluciones.toFixed(2)}</td>
                      <td class="money">{category.ventaNeta.toFixed(2)}</td>
                      <td class="money">{category.premios.toFixed(2)}</td>
                      <td class="money">{category.saldo.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            {/each}  
          </div>
        </TabPane>
      </TabContent>
    </div>
  </ModalBody>

  <!--<ModalFooter>
    <div class="footer-content">
      <div class="report-final bg-success white">
        <span>VENTA GENERAL RETAIL + WEB:</span>
        <span>{((report.deposit_bank_totalmoney + report.deposit_cash_totalmoney) + (report.withdrawal_bank_totalmoney + report.withdrawal_cash_totalmoney)).toFixed(2)}</span>  
      </div>
      <button disabled on:click={toggleCheckBox} class="btn btn-sm btn-success"><i class="bi bi-filetype-csv"></i> Imprimir</button>
    </div>
  </ModalFooter>-->
</Modal>

<style>
  
  
.category-title{
  background-color: #2044e383;
  font-weight: bold;
  padding: 0.2rem;
  color: white;
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
}
.content-total{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.filters{
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}


.container {
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
}
.footer-content{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

}
.report-final{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
  width: 70%;
}



.col {
  padding: 0.5rem;
}

.black {
  color: #000;
}

.money {
  font-family: monospace;
}

.form-control {
  border-radius: 0.5rem;
  border-color: #ddd;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  border-radius: 0.5rem;
}

.search {
  display: flex;
  align-items: flex-end;
}

.sector-info {
  background-color: #50616b;
  color: white;
  padding: 0.3rem;
  width: 100%;
}

.container-table {
  width: 100%;
  overflow-x: auto;
}

.caja-w-saldo {
  width: 33%;
  text-align: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.mr-3 {
  margin-right: 0.5rem;
}


.nav-tabs {
  border-bottom: 1px solid #ddd;
}

.nav-tabs .nav-link {
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
}

.nav-tabs .nav-link.active {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}


 @media only screen and (max-width: 1024px) {
  .sector-info {
    background-color: #50616b;
    color: white;
    padding: 0.3rem;
    width: 100%;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  .table-responsive {
    width: 100%;
  }

  .caja-w-saldo {
    width: 33%;
    text-align: center;
    color: white;
  }

  .mr-3 {
    margin-right: 0.5rem;
  }

  .black {
    color: #000;
  }

  .container-table {
    width: 100%;
  }

  .search {
    align-items: end;
    justify-content: end;
  }
}

@media only screen and (min-width: 1025px) {
  .sector-info {
    background-color: #50616b;
    color: white;
    padding: 0.3rem;
  }

  .container-table {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }

  .table-responsive {
    width: 100%;
  }

  .caja-w-saldo {
    width: 33%;
    text-align: center;
    color: white;
  }

  .mr-3 {
    margin-right: 0.5rem;
  }

  .black {
    color: #000
  }
}
</style>
