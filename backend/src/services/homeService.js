const Home = require("../models/Home");

class HomeService {
    getHomeMessage() {
        return new Home("Initial Express Setup!");
    }
}

module.exports = HomeService;
