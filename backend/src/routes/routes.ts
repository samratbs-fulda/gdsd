import { Router } from "express";
import { homeController } from "../controllers";

const router = Router();

const aboutFrontendPath = __dirname + '/../../../../frontend/about'
const aboutAssetPath = __dirname + '/../../../../frontend/about/assets'


router.get("/", homeController);


// About page(s)
// Assets
router.get('/about/assets/:assetname', function (req, res) {
    res.sendFile(req.params.assetname, {
        root: aboutAssetPath
    });
});

// About Page
router.get('/about', function (req, res) {
    res.sendFile('about.html', {
        root: aboutFrontendPath
    });
});

// Single about pages
router.get('/about/:aboutmember', function (req, res) {
    res.sendFile(req.params.aboutmember, {
        root: aboutFrontendPath
    });
});

// About page stylesheet
router.get('/about/style.css', function (req, res) {
    res.sendFile('style.css', {
        root: aboutFrontendPath
    });
});

export default router;
