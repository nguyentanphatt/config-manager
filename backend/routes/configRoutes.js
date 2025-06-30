import express from "express";
import {
  addConfigItem,
  deleteConfigItem,
  fetchConfig,
  fetchConfigByParentKey,
  fetchConfigItemByKey,
  fetchTopLevelKeys,
  getBackups,
  getBackupsDetail,
  rollbackBackup,
  updateConfigItem,
} from "../controller/configController.js";
const router = express.Router();

router.get("/config", fetchConfig);
router.get("/config/topkey", fetchTopLevelKeys);
router.get("/config/backup", getBackups);
router.delete("/config/delete/:key", deleteConfigItem);
router.put("/config/update/:key", updateConfigItem);
router.post("/config/add", addConfigItem);
router.get("/config/:key", fetchConfigItemByKey);
router.get("/config/parent/:parentKey", fetchConfigByParentKey);
router.get("/config/backup/:filename", getBackupsDetail);
router.get("/config/backup/rollback/:filename", rollbackBackup);
export default router;
