const { Router } = require('express');
const User = require('./model')

const router = Router()

async function update_user_balance(req, res) {
    try {
        const { userID } = req.params
        const { amount } = req.body;

        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).send({
                error: 'Пользователь не найден!'
            });
        }

        const newBalance = user.balance + amount;
        if (newBalance < 0) {
            return res.status(400).send({
                error: 'Недостаточно средств!'
            });
        }

        await User.update(
            { balance: newBalance },
            { where: { id: userID } }
        );

        return res.status(200).send({
            success: true,
            amount: newBalance
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Внутренняя ошибка сервера!'
        });
    }
}

router.patch('/:userId', update_user_balance)

module.exports = router;