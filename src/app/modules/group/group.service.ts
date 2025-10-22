import AppError from "../../errorHelper/AppError";
import { IGroup, GroupRole } from "./group.interface";
import { Group } from "./group.model";
import { User } from "../user/user.model";
import { Message } from "../message/message.model";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";

// Helper: get user by email
const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

// Create a group
const createGroup = async (payload: Partial<IGroup>, userEmail: string) => {
  const { name, description, isPrivate = false } = payload;
  if (!name || !description)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Name and description are required"
    );

  const user = await getUserByEmail(userEmail);

  const group = await Group.create({
    name: name.trim(),
    description: description.trim(),
    isPrivate,
    members: [
      {
        userId: user._id,
        role: "admin" as GroupRole,
        joinedAt: new Date(),
      },
    ],
  });

  await Message.create({
    groupId: group._id,
    senderId: user._id,
    content: `Group "${name}" was created by ${user.name}. Welcome!`,
    messageType: "system",
  });

  // Populate and return the group with user details
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Get group by ID - FIXED: Now populates user details
const getGroupById = async (groupId: string) => {
  const group = await Group.findById(groupId).populate(
    "members.userId",
    "email name"
  );
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  return group;
};

// Get groups for a user by email - FIXED: Now populates user details
const getUserGroups = async (userEmail: string) => {
  const user = await getUserByEmail(userEmail);
  const groups = await Group.find({ "members.userId": user._id }).populate(
    "members.userId",
    "email name"
  );
  return groups;
};

// Join group via invite code
const joinGroup = async (inviteCode: string, userEmail: string) => {
  if (!inviteCode)
    throw new AppError(httpStatus.BAD_REQUEST, "Invite code is required");

  const user = await getUserByEmail(userEmail);
  const group = await Group.findOne({ inviteCode });
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Invalid invite code");

  if (group.members.some((m) => m.userId.toString() === user._id.toString()))
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Already a member of this group"
    );

  group.members.push({
    userId: user._id,
    role: "member" as GroupRole,
    joinedAt: new Date(),
  });
  await group.save();

  await Message.create({
    groupId: group._id,
    senderId: user._id,
    content: `${user.name} joined the group`,
    messageType: "system",
  });

  // Populate and return
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Add group member
const addGroupMember = async (
  groupId: string,
  memberEmail: string,
  role: GroupRole = "member",
  adminEmail: string
) => {
  const adminUser = await getUserByEmail(adminEmail);
  const memberUser = await getUserByEmail(memberEmail);

  if (!Types.ObjectId.isValid(groupId))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid group ID");

  const group = await Group.findById(groupId);
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");

  const isAdmin = group.members.some(
    (m) =>
      m.userId.toString() === adminUser._id.toString() && m.role === "admin"
  );
  if (!isAdmin)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only group admin can add members"
    );

  if (
    group.members.some((m) => m.userId.toString() === memberUser._id.toString())
  )
    throw new AppError(httpStatus.BAD_REQUEST, "User is already a member");

  group.members.push({
    userId: memberUser._id,
    role,
    joinedAt: new Date(),
  });
  await group.save();

  await Message.create({
    groupId: group._id,
    senderId: adminUser._id,
    content: `${memberUser.name} was added to the group`,
    messageType: "system",
  });

  // Populate and return
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Update member role
const updateMemberRole = async (
  groupId: string,
  memberEmail: string,
  role: GroupRole,
  adminEmail: string
) => {
  const adminUser = await getUserByEmail(adminEmail);
  const memberUser = await getUserByEmail(memberEmail);

  const group = await Group.findById(groupId);
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");

  const isAdmin = group.members.some(
    (m) =>
      m.userId.toString() === adminUser._id.toString() && m.role === "admin"
  );
  if (!isAdmin)
    throw new AppError(httpStatus.FORBIDDEN, "Only admin can update roles");

  const member = group.members.find(
    (m) => m.userId.toString() === memberUser._id.toString()
  );
  if (!member) throw new AppError(httpStatus.NOT_FOUND, "Member not found");

  member.role = role;
  await group.save();

  // Populate and return
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Remove member
const removeGroupMember = async (
  groupId: string,
  memberEmail: string,
  adminEmail: string
) => {
  const adminUser = await getUserByEmail(adminEmail);
  const memberUser = await getUserByEmail(memberEmail);

  const group = await Group.findById(groupId);
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");

  const isAdmin = group.members.some(
    (m) =>
      m.userId.toString() === adminUser._id.toString() && m.role === "admin"
  );
  if (!isAdmin)
    throw new AppError(httpStatus.FORBIDDEN, "Only admin can remove members");

  group.members = group.members.filter(
    (m) => m.userId.toString() !== memberUser._id.toString()
  );
  await group.save();

  await Message.create({
    groupId: group._id,
    senderId: adminUser._id,
    content: `${memberUser.name} was removed from the group`,
    messageType: "system",
  });

  // Populate and return
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Regenerate invite code
const regenerateInviteCode = async (groupId: string, adminEmail: string) => {
  const adminUser = await getUserByEmail(adminEmail);

  const group = await Group.findById(groupId);
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");

  const isAdmin = group.members.some(
    (m) =>
      m.userId.toString() === adminUser._id.toString() && m.role === "admin"
  );
  if (!isAdmin)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only admin can regenerate invite code"
    );

  group.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  await group.save();

  // Populate and return
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Update group info
const updateGroup = async (
  groupId: string,
  payload: Partial<IGroup>,
  adminEmail: string
) => {
  const adminUser = await getUserByEmail(adminEmail);

  const group = await Group.findById(groupId);
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");

  const isAdmin = group.members.some(
    (m) =>
      m.userId.toString() === adminUser._id.toString() && m.role === "admin"
  );
  if (!isAdmin)
    throw new AppError(httpStatus.FORBIDDEN, "Only admin can update group");

  Object.assign(group, payload);
  await group.save();

  // Populate and return
  return await Group.findById(group._id).populate(
    "members.userId",
    "email name"
  );
};

// Delete group
const deleteGroup = async (groupId: string, adminEmail: string) => {
  const adminUser = await getUserByEmail(adminEmail);

  const group = await Group.findById(groupId);
  if (!group) throw new AppError(httpStatus.NOT_FOUND, "Group not found");

  const isAdmin = group.members.some(
    (m) =>
      m.userId.toString() === adminUser._id.toString() && m.role === "admin"
  );
  if (!isAdmin)
    throw new AppError(httpStatus.FORBIDDEN, "Only admin can delete group");

  await Group.findByIdAndDelete(groupId);
  return null;
};

export const groupService = {
  createGroup,
  getGroupById,
  getUserGroups,
  joinGroup,
  addGroupMember,
  updateMemberRole,
  removeGroupMember,
  regenerateInviteCode,
  updateGroup,
  deleteGroup,
};
