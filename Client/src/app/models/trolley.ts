import { TrolleyItem } from "./trolleyItem";

export class Trolley {
    constructor(
        public products: TrolleyItem[], 
        public productsCant:number
    ) {}
}