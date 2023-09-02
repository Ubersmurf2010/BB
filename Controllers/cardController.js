import CardModel from '../models/Card.js';

export const create = async (req, res) => {
    try {
        const doc = new CardModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const card = await doc.save();
        res.json(card);
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Не удалось создать карточку товара',
        });
    }
}

export const remove = async(req, res) => {
    try {
        const cardId = req.params.id;
        CardModel.findByIdAndRemove(
            {
            _id:cardId,
            }
        ).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось удалить карточку товара',
                });        
            }
            
            if (!doc) {
                return res.status(404).json({
                    message: 'Карточка товара не найдена',
                });
            }

            res.json({
                success: true,
            });           

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Глобальная ошибка. Не удалось удалить карточку товара.',
        });
    }
}

export const update = async(req, res) => {
    try {
        const cardId = req.params.id;
        await CardModel.updateOne(
            {
                _id: cardId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            },
        );
        res.json({
            success: true,
        });
    }    
    
    catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Не удалось обновить к.т.',
        });
    }
}

export const getOne = async(req, res) => {
    try {
        const cardId = req.params.id;
        CardModel.findOneAndUpdate(
            {
                _id: cardId, 
            },
            
            {
                returnDocument: `after`,
            },
        ).populate(`user`).then((doc, err) => {

                if (err) {  
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удается вернуть карточку товара',
                    });        
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Не удается найти карточку товара',
                    });
                }
                res.json(doc); 
            },
        )

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Не удается получить карточку товара по запросу getOne',
        });
    }
}

export const getAll = async(req, res) => {
    try {
        //здесь необходимо сделать populate, чтобы нельзя было получить доступ к бд через гет запрос
        const cards = await CardModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"]}).exec();
        res.json(cards);
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Не удается получить товар',
        });
    }
}

