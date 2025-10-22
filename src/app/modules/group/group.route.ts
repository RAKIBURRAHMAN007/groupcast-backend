import express from "express";
import { groupController } from "./group.controller";

const router = express.Router();

// Email is passed as a param
router.post("/create/:email", groupController.createGroup);
router.get("/my-groups/:email", groupController.getUserGroups);
router.post("/join/:email", groupController.joinGroup);
router.get("/:id", groupController.getGroupById);
router.put("/update/:id/:email", groupController.updateGroup);
router.delete("/delete/:id/:email", groupController.deleteGroup);
router.post("/:id/members/:email", groupController.addGroupMember);
router.delete(
  "/:id/members/:memberEmail/:email",
  groupController.removeGroupMember
);
router.patch(
  "/:id/members/:memberEmail/:email/role",
  groupController.updateMemberRole
);
router.post(
  "/:id/regenerate-invite/:email",
  groupController.regenerateInviteCode
);

export const groupRoutes = router;
