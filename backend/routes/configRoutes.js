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
import { login } from "../controller/userController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { decryptRequest } from "../middleware/decryptRequest.js";
import { encryptResponse } from "../middleware/encryptResponse.js";
const router = express.Router();

router.post("/login", login);

router.use(authenticateToken);
router.use(decryptRequest);
router.get("/config", fetchConfig);
router.get("/config/topkey", fetchTopLevelKeys);
router.get("/config/backup", getBackups);

router.use(encryptResponse);
router.get("/config/:key", fetchConfigItemByKey);
router.post("/config/add", addConfigItem);
router.delete("/config/delete/:key", deleteConfigItem);
router.put("/config/update/:key", updateConfigItem);
router.get("/config/parent/:parentKey", fetchConfigByParentKey);
router.get("/config/backup/:filename", getBackupsDetail);
router.get("/config/backup/rollback/:filename", rollbackBackup);
export default router;
