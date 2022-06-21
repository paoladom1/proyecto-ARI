import { Router } from 'express';
const router = Router();

import controlador from '../controllers/security';

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "File converter" });
});

router.post("/", controlador.handlexml);

module.exports = router;
