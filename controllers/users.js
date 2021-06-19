const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const EmailService = require("../services/email");
const Users = require("../repositiries/users");
const { HttpCode } = require("../helpers/constants");
const {
  CreateSenderNodemailer,
  CreateSenderSendGrid,
} = require("../services/email-sender");

require("dotenv").config();

const UploadAvatarService = require("../services/local-upload");
// const UploadAvatarService = require("../services/cloud-upload");
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const { id, email, subscription, avatar, verifyToken } = await Users.create(
      req.body
    );

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
      );
      await emailService.sendVerifyEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatarURL: avatar, verify, verifyToken },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);

    return res.json({
      status: "success",
      code: "200",
      data: {
        token,
        user: { email: user.email, subscription: user.subscription },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { email: user.email, subscription: user.subscription },
    });
  } catch (e) {
    next(e);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      const newUser = await Users.updateSubscription(user.id, req.body);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { email: newUser.email, subscription: newUser.subscription },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (e) {
    next(e);
  }
};

/*LOCAL*/
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarURL = await uploads.saveAvatar({ idUser: id, file: req.file });

    try {
      await fs.unlink(path.join(process.env.AVATAR_OF_USERS, req.user.avatar));
    } catch (error) {
      console.log(error.message);
    }
    await Users.updateAvatar(id, avatarURL);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

/*CLOUD*/
// const avatars = async (req, res, next) => {
//   try {
//     const id = req.user.id;
//     const uploads = new UploadAvatarService();
//     const { idCloudAvatar, avatarURL } = await uploads.saveAvatar(
//       req.file.path,
//       req.user.idCloudAvatar
//     );

//     await fs.unlink(req.file.path);
//     await Users.updateAvatar(id, avatarURL, idCloudAvatar);
//     return res.status(HttpCode.OK).json({
//       status: "success",
//       code: HttpCode.OK,
//       data: { avatarURL },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verifyToken);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: "succes",
        code: 200,
        data: { message: "Verification successful" },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

const repeateVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { email, verify, verifyToken } = user;
      if (!verify) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid()
        );
        await emailService.sendVerifyEmail(verifyToken, email);
        return res.json({
          status: "succes",
          code: 200,
          data: { message: "Resubmittet Verification successful" },
        });
      }
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await Users.listUsers();
    res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { users } });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  updateUser,
  listUsers,
  verify,
  repeateVerification,
};
