async function exportFile() {
    // Obtén los datos y filtros
    const params = { ...filters };
    for (const key in params) {
        if (params[key] === "") {
            delete params[key];
        }
    }

    try {
        params.xpage = transations.total;
        loading = true;
        let { data } = await server.trx.list(params);
        loading = false;
        const dataToExport = [];
        dataToExport.push([
            "ID",
            "Reference (Trx Id)",
            "Trx Asociado",
            "Serial",
            "Fecha",
            "Username (UserId)",
            "Username_Origen",
            "Juego",
            "Sitio",
            "Tipo",
            "Moneda",
            "Monto",
            "Nuevo Balance",
            "Opciones", // Opciones, puedes dejar esto en blanco ya que no se exporta a Excel
        ]);
        data.list.forEach((trx) => {
            dataToExport.push([
                trx.id,
                trx.trxid,
                trx.referencebet || "",
                trx.serial,
                moment(trx.date).format("DD/MM/YYYY HH:mm:ss"),
                `${trx.user.username} (${trx.user.id})`,
                trx.user.username_origin,
                `${trx.game.name} (${trx.game.gameid}) - ${trx.game.category}`,
                trx.user.client_id.namesite,
                trx.movement,
                trx.user.currency,
                trx.amount.toFixed(2),
                trx.balanceaftertrx?.toFixed(2),
                "", // Opciones, puedes dejar esto en blanco ya que no se exporta a Excel
            ]);
        });

        // Crea un libro de Excel
        const ws = utils.json_to_sheet(dataToExport);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data"); // Nombre de la hoja en el archivo Excel

        // Descarga el archivo Excel
        writeFileXLSX(wb, "Transacciones.xlsx");
    } catch (error) {
        console.log("Failed to write", error);
        loading = false;
        //alertify.error("Error al exportar los datos a Excel");
    }
}



<button class="btn btn-success btn-sm" on:click={exportFile}> <i class="bi bi-filetype-xlsx" /> </button>