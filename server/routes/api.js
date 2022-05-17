const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../models/Expense')


router.get('/expenses', function (req, res) {
    if (req.query.d1 && req.query.d2) {
        const d1 = moment(req.query.d1, 'YYYY-MM-DD').format('LLLL')
        const d2 = moment(req.query.d2, 'YYYY-MM-DD').format('LLLL')
        Expense.find({
            $and: [
                { date: { $gt: d1 } },
                { date: { $lt: d2 } }
            ]
        }, function (err, expenses) {
            res.send(expenses)
        })
    } else {

        if (req.query.d1) {
            const d1 = moment(req.query.d1, "YYYY-MM-DD").format('LLLL')
            Expense.find({
                $and: [
                    { date: { $gt: d1 } },
                    { date: { $lt: moment().format('LLLL') } }
                ]
            }, function (err, expenses) {
                res.send(expenses)
            })

        } else {
            Expense.aggregate([
                {
                    $match:
                        {}
                },
                {
                    $sort: { date: -1 }
                }
            ], function (err, expenses) {
                res.send(expenses)
            })
        }
    }
})

router.get('/expenses/:group', function (req, res) {
    const group = req.params.group
    const total = req.query.total
    if (total) {
        Expense.aggregate([
            { $match: { "group": group } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ], function (err, result) {
            res.send(`Total: ${result[0].total}`)
        })
    } else {
        Expense.find({
            "group": group
        }, function (err, arr) {
            res.send(arr)
        })
    }
})



router.post('/new', function (req, res) {
    const name = req.body.name
    const amount = req.body.amount
    const group = req.body.group
    let date
    if (req.body.date) {
        date = moment(req.body.date, 'YYYY-MM-DD').format('LLLL')
    } else {
        const d = new Date();
        date = moment().format('LLLL')
    }
    const ex = new Expense({ name: name, amount: amount, group: group, date: date })
    ex.save()
    res.send(ex)
})



router.put('/update/:group1/:group2', function (req, res) {
    const g1 = req.params.group1
    const g2 = req.params.group2
    Expense.findOneAndUpdate({ group: g1 }, { $set: { group: g2 } }, { new: true }, function (err, expense) {
        res.send(`The name of the expense changed: ${expense["name"]}, group
        changed to : ${g2}`)
    })
})


module.exports = router
