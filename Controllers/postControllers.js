import PostModel from '../models/Post.js';

export const getAll = async(req, res) => {
    try {
        //здесь необходимо сделать populate, чтобы нельзя было получить доступ к бд через гет запрос
        const posts = await PostModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"]}).exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'couldnt get the articles',
        });
    }
}


// -1 означает, что сверху буду показываться наиболее популярные статьи
export const getPopularPosts = async(req, res) => {
    try {
        const posts = await PostModel.find().sort({viewsCount: -1}).populate({ path: "user", select: ["fullName", "avatarUrl"]}).exec();
        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
                message: 'couldnt get the most populat articles',
        });
    }
}


// -1 означает, что сверху будут показываеться новые статьи
export const getNewsPosts = async(req, res) => {
    try {
        const posts = await PostModel.find().sort({createdAt: -1}).populate({ path: "user", select: ["fullName", "avatarUrl"]}).exec();
        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
                message: 'couldnt get the most populat articles',
        });
    }
}

export const getTagsPosts = async(req, res) => {
    try {
        const lastposts = await PostModel.find().sort({viewsCount: -1}).limit(5).exec();
        const tags = lastposts.map(obj => obj.tags).flat().slice(0, 5);
        const posts = await PostModel.find({tags: tags[0]}).populate({ path: "user", select: ["fullName", "avatarUrl"]}).exec();
        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
                message: 'couldnt get tags articles',
        });
    }
}


export const getLastTags = async(req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'couldnt get tags',
        });
    }
}


export const getOne = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId, 
            },
            
            {
                $inc: {viewsCount: 1},
            },
            
            {
                returnDocument: `after`,
            },
        ).populate(`user`).then((doc, err) => {

                if (err) {  
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удается вернуть статью',
                    });        
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Не удается найти статью',
                    });
                }
                res.json(doc); 
            },
        )

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Не удается получить статью по запросу getOne',
        });
    }
}

export const remove = async(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findByIdAndRemove(
            {
            _id:postId,
            }
        ).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'couldnt delete article',
                });        
            }
            
            if (!doc) {
                return res.status(404).json({
                    message: 'Article not found',
                });
            }

            res.json({
                success: true,
            });           

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'couldnt delete article',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: 'Article denied',
        });
    }
}

export const update = async(req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
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
                message: 'couldnt update article',
        });
    }
}