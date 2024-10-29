import { Router } from "express";
import { homeController } from "../controllers";

const router = Router();

const frontendPath = __dirname + '/../../../../frontend'
const assetPath = __dirname + '/../../../../frontend/assets'


router.get("/", homeController);

// Assets
router.get('/assets/:assetname', function (req, res) {
    res.sendFile(req.params.assetname, {
        root: assetPath
    });
});

// About Page
router.get('/about', function (req, res) {
    res.sendFile('about.html', {
        root: frontendPath
    });
});

// Single about pages
router.get('/about/:aboutmember', function (req, res) {
    res.sendFile(req.params.aboutmember, {
        root: frontendPath
    });
});

router.get('/style.css', function (req, res) {
    res.sendFile('style.css', {
        root: frontendPath
    });
});

export default router;
