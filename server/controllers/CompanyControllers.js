import Company from "../models/Company.js";
import url from "url";
import User from "../models/User.js";
import axios from "axios";

// @DESC: Get all companies for a specific user
// PATH: /api/companies
// METHOD: GET
// PRIVATE
export const getCompanies = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("applications");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.applications);
    } catch (error) {
        console.error("Get Companies Error:", error);
        res.status(500).json({ message: "Failed to retrieve companies, please try again :(" });
    }
};

// @DESC: Add a company
// PATH: /api/companies/add
// METHOD: POST
// PRIVATE
export const addCompany = async (req, res) => {
        try {
        const { name, role, city, link, applyDate, status } = req.body;

        if (!name || !role || !city || !link || !applyDate || !status) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const imgUrl = await getImage(name);

        const applyDatePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!applyDatePattern.test(applyDate)) {
            return res.status(400).json({ error: "Invalid date format. Please use MM/DD/YYYY." });
        }

        const company = new Company({
            name,
            role,
            city,
            link,
            imgUrl,
            applyDate,
            status,
            user_id: req.user._id,
            updatedAt: status === "Submitted" ? new Date(applyDate) : new Date()
        });

        await company.save();

        const user = await User.findById(req.user._id);
        user.applications.push(company._id);
        await user.save();

        res.status(201).json(company);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Failed to add this company, please try again :(` });
    }
};

// @DESC: Update a company
// PATH: /api/companies/:id
// METHOD: PUT
// PRIVATE
export const updateCompany = async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Company.findById(id);
        if (!company) return res.status(404).json({ message: "Company not found :(" });

        const { name, role, city, link, status } = req.body;

        let imgUrl = company.imgUrl;

        if (name !== company.name) {
            imgUrl = await getImage(name);
        } 
        company.name = name || company.name;
        company.role = role || company.role;
        company.city = city || company.city;
        company.link = link || company.link;
        company.status = status || company.status;
        company.imgUrl = imgUrl;
        company.updatedAt = status === "Submitted" ? new Date(company.applyDate) : new Date();

        await company.save();
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: "Failed to update this company, please try again :(" });
    }
};

// @DESC: Delete a company
// PATH: /api/companies/:id
// METHOD: DELETE
// PRIVATE
export const deleteCompany = async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Company.findById(id);
        if (!company) return res.status(404).json({ message: "Company not found :(" });

        await Company.deleteOne({ _id: id });

        const user = await User.findById(req.user._id);
        user.applications = user.applications.filter(companyId => companyId.toString() !== id);
        await user.save();

        res.json({ message: "Company deleted :)" });
    } catch (error) {
        console.error("Delete Company Error:", error);
        res.status(500).json({ message: "Failed to delete this company, please try again :(" });
    }
};

// @DESC: Get a company by User ID
// PATH: /api/companies/user/:id
// METHOD: GET
// PUBLIC
export const getCompaniesByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).populate("applications");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.applications);
    } catch (error) {
        console.error("Get Companies By User ID Error:", error);
        res.status(500).json({ message: "Failed to retrieve companies, please try again :(" });
    }
}


// Utils: Image Domain Helper
const getImage = async (name) => {
    try {
        const response = await axios.get(`https://api.brandfetch.io/v2/search/${name}`);
        if (response.data && response.data.length > 0) {
            return response.data[0].icon;
        }
    } catch (error) {
        console.error("Error fetching image from Brandfetch:", error.message);
    }
    return null;
};
