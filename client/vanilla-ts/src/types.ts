export type Point = {
    X: number;
    Y: number;
}
  
export type DrawData = {
    Points: Point[];
    LineWidth: number;
    Colour: string;
};

export type Message<T> = {
    Type: string;
    Data: T;
}