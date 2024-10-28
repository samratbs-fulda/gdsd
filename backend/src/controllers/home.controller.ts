
import { Request, Response } from "express";
import { HomeService } from "../services";

const homeService = new HomeService();

export const homeController = (req: Request, res: Response): void => {
    const homeMessage = homeService.getHomeMessage();
    res.send(homeMessage.message);
};
