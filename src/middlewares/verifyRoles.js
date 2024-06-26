import { roleList } from "../consts/authorization.js";
import { UnauthorizedResponse } from "../helpers/http.js";
import { HTTP_MESSAGE } from "../helpers/http.js";

const verifyRoles = (...allowedRoles) => { 
    return (req, res, next) => {
        try {
            if (!req?.roles) {
                return UnauthorizedResponse(res, HTTP_MESSAGE.UNAUTHORIZED);
            }
            const rolesArray = [...allowedRoles];
            const isAdmin = allowedRoles.includes(roleList.ADMIN);
            let result = req.roles.some(role => rolesArray.includes(role)) || isAdmin;
            if (!result) {
                return UnauthorizedResponse(res, HTTP_MESSAGE.UNAUTHORIZED);
            }
            next();
        } catch (error) {
            return UnauthorizedResponse(res, HTTP_MESSAGE.UNAUTHORIZED, error);
        }
    };
};

export { verifyRoles };
