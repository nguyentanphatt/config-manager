import express from "express";
import {
  deleteConfigItem,
  fetchConfig,
  updateConfigItem,
} from "../controller/configController.js";
const router = express.Router();

router.get("/config", fetchConfig);
router.delete("/config/delete/:key", deleteConfigItem);
router.put("/config/update/:key", updateConfigItem);
export default router;
