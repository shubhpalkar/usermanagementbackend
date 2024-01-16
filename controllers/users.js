const userModel = require('../models/users');

const getUsers = async(req, res) =>{
    let params = req.body;
    let sortField = params.sortField || 'createdAt'; // Sort field
    let sortOrder = parseInt(params.sortOrder) || -1; // Sort order (1: ascending, -1: descending)
    const page = parseInt(params.page) || 1; // Current page number
    const pageSize = parseInt(params.pageSize) || 10; // Number of items per page
    const search = params.search || ''; // Search query
    const searchColumns = params.searchColumns || ['name', 'email', 'gender', 'status'];
    try {
        const matchQuery = {};
        if (search && searchColumns.length > 0) {
            const searchRegex = new RegExp(search, 'i');
            matchQuery.$or = searchColumns.map((column) => ({
                [column.trim()]: searchRegex,
            }));
        }

        const sort = { [sortField]: sortOrder };

        const pipeline = [
            {
                $match: matchQuery,
            },
            {
                $sort: sort,
            },
            {
                $facet: {
                    paginatedItems: [
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize },
                    ],
                    totalCount: [
                        {
                            $count: 'total',
                        },
                    ],
                },
            },
        ];

        console.log(JSON.stringify(pipeline)); // Log the pipeline query

        // const [result] = await userModel.aggregate(pipeline).toArray();
        const [result] = await userModel.aggregate(pipeline);
        console.log('result', result);
        const totalCount = result.totalCount[0] ? result.totalCount[0].total : 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        const items = result.paginatedItems;

        res.status(200).json({
            error: false,
            title: 'Data fetched successfully!',
            page,
            pageSize,
            totalCount,
            totalPages,
            items,
        });
    } catch (err) {
        console.error('err', err);
        res.status(500).json({
            error: true,
            title: 'Something went wrong.'
        });
    }
}
const add = async(req, res) => {
    try{
        const {name, email, about, skills, gender} = req.body;
        const result = await userModel.find({email: email}).exec();
        if(result.length>0){
            return res.status(400).json({
                error: true,
                title: 'Email already taken',
                errors: []
            });
        }
        let newUser = new userModel({name, email, about, skills, gender});
        // Save the new user
        await newUser.save();

        return res.status(200).json({
            error: false,
            title: 'User Added Successfully',
            errors: []
        });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            error: true,
            title: 'Something went wrong',
            errors: error
        });
    }
}

const edit = async(req, res) => {
    try{
        const {id, name, email, about, skills, gender, status} = req.body;
        const userExist = await userModel.findOne(
            {
                email: email,
                _id: { $not: {$eq: id}}
            }
        ).exec();

        if(userExist){
            return res.status(400).json({
                error: true,
                title: 'Email already taken',
                errors: []
            });
        }

        const user = await userModel.findOne({ _id: id }).exec();
        if(!user){
            return res.status(401).json({
                error: true,
                title: 'User not found',
                errors: []
            }); 
        }
        user.updateOne(
            { name, email, about, skills, gender, status },
            { where: { _id: id } },
        ).then((details) =>{
            return res.status(200).json({
                error: false,
                title: 'User Updated Successfully',
                errors: []
            });
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            title: 'Something went wrong',
            errors: error
        });
    }
}

const deleteUser = async(req, res) => {
    const result = await userModel.deleteOne({_id: req.params.id});
    if (result?.acknowledged) {
        return res.status(200).json({
            title: 'User deleted successfully!',
            error: false
        });
       
    } else {
        return res.status(400).json({
            title: 'Unable to delete user.',
            error: true
        });
    }
}

module.exports = {
    getUsers,
    add,
    edit,
    deleteUser
};