const { HomeService } = require("../services");

const homeService = new HomeService();

const homeController = (req, res) => {
    const homeMessage = homeService.getHomeMessage();
    res.send(homeMessage.message);
};

module.exports = { homeController };
