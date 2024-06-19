import { roleList } from "../../../test/src/consts/authorization.js";
import { UnauthorizedResponse } from "../../../test/src/helpers/http.js";

const verifyRoles = (...allowedRoles)=>{ 
    return (req,res,next)=>{
        if(!req?.roles){
            return UnauthorizedResponse(res, req.t("failure_status"));
        }
        const rolesArray = [...allowedRoles];
        let result = req?.roles.map(role => rolesArray.includes(role))
                    || allowedRoles.includes(roleList.ADMIN);
        if(!result) return UnauthorizedResponse(res, req.t("failure_message_3"));
        next();
    }
}

export { verifyRoles };

