import {body} from 'express-validator';


//проверка вводимых данных
export const loginValidator = [
    body('email', 'Email format is incorrect. Please check.').isEmail(),
    body('password', 'Password if too short. Please enter the password again.').isLength({min: 8}), 
];

export const registerValidator = [
    body('email', 'Email format is incorrect. Please check.').isEmail(),
    body('password', 'Password if too short. Please enter the password again.').isLength({min: 8}), 
    body('fullName', 'Name if too short. Please enter the name again.').isLength({min: 5}),
    body('avatarUrl', 'Url is not a link.').optional().isURL(),

];

export const postCreateValidator = [
    body('title', 'Enter the heading of article').isLength({min: 3}).isString(),
    body('text', 'Enter the text of article').isLength({min: 10}).isString(),
    body('tags', 'Enter the tags array').optional().isString(),
    body('imageUrl', 'Wrong url').optional().isString(),
];

export const cardCreateValidator = [
    body('title', 'Название товара').isLength({min: 3}).isString(),
    body('text', 'Описание товара').isLength({min: 10}).isString(),
    body('imageUrl', 'Не удается загрузить картинку').optional().isString(),
];