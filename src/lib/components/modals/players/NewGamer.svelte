<script>
  //import //alertify from "//alertifyjs";
  import { ModalBody, ModalFooter, ModalHeader, Modal } from "sveltestrap";

  export let showNewGamer;
  export let user = {};

  const saveUser = async () => {
    if (!user.code) return; //alertify.error("Ingrese el código");
    if (!user.username) return; //alertify.error("Ingrese el nombre de usuario");
    if (!user.password) return; //alertify.error("Ingrese una contraseña");
    if (!user.balance) return; //alertify.error("Ingrese el balance");
    if (isNaN(user.status)) return; //alertify.error("Ingrese el estado");
    if (!user.platform) return; //alertify.error("Ingrese la plataforma");
    if (!user.country) return; //alertify.error("Ingrese el país");
    if (!user.name) return; //alertify.error("Ingrese el nombre");
    if (!user.lastname) return; //alertify.error("Ingrese el apellido");
    if (!user.gender) return; //alertify.error("Ingrese el genero");
    try {
      await backend.user.save(client);
      list();
      //alertify.success("Procesado!");
    } catch (error) {
      //alertify.error("ERROR");
    }
  };

  const onshowModalNewGamer = () => (showNewGamer = !showNewGamer);
</script>

<Modal isOpen={showNewGamer} toggle={onshowModalNewGamer} size={"xl"}>
  <ModalHeader toggle={onshowModalNewGamer}>Agregar Jugador</ModalHeader>
  <ModalBody>
    <div>
      <div>
        <form>
          <div class="row">
            <div class="mb-3 col">
              <span class="form-label">ID</span>
              <input
                bind:value={user.id}
                type="text"
                class="form-control"
                placeholder="DEFAULT"
                disabled
              />
            </div>
            <div class="mb-3 col">
              <span class="form-label">CLIENT CODE</span>
              <input bind:value={user.code} type="text" class="form-control" />
            </div>
            <div class="mb-3 col">
              <span class="form-label">USERNAME</span>
              <input
                bind:value={user.username}
                class="form-control"
                list="providers"
              />
              <datalist id="providers">
                <option />
              </datalist>
            </div>
            <div class="mb-3 col">
              <span class="form-label">CONTRASEÑA</span>
              <input
                bind:value={user.password}
                type="password"
                class="form-control"
                list="passwords"
              />
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col">
              <span class="form-label">BALANCE</span>
              <input bind:value={user.balance} class="form-control" />
            </div>
            <div class="mb-3 col">
              <span class="form-label">PLATAFORMA</span>
              <select bind:value={user.platform} class="form-control">
                <option value="C014">EJEMPLO</option>
                <option value="50DA">UNIVERSAL RACE</option>
                <option value="086C">JETBET</option>
                <option value="0AC2">PARKING</option>
                <option value="A12D">BABIECA</option>
                <option value="AAC1">COLISEO</option>
                <option value="C43B">CABALLO SPORT</option>
                <option value="CC29">UNIVERSAL HORSE</option>
                <option value="A03F">CVA POKER</option>
                <option value="LAJO">LA JOYA</option>
                <option value="0C55">PINOLO</option>
                <option value="BOPD">BACKOFFICE</option>
                <option value="GOLD">GOLDEN BET</option>
                <option value="MP01">MI APUESTA</option>
                <option value="FORT">365 FORTUNA</option>
                <option value="LATI">LATIN SPORT 21</option>
              </select>
            </div>
            <div class="mb-3 col">
              <span class="form-label">PAÍS</span>
              <input
                bind:value={user.country}
                type="text"
                class="form-control"
              />
            </div>
            <div class="mb-3 col">
              <span class="form-label">NOMBRE</span>
              <input bind:value={user.name} class="form-control" />
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col">
              <span class="form-label">APELLIDO</span>
              <input bind:value={user.lastname} class="form-control" />
            </div>
            <div class="mb-3 col">
              <span class="form-label">GENERO</span>
              <select bind:value={user.gender} class="form-control">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div class="mb-3 col">
              <span class="form-label">MONEDA</span>
              <input
                bind:value={user.currency}
                type="text"
                class="form-control"
              />
            </div>
            <div class="mb-3 col">
              <span class="form-label">ESTADO</span>
              <select bind:value={user.status} class="form-control">
                <option value="1">Activo</option>
                <option value="0">Desactivo</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <div>
      <button class="btn btn-primary btn-sm" on:click={saveUser}>Guardar</button
      >
      <button class="btn btn-light btn-sm" on:click={onshowModalNewGamer}
        >Cerrar</button
      >
    </div>
  </ModalFooter>
</Modal>
