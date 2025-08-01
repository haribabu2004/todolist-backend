const express = require('express');
const router = express.Router();
const TaskSchema = require('../Models/Task');

router.put("/:id", async (req, res)=>{
    const {completed} = req.body;

    TaskSchema.findByIdAndUpdate(req.params.id, {completed}, {new: true})
        .then(result => {
            console.log(result);
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.put("/edit/:id", async(req,res)=>{
    const {task} = req.body;

    TaskSchema.findByIdAndUpdate(req.params.id, {task} ,{new:true})
    .then(result => 
        res.json(result)
    ).catch(err=> res.status(500).json(err))
})


module.exports = router;