import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, UnauthorizedResponse } from '../../../../helpers/http.js';
//update the version setting
const updateVersionSetting = async (req, res) => {
    try {
      const { adminId, type, versionId, status, appVer } = req.body;
      const file = req.file;
  
      // Fetch Admin ID to check if it exists
      const details = await findOne("Admin", { _id: adminId });
      if (!details) {
        return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
      }
  
      const versionInfo = await findOne("VersionSetting", { _id: versionId });
      if (!versionInfo) {
        return BadRequestResponse(res, HTTP_MESSAGE.VERSION_SETTING_NOT_FOUND);
      }
  
      let query = {};
  
      switch (type) {
        case '1':
          query = { forceUpdate: status };
          if (file && file.originalname) {
            query['apkFileName'] = file.originalname;
          }
          break;
        case '2':
          query = { maintainence: status };
          if (file && file.originalname) {
            query['apkFileName'] = file.originalname;
          }
          break;
        case '3':
          query = { appVersion: appVer };
          if (file && file.filename) {
            query['apkFileName'] = file.filename;
          }
          break;
        default:
          return BadRequestResponse(res, "Invalid type");
      }
  
      if (file && file.filename) {
        const filePath = path.join(__dirname, '../../../../../../public/tempDirectory/', file.filename);
        const destinationDir = path.join(__dirname, '../../../../../../public/apk/');
        
        await fs.mkdir(destinationDir, { recursive: true });
        const files = await fs.readdir(destinationDir);
        for (const existingFile of files) {
          await fs.unlink(path.join(destinationDir, existingFile));
        }
        const destinationPath = path.join(destinationDir, file.filename);
        await fs.rename(filePath, destinationPath);
      }
  
      let a=await update("VersionSetting", { _id: versionId }, { $set: query });
      return SuccessResponse(res, HTTP_MESSAGE.VERSION_SETTING_UPDATE);
  
    } catch (err) {
      console.log(err.message)
      return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
    }
  };
  
  const listVersionSetting = async(req,res)=>{
    try{
      let{adminId}=req.query;
  
      //check if admin is exist
      const adminDetails = await findOne("Admin",{_id:adminId});
      if(!adminDetails) return BadRequestResponse(res,HTTP_MESSAGE.USER_NOT_FOUND);
       
      //get the all version list from the version setting table
      const list = await findAll("VersionSetting",{});
      return SuccessResponse(res,HTTP_MESSAGE.ALL_VERSION_SETTING_LIST,list)
      
    }catch(err){
      return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
    }
  };


  export { updateVersionSetting, listVersionSetting }; 