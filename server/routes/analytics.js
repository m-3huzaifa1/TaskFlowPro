const express = require('express')
const app = express()
const router = express.Router();
const Task = require('../model/Task');
const authMiddleware = require('../middleware/auth');

app.use(authMiddleware)

router.get('/metrics', async (req, res) => {
    try {
        const metrics = await Task.aggregate([
            {
                $facet: {
                    completedTasks: [
                        { $match: { status: 'Done' } },
                        { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
                    ],
                    overdueTrends: [
                        { $match: { dueDate: { $lt: new Date() }, status: { $ne: 'Done' } } },
                        {
                            $group: {
                                _id: { $month: '$dueDate' },
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    priorityDistribution: [
                        {
                            $group: {
                                _id: '$priority',
                                total: { $sum: 1 },
                                completed: {
                                    $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        res.json(metrics[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;