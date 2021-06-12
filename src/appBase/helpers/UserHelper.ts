import { ApiHelper } from "./ApiHelper"
import { UserInterface, ChurchInterface, UserContextInterface, IPermission } from "../interfaces";

export class UserHelper {
    static currentChurch: ChurchInterface;
    static churches: ChurchInterface[];
    static user: UserInterface;
    static churchChanged: boolean = false;

    static selectChurch = (context: UserContextInterface, churchId?: string, keyName?: string) => {
      let church = null;

      if (churchId) UserHelper.churches.forEach(c => { if (c.id === churchId) church = c; });
      else if (keyName) UserHelper.churches.forEach(c => { if (c.subDomain === keyName) church = c; });
      else church = UserHelper.churches[0];
      if (!church) return;
      else {
        UserHelper.currentChurch = church;
        UserHelper.setupApiHelper(UserHelper.currentChurch);
        if (context.churchName !== "") UserHelper.churchChanged = true;
        context.setChurchName(UserHelper.currentChurch.name);
      }
    }

    static setupApiHelper(church: ChurchInterface) {
      ApiHelper.setDefaultPermissions(church.jwt);
      church.apis.forEach(api => { ApiHelper.setPermissions(api.keyName, api.jwt, api.permissions); });
    }

    static checkAccess({ api, contentType, action }: IPermission): boolean {
      const permissions = ApiHelper.getConfig(api).permisssions;

      let result = false;
      if (permissions !== undefined) {
        permissions.forEach(element => {
          if (element.contentType === contentType && element.action === action) result = true;
        });
      }
      return result;
    }

}

