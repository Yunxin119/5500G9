import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: false
    },
    applyDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    imageDomain: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Convert to JSON-like structure
CompanySchema.methods.toJSON = function() {
    const company = this;
    const companyObject = company.toObject();

    return {
        id: companyObject._id,
        name: companyObject.name,
        role: companyObject.role,
        city: companyObject.city,
        link: companyObject.link,
        imgUrl: companyObject.imgUrl,
        applyDate: companyObject.applyDate,
        status: companyObject.status,
        updatedAt: companyObject.updatedAt ? companyObject.updatedAt.toISOString().split('T')[0] : null,
        imageDomain: companyObject.imageDomain,
        user_id: companyObject.user_id
    };
};

export default mongoose.model("Company", CompanySchema);
