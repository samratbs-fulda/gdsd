import { Home } from "../models/Home";

export class HomeService {
    getHomeMessage(): Home {
        return new Home("Initial Express Setup!");
    }
}
