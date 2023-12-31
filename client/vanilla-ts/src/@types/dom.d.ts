import { DrawData } from "../types";

interface CustomEventMap {
    "DrawDataSent": CustomEvent<DrawData>;
    "DrawDataReceived": CustomEvent<DrawData>;
}
declare global {
    interface Document { //adds definition to Document, but you can do the same with HTMLElement
        addEventListener<K extends keyof CustomEventMap>(type: K,
           listener: (this: Document, ev: CustomEventMap[K]) => void, options?: boolean | AddEventListenerOptions): any;
        removeEventListener<K extends keyof CustomEventMap>(type: K,
            listener: (this: HTMLElement, ev: CustomEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
    }
}
export { }; //keep that for TS compiler.