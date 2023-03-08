import express, { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
import { isImportEqualsDeclaration } from "typescript";
import {
  ErrorMessage,
  MessageResponse,
  tokenAccess,
} from "../middleware/commenResError";
import product from "../model/product";
import signUp from "../model/register";
import tokenModel from "../model/token";
const multer = require("multer");
const Appstring = require("../Appstring");

import { fileFilter, storage } from "../router/routers";
import sendConfirmationEmail from "./nodemailer";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const Appstring = require("../Appstring");
require("dotenv").config();
var mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const register = async (req: Request, res: Response) => {
  console.log("gg");

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      PhoneNo: req.body?.PhoneNo,
    });
    await user.save();
    MessageResponse(req, res, user, 201);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await signUp.findOne({
      email: req.body?.email,
      PhoneNo: req.body?.PhoneNo,
    });

    const userLogin = await tokenModel.findOne({ userId: user?._id });

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        if (userLogin) {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          await tokenModel.updateOne(
            { userId: user._id },
            { token: token },
            {
              new: true,
            }
          );
          tokenAccess(req, res, token, 200);
        } else {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          const createToken = await tokenModel.create({
            userId: user._id,
            token: token,
          });
          await createToken.save();

          tokenAccess(req, res, createToken, 200);
        }
      } else {
        ErrorMessage(req, res, Appstring.NOT_VALID_DETAILS, 400);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};

//product crud
const createProduct = async (req: Request, res: Response) => {
  try {
    const Product = await product.create({
      productName: req.body.productName,

      detail: req.body.detail,
      price: req.body.price,
      discount: req.body.discount,
    });
    MessageResponse(req, res, Appstring.PROUDUCT_CREATED, 201);
  } catch (error) {
    ErrorMessage(req, res, error, 412);
  }
};
const getProducts = async (req: Request, res: Response) => {
  try {
    const Product = await product.find();
    console.log(Product, "Product");

    MessageResponse(req, res, Product, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 412);
  }
};
const updateProduct = async (req: Request, res: Response) => {
  try {
    let quary: any = {
      productName: req.body.productName ?? undefined,
      detail: req.body.detail ?? undefined,
      price: req.body.price ?? undefined,
      discount: req.body.discount ?? undefined,
    };
    const Product = await product.updateOne({ id: req.params.id }, quary, {
      new: true,
    });
    MessageResponse(req, res, Product, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 412);
  }
};
const deleteProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);

    const Product = await product.deleteOne({ _id: req.params.id });
    MessageResponse(req, res, Product, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 412);
  }
};

const sendMail = async (req: Request, res: Response) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "chanel.crooks94@ethereal.email",
        pass: "1Uxgqw9qCy8QRNxPyn",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"lali 👻" <lali@gamile.com>', // sender address
      to: "hd@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://e

    // Preview URL
    MessageResponse(req, res, info, 200);
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 412);
  }
};

const nodemailerMail = async (req: Request, res: Response) => {
  try {
    
    sendConfirmationEmail("harshita", "hd@mailinator.com", "123456");
    MessageResponse(req,res,'register ok',200)
    // Preview URL
    // MessageResponse(req, res, info, 200);
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 412);
  }
};


export {
  register,
  login,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  sendMail,
  nodemailerMail
};
