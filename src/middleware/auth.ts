// exports.isAuthenticated = (req,res,next)=>{
//     if(req.session.user){
//         return next();
//     }
//     res.redirect('/login');
// };
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};
