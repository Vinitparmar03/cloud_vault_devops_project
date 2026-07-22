import ApiError from "../utils/ApiError.js";
import Vault from "../models/vault.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.middleware.js";

export const createVault = asyncHandler(async (req, res) => {

    const { title } = req.body;
    if (!title)
        throw new ApiError(400, "Title is required");
    
    if (!req.file)
        throw new ApiError(400, "Please upload a file");
    

    const uploadedFile = await uploadOnCloudinary(req.file.buffer);

    console.log("Hello",uploadedFile);
    const vault = await Vault.create({

        title,

        owner: req.user._id,

        file: {
            public_id: uploadedFile.public_id,
            url: uploadedFile.url,
            secure_url: uploadedFile.secure_url,
            original_name: req.file.originalname,
            format: uploadedFile.format,
            resource_type: uploadedFile.resource_type,
            bytes: uploadedFile.bytes,
        },
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            vault,
            "File uploaded successfully"
        )
    );
});
export const getAllVaults = asyncHandler(async (req, res) => {

    const vaults = await Vault.find({
        owner: req.user._id
    })
    .select("-__v")
    .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            vaults,
            "Vaults fetched successfully"
        )
    );

});

export const getVaultById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const vault = await Vault.findOne({
        _id: id,
        owner: req.user._id
    }).select("-__v");

    if (!vault)
        throw new ApiError(404, "Vault not found");

    return res.status(200).json(
        new ApiResponse(
            200,
            vault,
            "Vault fetched successfully"
        )
    );

});

export const deleteVault = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const vault = await Vault.findOne({
        _id: id,
        owner: req.user._id,
    });


    if (!vault)
        throw new ApiError(404, "Vault not found");


    await cloudinary.uploader.destroy(
        vault.file.public_id,
        {
            resource_type: vault.file.resource_type,
        }
    );


    await vault.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Vault deleted successfully"
        )
    );

});
