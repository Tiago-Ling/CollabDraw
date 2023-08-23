import { setupCanvas } from './canvas';
import { initWSConnection } from './routes';
import './style.css'
import { DrawData } from './types';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="container">
    <div id="toolbar">
        <h1>CollabDraw</h1>
        <label for="stroke">Stroke</label>
        <input id="stroke" name='stroke' type="color">
        <label for="lineWidth">Line Width</label>
        <input id="lineWidth" name='lineWidth' type="number" value="5">
        <button id="clear">Clear</button>
    </div>
    <div class="drawing-board">
        <canvas id="drawing-board"></canvas>
    </div>
  </section>
`

// Should CustomEvent listeners be here maybe?

// Should this even be here?
let currentData:DrawData = {
  Points: [],
  LineWidth: 5,
  Colour: "#000000"
}

setupCanvas(currentData);
initWSConnection();