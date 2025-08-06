import { envVars } from "../config/env";
import { IAuthProvider, IUser, UserRole } from "../modules/user/user.interface";

import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
export const seedAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("admin exist");
      return;
    }
    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: "admin",
      role: UserRole.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      auths: [authProvider],
      isVerified: true,
    };
    const superAdmin = await User.create(payload);
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
