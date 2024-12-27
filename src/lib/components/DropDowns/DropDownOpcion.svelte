<script>
</script>

<div class="col">
  <div class="tabs">
    <div class="tab">
      <input type="checkbox" id="chck1" />
      <label class="tab-label" for="chck1">PROVEEDORES</label>
      <div class="tab-content">Novamatic</div>
      <div class="tab-content">Pragmaticplay</div>
    </div>
  </div>
</div>

<style>
input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

/* Accordion styles */
.tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.5);
}

.tab {

  width: 15rem;
  color: white;
  overflow: hidden;
}
.tab-label {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background: linear-gradient(20deg, #e9b100, #e9ab00);
  font-weight: bold;
  cursor: pointer;
  /* Icon */
}
.tab-label:hover {
  background: #9c8720;
}
.tab-label::after {
  content: "❯";
  width: 1em;
  height: 1em;
  text-align: center;
  transition: all 0.35s;
}
.tab-content {
  max-height: 0;
  padding: 0 1em;
  color: white;
  background: pink;
  transition: all 0.35s;
}
input:checked + .tab-label {
  background: #4d004d;
}
input:checked + .tab-label::after {
  transform: rotate(90deg);
}
input:checked ~ .tab-content {
  max-height: 100vh;
  padding: 1em;
}
</style>
