import jwt from 'jsonwebtoken';

export default (req, res, next) => {
//parse token
    //const token = req.headers.authorization.split(' ')[1];
    //хуй знает почему, но залупа снизу никак не работает!
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    // хуй знает опять же почему-то сплит не работает при сохранении авторизации ((()))
    //res.send(token);
    
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();

        } catch (e) {
            return res.status(403).json({
                message: 'Error in decode token',
        });
        }

    } else {
        return res.status(403).json({
            message: 'Net dostupa',
        });
    }
}

