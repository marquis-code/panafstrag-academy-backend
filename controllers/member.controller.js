const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Member = require("../models/member.model");
const mongoose = require("mongoose");
module.exports.handle_new_member = async (req, res) => {
  try {
    const member = await Member.findOne({
      email: req.body.email,
    });
    if (member) {
      return res.status(404).json({
        errorMessage: `Member with Email ${req.body.email} already exist`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newMember = new Member({
      prefix: req.body.prefix,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      suffix: req.body.suffix,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      username: req.body.username,
      password: hashedPassword,
      salaryRange: req.body.salaryRange,
      reasonForJoiningAcademy: req.body.reasonForJoiningAcademy,
      memberType: req.body.memberType
    });

    newMember
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ successMessage: 'Hurry! now you are successfully registred as a member. Please login.' });
      })
      .catch((error) => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving Member. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.login_member = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(404).json({
        message: "Member not found. Invalid login credentials.",
        success: false,
      });
    }

    let auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(404).json({
        message: "Member not found. Invalid login credentials.",
        success: false,
      });
    }

    let token = jwt.sign(
      {
        id: member._id
      },
      process.env.MEMBER_JWT_SECRET,
      { expiresIn: "3 days" }
    );

    let result = {
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      email: employee.email,
      token: `Bearer ${token}`,
      memberType: member.memberType,
      expiresIn: 168,
    };

    return res.status(200).json({ ...result, successMessage: '"You are now logged in."' });
  } catch (error) {
    let errors = handleErrors(error);
    return res.json({
      errors,
    });
  }
};

module.exports.get_all_members = async (req, res) => {
  try {
    const members = await Member.find();
    if (!members) {
      return res.status(500).json({ errorMessage: "Members not available" });
    }
    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching Members. Please try again later",
    });
  }
};
module.exports.get_one_member = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid Member ID" });
  }
  try {
    const member = await Member.findById(_id);
    if (!member) {
      return res.status(404).json({ errorMessage: "Member does not exist" });
    }
    return res.status(200).json(member);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_member = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid Member ID" });
  }
  try {
    let member = await Member.findById(_id);
    await member.remove();
    return res.status(200).json({
      successMessage: "Member was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};

module.exports.update_member = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid member ID" });
  }
  try {
    let member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ errorMessage: "Member not found" });
    }

    const data = {
      prefix: req.body.prefix || member.prefix,
      firstName: req.body.firstName || member.firstName,
      middleName: req.body.middleName || member.middleName,
      lastName: req.body.lastName || member.lastName,
      suffix: req.body.suffix || member.suffix,
      email: req.body.email || member.email,
      phone: req.body.phone || member.phone,
      country: req.body.country || member.country,
      city: req.body.city || member.city,
      address: req.body.address || member.address,
      state: req.body.state || member.state,
      postalCode: req.body.postalCode || member.postalCode,
      username: req.body.username || member.username,
      password: req.body.password || member.password,
      salaryRange: req.body.salaryRange || member.salaryRange,
      memberType: req.body.memberType || member.memberType,
      reasonForJoiningAcademy:
        req.body.reasonForJoiningAcademy || member.reasonForJoiningAcademy,
    };

    member = await Member.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    return res.status(200).json({
      successMessage: "Member details was successfully updated",
    });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong" });
  }
};
