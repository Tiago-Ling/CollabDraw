import { DrawData } from "./types";

export function setupCanvas(currentData: DrawData) {
    
    const canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('drawing-board');
    const ctx:CanvasRenderingContext2D = <CanvasRenderingContext2D> canvas.getContext('2d');
    
    const toolbar:HTMLElement = <HTMLElement> document.getElementById('toolbar');

    const canvasOffsetX = canvas.offsetLeft;
    const canvasOffsetY = canvas.offsetTop;

    canvas.width = window.innerWidth - canvasOffsetX;
    canvas.height = window.innerHeight - canvasOffsetY;

    let isPainting = false;
    let lineWidth = 5;
    let canResize = true;

    // Note: trying to minimize get/put image data so using it every 200 ms
    window.addEventListener("resize", () => {
        if (canResize) {
            canResize = false;
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            canvas.width = window.innerWidth - canvasOffsetX;
            canvas.height = window.innerHeight - canvasOffsetY;

            ctx.putImageData(imgData, 0, 0);
        } else {
            setTimeout(() => { canResize = true; }, 200);
        }
    });

    toolbar.addEventListener('click', e => {
        if (!e.target) return;
        const target = <HTMLCanvasElement> e.target;
        if (target.id === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
      
    toolbar.addEventListener('change', e => {
        if (!e.target) return;
        const target = <HTMLInputElement> e.target;
        if(target.id === 'stroke') {
            ctx.strokeStyle = target.value;
            console.log(target.value);
            currentData.Colour = target.value;
        }
    
        if(target.id === 'lineWidth') {
            lineWidth = +target.value;
        }
          
    });
      
    canvas.addEventListener('mousemove', (e: any) => {
        if(!isPainting) {
            return;
        }
    
        currentData.Points.push({ X: e.clientX - canvasOffsetX, Y: e.clientY});
              
        ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
        ctx.stroke();
    });
      
    canvas.addEventListener('mousedown', () => {
        isPainting = true;
    
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
    });
      
    canvas.addEventListener('mouseup', () => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
          
        //This needs to be dispatched through an event
        const dataSent = new CustomEvent("DrawDataSent", {
            detail: currentData
        });
        document.dispatchEvent(dataSent);
      
        clearData();
    });

    const onDrawDataReceived = (event: CustomEvent) => {
        console.log('Draw On Canvas');
        
        const data:DrawData = event.detail;
        ctx.strokeStyle = data.Colour;
        ctx.lineWidth = data.LineWidth;
        ctx.lineCap = 'round';
      
        for (let i = 0; i < data.Points.length; i++) {
          ctx.lineTo(data.Points[i].X, data.Points[i].Y);
          ctx.stroke();
        }
      
        ctx.stroke();
        ctx.beginPath();
    }
    document.addEventListener("DrawDataReceived", onDrawDataReceived);

    const clearData = () => {
        currentData.Points = [];
    }
}