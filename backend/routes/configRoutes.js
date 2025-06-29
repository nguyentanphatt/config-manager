import express from "express";
import {
  addConfigItem,
  deleteConfigItem,
  fetchConfig,
  fetchConfigItemByKey,
  updateConfigItem,
} from "../controller/configController.js";
const router = express.Router();

router.get("/config", fetchConfig);
router.delete("/config/delete/:key", deleteConfigItem);
router.put("/config/update/:key", updateConfigItem);
router.post("/config/add", addConfigItem);
router.get("/config/:key", fetchConfigItemByKey);
export default router;
